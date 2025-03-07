import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'achievements' })
export class AchievementEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Writing clean code' })
  @Column({ type: 'text' })
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
}
