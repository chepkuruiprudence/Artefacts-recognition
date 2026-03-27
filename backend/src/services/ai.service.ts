import sharp from 'sharp';
import * as ort from 'onnxruntime-node';
import path from 'path';
import { ClassificationResult, ArtefactInfo } from '../types/index';

/**
 * AI Classification Service using ONNX Runtime
 * Handles image classification for Kikuyu cultural artefacts
 */
class AIService {
  private session: ort.InferenceSession | null = null;
  private modelPath: string = path.join(
    process.cwd(), 
    'src/assets/model/kikuyu_culture_model.onnx'
  );
  private modelLoaded: boolean = false;

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
   * Initialize ONNX model
   */
  private async initModel(): Promise<void> {
    try {
      console.log('🔄 Loading ONNX model from:', this.modelPath);
      
      this.session = await ort.InferenceSession.create(this.modelPath, {
        executionProviders: ['cpu'], // Use CPU provider
        graphOptimizationLevel: 'all',
      });
      
      this.modelLoaded = true;
      
      console.log('✅ AI Model loaded successfully');
      console.log('📊 Input names:', this.session.inputNames);
      console.log('📊 Output names:', this.session.outputNames);
      
    } catch (error) {
      console.error('❌ Failed to load ONNX model:', error);
      console.warn('⚠️  Model path:', this.modelPath);
      console.warn('⚠️  Falling back to simulated classification');
      this.modelLoaded = false;
    }
  }

  /**
   * Preprocess image for model input
   * Converts image to normalized Float32Array
   */
  /**
   * Preprocess image for model input
   * Converts image to normalized Float32Array (0.0 to 1.0) with BGR channel order
   */
  private async preprocessImage(imagePath: string): Promise<Float32Array> {
    try {
      const { data } = await sharp(imagePath)
        .resize(256, 256, { 
          fit: 'fill',        // Matches Keras 'squash' resizing
          kernel: 'linear'  // Matches Keras default interpolation
        })
        .removeAlpha()
        .toColorspace('srgb') // Get standard RGB first
        .raw()
        .toBuffer({ resolveWithObject: true });

      if (!data) {
        throw new Error('Failed to extract pixel data from image');
      }

      const float32Data = new Float32Array(256 * 256 * 3);

      /**
       * 🔄 THE BGR SWAP & NORMALIZATION LOOP
       * 1. data[i]! / 255.0 fixes the 10% "AI Panic" and the TS2532 error.
       * 2. Swapping indexes [i] and [i+2] matches your Kaggle cv2.imread(BGR) logic.
       */
      for (let i = 0; i < data.length; i += 3) {
        // We read R, G, B from Sharp and write B, G, R to the tensor
        float32Data[i]     = data[i + 2]! / 255.0; // Blue
        float32Data[i + 1] = data[i + 1]! / 255.0; // Green
        float32Data[i + 2] = data[i]!     / 255.0; // Red
      }

      return float32Data;
    } catch (error) {
      console.error('❌ Preprocessing error:', error);
      throw new Error('Failed to preprocess image');
    }
  }

  /**
   * Classify artefact image using ONNX model
   */
  async classifyImage(imagePath: string): Promise<ClassificationResult> {
    const startTime = Date.now();

    try {
      // Wait for model to load if not ready
      if (!this.modelLoaded || !this.session) {
        console.log('⏳ Waiting for model to load...');
        await this.initModel();
      }

      // If model still not loaded, use simulation
      if (!this.session || !this.modelLoaded) {
        console.warn('⚠️  Using simulated classification');
        return this.simulateClassification(startTime);
      }

      // Preprocess image
      const inputData = await this.preprocessImage(imagePath);
      
      // Get input name from model
      const inputName = this.session.inputNames[0];
      if (!inputName) {
        throw new Error('Model has no input names');
      }

      // Create input tensor [1, 256, 256, 3]
      const inputTensor = new ort.Tensor('float32', inputData, [1, 256, 256, 3]);

      console.log('🎯 Running inference...');
      console.log('   Input name:', inputName);
      console.log('   Input shape:', inputTensor.dims);

      // Run inference
      const outputs = await this.session.run({ [inputName]: inputTensor });
      
      // Get output
      const outputName = this.session.outputNames[0];
      if (!outputName) {
        throw new Error('Model has no output names');
      }

      const output = outputs[outputName];
      if (!output) {
        throw new Error('Model produced no output');
      }

      const predictions = output.data as Float32Array;

      console.log('📊 Raw predictions:', Array.from(predictions).map((p, i) => 
        `${this.labels[i]}: ${(p * 100).toFixed(2)}%`
      ));

      // Map predictions to labels
      const allPredictions = Array.from(predictions)
        .map((prob, idx) => ({
          label: this.labels[idx] ?? 'unknown',
          confidence: prob,
        }))
        .sort((a, b) => b.confidence - a.confidence);

      const processingTime = (Date.now() - startTime) / 1000;

      // Ensure we have a valid top prediction
      const topPrediction = allPredictions[0];
      if (!topPrediction) {
        throw new Error('Model produced no predictions');
      }

      console.log('🎯 Top prediction:', topPrediction.label, 
                  `(${(topPrediction.confidence * 100).toFixed(2)}%)`);

      return {
        success: true,
        topPrediction,
        allPredictions: allPredictions.slice(0, 3),
        metadata: {
          modelVersion: '1.0.0',
          processingTime,
        },
      };

    } catch (error) {
      console.error('❌ Classification error:', error);
      
      // Fallback to simulation
      console.warn('⚠️  Falling back to simulated classification');
      return this.simulateClassification(startTime);
    }
  }

