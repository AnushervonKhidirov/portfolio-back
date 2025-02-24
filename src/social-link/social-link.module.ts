import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialLinkService } from './social-link.service';
import { SocialLinkController } from './social-link.controller';
import { SocialLinkEntity } from './entity/social-link.entity';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [ProfileModule, TypeOrmModule.forFeature([SocialLinkEntity])],
  providers: [SocialLinkService],
  controllers: [SocialLinkController],
})
export class SocialLinkModule {}
