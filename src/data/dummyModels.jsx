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
      verified: true,
      featured: true,
      accuracy: 98.5,
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop&q=80',
      developer: {
        name: 'AI Labs Inc',
        verified: true,
        reputation: 4.9
      },
      tags: ['GPT', 'NLP', 'Enterprise'],
      lastUpdated: '2025-10-28'
    },
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
      verified: true,
      featured: true,
      accuracy: 99.2,
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop&q=80',
      developer: {
        name: 'Vision AI Labs',
        verified: true,
        reputation: 4.9
      },
      tags: ['YOLO', 'Real-time', 'Mobile'],
      lastUpdated: '2025-10-25'
    },
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
      verified: true,
      accuracy: 98.1,
      thumbnail: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=400&h=300&fit=crop&q=80',
      developer: {
        name: 'Audio Tech',
        verified: true,
        reputation: 4.7
      },
      tags: ['Speech-to-Text', 'Multilingual'],
      lastUpdated: '2025-10-20'
    }
  ];

  const modelTypes = [
    { category: 'Language', prefix: 'GPT', tags: ['NLP', 'Text Generation', 'Language'] },
    { category: 'Computer Vision', prefix: 'Vision', tags: ['Image', 'Detection', 'Recognition'] },
    { category: 'Audio', prefix: 'Audio', tags: ['Speech', 'Sound', 'Voice'] },
    { category: 'Multimodal', prefix: 'Multi', tags: ['Combined', 'Integration', 'Fusion'] }
  ];

  const generateName = (type, index) => {
    const suffixes = ['AI', 'Pro', 'Plus', 'Max', 'Elite', 'Ultra'];
    // Use deterministic suffix based on index instead of random
    const suffix = suffixes[index % suffixes.length];
    return `${type.prefix}-${index} ${suffix}`;
  };

  const generateDescription = (type, index) => {
    const descriptions = {
      'Language': [
        'State-of-the-art language model that excels in natural text generation, understanding context, and maintaining coherent conversations. Perfect for content creation, chatbots, and automated writing assistance.',
        'Advanced NLP model specialized in sentiment analysis and emotion detection. Ideal for social media monitoring, customer feedback analysis, and brand perception tracking.',
        'Multilingual translation powerhouse supporting 95+ languages with context-aware translations and idiom understanding. Essential for global communication and content localization.',
        'Enterprise-grade text summarization and analysis model. Automatically extracts key insights, generates reports, and processes large volumes of documents.'
      ],
      'Computer Vision': [
        'High-performance object detection system with real-time tracking capabilities. Achieves 99.2% accuracy across 1000+ object classes, ideal for security and retail analytics.',
        'Advanced facial recognition model with emotion detection and demographic analysis. Features anti-spoofing technology and privacy-preserving architecture.',
        'Industrial-grade quality control vision system. Detects defects, performs measurements, and ensures product consistency with sub-millimeter accuracy.',
        'Medical imaging analysis model trained on 10M+ annotated scans. Supports diagnosis assistance across multiple modalities including X-ray, CT, and MRI.'
      ],
      'Audio': [
        'Professional-grade speech recognition engine with 98% accuracy across 40+ languages. Features noise reduction and speaker diarization capabilities.',
        'Advanced music generation and analysis system. Creates original compositions, performs style transfer, and generates instrumental arrangements.',
        'Real-time voice cloning and synthesis model. Generates natural-sounding speech with emotion control and accent preservation.',
        'Environmental sound classification model for security and monitoring applications. Detects anomalies and classifies 1000+ types of sounds.'
      ],
      'Multimodal': [
        'Cutting-edge text-to-image generation model. Creates high-resolution images from detailed descriptions with style control and composition guidance.',
        'Video understanding and description system. Generates detailed scene descriptions, extracts actions, and identifies complex events in video content.',
        'Cross-modal learning system that bridges text, image, and audio understanding. Perfect for content analysis and multimedia search applications.',
        'Interactive AI assistant with multimodal capabilities. Understands and generates text, images, and audio in coherent conversations.'
      ]
    };
    // Use deterministic description based on index
    return descriptions[type.category][index % descriptions[type.category].length];
  };

