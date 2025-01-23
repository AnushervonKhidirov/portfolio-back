import { Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('email')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  sendMail() {
    this.mailService.sendMail();
  }
}
