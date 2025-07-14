export type TokenData = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume: number;
  liquidity: number;
  chartData: { time: string; value: number }[];
  aiHint: string;
};

const generateChartData = () => {
  const data = [];
  let lastValue = Math.random() * 100 + 10;
  for (let i = 0; i < 30; i++) {
    const change = (Math.random() - 0.48) * (lastValue * 0.1);
    lastValue = Math.max(1, lastValue + change);
    data.push({ time: `T-${29 - i}`, value: lastValue });
  }
  return data;
};

export const tokens: TokenData[] = [
  {
    id: 'solana-cat',
    name: 'Solana Cat',
    symbol: 'SCAT',
    price: 0.00123,
    priceChange24h: 15.6,
    marketCap: 1230000,
    volume: 540000,
    liquidity: 250000,
    chartData: generateChartData(),
    aiHint: 'cat animal'
  },
  {
    id: 'pepe-pump',
    name: 'Pepe on Pump',
    symbol: 'PUMP',
    price: 0.0000451,
    priceChange24h: -5.2,
    marketCap: 4500000,
    volume: 1200000,
    liquidity: 600000,
    chartData: generateChartData(),
    aiHint: 'frog meme'
  },
  {
    id: 'doge-sol',
    name: 'Doge on Sol',
    symbol: 'DOGES',
    price: 0.00088,
    priceChange24h: 22.1,
    marketCap: 880000,
    volume: 310000,
    liquidity: 150000,
    chartData: generateChartData(),
    aiHint: 'doge meme'
  },
  {
    id: 'wizards-orb',
    name: 'Wizards Orb',
    symbol: 'WORB',
    price: 1.12,
    priceChange24h: 7.8,
    marketCap: 1120000,
    volume: 450000,
    liquidity: 300000,
    chartData: generateChartData(),
    aiHint: 'wizard magic'
  },
  {
    id: 'sol-raiders',
    name: 'Sol Raiders',
    symbol: 'RAID',
    price: 0.25,
    priceChange24h: -11.4,
    marketCap: 2500000,
    volume: 900000,
    liquidity: 500000,
    chartData: generateChartData(),
    aiHint: 'pirate game'
  },
  {
    id: 'cyber-punked',
    name: 'Cyber Punked',
    symbol: 'CYBER',
    price: 0.78,
    priceChange24h: 35.2,
    marketCap: 7800000,
    volume: 2500000,
    liquidity: 1200000,
    chartData: generateChartData(),
    aiHint: 'cyberpunk future'
  },
];