// Unique AI-themed images for each category - 32 unique images (8 per category)
// Using reliable, tested Unsplash URLs with proper parameters
const categoryImages = {
  'Language': [
    'https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=400&h=300&fit=crop&q=80&auto=format', // AI Code
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=300&fit=crop&q=80&auto=format', // Programming
    'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop&q=80&auto=format', // Code Editor
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=300&fit=crop&q=80&auto=format', // Coding
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop&q=80&auto=format', // Code Screen
    'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=400&h=300&fit=crop&q=80&auto=format', // Text Processing
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=300&fit=crop&q=80&auto=format', // Code Development
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=300&fit=crop&q=80&auto=format', // Data Code
  ],
  'Computer Vision': [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&q=80&auto=format', // Neural Network
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop&q=80&auto=format', // AI Brain
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=300&fit=crop&q=80&auto=format', // AI Tech
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop&q=80&auto=format', // Technology
    'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=400&h=300&fit=crop&q=80&auto=format', // Image Recognition
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop&q=80&auto=format', // Tech Vision
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop&q=80&auto=format', // Technology
    'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop&q=80&auto=format', // AI Vision
  ],
  'Audio': [
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop&q=80', // Music Studio (Audio-3 Max)
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop&q=80', // Sound Waves
    'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=300&fit=crop&q=80', // Audio Tech
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop&q=80', // Sound Engineering
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop&q=80', // Audio Recording
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop&q=80', // Music Production
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&q=80', // Audio Equipment
    'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=300&fit=crop&q=80', // Sound Mixer
  ],
  'Multimodal': [
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop&q=80', // AI Brain (Multi-4 Elite)
    'https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?w=400&h=300&fit=crop&q=80', // AI Network
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop&q=80', // ML Visualization
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&q=80', // Data Analytics
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&q=80', // Dashboard Analytics
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop&q=80', // Technology
    'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=300&fit=crop&q=80', // AI Technology
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop&q=80', // Tech Innovation
  ]
};

const generateDummyModels = () => {
  // Track image usage per category to ensure uniqueness
  const imageIndexes = {
    'Language': 0,
    'Computer Vision': 0,
    'Audio': 0,
    'Multimodal': 0
  };

  // Generate additional models with deterministic values
  const additionalModels = [];
  for (let i = 0; i < 27; i++) {
    const typeIndex = i % modelTypes.length;
    const type = modelTypes[typeIndex];
    
    // Get next unique image for this category
    const categoryImagePool = categoryImages[type.category];
    const imageIndex = imageIndexes[type.category] % categoryImagePool.length;
    const thumbnail = categoryImagePool[imageIndex];
    imageIndexes[type.category]++;
    
    // Use deterministic values based on index to ensure consistency
    const priceBase = (i % 5) + 0.5;
    const ratingBase = 4.0 + ((i % 10) / 10);
    const reviewBase = 100 + (i * 37);
    const downloadBase = 1000 + (i * 423);
    const accuracyBase = 90 + ((i % 9) + 0.5);
    const verified = (i % 3) !== 0;
    const featured = (i % 8) === 0;
    const reputationBase = 4.0 + ((i % 10) / 10);
    
    additionalModels.push({
      id: `model-${i + 4}`,
      name: generateName(type, i + 1),
      description: generateDescription(type, i + 1),
      category: type.category,
      subcategory: type.tags[0],
      price: Number(priceBase.toFixed(2)),
      currency: 'ETH',
      rating: Number(ratingBase.toFixed(1)),
      reviewCount: reviewBase,
      downloads: downloadBase,
      verified: verified,
      featured: featured,
      accuracy: Number(accuracyBase.toFixed(1)),
      thumbnail: thumbnail,
      developer: {
        name: `AI Corp ${i + 1}`,
        verified: verified,
        reputation: Number(reputationBase.toFixed(1))
      },
      tags: [
        type.tags[i % type.tags.length],
        'AI',
        (i % 2) === 0 ? 'Enterprise' : 'Research'
      ],
      lastUpdated: new Date(Date.now() - (i * 3) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  }

  return [...baseModels, ...additionalModels];
};

export const dummyModels = generateDummyModels();