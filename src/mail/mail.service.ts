import type { TMail } from './mail.type';

import { Injectable, HttpStatus } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(mail: TMail) {
    const response = await this.mailerService.sendMail({
      to: process.env.MAIL_TO,
      from: process.env.MAIL_FROM,
      subject: mail.subject,
      text: `Hi! I'm ${mail.name}. ${mail.message}`,
    });

    const status = response.response.includes('Ok')
      ? HttpStatus.OK
      : HttpStatus.BAD_REQUEST;

    return { status };
  }
}
