import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// modules
import { SkillModule } from './skill/skill.module';

// entities
import { SkillEntity } from './skill/entity/skill.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [SkillEntity],
      synchronize: true,
    }),
    SkillModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
