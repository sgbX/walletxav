/**File routes and page orders  */
import './styles/index.css'; 
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';

import Intro from './components/Intro'; 
import App from './pages/App'; 
import { Connection, ConnectionType } from '@typedef/connection';
import { buildInjectedConnector } from '@typedef/injected';

const PRIORITIZED_CONNECTORS: { [key in ConnectionType]?: Connection } = {
  [ConnectionType.INJECTED]: buildInjectedConnector(),
};

const RootComponent: React.FC = () => {
  const [showLandingPage, setShowLandingPage] = useState(false);

  const handleAnimationComplete = () => {
    setShowLandingPage(true);
  };

  return (
    <React.StrictMode>
      <Web3ReactProvider
        connectors={Object.values(PRIORITIZED_CONNECTORS).map((connector) => [
          connector.connector,
          connector.hooks,
        ])}
      >
        <Router>
          <Routes>
            <Route
              path="/"
              element={<Intro onAnimationComplete={handleAnimationComplete} />}
            />
            <Route path="/app" element={<App />} />
          </Routes>
        </Router>
      </Web3ReactProvider>
    </React.StrictMode>
  );
};

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(<RootComponent />);
} else {
  console.error('Root container not found');
}