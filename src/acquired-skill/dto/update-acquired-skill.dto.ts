import { PartialType } from '@nestjs/swagger';
import { CreateAcquiredSkillDto } from './create-acquired-skill.dto';

export class UpdateAcquiredSkillDto extends PartialType(
  CreateAcquiredSkillDto,
) {}
