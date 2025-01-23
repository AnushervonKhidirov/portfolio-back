import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  sendMail() {
    this.mailerService.sendMail({
      to: process.env.MAIL_TO,
      from: process.env.MAIL_FROM,
      subject: 'TEST',
      text: 'testing',
    });
  }
}
