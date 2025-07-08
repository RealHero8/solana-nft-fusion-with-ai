import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';
import { Nft } from './nft.entity';

@Entity('fusions')
export class Fusion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  resultImageUrl: string;

  @Column({ type: 'jsonb' })
  fusionAttributes: any;

  @Column({ type: 'jsonb' })
  aiParameters: any;

  @Column({ default: 'pending' })
  status: 'pending' | 'processing' | 'completed' | 'failed';

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'decimal', precision: 18, scale: 9, default: 0 })
  cost: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.fusions)
  creator: User;

  @ManyToMany(() => Nft)
  @JoinTable({
    name: 'fusion_parent_nfts',
    joinColumn: { name: 'fusionId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'nftId', referencedColumnName: 'id' },
  })
  parentNfts: Nft[];

  @ManyToOne(() => Nft, nft => nft.childFusions)
  resultNft: Nft;
} 