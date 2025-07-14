export type TokenData = {
  id: string;
  name: string;
  symbol: string;
  contractAddress: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume: number;
  liquidity: number;
  rsi5m: number;
  rsi1h: number;
  chartData: { time: string; value: number }[];
  aiHint: string;
};

const generateChartData = () => {
  const data = [];
  let lastValue = Math.random() * 100 + 10;
  for (let i = 0; i < 60; i++) {
    const change = (Math.random() - 0.48) * (lastValue * 0.1);
    lastValue = Math.max(1, lastValue + change);
    data.push({ time: `T-${59 - i}`, value: lastValue });
  }
  return data;
};

const generateRsi = () => Math.floor(Math.random() * 70) + 15; // RSI between 15 and 85

export const tokens: TokenData[] = [
  {
    id: 'solana-cat',
    name: 'Solana Cat',
    symbol: 'SCAT',
    contractAddress: '7x7k3e6YdK2h5yZ6c8A9b1D3fG5hJ7k9L2mN4pQ6rT8s',
    price: 0.00123,
    priceChange24h: 15.6,
    marketCap: 1230000,
    volume: 540000,
    liquidity: 250000,
    rsi5m: generateRsi(),
    rsi1h: generateRsi(),
    chartData: generateChartData(),
    aiHint: 'cat animal'
  },
  {
    id: 'pepe-pump',
    name: 'Pepe on Pump',
    symbol: 'PUMP',
    contractAddress: 'F8t3hJ5kL9mN2pQ4rT6sV8wX1yZ3aC5bE7gH9jK1mL2n',
    price: 0.0000451,
    priceChange24h: -5.2,
    marketCap: 4500000,
    volume: 1200000,
    liquidity: 600000,
    rsi5m: generateRsi(),
    rsi1h: generateRsi(),
    chartData: generateChartData(),
    aiHint: 'frog meme'
  },
  {
    id: 'doge-sol',
    name: 'Doge on Sol',
    symbol: 'DOGES',
    contractAddress: '9b1D3fG5hJ7k9L2mN4pQ6rT8sA7x7k3e6YdK2h5yZ6c8',
    price: 0.00088,
    priceChange24h: 22.1,
    marketCap: 880000,
    volume: 310000,
    liquidity: 150000,
    rsi5m: generateRsi(),
    rsi1h: generateRsi(),
    chartData: generateChartData(),
    aiHint: 'doge meme'
  },
  {
    id: 'wizards-orb',
    name: 'Wizards Orb',
    symbol: 'WORB',
    contractAddress: 'L2mN4pQ6rT8sV8wX1yZ3aC5bE7gH9jK1mL2nF8t3hJ5k',
    price: 1.12,
    priceChange24h: 7.8,
    marketCap: 1120000,
    volume: 450000,
    liquidity: 300000,
    rsi5m: generateRsi(),
    rsi1h: generateRsi(),
    chartData: generateChartData(),
    aiHint: 'wizard magic'
  },
  {
    id: 'sol-raiders',
    name: 'Sol Raiders',
    symbol: 'RAID',
    contractAddress: '3fG5hJ7k9L2mN4pQ6rT8sA7x7k3e6YdK2h5yZ6c8A9b1D',
    price: 0.25,
    priceChange24h: -11.4,
    marketCap: 2500000,
    volume: 900000,
    liquidity: 500000,
    rsi5m: generateRsi(),
    rsi1h: generateRsi(),
    chartData: generateChartData(),
    aiHint: 'pirate game'
  },
  {
    id: 'cyber-punked',
    name: 'Cyber Punked',
    symbol: 'CYBER',
    contractAddress: 'pQ6rT8sA7x7k3e6YdK2h5yZ6c8A9b1D3fG5hJ7k9L2mN4',
    price: 0.78,
    priceChange24h: 35.2,
    marketCap: 7800000,
    volume: 2500000,
    liquidity: 1200000,
    rsi5m: generateRsi(),
    rsi1h: generateRsi(),
    chartData: generateChartData(),
    aiHint: 'cyberpunk future'
  },
  {
    id: 'crypto-ninja',
    name: 'Crypto Ninja',
    symbol: 'CNINJA',
    contractAddress: 'k9L2mN4pQ6rT8sA7x7k3e6YdK2h5yZ6c8A9b1D3fG5hJ7',
    price: 0.021,
    priceChange24h: 42.0,
    marketCap: 210000,
    volume: 150000,
    liquidity: 80000,
    rsi5m: generateRsi(),
    rsi1h: generateRsi(),
    chartData: generateChartData(),
    aiHint: 'ninja warrior'
  },
  {
    id: 'galaxy-quest',
    name: 'Galaxy Quest',
    symbol: 'GQT',
    contractAddress: 'dK2h5yZ6c8A9b1D3fG5hJ7k9L2mN4pQ6rT8sA7x7k3e6Y',
    price: 3.45,
    priceChange24h: 18.9,
    marketCap: 34500000,
    volume: 7800000,
    liquidity: 4200000,
    rsi5m: generateRsi(),
    rsi1h: generateRsi(),
    chartData: generateChartData(),
    aiHint: 'galaxy space'
  },
];

export const defaultTokens = tokens;

export const newTokens: TokenData[] = [
    {
    id: 'pixel-pioneer',
    name: 'Pixel Pioneer',
    symbol: 'PIXEL',
    contractAddress: 'A7x7k3e6YdK2h5yZ6c8A9b1D3fG5hJ7k9L2mN4pQ6rT8',
    price: 0.05,
    priceChange24h: 150.5,
    marketCap: 50000,
    volume: 200000,
    liquidity: 30000,
    rsi5m: generateRsi(),
    rsi1h: generateRsi(),
    chartData: generateChartData(),
    aiHint: 'pixel art'
  },
  {
    id: 'mech-mayhem',
    name: 'Mech Mayhem',
    symbol: 'MECH',
    contractAddress: 'B8y8k4f7ZeL3i6xW7d9B2E4hH6jL8nO5rS9vU2wZ4bC1',
    price: 0.12,
    priceChange24h: 88.2,
    marketCap: 120000,
    volume: 450000,
    liquidity: 90000,
    rsi5m: generateRsi(),
    rsi1h: generateRsi(),
    chartData: generateChartData(),
    aiHint: 'robot mech'
  }
];

export const watchlistTokens: TokenData[] = [
    {
    id: 'solana-cat',
    name: 'Solana Cat',
    symbol: 'SCAT',
    contractAddress: '7x7k3e6YdK2h5yZ6c8A9b1D3fG5hJ7k9L2mN4pQ6rT8s',
    price: 0.00123,
    priceChange24h: 15.6,
    marketCap: 1230000,
    volume: 540000,
    liquidity: 250000,
    rsi5m: generateRsi(),
    rsi1h: generateRsi(),
    chartData: generateChartData(),
    aiHint: 'cat animal'
  },
];
