/**
 * This file grabs metamask hook to get account and chain information,
 * Features
 * --> connects to metamask to grab the users account and chain ID.
 * --> account balance grabbed from the usebalance hook
 * --> renders the 'AccountDisplay.tsx' component to display the account and balance detail.
 *
 */



import React from 'react';
import { useMetaMask } from '../hooks/useMetaMask';
import { useBalance } from '../hooks/useBalance';
import { chainIdMap } from '../constants/chainIdMap';
import AccountDisplay from '../components/AccountDisplay';
import '../styles/App.css';

const BalanceDisplay: React.FC = () => {
  const { web3, accounts, chainId, error: metaMaskError } = useMetaMask();
  const { balance, error: balanceError } = useBalance(web3, accounts, chainId);

  const renderError = (error: string) => (
    <div className="error-message">Error: {error}</div>
  );

  const renderContent = () => {
    if (!accounts.length) {
      return <div>Please connect to MetaMask.</div>;
    }

    const symbol = chainIdMap.get(chainId || '') || 'Unknown';

    return (
      <AccountDisplay 
        account={accounts[0]} 
        balance={balance} 
        symbol={symbol} 
      />
    );
  };

  return (
    <div className="balance-display">
      {metaMaskError ? renderError(metaMaskError) : balanceError ? renderError(balanceError) : renderContent()}
    </div>
  );
};

export default BalanceDisplay;