  /**
   * Simulated classification (fallback when model unavailable)
   */
  private simulateClassification(startTime: number): ClassificationResult {
    const randomIndex = Math.floor(Math.random() * this.labels.length);
    const confidence = 0.75 + Math.random() * 0.24; // 75-99%

    const allPredictions = this.labels
      .map((label, idx) => ({
        label,
        confidence: idx === randomIndex ? confidence : Math.random() * 0.3,
      }))
      .sort((a, b) => b.confidence - a.confidence);

    const processingTime = (Date.now() - startTime) / 1000;

    console.log('🎲 Simulated prediction:', allPredictions[0]?.label);

    return {
      success: true,
      topPrediction: allPredictions[0]!,
      allPredictions: allPredictions.slice(0, 3),
      metadata: {
        modelVersion: '1.0.0-simulated',
        processingTime,
      },
    };
  }

  /**
   * Get detailed artefact information
   */
  getArtefactInfo(label: string): ArtefactInfo {
    // Normalize label for lookup
    const normalizedLabel = label.toLowerCase().trim();

    const artefactDatabase: Record<string, ArtefactInfo> = {
      'kikuyu spears': {
        category: 'KIKUYU_SPEARS',
        era: 'Pre-Colonial to 19th Century',
        description:
          'Traditional spear (Itimũ) used for hunting, warfare, and ceremonial purposes. Features a long wooden shaft with a sharp metal or stone tip. The spear was both a practical tool and a symbol of warrior status.',
        culturalSignificance:
          'Symbol of manhood and warrior status in Kikuyu society. Young men received spears during initiation ceremonies marking their transition to adulthood. Warriors (aanake) carried spears as protection and symbols of their duty to defend the community.',
        materials: ['Hardwood shaft', 'Forged iron tip', 'Leather binding', 'Animal sinew'],
      },
      'kikuyu stools': {
        category: 'KIKUYU_STOOLS',
        era: 'Pre-Colonial to Present',
        description:
          'Three-legged wooden stool (Gĩtĩ or Mũthĩgi) carved from a single piece of wood. Each stool is unique, personalized to its owner with intricate geometric patterns. The three legs symbolize stability and balance.',
        culturalSignificance:
          'Represents status, wisdom, and eldership in Kikuyu culture. Used during important ceremonies, council meetings (kiama), and storytelling sessions. Passed down through generations as family heirlooms. The owner\'s stool was considered deeply personal - sitting on another\'s stool was a serious transgression.',
        materials: ['Mũgumo wood (sacred fig)', 'Mũtamaiyo wood', 'Natural oil finish'],
      },
      'non artefacts': {
        category: 'NON_ARTEFACTS',
        era: 'N/A',
        description:
          'This item does not appear to be a traditional Kikuyu cultural artefact. It may be a modern object, natural item, or item from a different cultural context.',
        culturalSignificance:
          'Not applicable - this is not a recognized Kikuyu cultural artefact.',
        materials: ['N/A'],
      },
      'kikuyu beadwork': {
        category: 'KIKUYU_BEADWORK',
        era: '19th-20th Century',
        description:
          'Intricate beaded jewelry including necklaces (Mũgathĩ), bracelets, waist beads, and ornaments. Made with colorful glass beads arranged in traditional geometric patterns. Each color combination carries specific cultural meaning.',
        culturalSignificance:
          'Indicates social status, marital status, and age group. Red beads symbolize bravery and blood, white represents purity and peace, blue connects to sky and divine, green signifies land and fertility. Different patterns identified clan affiliations and personal achievements. Beadwork was exchanged during courtship and marriage ceremonies.',
        materials: ['Glass beads (imported)', 'Copper wire', 'Natural fiber thread', 'Leather'],
      },
      'kikuyu walking stick': {
        category: 'KIKUYU_WALKING_STICK',
        era: 'Traditional to Present',
        description:
          'Carved wooden walking stick (Mũthĩgi wa kũgera) used by elders and respected community members. Features elaborate carvings including geometric patterns, animal motifs, and symbolic designs that tell the owner\'s life story.',
        culturalSignificance:
          'Symbol of eldership, wisdom, and authority. Given to men who have achieved elder status (athuuri) in the community. The stick serves both practical and ceremonial purposes. The intricate carvings often depict significant life events, clan symbols, or proverbs. Used during council meetings to emphasize points and maintain order.',
        materials: ['Hardwood (mũiri or mũtamaiyo)', 'Natural finish', 'Carved decorations'],
      },
      'kikuyu pots': {
        category: 'KIKUYU_POTS',
        era: 'Pre-Colonial to Present',
        description:
          'Hand-molded clay pots (Nyũngũ or Mũkwa) used for cooking, brewing, and storage. Made using traditional coiling technique without a potter\'s wheel. Each pot is burnished with smooth stones and sometimes decorated with incised patterns.',
        culturalSignificance:
          'Essential household items made exclusively by women, representing female knowledge and domestic authority. Different shapes serve specific purposes: wide-mouth for cooking ugali, narrow-neck for storing honey or oil, large pots for brewing traditional beer (njohi). The skill of pottery-making was passed from mother to daughter. A woman\'s pottery collection indicated her household management skills.',
        materials: ['Clay', 'Natural minerals', 'Organic temper (crushed pottery)', 'Ash polish'],
      },
      'kikuyu huts': {
        category: 'KIKUYU_HUTS',
        era: 'Pre-Colonial to Mid-20th Century',
        description:
          'Traditional round hut (Nyũmba) with thatched roof and mud walls. Built around a central pole representing the connection to ancestors and the divine. The circular design has no corners where evil spirits could hide.',
        culturalSignificance:
          'The hut layout reflects Kikuyu cosmology and social structure. Men\'s side (right) represents strength and protection, women\'s side (left) represents nurturing and life. The fireplace in center symbolizes family unity and continuity. Hut construction was a community affair (ngwatio) involving extended family and neighbors, strengthening social bonds.',
        materials: ['Mud and clay', 'Wooden poles (mũgumo, mũthakwa)', 'Grass thatch', 'Cow dung (for flooring)'],
      },
      'kikuyu combs': {
        category: 'KIKUYU_COMBS',
        era: 'Traditional',
        description:
          'Wooden combs (Mũkĩa or Mũrangi) carved from single piece of wood. Features multiple teeth and often a decorative handle with geometric patterns. Used for creating and maintaining elaborate traditional hairstyles.',
        culturalSignificance:
          'Hairstyles indicated age grade, marital status, and social standing. Unmarried girls wore specific styles different from married women. Hairstyling sessions were important social events where women gathered, shared stories, and passed down oral traditions. The comb itself was a personal item, sometimes given as a courtship gift.',
        materials: ['Hardwood', 'Natural oil finish', 'Carved decorations'],
      },
      'kikuyu shields': {
        category: 'KIKUYU_SHIELDS',
        era: 'Warrior Era (Pre-1900s)',
        description:
          'Traditional war shield (Ngo or Rũthanju) made from buffalo hide stretched over a wooden frame. Decorated with distinctive patterns and colors indicating warrior age-group (riika) and achievements. Typically oval or elongated shape for full-body protection.',
        culturalSignificance:
          'Symbol of bravery, protection, and warrior identity. Each warrior age-group had unique shield decorations - specific color combinations, patterns, and emblems. Red ochre indicated a warrior who had proven himself in battle. Shields were carried during raids, defense, and ceremonial dances. The shield dance (kũina) displayed warrior prowess and unity.',
        materials: ['Buffalo hide', 'Wooden frame', 'Natural pigments (red ochre, white clay, charcoal)', 'Leather straps'],
      },
      'kikuyu calabash': {
        category: 'KIKUYU_CALABASH',
        era: 'Traditional to Present',
        description:
          'Dried gourd container (Kĩgamba or Kĩnya) used for storing and serving liquids, especially milk, honey, and traditional beverages. Often decorated with burnt geometric patterns or painted designs. Different sizes for different purposes.',
        culturalSignificance:
          'Important in traditional ceremonies, hospitality, and daily life. Used for serving guests as a sign of respect and welcome. Special ceremonial calabashes reserved for important occasions like weddings, peace-making ceremonies, and offerings to ancestors. The skill of selecting, preparing, and decorating gourds was highly valued. A well-decorated calabash indicated the owner\'s artistic ability and social status.',
        materials: ['Dried gourd (Kĩgere)', 'Burnt decorations', 'Beeswax coating (for waterproofing)', 'Natural dyes'],
      },
    };

    // Try exact match first
    let artefactInfo = artefactDatabase[normalizedLabel];
    
    // If no exact match, try partial matching
    if (!artefactInfo) {
      const partialMatch = Object.keys(artefactDatabase).find(key => 
        normalizedLabel.includes(key) || key.includes(normalizedLabel)
      );
      if (partialMatch) {
        artefactInfo = artefactDatabase[partialMatch];
      }
    }

    // Return found info or default
    return artefactInfo || {
      category: 'KIKUYU_SPEARS',
      era: 'Traditional',
      description: `Kikuyu cultural artefact: ${label}`,
      culturalSignificance: 'Part of the rich Kikuyu cultural heritage',
      materials: ['Traditional materials'],
    };
  }

  /**
   * Get model status
   */
  getModelStatus(): { loaded: boolean; version: string; classes: number } {
    return {
      loaded: this.modelLoaded,
      version: this.modelLoaded ? '1.0.0' : '1.0.0-simulated',
      classes: this.labels.length,
    };
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    if (this.session) {
      // ONNX Runtime session cleanup is automatic
      this.session = null;
      console.log('🧹 Model session cleaned up');
    }
  }
}

export default new AIService();