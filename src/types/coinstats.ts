export interface CoinResponse {
  coin: Coin;
}

export interface Coin {
  id: string;
  icon: string;
  name: string;
  symbol: string;
  rank: number;
  price: number;
  priceBtc: number;
  volume: number;
  marketCap: number;
  availableSupply: number;
  totalSupply: number;
  priceChange1h: number;
  priceChange1d: number;
  priceChange1w: number;
  websiteUrl: string;
  twitterUrl: string;
  contractAddress: string;
  decimals: number;
  exp?: string[] | null;
}