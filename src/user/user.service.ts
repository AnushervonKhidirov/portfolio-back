import type { TUser } from './user.type';

import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';

import { EndpointDB } from '@constant/endpoints';

@Injectable()
export class UserService {
  async getUser() {
    const userInfoJson = await readFile(
      join(process.cwd(), EndpointDB.UserInfo),
      {
        encoding: 'utf-8',
      },
    );

    return JSON.parse(userInfoJson) as TUser;
  }
}
