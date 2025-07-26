
import { PublicKey } from "@solana/web3.js";

export const DLMM_PROGRAM_ID = new PublicKey(
  "LBUZKhRxPF3XUpBCjp4qjyK9xuh2geF9CEoJik8R3yr"
);

export const METEORA_DLMM_IDL = {
  version: "0.2.4",
  name: "lb_clmm",
  instructions: [],
  accounts: [
    {
      name: "Position",
      type: {
        kind: "struct",
        fields: [
          { name: "owner", type: "publicKey" },
          { name: "lbPair", type: "publicKey" },
          { name: "lowerBinId", type: "i32" },
          { name: "upperBinId", type: "i32" },
        ],
      },
    },
  ],
  errors: [],
};
