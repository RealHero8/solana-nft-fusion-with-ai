import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Nft } from './nft.entity';

@Entity('collections')
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  bannerUrl: string;

  @Column()
  symbol: string;

  @Column({ type: 'jsonb' })
  metadata: any;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: 0 })
  totalSupply: number;

  @Column({ default: 0 })
  floorPrice: number;

  @Column({ default: 0 })
  totalVolume: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Nft, nft => nft.collection)
  nfts: Nft[];
} 