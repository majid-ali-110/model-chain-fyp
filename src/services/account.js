/**
 * Decentralized Account Management Service
 * Handles account creation, profile management, and role assignment
 */

import { ethers } from 'ethers';
import { uploadJSON, uploadFile, fetchFromIPFS, uploadProfile } from './ipfs';

// Profile storage key prefix
const PROFILE_KEY_PREFIX = 'modelchain_profile_';

/**
 * Check if account exists for wallet address
 */
export async function checkAccountExists(address) {
  try {
    const profile = await getUserProfile(address);
    return !!profile;
  } catch {
    return false;
  }
}

/**
 * Create new account profile
 */
export async function createAccountProfile(walletAddress, profileData) {
  try {
    const profile = {
      walletAddress: walletAddress.toLowerCase(),
      username: profileData.username,
      displayName: profileData.displayName || profileData.username,
      bio: profileData.bio || '',
      avatarIPFS: profileData.avatarIPFS || '',
      role: profileData.role || 'user',
      socialLinks: {
        twitter: profileData.twitter || '',
        github: profileData.github || '',
        linkedin: profileData.linkedin || '',
        website: profileData.website || ''
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // Upload profile to IPFS
    const result = await uploadProfile(profile);
    const ipfsHash = result.hash;

    // Store mapping: address -> IPFS hash (in production, this goes on-chain)
    localStorage.setItem(`${PROFILE_KEY_PREFIX}${walletAddress.toLowerCase()}`, ipfsHash);

    return {
      success: true,
      profile,
      ipfsHash
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get user profile from decentralized storage
 */
export async function getUserProfile(walletAddress) {
  try {
    // Get IPFS hash from mapping
    const ipfsHash = localStorage.getItem(`${PROFILE_KEY_PREFIX}${walletAddress.toLowerCase()}`);
    
    if (!ipfsHash) {
      return null;
    }

    // Fetch profile from IPFS
    const profileData = await fetchFromIPFS(ipfsHash);
    
    if (!profileData) {
      return null;
    }

    return typeof profileData === 'string' ? JSON.parse(profileData) : profileData;
  } catch {
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(walletAddress, updates) {
  try {
    const currentProfile = await getUserProfile(walletAddress);
    
    if (!currentProfile) {
      throw new Error('Profile not found');
    }

    const updatedProfile = {
      ...currentProfile,
      ...updates,
      walletAddress: walletAddress.toLowerCase(),
      updatedAt: Date.now()
    };

    const result = await uploadProfile(updatedProfile);
    const ipfsHash = result.hash;

    localStorage.setItem(`${PROFILE_KEY_PREFIX}${walletAddress.toLowerCase()}`, ipfsHash);

    return {
      success: true,
      profile: updatedProfile,
      ipfsHash
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Upload avatar to IPFS
 */
export async function uploadAvatar(file) {
  try {
    if (!file || !file.type.startsWith('image/')) {
      throw new Error('Invalid image file');
    }

    const result = await uploadFile(file);

    return {
      success: true,
      ipfsHash: result.hash,
      url: result.url
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Request role upgrade (Developer or Validator)
 * Requires staking tokens/ETH
 */
export async function requestRoleUpgrade(walletAddress, signer, role, stakeAmount) {
  try {
    // In production: Call Governance contract to stake and upgrade role
    // const governanceContract = new ethers.Contract(GOVERNANCE_ADDRESS, GovernanceABI, signer);
    // const tx = await governanceContract.stake(lockPeriod, { value: ethers.parseEther(stakeAmount.toString()) });
    // await tx.wait();

    // For now, update profile directly
    await updateUserProfile(walletAddress, { role });

    return {
      success: true,
      role,
      transactionHash: null // Will be real tx hash when contracts deployed
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Check if username is available
 */
export async function checkUsernameAvailable(username) {
  try {
    // In production: Query The Graph or smart contract
    // For now, check localStorage
    const keys = Object.keys(localStorage);
    
    for (const key of keys) {
      if (key.startsWith(PROFILE_KEY_PREFIX)) {
        const hash = localStorage.getItem(key);
        try {
          const profile = await fetchFromIPFS(hash);
          if (profile && profile.username?.toLowerCase() === username.toLowerCase()) {
            return false;
          }
        } catch {
          continue;
        }
      }
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Sign message for authentication
 */
export async function signAuthMessage(signer, nonce) {
  try {
    const message = `Sign this message to authenticate with ModelChain.\n\nNonce: ${nonce}\nTimestamp: ${Date.now()}`;
    const signature = await signer.signMessage(message);
    
    return {
      success: true,
      signature,
      message
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get account statistics
 */
export async function getAccountStats(walletAddress) {
  try {
    // In production: Query The Graph for on-chain data
    // For now, return placeholder - will be populated by UserContext
    return {
      modelsCreated: 0,
      modelsPurchased: 0,
      totalSpent: '0',
      totalEarned: '0',
      reputation: 100,
      joinedAt: Date.now()
    };
  } catch {
    return null;
  }
}

/**
 * Verify wallet signature
 */
export function verifySignature(message, signature, expectedAddress) {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch {
    return false;
  }
}
