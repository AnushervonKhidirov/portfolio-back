import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ActivityEntity } from 'src/activity/entity/activity.entity';

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

  @ManyToMany(() => ActivityEntity, (activity) => activity.achievements)
  activity: ActivityEntity[];
}
