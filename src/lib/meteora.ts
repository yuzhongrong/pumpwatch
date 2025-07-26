
import { AnchorProvider, Idl, Program } from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { DLMM_PROGRAM_ID, METEORA_DLMM_IDL } from "./constants";

// A simplified representation of a position account from the chain
interface PositionAccount {
    publicKey: PublicKey;
    account: {
        lbPair: PublicKey; // The pool this position belongs to
        owner: PublicKey;
        lowerBinId: number;
        upperBinId: number;
    };
}

export class LbPair {
    private constructor(
        public readonly connection: Connection,
        public readonly program: Program<Idl>,
        public readonly publicKey: PublicKey,
    ) { }

    /**
     * Creates an instance of LbPair.
     * @param provider The AnchorProvider for connection and wallet details.
     * @param poolAddress The public key of the DLMM pool.
     * @returns A new instance of LbPair.
     */
    public static async create(provider: AnchorProvider, poolAddress: PublicKey): Promise<LbPair> {
        const program = new Program(
            METEORA_DLMM_IDL as Idl,
            DLMM_PROGRAM_ID,
            provider
        );
        return new LbPair(provider.connection, program, poolAddress);
    }
    
    /**
     * Fetches all liquidity positions for a given owner in this specific pool.
     * @param owner The public key of the wallet owning the positions.
     * @returns An array of Position objects.
     */
    public async getPositions(owner: PublicKey): Promise<Position[]> {
        // This fetches all accounts of the 'position' type from the DLMM program
        // that are owned by the specified owner wallet.
        const allPositionStatesForOwner = (await this.program.account.position.all([
            // Filter 1: The owner of the position must match the provided owner's public key.
            // The offset is 40 bytes: 8 for discriminator + 32 for lbPair public key.
            {
                memcmp: {
                    offset: 40, 
                    bytes: owner.toBase58(),
                },
            },
        ])) as PositionAccount[];

        // Filter the results in code to ensure the position belongs to the specific pool (lbPair) we are querying.
        const positionsForPool = allPositionStatesForOwner.filter(
            (pos) => pos.account.lbPair.equals(this.publicKey)
        );

        // Map the filtered account data to our simplified Position class.
        return positionsForPool.map(pos => {
            return new Position(
                pos.publicKey,
                pos.account.lowerBinId,
                pos.account.upperBinId,
            );
        });
    }
}

/**
 * A simplified class representing a user's liquidity position.
 */
export class Position {
    constructor(
        public readonly publicKey: PublicKey,
        public readonly lowerBinId: number,
        public readonly upperBinId: number
    ) {}
}
