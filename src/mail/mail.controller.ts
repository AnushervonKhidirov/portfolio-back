import type { TMail } from './mail.type';
import type { Response } from 'express';

import { Controller, Post, Body, HttpCode, Res } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('email')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  @HttpCode(200)
  async sendMail(@Body() mail: TMail, @Res() res: Response) {
    const response = await this.mailService.sendMail(mail);
    return res.status(response.status).send();
  }
}
