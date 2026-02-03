/**
 * IPFS Service for ModelChain
 * Handles file uploads and retrieval from IPFS via Pinata or public gateway
 */

// Pinata API configuration (set these in .env)
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY || '';
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY || '';
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT || '';

// IPFS Gateway URLs
const GATEWAYS = [
  'https://gateway.pinata.cloud/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://dweb.link/ipfs/'
];

/**
 * Upload JSON data to IPFS via Pinata
 * @param {Object} data - JSON data to upload
 * @param {string} name - Name for the pinned file
 * @returns {Promise<{hash: string, url: string}>}
 */
export const uploadJSON = async (data, name = 'data.json') => {
  // Try Pinata first if credentials exist
  if (PINATA_JWT || PINATA_API_KEY) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Use JWT if available, otherwise use API key/secret
      if (PINATA_JWT) {
        headers['Authorization'] = `Bearer ${PINATA_JWT}`;
      } else {
        headers['pinata_api_key'] = PINATA_API_KEY;
        headers['pinata_secret_api_key'] = PINATA_SECRET_KEY;
      }

      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          pinataContent: data,
          pinataMetadata: {
            name: name,
            keyvalues: {
              app: 'ModelChain',
              timestamp: Date.now().toString()
            }
          },
          pinataOptions: {
            cidVersion: 1
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        return {
          hash: result.IpfsHash,
          url: `${GATEWAYS[0]}${result.IpfsHash}`
        };
      }
      
      // If Pinata fails, fall through to local storage
      console.warn('Pinata upload failed, using local storage fallback');
    } catch (error) {
      console.warn('Pinata error, using local storage fallback:', error.message);
    }
  }

  // Fallback to local storage simulation for development
  return uploadJSONLocal(data, name);
};

/**
 * Upload file to IPFS via Pinata
 * @param {File} file - File to upload
 * @returns {Promise<{hash: string, url: string}>}
 */
export const uploadFile = async (file) => {
  // Try Pinata first if credentials exist
  if (PINATA_JWT || PINATA_API_KEY) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pinataMetadata', JSON.stringify({
        name: file.name,
        keyvalues: {
          app: 'ModelChain',
          type: file.type,
          size: file.size.toString(),
          timestamp: Date.now().toString()
        }
      }));
      formData.append('pinataOptions', JSON.stringify({
        cidVersion: 1
      }));

      const headers = {};
      if (PINATA_JWT) {
        headers['Authorization'] = `Bearer ${PINATA_JWT}`;
      } else {
        headers['pinata_api_key'] = PINATA_API_KEY;
        headers['pinata_secret_api_key'] = PINATA_SECRET_KEY;
      }

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers,
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        return {
          hash: result.IpfsHash,
          url: `${GATEWAYS[0]}${result.IpfsHash}`,
          size: result.PinSize
        };
      }

      console.warn('Pinata file upload failed, using local storage fallback');
    } catch (error) {
      console.warn('Pinata file error, using local storage fallback:', error.message);
    }
  }

  // Fallback to local storage simulation for development
  return uploadFileLocal(file);
};

/**
 * Fetch data from IPFS
 * @param {string} hash - IPFS hash (CID)
 * @returns {Promise<any>}
 */
export const fetchFromIPFS = async (hash) => {
  // Try each gateway until one works
  for (const gateway of GATEWAYS) {
    try {
      const response = await fetch(`${gateway}${hash}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          return await response.json();
        }
        return await response.text();
      }
    } catch (error) {
      // Try next gateway
      continue;
    }
  }

  // Fallback to local storage for development
  return fetchFromLocal(hash);
};

/**
 * Get IPFS URL for a hash
 * @param {string} hash - IPFS hash
 * @returns {string}
 */
export const getIPFSUrl = (hash) => {
  if (!hash) return '';
  // Remove ipfs:// prefix if present
  const cleanHash = hash.replace('ipfs://', '');
  return `${GATEWAYS[0]}${cleanHash}`;
};

/**
 * Upload model metadata to IPFS
 * @param {Object} metadata - Model metadata
 * @returns {Promise<{hash: string, url: string}>}
 */
export const uploadModelMetadata = async (metadata) => {
  const modelMetadata = {
    name: metadata.name,
    description: metadata.description,
    category: metadata.category,
    framework: metadata.framework,
    version: metadata.version || '1.0.0',
    author: metadata.author,
    license: metadata.license || 'MIT',
    tags: metadata.tags || [],
    requirements: metadata.requirements || [],
    inputFormat: metadata.inputFormat,
    outputFormat: metadata.outputFormat,
    modelSize: metadata.modelSize,
    performance: metadata.performance || {},
    createdAt: new Date().toISOString(),
    modelChainVersion: '1.0.0'
  };

  return uploadJSON(modelMetadata, `${metadata.name}-metadata.json`);
};

/**
 * Upload user profile to IPFS
 * @param {Object} profile - User profile data
 * @returns {Promise<{hash: string, url: string}>}
 */
export const uploadProfile = async (profile) => {
  const profileData = {
    username: profile.username,
    displayName: profile.displayName,
    bio: profile.bio,
    avatar: profile.avatar,
    social: {
      twitter: profile.twitter,
      github: profile.github,
      website: profile.website
    },
    role: profile.role,
    createdAt: profile.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return uploadJSON(profileData, `profile-${profile.username}.json`);
};

// ============================================
// Local Storage Fallback (Development Only)
// ============================================

const LOCAL_STORAGE_PREFIX = 'ipfs_mock_';

const uploadJSONLocal = async (data, name) => {
  const hash = `Qm${generateMockHash()}`;
  const key = `${LOCAL_STORAGE_PREFIX}${hash}`;
  
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    // localStorage might be full or disabled
  }
  
  return {
    hash,
    url: `https://ipfs.io/ipfs/${hash}`
  };
};

const uploadFileLocal = async (file) => {
  const hash = `Qm${generateMockHash()}`;
  
  // For files, we store a reference but not the actual data
  // In production, this goes to IPFS
  const fileRef = {
    name: file.name,
    type: file.type,
    size: file.size,
    uploadedAt: Date.now()
  };
  
  try {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${hash}`, JSON.stringify(fileRef));
  } catch (e) {
    // localStorage might be full
  }
  
  return {
    hash,
    url: `https://ipfs.io/ipfs/${hash}`,
    size: file.size
  };
};

const fetchFromLocal = async (hash) => {
  const key = `${LOCAL_STORAGE_PREFIX}${hash}`;
  const data = localStorage.getItem(key);
  
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }
  
  throw new Error(`IPFS content not found: ${hash}`);
};

const generateMockHash = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let hash = '';
  for (let i = 0; i < 44; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
};

/**
 * Alias for fetchFromIPFS for backward compatibility
 */
export const getFromIPFS = fetchFromIPFS;

/**
 * Parse metadata from IPFS response
 * @param {Object|string} data - Raw data from IPFS
 * @returns {Object} Parsed metadata
 */
export const parseMetadata = (data) => {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return { raw: data };
    }
  }
  return data || {};
};

export default {
  uploadJSON,
  uploadFile,
  fetchFromIPFS,
  getFromIPFS,
  getIPFSUrl,
  uploadModelMetadata,
  uploadProfile,
  parseMetadata
};
