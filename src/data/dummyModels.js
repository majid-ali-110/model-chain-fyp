const baseModels = [
    {
      id: 'llm-1',
      name: 'TextGenius Pro',
      description: 'Advanced language model for content generation and comprehension',
      category: 'Language',
      subcategory: 'Text Generation',
      price: 2.5,
      currency: 'ETH',
      rating: 4.9,
      reviewCount: 1250,
      downloads: 15000,
      thumbnail: 'https://picsum.photos/seed/llm-1/400/300',
      verified: true,
      featured: true,
      accuracy: 98.5,
      developer: {
        name: 'AI Labs Inc',
        verified: true,
        reputation: 4.9
      },
      tags: ['GPT', 'NLP', 'Enterprise'],
      lastUpdated: '2025-10-28'
    },
  {
    id: 'llm-2',
    name: 'SentimentMaster',
    description: 'Real-time sentiment analysis for social media and customer feedback',
    category: 'Language',
    subcategory: 'Sentiment Analysis',
    price: 0.8,
    currency: 'ETH',
    rating: 4.7,
    reviewCount: 830,
    downloads: 8900,
    thumbnail: 'https://picsum.photos/seed/llm-2/400/300',
    verified: true,
    accuracy: 96.2,
    developer: {
      name: 'DataMinds',
      verified: true,
      reputation: 4.8
    },
    tags: ['BERT', 'Sentiment', 'Social Media']
  },
  // Vision Models
  {
    id: 'cv-1',
    name: 'ObjectDetectPro',
    description: 'State-of-the-art object detection with 99.2% accuracy',
    category: 'Computer Vision',
    subcategory: 'Object Detection',
    price: 1.75,
    currency: 'ETH',
    rating: 4.8,
    reviewCount: 950,
    downloads: 12000,
    thumbnail: 'https://picsum.photos/seed/cv-1/400/300',
    verified: true,
    featured: true,
    accuracy: 99.2,
    developer: {
      name: 'Vision AI Labs',
      verified: true,
      reputation: 4.9
    },
    tags: ['YOLO', 'Real-time', 'Mobile']
  },
  {
    id: 'cv-2',
    name: 'FaceAnalytics',
    description: 'Advanced facial recognition and emotion detection',
    category: 'Computer Vision',
    subcategory: 'Face Recognition',
    price: 3.0,
    currency: 'ETH',
    rating: 4.6,
    reviewCount: 720,
    downloads: 6500,
    thumbnail: 'https://picsum.photos/seed/cv-2/400/300',
    verified: true,
    accuracy: 97.8,
    tags: ['Face Detection', 'Emotion', 'Security']
  },
  // Audio Models
  {
    id: 'audio-1',
    name: 'VoiceGenius',
    description: 'High-accuracy speech recognition and transcription',
    category: 'Audio',
    subcategory: 'Speech Recognition',
    price: 1.2,
    currency: 'ETH',
    rating: 4.7,
    reviewCount: 850,
    downloads: 9200,
    thumbnail: 'https://picsum.photos/seed/audio-1/400/300',
    verified: true,
    accuracy: 98.1,
    tags: ['Speech-to-Text', 'Multilingual']
  },
  {
    id: 'audio-2',
    name: 'MusicAI',
    description: 'Music generation and analysis model',
    category: 'Audio',
    subcategory: 'Music Generation',
    price: 0.5,
    currency: 'ETH',
    rating: 4.5,
    reviewCount: 320,
    downloads: 4100,
    thumbnail: 'https://picsum.photos/seed/audio-2/400/300',
    tags: ['Music', 'Generation', 'MIDI']
  },
  // Multimodal Models
  {
    id: 'multi-1',
    name: 'ImageNarrator',
    description: 'Convert images to detailed text descriptions',
    category: 'Multimodal',
    subcategory: 'Image-to-Text',
    price: 1.8,
    currency: 'ETH',
    rating: 4.8,
    reviewCount: 680,
    downloads: 7300,
    thumbnail: 'https://picsum.photos/seed/multi-1/400/300',
    verified: true,
    featured: true,
    tags: ['Vision-Language', 'Captioning']
  },
  // Time Series Models
  {
    id: 'ts-1',
    name: 'StockPredictor',
    description: 'Advanced stock market prediction model',
    category: 'Time Series',
    subcategory: 'Financial',
    price: 5.0,
    currency: 'ETH',
    rating: 4.6,
    reviewCount: 420,
    downloads: 3200,
    thumbnail: 'https://picsum.photos/seed/ts-1/400/300',
    verified: true,
    tags: ['Finance', 'Prediction']
  },
  // Medical AI Models
  {
    id: 'med-1',
    name: 'MedicalVision',
    description: 'Medical image analysis and diagnosis assistance',
    category: 'Medical',
    subcategory: 'Diagnosis',
    price: 4.5,
    currency: 'ETH',
    rating: 4.9,
    reviewCount: 310,
    downloads: 2800,
    thumbnail: 'https://picsum.photos/seed/med-1/400/300',
    verified: true,
    featured: true,
    tags: ['Healthcare', 'Radiology']
  },
  // Free Models
  {
    id: 'free-1',
    name: 'BasicNLP',
    description: 'Simple text classification and sentiment analysis',
    category: 'Language',
    thumbnail: 'https://picsum.photos/seed/free-1/400/300',
    subcategory: 'Classification',
    price: 0,
    currency: 'ETH',
    rating: 4.3,
    reviewCount: 1500,
    downloads: 25000,
    tags: ['Free', 'Starter', 'Educational']
  }
];

// Generate additional models
const additionalModels = [];
const names = [
  'SmartVision', 'TextPro', 'AudioMaster', 'MultiAI', 'DataFlow', 'NeuralNet',
  'DeepAnalyzer', 'QuantumAI', 'CloudMind', 'EdgeML', 'FastProcessor', 'SmartClassifier'
];

const descriptions = [
  'Advanced AI model with multiple capabilities and high performance',
  'State-of-the-art model optimized for production environments',
  'Enterprise-grade machine learning model with excellent accuracy',
  'Lightweight model designed for edge computing and mobile deployment',
  'Robust model trained on diverse datasets for generalization',
  'Real-time processing model with low latency requirements'
];

const categories = ['Language', 'Computer Vision', 'Audio', 'Multimodal', 'Time Series', 'Medical'];
const subcategories = ['Analysis', 'Generation', 'Recognition', 'Processing', 'Prediction', 'Classification'];

for (let i = 0; i < 50; i++) {
  additionalModels.push({
    id: 'model-' + (i + 11),
    name: names[i % names.length] + ' ' + (i + 1),
    description: descriptions[i % descriptions.length],
    category: categories[i % categories.length],
    subcategory: subcategories[i % subcategories.length],
    price: parseFloat((Math.random() * 5).toFixed(2)),
    currency: 'ETH',
    rating: parseFloat((4 + Math.random()).toFixed(1)),
    reviewCount: Math.floor(Math.random() * 1000) + 100,
    downloads: Math.floor(Math.random() * 10000) + 1000,
    verified: Math.random() > 0.3,
    featured: Math.random() > 0.8,
    accuracy: parseFloat((90 + Math.random() * 9).toFixed(1)),
    developer: {
      name: 'AI Corp ' + (i + 1),
      verified: Math.random() > 0.3,
      reputation: parseFloat((4 + Math.random()).toFixed(1))
    },
    tags: [
      categories[i % categories.length],
      'AI',
      Math.random() > 0.5 ? 'Enterprise' : 'Research'
    ],
    lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
}

export const dummyModels = baseModels.concat(additionalModels);