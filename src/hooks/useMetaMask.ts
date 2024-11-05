/**
 * interface for Metamask to use functions for connecting to MetaMask.
 */

import { useState, useEffect } from 'react';
import Web3 from 'web3';

declare let window: any;

export const useMetaMask = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAccountsChanged = (newAccounts: string[]) => {
      if (newAccounts.length === 0) {
        setError('Please re-connect to MetaMask.');
        setAccounts([]);
      } else {
        setError(null);
        setAccounts(newAccounts);
      }
    };

    const handleChainChanged = (newChainId: string) => {
      console.log('Detected chain change:', newChainId);
      const decimalChainId = parseInt(newChainId, 16).toString();
      setChainId(decimalChainId);
      setError(null);
    };

    const initializeWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          handleAccountsChanged(accounts);

          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          handleChainChanged(chainId);

          window.ethereum.on('accountsChanged', handleAccountsChanged);
          window.ethereum.on('chainChanged', handleChainChanged);
        } catch (err: any) {
          console.error('MetaMask initialization error:', err);
          setError('Failed to initialize MetaMask');
        }
      } else {
        console.error('MetaMask is not installed');
        setError('MetaMask is not installed');
      }
    };

    initializeWeb3();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const connect = async (): Promise<string[]> => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccounts(accounts);
      return accounts;
    } catch (err: any) {
      if (err.code === -32002) {
        console.error('MetaMask is already processing a request. Please complete the request in MetaMask.');
        setError('MetaMask is already processing a request. Please complete the request in MetaMask.');
      } else {
        console.error('Failed to connect to MetaMask:', err);
        setError('Failed to connect to MetaMask');
      }
      throw new Error('Failed to connect to MetaMask');
    }
  };

  return { web3, accounts, connect, error, chainId };
};