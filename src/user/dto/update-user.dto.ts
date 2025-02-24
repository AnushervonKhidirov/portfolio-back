import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ProfileEntity } from 'src/profile/entity/profile.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  defaultProfile?: ProfileEntity
}
