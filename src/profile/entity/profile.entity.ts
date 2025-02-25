import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

import { UserEntity } from 'src/user/entity/user.entity';
import { PositionEntity } from 'src/position/entity/position.entity';
import { GradeEntity } from 'src/grade/entity/grade.entity';
import { ContactInfoEntity } from 'src/contact-info/entity/contact-info.entity';
import { SocialLinkEntity } from 'src/social-link/entity/social-link.entity';
import { AcquiredSkillEntity } from 'src/acquired-skill/entity/acquired-skill.entity';

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

  @OneToMany(() => ContactInfoEntity, (contactInfo) => contactInfo.profile, {
    eager: true,
  })
  contactInfo: ContactInfoEntity[];

  @OneToMany(() => SocialLinkEntity, (socialLink) => socialLink.profile, {
    eager: true,
  })
  socialLinks: SocialLinkEntity[];

  @OneToMany(
    () => AcquiredSkillEntity,
    (acquiredSkills) => acquiredSkills.profile,
    {
      eager: true,
    },
  )
  acquiredSkills: AcquiredSkillEntity[];
}
