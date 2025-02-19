import { Module } from '@nestjs/common';
import { ScheduledTasksService } from './scheduled-tasks.service';
import { JwtModule } from 'src/jwt/jwt.module';

@Module({
  imports: [JwtModule],
  providers: [ScheduledTasksService],
})
export class ScheduledTasksModule {}
