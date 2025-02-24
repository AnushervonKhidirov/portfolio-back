import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { UserEntity } from 'src/user/entity/user.entity';
import { PositionEntity } from 'src/position/entity/position.entity';
import { GradeEntity } from 'src/grade/entity/grade.entity';

@Entity({ name: 'profiles' })
export class ProfileEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'About you' })
  @Column({ type: 'text' })
  about: string;

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
  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.profile)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToOne(() => UserEntity, (user) => user.defaultProfile)
  userDefaultProfile: UserEntity;

  @ApiProperty({ example: 1 })
  @Column({ name: 'position_id' })
  positionId: number;

  @ManyToOne(() => PositionEntity, (position) => position.profile, {
    eager: true,
  })
  @JoinColumn({ name: 'position_id' })
  position: PositionEntity;

  @ApiProperty({ example: 1 })
  @Column({ name: 'grade_id' })
  gradeId: number;

  @ManyToOne(() => GradeEntity, (grade) => grade.profile, {
    eager: true,
  })
  @JoinColumn({ name: 'grade_id' })
  grade: GradeEntity;
}
