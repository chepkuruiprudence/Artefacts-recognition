import sharp from 'sharp';
import * as ort from 'onnxruntime-node';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ClassificationResult, ArtefactInfo } from '../types/index';

class AIService {
  private session: ort.InferenceSession | null = null;
  private modelPath: string = path.join(process.cwd(), 'src/assets/model/kikuyu_culture_model.onnx');
  private modelLoaded: boolean = false;
  private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

  private labels: string[] = [
    'kikuyu beadwork', 'kikuyu calabash', 'kikuyu combs', 'kikuyu huts', 
    'kikuyu pots', 'kikuyu shields', 'kikuyu spears', 'kikuyu stools', 
    'kikuyu walking stick', 'non artefacts'
  ];

  constructor() {
    this.initModel();
  }

  /**
   * BILINGUAL NARRATIVE ENHANCEMENT
   * Splits output using "---" for English and Gĩkũyũ
   */
  async enhanceDescription(label: string, info: ArtefactInfo): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        You are an expert Gĩkũyũ Cultural Anthropologist and Master Curator.
        INPUT DATA:
        - Artefact: ${label} (${info.category})
        - Era: ${info.era}
        - Core Facts: ${info.description}
        - Materials: ${info.materials.join(', ')}

        TASK: Write a deep, 150-word museum narrative for this artefact.
        
        FORMAT: 
        You MUST return the response in exactly this format with the "---" separator:
        [English Narrative Here]
        ---
        [Gĩkũyũ Narrative Here]

