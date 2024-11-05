/**
 * The main app gateway loaded after the landing page
 * Features:
 * -->Handles Metamask connection, initializing and UI.
 * -->Errro handling using useMetaMask hook
 * -->Provides a reload button for unsupported networks and navigates to a landing page.
 * --> Connects to MetaMask via a button and displays balance information when connected.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MetaMaskButton from '../components/MetaMaskButton';
import Initializing from '../components/Initializing';
import BalanceDisplay from '../components/BalanceDisplay';
import ReloadButton from '../components/ReloadButton';
import { useMetaMask } from '../hooks/useMetaMask';
import { chainIdMap } from '../constants/chainIdMap';
import gsap from 'gsap';
import '../styles/App.css'; 

const App: React.FC = () => {
  const [isInitializing, setInitializing] = useState(false);
  const [isConnectionClicked, setConnectionClicked] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(true);
  const [wasUnsupportedNetwork, setWasUnsupportedNetwork] = useState(false);
  const [shouldReload, setShouldReload] = useState(false); 
  const { connect, accounts, chainId, error } = useMetaMask();
  const navigate = useNavigate();
  const appContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isConnectionClicked && accounts.length > 0 && isFirstLogin) {
      console.log('First login detected:', accounts[0]);
      setIsFirstLogin(false);
      setInitializing(true);
      setTimeout(() => {
        console.log('Initialization complete, showing account info');
        setInitializing(false);
      }, 3000);
    }
  }, [accounts, isFirstLogin, isConnectionClicked]);

  useEffect(() => {
    if (accounts.length > 0 && !isFirstLogin && !shouldReload) {
      setInitializing(true);
      setTimeout(() => {
        setInitializing(false);
      }, 3000);
    }
  }, [accounts, shouldReload]);

  useEffect(() => {
    if (chainId) {
      const isSupported = chainIdMap.has(chainId);
      console.log('Network changed, checking if supported:', chainId);

      if (!isSupported) {
        setWasUnsupportedNetwork(true);
        setShouldReload(false);
      } else if (isSupported && wasUnsupportedNetwork) {
        setShouldReload(true); 
      } else if (isSupported) {
        setWasUnsupportedNetwork(false);
      }
    }
  }, [chainId, wasUnsupportedNetwork]);

  useEffect(() => {
    if (appContainerRef.current) {
      gsap.fromTo(
        appContainerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.5 }
      );
    }
  }, []);

  const handleConnection = async () => {
    console.log('Connecting to MetaMask...');
    setConnectionClicked(true);
    await connect();
  };

  const handleReload = () => {
    setWasUnsupportedNetwork(false);
    setShouldReload(false);

   
    if (accounts.length > 0) {
      setInitializing(true);
      setTimeout(() => {
        setInitializing(false);
      }, 3000);
    }
  };

  const navigateToLandingPage = () => {
    if (appContainerRef.current) {
      gsap.to(appContainerRef.current, {
        opacity: 0,
        duration: 1.5,
        onComplete: () => navigate('/')
      });
    } else {
      navigate('/');
    }
  };

  const isSupportedNetwork = chainId && chainIdMap.has(chainId);

  console.log('Current chainId:', chainId);
  console.log('Is supported network:', isSupportedNetwork);

  return (
    <div ref={appContainerRef} className="App">
      {isInitializing ? (
        <Initializing onInitialized={() => setInitializing(false)} />
      ) : (
        <>
          {accounts.length === 0 || !isConnectionClicked ? (
            <div className="flex justify-center items-center">
              <MetaMaskButton onConnect={handleConnection} />
            </div>
          ) : (
            <>
              {isSupportedNetwork && !shouldReload ? (
                <BalanceDisplay />
              ) : (
                <div className="unsupported-network">
                  <h3 className="font-pp-neue-montreal-bold">Error</h3>
                  <div className="close-button" onClick={() => setWasUnsupportedNetwork(false)}>X</div>
                  <div className="warning-icon">⚠️</div>
                  <div className="error-message font-pp-neue-montreal-bold">
                    Unsupported network. Please switch to a supported network and click Reload.
                  </div>
                  <div className="reload-button-container">
                    <ReloadButton onReload={handleReload} />
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
      {error && <div className="error">{error}</div>}
      {!isInitializing && (
        <div className="button-wrapper">
          <button onClick={navigateToLandingPage} className="arrow-button">
            <span className="arrow-icon">←</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;