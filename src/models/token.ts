import mongoose, { Schema, Document, models, Model } from 'mongoose';

// Define the structure for nested objects
const TokenInfoSchema = new Schema({
  address: String,
  name: String,
  symbol: String,
});

const TxnsDetailSchema = new Schema({
  buys: Number,
  sells: Number,
});

const TxnsSchema = new Schema({
  m5: TxnsDetailSchema,
  h1: TxnsDetailSchema,
  h6: TxnsDetailSchema,
  h24: TxnsDetailSchema,
});

const VolumeSchema = new Schema({
  h24: Number,
  h6: Number,
  h1: Number,
  m5: Number,
});

const PriceChangeSchema = new Schema({
  m5: Number,
  h1: Number,
  h6: Number,
  h24: Number,
});

const InfoSchema = new Schema({
  imageUrl: String,
  header: String,
  openGraph: String,
  websites: [{ label: String, url: String }],
  socials: [{ type: String, url: String }],
});

// Define the main Token schema
interface IToken extends Document {
  pairAddress: string;
  baseToken: object;
  priceUsd: string;
  txns: object;
  volume: object;
  priceChange: object;
  marketCap: number;
  pairCreatedAt: number;
  info: object;
}

const TokenSchema: Schema<IToken> = new Schema({
  pairAddress: { type: String, required: true, unique: true },
  baseToken: { type: TokenInfoSchema, required: true },
  priceUsd: { type: String, required: true },
  txns: { type: TxnsSchema, required: true },
  volume: { type: VolumeSchema, required: true },
  priceChange: { type: PriceChangeSchema, required: true },
  marketCap: { type: Number, required: true },
  pairCreatedAt: { type: Number, required: true },
  info: { type: InfoSchema, required: false },
});

const Token: Model<IToken> = models.Token || mongoose.model<IToken>('Token', TokenSchema);

export default Token;
