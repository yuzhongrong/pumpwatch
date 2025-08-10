export type TokenData = {
  id: string;
  tokenContractAddress: string;
  info: {
    imageUrl?: string;
    websites?: { label: string; url: string }[];
    socials?: { type: string; url: string }[];
  } | null;
  marketCap: number | null;
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  priceUsd: string;
  current_price?: number;
  'rsi-1h': number | null;
  'rsi-5m': number | null;
  'rsi_200_1h': string[][];
  'rsi_200_5m': string[][];
  symbol: string;
  txns: {
    m5: { buys: number; sells: number };
    h1: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h24: { buys: number; sells: number };
  };
  volume: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
};
