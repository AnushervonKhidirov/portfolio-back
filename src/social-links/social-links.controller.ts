import { Controller, Get } from '@nestjs/common';
import { SocialLinksService } from './social-links.service';

@Controller('social-links')
export class SocialLinksController {
  constructor(private readonly socialLinksService: SocialLinksService) {}

  @Get()
  async getContacts() {
    return this.socialLinksService.getSocialLinks();
  }
}