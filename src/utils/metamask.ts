import Web3 from 'web3';

declare let window: any;

export const initializeWeb3 = (): Web3 | null => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    return web3;
  }
  return null;
};