import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { JwtEntity } from 'src/jwt/entity/jwt.entity';
import { ProfileEntity } from 'src/profile/entity/profile.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'expample@mail.com' })
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ApiProperty({ example: 'FirstName' })
  @Column({ name: 'first_name', length: 20 })
  firstName: string;

  @ApiProperty({ example: 'LastName' })
  @Column({ name: 'last_name', length: 20 })
  lastName: string;

  @ApiProperty({ example: '2001-04-23' })
  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

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

  @OneToMany(() => JwtEntity, (token) => token.user)
  token: JwtEntity;

  @OneToMany(() => ProfileEntity, (profile) => profile.user)
  profile: ProfileEntity;

  @ApiProperty({ example: 1 })
  @Column({ name: 'default_profile_id', nullable: true })
  defaultProfileId: number;

  @OneToOne(() => ProfileEntity, (profile) => profile.user, { nullable: true })
  @JoinColumn({ name: 'default_profile_id' })
  defaultProfile: ProfileEntity;
}
