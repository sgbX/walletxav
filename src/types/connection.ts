import { CHAIN_INFO } from './constants';
import { buildInjectedConnector } from './injected';
import { Web3ReactHooks } from '@web3-react/core';
import { AddEthereumChainParameter,Connector } from '@web3-react/types';

export interface Connection {
    connector: Connector
    hooks: Web3ReactHooks
    type: ConnectionType
}

export enum ConnectionType {
    COINBASE_WALLET = `COINBASE_WALLET`,
    GNOSIS_SAFE = `GNOSIS_SAFE`,
    INJECTED = `INJECTED`,
    NETWORK = `NETWORK`,
    WALLET_CONNECT = `WALLET_CONNECT`,
}

export function getIsInjected (): boolean {
    return Boolean(window.ethereum);
}

export function getHasMetaMaskExtensionInstalled (): boolean {
    return window.ethereum?.isMetaMask ?? false;
}

export function onConnectionError (error: Error) {
    console.debug(`web3-react error: ${error}`);
}

export const PRIORITIZED_CONNECTORS: Connection[] = [
    buildInjectedConnector(),
];

export function getConnection (c: Connector | ConnectionType) {
    if (c instanceof Connector) {
        const connection = PRIORITIZED_CONNECTORS.find(
            (connection) => connection.connector === c
        );

        if (!connection) {
            throw Error(`unsupported connector`);
        }

        return connection;
    }

    switch(c) {
        case ConnectionType.INJECTED:
            return PRIORITIZED_CONNECTORS[0];
        case ConnectionType.COINBASE_WALLET:
            return PRIORITIZED_CONNECTORS[1];
        case ConnectionType.WALLET_CONNECT:
            return PRIORITIZED_CONNECTORS[2];
        case ConnectionType.GNOSIS_SAFE:
            return PRIORITIZED_CONNECTORS[3];
        case ConnectionType.NETWORK:
            return PRIORITIZED_CONNECTORS[4];
    }
}

export const switchNetwork = async (chainId: number, connectionType: ConnectionType | null
) => {
    if (!connectionType) {
        return;
    }

    const { connector } = getConnection(connectionType);

    if (
        connectionType === ConnectionType.WALLET_CONNECT ||
    connectionType === ConnectionType.NETWORK) {
        await connector.activate(chainId);
        return;
    }

    const chainInfo = CHAIN_INFO[chainId];
    const addChainParameter: AddEthereumChainParameter = {
        chainId,
        chainName: chainInfo.label,
        rpcUrls: [chainInfo.rpcUrl],
        nativeCurrency: chainInfo.nativeCurrency,
        blockExplorerUrls: [chainInfo.explorer],
    };
    await connector.activate(addChainParameter);
};
