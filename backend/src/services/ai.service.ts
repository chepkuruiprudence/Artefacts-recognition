import sharp from 'sharp';
import * as ort from 'onnxruntime-node';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ClassificationResult, ArtefactInfo } from '../types/index';

/**
 * AI Classification Service using ONNX Runtime
 * Handles image classification and LLM-based description enhancement
 */
class AIService {
  private session: ort.InferenceSession | null = null;
  private modelPath: string = path.join(
    process.cwd(), 
    'src/assets/model/kikuyu_culture_model.onnx'
  );
  private modelLoaded: boolean = false;

  // Initialize Gemini AI (Ensure GEMINI_API_KEY is in your .env)
  private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

  private labels: string[] = [
    'kikuyu beadwork',      // 0
    'kikuyu calabash',      // 1
    'kikuyu combs',         // 2
    'kikuyu huts',          // 3
    'kikuyu pots',          // 4
    'kikuyu shields',       // 5
    'kikuyu spears',        // 6
    'kikuyu stools',        // 7
    'kikuyu walking stick', // 8
    'non artefacts'         // 9
  ];

  constructor() {
    this.initModel();
  }

  /**
   * AI Narrative Enhancement
   * Uses Gemini to turn static facts into a compelling storytelling experience
   */
  async enhanceDescription(label: string, info: ArtefactInfo): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `
        You are an expert Gĩkũyũ Cultural Anthropologist. 
        Your goal is to provide a deep, educational, and reverent description of a cultural artefact.
        
        ARTEFACT: ${label}
        CORE FACTS: ${info.description}
        CULTURAL CONTEXT: ${info.culturalSignificance}
        MATERIALS USED: ${info.materials.join(', ')}

        INSTRUCTIONS:
        1. Write a detailed educational paragraph (6-8 sentences).
        2. Do NOT shorten the information; instead, elaborate on HOW the materials were used and WHY the significance matters.
        3. Use a sophisticated, storytelling tone suitable for a high-end digital museum.
        4. Include the traditional Gĩkũyũ name (e.g., Itimũ, Ngo, Gĩtĩ) naturally in the text.
        5. Structure the response as a single, cohesive narrative.
        
        Return ONLY the enhanced text.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      return text.length > info.description.length ? text : info.description;

    } catch (error) {
      console.error("✨ Gemini Enhancement failed, using original description:", error);
      return info.description; 
    }
  }

  private async initModel(): Promise<void> {
    try {
      console.log('🔄 Loading ONNX model from:', this.modelPath);
      this.session = await ort.InferenceSession.create(this.modelPath, {
        executionProviders: ['cpu'],
        graphOptimizationLevel: 'all',
      });
      this.modelLoaded = true;
      console.log('✅ AI Model loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load ONNX model:', error);
      this.modelLoaded = false;
    }
  }

  private async preprocessImage(imagePath: string): Promise<Float32Array> {
    try {
      const { data } = await sharp(imagePath)
        .resize(256, 256, { fit: 'fill', kernel: 'linear' })
        .removeAlpha()
        .toColorspace('srgb')
        .raw()
        .toBuffer({ resolveWithObject: true });

      if (!data) throw new Error('Failed to extract pixel data');

      const float32Data = new Float32Array(256 * 256 * 3);
      for (let i = 0; i < data.length; i += 3) {
        float32Data[i]     = data[i + 2]! / 255.0; // B
        float32Data[i + 1] = data[i + 1]! / 255.0; // G
        float32Data[i + 2] = data[i]!     / 255.0; // R
      }
      return float32Data;
    } catch (error) {
      throw new Error('Failed to preprocess image');
    }
  }

  async classifyImage(imagePath: string): Promise<ClassificationResult> {
    const startTime = Date.now();
    try {
      if (!this.modelLoaded || !this.session) await this.initModel();
      if (!this.session) return this.simulateClassification(startTime);

      const inputData = await this.preprocessImage(imagePath);
      const inputName = this.session.inputNames[0]!;
      const inputTensor = new ort.Tensor('float32', inputData, [1, 256, 256, 3]);

      const outputs = await this.session.run({ [inputName]: inputTensor });
      const outputName = this.session.outputNames[0]!;
      const predictions = outputs[outputName]!.data as Float32Array;

      const allPredictions = Array.from(predictions)
        .map((prob, idx) => ({
          label: this.labels[idx] ?? 'unknown',
          confidence: prob,
        }))
        .sort((a, b) => b.confidence - a.confidence);

      return {
        success: true,
        topPrediction: allPredictions[0]!,
        allPredictions: allPredictions.slice(0, 3),
        metadata: { modelVersion: '1.0.0', processingTime: (Date.now() - startTime) / 1000 },
      };
    } catch (error) {
      return this.simulateClassification(startTime);
    }
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