import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
  getAccount,
} from '@solana/spl-token';
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
  findMetadataPda,
  CreateCandyMachineInput,
  CreateCandyMachineOutput,
} from '@metaplex-foundation/js';

export class SolanaUtils {
  private connection: Connection;
  private metaplex: Metaplex;

  constructor(rpcUrl: string = 'https://api.mainnet-beta.solana.com') {
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.metaplex = new Metaplex(this.connection);
  }

  /**
   * Create a new wallet keypair
   */
  static createWallet(): Keypair {
    return Keypair.generate();
  }

  /**
   * Get wallet balance
   */
  async getBalance(publicKey: PublicKey): Promise<number> {
    const balance = await this.connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  }

  /**
   * Transfer SOL between wallets
   */
  async transferSol(
    fromKeypair: Keypair,
    toPublicKey: PublicKey,
    amount: number
  ): Promise<string> {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: toPublicKey,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [fromKeypair]
    );

    return signature;
  }

  /**
   * Create a new token mint
   */
  async createTokenMint(
    payer: Keypair,
    mintAuthority: PublicKey,
    freezeAuthority: PublicKey | null = null,
    decimals: number = 9
  ): Promise<PublicKey> {
    const mint = await createMint(
      this.connection,
      payer,
      mintAuthority,
      freezeAuthority,
      decimals
    );

    return mint;
  }

  /**
   * Create or get associated token account
   */
  async getOrCreateTokenAccount(
    mint: PublicKey,
    owner: PublicKey,
    payer: Keypair
  ) {
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      this.connection,
      payer,
      mint,
      owner
    );

    return tokenAccount;
  }

  /**
   * Mint tokens to an account
   */
  async mintTokens(
    mint: PublicKey,
    to: PublicKey,
    amount: number,
    payer: Keypair
  ): Promise<string> {
    const signature = await mintTo(
      this.connection,
      payer,
      mint,
      to,
      payer,
      amount
    );

    return signature;
  }

  /**
   * Transfer tokens between accounts
   */
  async transferTokens(
    mint: PublicKey,
    from: PublicKey,
    to: PublicKey,
    amount: number,
    payer: Keypair
  ): Promise<string> {
    const signature = await transfer(
      this.connection,
      payer,
      from,
      to,
      payer,
      amount
    );

    return signature;
  }

  /**
   * Get token account balance
   */
  async getTokenBalance(tokenAccount: PublicKey): Promise<number> {
    const account = await getAccount(this.connection, tokenAccount);
    return Number(account.amount);
  }

  /**
   * Create NFT using Metaplex
   */
  async createNFT(
    payer: Keypair,
    name: string,
    symbol: string,
    uri: string,
    sellerFeeBasisPoints: number = 500
  ) {
    const { nft } = await this.metaplex.nfts().create({
      name,
      symbol,
      uri,
      sellerFeeBasisPoints,
      creators: [
        {
          address: payer.publicKey,
          verified: true,
          share: 100,
        },
      ],
      isMutable: true,
    });

    return nft;
  }

  /**
   * Get NFT metadata
   */
  async getNFTMetadata(mintAddress: PublicKey) {
    const metadataPda = findMetadataPda(mintAddress);
    const metadata = await this.metaplex.nfts().findByMint({ mintAddress });

    return metadata;
  }

  /**
   * Update NFT metadata
   */
  async updateNFTMetadata(
    mintAddress: PublicKey,
    payer: Keypair,
    updates: {
      name?: string;
      symbol?: string;
      uri?: string;
      sellerFeeBasisPoints?: number;
    }
  ) {
    const { response } = await this.metaplex.nfts().update({
      nftOrSft: await this.metaplex.nfts().findByMint({ mintAddress }),
      name: updates.name,
      symbol: updates.symbol,
      uri: updates.uri,
      sellerFeeBasisPoints: updates.sellerFeeBasisPoints,
    });

    return response;
  }

  /**
   * Upload file to Arweave
   */
  async uploadToArweave(
    file: Buffer,
    payer: Keypair
  ): Promise<string> {
    this.metaplex.use(keypairIdentity(payer));
    this.metaplex.use(bundlrStorage());

    const metaplexFile = toMetaplexFile(file, 'image.png');
    const uri = await this.metaplex.storage().upload(metaplexFile);

    return uri;
  }

  /**
   * Create NFT collection
   */
  async createCollection(
    payer: Keypair,
    name: string,
    symbol: string,
    uri: string
  ) {
    const { nft } = await this.metaplex.nfts().create({
      name,
      symbol,
      uri,
      sellerFeeBasisPoints: 500,
      creators: [
        {
          address: payer.publicKey,
          verified: true,
          share: 100,
        },
      ],
      isCollection: true,
    });

    return nft;
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(signature: string) {
    const status = await this.connection.getSignatureStatus(signature);
    return status;
  }

  /**
   * Get recent transactions for an address
   */
  async getRecentTransactions(publicKey: PublicKey, limit: number = 10) {
    const signatures = await this.connection.getSignaturesForAddress(
      publicKey,
      { limit }
    );

    const transactions = await Promise.all(
      signatures.map(async (sig) => {
        const tx = await this.connection.getTransaction(sig.signature, {
          maxSupportedTransactionVersion: 0,
        });
        return {
          signature: sig.signature,
          slot: sig.slot,
          transaction: tx,
        };
      })
    );

    return transactions;
  }

  /**
   * Validate Solana address
   */
  static isValidAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Convert lamports to SOL
   */
  static lamportsToSol(lamports: number): number {
    return lamports / LAMPORTS_PER_SOL;
  }

  /**
   * Convert SOL to lamports
   */
  static solToLamports(sol: number): number {
    return sol * LAMPORTS_PER_SOL;
  }
} 