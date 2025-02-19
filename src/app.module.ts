import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

// modules
import { ScheduledTasksModule } from './scheduled-tasks/scheduled-tasks.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from './jwt/jwt.module';
import { SkillModule } from './skill/skill.module';
import { PositionModule } from './position/position.module';

// entities
import { UserEntity } from './user/entity/user.entity';
import { JwtEntity } from './jwt/entity/jwt.entity';
import { SkillEntity } from './skill/entity/skill.entity';
import { PositionEntity } from './position/entity/position.entity';

// middlewares
import { AuthMiddleware } from './common/middleware/auth-middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [UserEntity, JwtEntity, SkillEntity, PositionEntity],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    ScheduledTasksModule,
    UserModule,
    AuthModule,
    JwtModule,
    SkillModule,
    PositionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: '*', method: RequestMethod.GET }, 'auth/*path')
      .forRoutes('*');
  }
}
