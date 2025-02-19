import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class ScheduledTasksService {
  constructor(private readonly jwtService: JwtService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredTokens() {
    const removedTokens = await this.jwtService.deleteExpiredTokens();
    console.log(`${removedTokens.length} tokens removed successfully`);
  }
}
