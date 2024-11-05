/**
 * This file displays the user's wallet address and balance.
 * We can:
 * --> expand the minimised version of the wallet address
 * --> see the balance of the supported network , can see the USD vaue using the coingecko api
 * (approved to be used by Shawn)
 * --> smooth transition when switching the display from wallet address and to balance, vice versa
 * 
*/

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getUsdValue } from '../utils/api';
import { gsap } from 'gsap';
import Modal from './Modal';
import '../styles/AccountDisplay.css';

type AccountDisplayProps = {
  account: string;
  balance: string;
  symbol: string;
};

const AccountDisplay: React.FC<AccountDisplayProps> = ({ account, balance, symbol }) => {
  const [usdBalance, setUsdBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showUsd, setShowUsd] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [highlighted, setHighlighted] = useState<string>('account');
  const [showModal, setShowModal] = useState<boolean>(false);

  const walletAddressRef = useRef<HTMLDivElement>(null);
  const walletBalanceRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const shortAccount = `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;

  const fetchUsdBalance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (symbol !== 'Unknown') {
        const usdValue = await getUsdValue(symbol.toLowerCase());
        const balanceInUsd = parseFloat(balance) * usdValue;
        setUsdBalance(balanceInUsd.toFixed(2));
      }
    } catch (error) {
      console.error('Failed to fetch USD value:', error);
      setError('Failed to fetch USD value');
      setTimeout(() => setShowModal(true), 1500);
    } finally {
      setLoading(false);
    }
  }, [balance, symbol]);

  const handleBalanceClick = () => {
    if (loading) return;
    if (highlighted !== 'balance') {
      setHighlighted('balance');
      animateHighlight('balance');
    } else {
      setShowUsd(prev => !prev);
      if (!showUsd) fetchUsdBalance();
      animateHighlight('balance');
    }
  };

  const handleWalletClick = () => {
    if (highlighted !== 'account') {
      setHighlighted('account');
      animateHighlight('account');
    } else {
      setIsExpanded(prev => !prev);
      animateHighlight('account');
    }
  };

  const animateHighlight = (type: string) => {
    const walletRect = walletAddressRef.current?.getBoundingClientRect();
    const balanceRect = walletBalanceRef.current?.getBoundingClientRect();
    const highlightRect = highlightRef.current?.getBoundingClientRect();
    
    if (!highlightRect) return;

    const animationConfig = {
      duration: 0.3,
      backgroundColor: '#414141',
      color: '#ffffff',
    };

    if (type === 'account' && walletRect) {
      gsap.to(highlightRef.current, {
        ...animationConfig,
        x: walletRect.left - highlightRect.left,
        width: walletRect.width,
      });
    } else if (type === 'balance' && balanceRect) {
      gsap.to(highlightRef.current, {
        ...animationConfig,
        x: balanceRect.left - highlightRect.left,
        width: balanceRect.width,
      });
    } else {
      gsap.to(highlightRef.current, {
        duration: 0.3,
        x: 0,
        width: 0,
        backgroundColor: 'transparent',
        color: 'transparent',
      });
    }
  };

  useEffect(() => {
    if (showUsd) fetchUsdBalance();
  }, [balance, symbol, showUsd, fetchUsdBalance]);

  useEffect(() => {
    animateHighlight(highlighted);
  }, [highlighted]);

  return (
    <div className="wallet-container flex items-center border border-gray-300 rounded-lg overflow-hidden font-pp-neue-montreal-bold w-max relative transition-all duration-300 ease-in-out">
      <div
        ref={walletAddressRef}
        className={`wallet-address px-4 py-2 cursor-pointer transition-all duration-300 ease-in-out ${highlighted === 'account' ? 'selected' : 'unselected'}`}
        onClick={handleWalletClick}
      >
        {isExpanded ? account : shortAccount}
      </div>
      <div
        ref={walletBalanceRef}
        className={`wallet-balance px-4 py-2 cursor-pointer transition-all duration-300 ease-in-out ${highlighted === 'balance' ? 'selected' : 'unselected'}`}
        onClick={handleBalanceClick}
      >
        {loading ? 'Loading...' : (showUsd && usdBalance ? `$${usdBalance}` : `${balance} ${symbol}`)}
      </div>
      <div ref={highlightRef} className="highlight absolute top-0 left-0 h-full pointer-events-none"></div>
      {error && <div className="error text-red-500 mt-2">{error}</div>}
      {showModal && (
        <Modal
          message={(
            <>
              ERROR 429:: (Too Many Requests)
              <br />
              <br />
              Woah - you're clicking too fast!
              <br />
              Please restart your server.
            </>
          )}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default AccountDisplay;