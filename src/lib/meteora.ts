
import { AnchorProvider, BN, Idl, Program } from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { DLMM_PROGRAM_ID, METEORA_DLMM_IDL } from "./constants";

export class LbPair {
    public static DLMM_PROGRAM = new Program(METEORA_DLMM_IDL as Idl, DLMM_PROGRAM_ID);

    private constructor(
        public readonly connection: Connection,
        public readonly program: Program,
        public readonly publicKey: PublicKey,
    ) { }

    public static async create(provider: AnchorProvider, poolAddress: PublicKey): Promise<LbPair> {
        return new LbPair(provider.connection, LbPair.DLMM_PROGRAM, poolAddress);
    }
    
    public async getPositions(owner: PublicKey): Promise<Position[]> {
        const positionStates = await this.program.account.position.all([
            {
                memcmp: {
                    offset: 8,
                    bytes: owner.toBase58(),
                },
            },
            {
                memcmp: {
                    offset: 40,
                    bytes: this.publicKey.toBase58(),
                },
            }
        ]);

        return positionStates.map(pos => {
            return new Position(
                pos.publicKey,
                pos.account.lowerBinId,
                pos.account.upperBinId,
            );
        });
    }
}

export class Position {
    constructor(
        public readonly publicKey: PublicKey,
        public readonly lowerBinId: number,
        public readonly upperBinId: number
    ) {}
}

