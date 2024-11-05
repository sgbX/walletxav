import axios from 'axios';

//fetch the USD value from CoinGecko (since CoinStates had DNS issues)
const COIN_GECKO_BASE_URL = 'https://api.coingecko.com/api/v3/simple/price';
const LINEA_ETH_USD_VALUE = 1.50; // Simulated the USD value for LineaETH

export const getUsdValue = async (asset: string): Promise<number> => {
  if (asset === 'lineaeth') {
    return LINEA_ETH_USD_VALUE;
  }

  try {
    const params = new URLSearchParams({ ids: asset, vs_currencies: 'usd' });
    const response = await axios.get(`${COIN_GECKO_BASE_URL}?${params.toString()}`);
    
    const usdValue = response.data[asset]?.usd;
    
    if (usdValue === undefined) {
      console.error(`USD value for asset "${asset}" not found in response:`, response.data);
      throw new Error(`USD value for asset "${asset}" not found in response`);
    }

    return usdValue;
  } catch (err) {
    console.error(`Failed to fetch USD value for asset "${asset}":`, err);
    throw new Error(`Failed to fetch USD value for asset "${asset}"`);
  }
};