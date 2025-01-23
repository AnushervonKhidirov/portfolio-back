import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: process.env.MAIL_HOST,
          port: process.env.MAIL_PORT,
          secure: false,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  controllers: [MailController],
})
export class MailModule {}
