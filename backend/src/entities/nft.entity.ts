import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Collection } from './collection.entity';
import { Fusion } from './fusion.entity';

@Entity('nfts')
export class Nft {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mintAddress: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  imageUrl: string;

  @Column({ type: 'jsonb' })
  attributes: any;

  @Column({ type: 'jsonb' })
  metadata: any;

  @Column({ default: false })
  isForSale: boolean;

  @Column({ type: 'decimal', precision: 18, scale: 9, nullable: true })
  price: number;

  @Column({ nullable: true })
  tokenSymbol: string;

  @Column({ default: 0 })
  fusionCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.nfts)
  owner: User;

  @ManyToOne(() => Collection, collection => collection.nfts)
  collection: Collection;

  @OneToMany(() => Fusion, fusion => fusion.parentNfts)
  parentFusions: Fusion[];

  @OneToMany(() => Fusion, fusion => fusion.resultNft)
  childFusions: Fusion[];
} 