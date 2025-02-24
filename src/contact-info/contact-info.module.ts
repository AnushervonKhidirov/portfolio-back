import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactInfoService } from './contact-info.service';
import { ContactInfoController } from './contact-info.controller';
import { ContactInfoEntity } from './entity/contact-info.entity';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [ProfileModule, TypeOrmModule.forFeature([ContactInfoEntity])],
  providers: [ContactInfoService],
  controllers: [ContactInfoController],
})
export class ContactInfoModule {}
