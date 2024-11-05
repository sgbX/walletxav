/**
 * This component is a visual indicator that the app is initializing after connecting to metamask
 * Features:
 * --> Updates the page after 4 seconds.
 * --> Calls the `onInitialized` callback function after the timeout.
 * --> Cleans up the timer when the component is unmounted.
 * 
 */

import React, { useEffect, useState } from 'react';

const Initializing: React.FC<{ onInitialized: () => void }> = ({ onInitialized }) => {
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');

  useEffect(() => {
    console.log('Initializing component mounted');
    const timer = setTimeout(() => {
      setLoadingMessage('Please unlock your MetaMask to continue...');
      onInitialized(); 
    }, 4000);

    return () => {
      console.log('Initializing component unmounted');
      clearTimeout(timer);
    };
  }, [onInitialized]);

  return (
    <div className="initializing-container">
      <button className="initializing-button" disabled>
        <span>
          {loadingMessage}<span className="dots"></span>
        </span>
        <div className="loader"></div>
      </button>
    </div>
  );
};

export default Initializing;