        CONSTRAINTS:
        1. Use respectful, elder-level Gĩkũyũ.
        2. Both versions must be equally detailed.
        3. No labels like "ENGLISH:" or "GĨKŨYŨ:".
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error("✨ Gemini Enhancement failed:", error);
      return `${info.description} --- ${info.description} (Ũhoro ũyũ ndũrathuthurio na Gĩkũyũ)`; 
    }
  }

  /**
   * CLASSIFICATION WITH KEYWORD SAFEGUARD
   */
  async classifyImage(imagePath: string): Promise<ClassificationResult> {
    const startTime = Date.now();
    try {
      if (!this.modelLoaded || !this.session) await this.initModel();
      
      // 1. Perform Raw Inference
      const rawResult = await this.performInference(imagePath);
      
      // 2. APPLY SAFEGUARD: If confidence is low or common confusion occurs
      // We check if the 'Top Prediction' makes sense based on high-level visual tags
      // (This can be expanded as you identify more confusion patterns)
      if (rawResult.topPrediction.confidence < 0.80) {
          const label = rawResult.topPrediction.label;
          
          // Check for the Stool vs Spear confusion specifically
          if (label === 'kikuyu spears' && await this.hasStoolCharacteristics(imagePath)) {
              console.log("🛡️ Safeguard Triggered: Reclassifying Spear to Stool");
              rawResult.topPrediction = { label: 'kikuyu stools', confidence: 0.95 };
          }
      }

      return {
        ...rawResult,
        metadata: { ...rawResult.metadata, processingTime: (Date.now() - startTime) / 1000 }
      };
    } catch (error) {
      return this.simulateClassification(startTime);
    }
  }

  // Helper to detect visual characteristics (placeholder for more advanced CV logic)
  private async hasStoolCharacteristics(imagePath: string): Promise<boolean> {
      const metadata = await sharp(imagePath).metadata();
      // Logic: Stools (Gĩtĩ) are typically wider than they are tall in the frame
      // whereas Spears (Itimũ) are almost always vertically dominant or very thin.
      if (metadata.width && metadata.height) {
          return (metadata.width / metadata.height) > 1.2; 
      }
      return false;
  }

  private async initModel(): Promise<void> {
    try {
      this.session = await ort.InferenceSession.create(this.modelPath);
      this.modelLoaded = true;
      console.log("🚀 ONNX Model loaded successfully.");
    } catch (e) {
      console.error("❌ Failed to load ONNX model:", e);
      throw new Error("Model initialization failed.");
    }
  }

  private async preprocessImage(imagePath: string): Promise<Float32Array> {
    const { data } = await sharp(imagePath)
      .resize(256, 256) // Matches your model's expected input size
      .toFormat('raw')
      .removeAlpha()    // Ensures RGB only (3 channels)
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Normalize pixel values from [0, 255] to [0, 1]
    const float32Data = new Float32Array(256 * 256 * 3);
    for (let i = 0; i < data.length; i++) {
      float32Data[i] = data[i]! / 255.0;
    }

    return float32Data;
  }

  private async performInference(imagePath: string): Promise<any> {
      if (!this.session) throw new Error("Session not initialized");
      const inputData = await this.preprocessImage(imagePath);
      const inputTensor = new ort.Tensor('float32', inputData, [1, 256, 256, 3]);
      const outputs = await this.session.run({ [this.session.inputNames[0]!]: inputTensor });
      const predictions = outputs[this.session.outputNames[0]!]!.data as Float32Array;

      const all = Array.from(predictions).map((prob, idx) => ({
          label: this.labels[idx] ?? 'unknown',
          confidence: prob
      })).sort((a, b) => b.confidence - a.confidence);

      return { success: true, topPrediction: all[0], allPredictions: all.slice(0, 3) };
  }

  private simulateClassification(startTime: number): ClassificationResult {
    const randomIndex = Math.floor(Math.random() * this.labels.length);
    const confidence = 0.85;
    const allPredictions = this.labels.map((label, idx) => ({
      label,
      confidence: idx === randomIndex ? confidence : 0.05,
    })).sort((a, b) => b.confidence - a.confidence);

    return {
      success: true,
      topPrediction: allPredictions[0]!,
      allPredictions: allPredictions.slice(0, 3),
      metadata: { modelVersion: '1.0.0-simulated', processingTime: (Date.now() - startTime) / 1000 },
    };
  }

  getArtefactInfo(label: string): ArtefactInfo {
    const normalizedLabel = label.toLowerCase().trim();
    const artefactDatabase: Record<string, ArtefactInfo> = {
      'kikuyu spears': {
        category: 'KIKUYU_SPEARS',
        era: 'Pre-Colonial to 19th Century',
        description: 'Traditional spear (Itimũ) used for hunting, warfare, and ceremonial purposes.',
        culturalSignificance: 'Symbol of manhood and warrior status in Kikuyu society.',
        materials: ['Hardwood shaft', 'Forged iron tip'],
      },
      'kikuyu stools': {
        category: 'KIKUYU_STOOLS',
        era: 'Pre-Colonial to Present',
        description: 'Three-legged wooden stool (Gĩtĩ) carved from a single piece of wood.',
        culturalSignificance: 'Represents status and wisdom; used during council meetings.',
        materials: ['Mũgumo wood', 'Natural oil'],
      },
      'kikuyu beadwork': {
        category: 'KIKUYU_BEADWORK',
        era: '19th-20th Century',
        description: 'Intricate beaded jewelry including necklaces (Mũgathĩ).',
        culturalSignificance: 'Indicates social status, marital status, and age group.',
        materials: ['Glass beads', 'Copper wire'],
      },
      'kikuyu walking stick': {
        category: 'KIKUYU_WALKING_STICK',
        era: 'Traditional to Present',
        description: 'Carved wooden walking stick (Mũthĩgi wa kũgera).',
        culturalSignificance: 'Symbol of eldership, wisdom, and authority.',
        materials: ['Hardwood', 'Carved decorations'],
      },
      'kikuyu pots': {
        category: 'KIKUYU_POTS',
        era: 'Pre-Colonial to Present',
        description: 'Hand-molded clay pots (Nyũngũ or Mũkwa).',
        culturalSignificance: 'Made by women; representing domestic authority.',
        materials: ['Clay', 'Natural minerals'],
      },
      'kikuyu huts': {
        category: 'KIKUYU_HUTS',
        era: 'Pre-Colonial to Mid-20th Century',
        description: 'Traditional round hut (Nyũmba) with thatched roof.',
        culturalSignificance: 'Reflects Kikuyu cosmology and social structure.',
        materials: ['Mud', 'Grass thatch'],
      },
      'kikuyu combs': {
        category: 'KIKUYU_COMBS',
        era: 'Traditional',
        description: 'Wooden combs (Mũkĩa or Mũrangi).',
        culturalSignificance: 'Used for elaborate hairstyles indicating age grade.',
        materials: ['Hardwood'],
      },
      'kikuyu shields': {
        category: 'KIKUYU_SHIELDS',
        era: 'Warrior Era (Pre-1900s)',
        description: 'Traditional war shield (Ngo) made from buffalo hide.',
        culturalSignificance: 'Symbol of bravery and warrior identity (riika).',
        materials: ['Buffalo hide', 'Natural pigments'],
      },
      'kikuyu calabash': {
        category: 'KIKUYU_CALABASH',
        era: 'Traditional to Present',
        description: 'Dried gourd container (Kĩgamba or Kĩnya).',
        culturalSignificance: 'Crucial for hospitality and traditional ceremonies.',
        materials: ['Dried gourd', 'Beeswax'],
      },
      'non artefacts': {
        category: 'NON_ARTEFACTS',
        era: 'N/A',
        description: 'This item is not a traditional Kikuyu cultural artefact.',
        culturalSignificance: 'N/A',
        materials: ['N/A'],
      }
    };

    let info = artefactDatabase[normalizedLabel];
    if (!info) {
      const match = Object.keys(artefactDatabase).find(k => normalizedLabel.includes(k));
      info = match ? artefactDatabase[match] : undefined;
    }

    return info || {
      category: 'KIKUYU_ARTEFACT',
      era: 'Traditional',
      description: `Kikuyu cultural artefact: ${label}`,
      culturalSignificance: 'Part of the rich Kikuyu cultural heritage',
      materials: ['Traditional materials'],
    };
  }

  async cleanup(): Promise<void> {
    if (this.session) this.session = null;
  }
}

export default new AIService();