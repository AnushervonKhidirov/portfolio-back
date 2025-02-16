import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// modules
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from './jwt/jwt.module';

// entities
import { UserEntity } from './user/entity/user.entity';
import { JwtEntity } from './jwt/entity/jwt.entity';

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
      entities: [UserEntity, JwtEntity],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    JwtModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
