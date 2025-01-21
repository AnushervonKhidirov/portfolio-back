import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function main() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = process.env.PORT ?? 4000;
  await app.listen(port);
}

main();
