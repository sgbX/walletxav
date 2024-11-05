/**
 * fetches and returns balance of the first connected account on MetaMask
 * Features:
 * -->polling mechanism to update balance constantly
 */

import { useState, useEffect } from 'react';
import Web3 from 'web3';

export const useBalance = (web3: Web3 | null, accounts: string[], chainId: string | null) => {
  const [balance, setBalance] = useState<string>('0');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // To prevent state updates on unmounted component

    const fetchBalance = async () => {
      if (web3 && accounts.length > 0) {
        try {
          const balanceWei = await web3.eth.getBalance(accounts[0]);
          const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
          if (isMounted) {
            setBalance(balanceEth);
          }
        } catch (err) {
          console.error('Failed to fetch balance:', err);
          if (isMounted) {
            setError('Failed to fetch balance');
          }
        }
      }
    };

    fetchBalance();

    // Setup a polling mechanism to fetch balance periodically
    const interval = web3 && accounts.length > 0 ? setInterval(fetchBalance, 10000) : null;

    return () => {
      isMounted = false;
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [web3, accounts, chainId]);

  return { balance, error };
};