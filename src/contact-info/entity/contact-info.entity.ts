import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProfileEntity } from 'src/profile/entity/profile.entity';

@Entity({ name: 'contact_info' })
export class ContactInfoEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'phone' })
  @Column()
  title: string;

  @ApiProperty({ example: '+992 341 44 34 23' })
  @Column()
  value: string;

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
