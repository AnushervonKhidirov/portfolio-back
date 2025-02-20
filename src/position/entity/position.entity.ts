import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProfileEntity } from 'src/profile/entity/profile.entity';

@Entity({ name: 'positions' })
export class PositionEntity {
  @ApiProperty({ type: 'number', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: 'string', example: 'Back-End' })
  @Column({ length: 20, unique: true })
  value: string;

  @Column({
    name: 'created_at',
    type: 'bigint',
  })
  createdAt: number;

  @Column({
    name: 'updated_at',
    type: 'bigint',
  })
  updatedAt: number;

  @OneToMany(() => ProfileEntity, (profile) => profile)
  profile: ProfileEntity;
}
