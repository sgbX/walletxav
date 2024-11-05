/**
 * Connect to Metamas button using the 'useMetaMask' hook
 * Features:
 * -->Calls the `onConnect` callback with the connected accounts once MetaMask is successfully connected.
 * 
 * 
 */

import React from 'react';
import { useMetaMask } from '../hooks/useMetaMask';
import foxIcon from '../assets/fox-icon.png'; // Adjust the path as needed

const MetaMaskButton: React.FC<{ onConnect: (accounts: string[]) => void }> = ({ onConnect }) => {
  const { connect, error } = useMetaMask();

  const handleConnect = async () => {
    try {
      const result = await connect();
      if (result && result.length > 0) {
        console.log('MetaMask connected:', result);
        onConnect(result);
      }
    } catch (err) {
      // Error handling is done in the hook, nothing more to do here
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button onClick={handleConnect} className="connect-wallet-button font-pp-neue-montreal-bold flex items-center justify-center">
        <span className="mr-2">Connect to MetaMask</span>
        <img src={foxIcon} alt="MetaMask" className="w-10 h-auto" /> {/* Increase the width to 10 */}
      </button>
      {error && <div className="error mt-2">{error}</div>}
    </div>
  );
};

export default MetaMaskButton;