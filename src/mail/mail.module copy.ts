import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

import { MailerModule } from '@nestjs-modules/mailer';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

// @Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: 'sandbox.smtp.mailtrap.io',
          port: 2525,
          secure: false,
          auth: {
            user: '8594baedc26699',
            pass: 'a03205e4543d36',
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  controllers: [MailController],
})
export class MailModule {}
