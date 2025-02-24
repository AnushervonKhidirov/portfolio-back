import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProfileEntity } from 'src/profile/entity/profile.entity';

@Entity({ name: 'social_links' })
export class SocialLinkEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'GitHub' })
  @Column()
  title: string;

  @ApiProperty({ example: 'https://github.com' })
  @Column()
  href: string;

  @ApiProperty({ example: 1740024934772 })
  @Column({
    name: 'created_at',
    type: 'bigint',
  })
  createdAt: number;

  @ApiProperty({ example: 1740024934772 })
  @Column({
    name: 'updated_at',
    type: 'bigint',
  })
  updatedAt: number;

  @ApiProperty({ example: 1 })
  @Column({ name: 'profile_id' })
  profileId: number;

  @ManyToOne(() => ProfileEntity, (profile) => profile)
  @JoinColumn({ name: 'profile_id' })
  profile: ProfileEntity;
}
