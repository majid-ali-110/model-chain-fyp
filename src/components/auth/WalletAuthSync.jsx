import { useEffect } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';

/**
 * Component that syncs wallet connection with authentication and user profile
 * This ensures that when wallet connects/disconnects, the app state updates accordingly
 */
const WalletAuthSync = () => {
  const { connected, address, profile } = useWallet();
  const { login, logout, isAuthenticated } = useAuth();
  const { loadUserProfile, loadPurchases, loadUserModels, loadEarnings, loadRewards, loadActivity } = useUser();

  useEffect(() => {
    const syncWalletToAuth = async () => {
      if (connected && address && profile) {
        // Wallet is connected with profile - login user
        if (!isAuthenticated) {
          await login(address, profile);
        }
        
        // Load user data
        await loadUserProfile(address, profile);
        await loadPurchases(address);
        await loadUserModels(address);
        await loadEarnings(address);
        await loadRewards(address);
        await loadActivity(address);
      } else if (!connected && isAuthenticated) {
        // Wallet disconnected - logout user
        logout();
      }
    };

    syncWalletToAuth();
  }, [connected, address, profile, isAuthenticated]);

  // This component doesn't render anything
  return null;
};

export default WalletAuthSync;
