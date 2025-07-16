export type TokenData = {
  id: string;
  tokenContractAddress: string;
  info: {
    imageUrl?: string;
    websites?: { label: string; url: string }[];
    socials?: { type: string; url: string }[];
  };
  marketCap: number;
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  priceUsd: string;
  'rsi-1h': number;
  'rsi-5m': number;
  'rsi_200_1h': string[][];
  'rsi_200_5m': string[][];
  symbol: string;
};
