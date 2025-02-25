import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProfileEntity } from 'src/profile/entity/profile.entity';
import { SkillEntity } from 'src/skill/entity/skill.entity';

@Entity({ name: 'acquired_skills' })
export class AcquiredSkillEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 80 })
  @Column()
  progress: number;

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
  @Column({ name: 'skill_id' })
  skillId: number;

  @ManyToOne(() => SkillEntity, (skill) => skill, { eager: true })
  @JoinColumn({ name: 'skill_id' })
  skill: SkillEntity;

  @ApiProperty({ example: 1 })
  @Column({ name: 'profile_id' })
  profileId: number;

  @ManyToOne(() => ProfileEntity, (profile) => profile.acquiredSkills)
  @JoinColumn({ name: 'profile_id' })
  profile: ProfileEntity;
}
