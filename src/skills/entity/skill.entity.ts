import { AcquiredSkillEntity } from 'src/acquired-skills/entity/acquired-skills.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne } from 'typeorm';

@Entity({ name: 'skills' })
export class SkillEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @OneToOne(() => AcquiredSkillEntity, (acquiredSkill) => acquiredSkill.skill)
  acquiredSkill: AcquiredSkillEntity
}
