/**
 * AI-themed placeholder image URLs
 * Professional, relevant images for AI/ML marketplace
 */

// Using a combination of sources for AI-related placeholder images
// These are real, publicly available AI/tech-themed images

export const getAIPlaceholder = (seed, size = '400x300') => {
  // Map of seed values to AI-themed image categories
  const aiCategories = {
    'ai-model-1': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop', // AI Neural Network
    'ai-model-2': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=300&fit=crop', // AI Technology
    'ai-model-3': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop', // AI Brain
    'model-1': 'https://images.unsplash.com/photo-1676277791608-ac36a5fc80e3?w=400&h=300&fit=crop', // AI Chip
    'model-2': 'https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?w=400&h=300&fit=crop', // AI Network
    'model-3': 'https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=400&h=300&fit=crop', // AI Code
    'model1': 'https://images.unsplash.com/photo-1676277791608-ac36a5fc80e3?w=200&h=200&fit=crop', // AI Chip Small
    'model2': 'https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?w=200&h=200&fit=crop', // AI Network Small
    'my-model-1': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop', // Neural Network
    'my-model-2': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=300&fit=crop', // AI Tech
    'my-model-3': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop', // AI Brain
  };

  // Return specific category image or generate a default
  if (aiCategories[seed]) {
    return aiCategories[seed];
  }

  // For dynamic seeds (like model IDs), use a rotation of AI-themed images
  const defaultImages = [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995', // Neural Network
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485', // AI Technology
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb', // AI Brain
    'https://images.unsplash.com/photo-1676277791608-ac36a5fc80e3', // AI Chip
    'https://images.unsplash.com/photo-1655393001768-d946c97d6fd1', // AI Network
    'https://images.unsplash.com/photo-1639322537504-6427a16b0a28', // AI Code
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0', // ML Visualization
    'https://images.unsplash.com/photo-1675271591843-b127ce24ba6f', // AI Interface
  ];

  // Use hash of seed to select consistent image
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageIndex = hash % defaultImages.length;
  const [width, height] = size.split('x');
  
  return `${defaultImages[imageIndex]}?w=${width}&h=${height}&fit=crop`;
};

// Specific placeholder types
export const placeholders = {
  neuralNetwork: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
  aiTechnology: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=300&fit=crop',
  aiBrain: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
  aiChip: 'https://images.unsplash.com/photo-1676277791608-ac36a5fc80e3?w=400&h=300&fit=crop',
  aiNetwork: 'https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?w=400&h=300&fit=crop',
  aiCode: 'https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=400&h=300&fit=crop',
  mlVisualization: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop',
  aiInterface: 'https://images.unsplash.com/photo-1675271591843-b127ce24ba6f?w=400&h=300&fit=crop',
};

// Category-specific placeholders
export const categoryPlaceholders = {
  'Computer Vision': placeholders.neuralNetwork,
  'Natural Language Processing': placeholders.aiCode,
  'Audio Processing': placeholders.aiNetwork,
  'Generative AI': placeholders.aiBrain,
  'Recommendation Systems': placeholders.mlVisualization,
  'Time Series': placeholders.aiChip,
  'Reinforcement Learning': placeholders.aiInterface,
  'default': placeholders.aiTechnology,
};

export const getCategoryPlaceholder = (category) => {
  return categoryPlaceholders[category] || categoryPlaceholders.default;
};
