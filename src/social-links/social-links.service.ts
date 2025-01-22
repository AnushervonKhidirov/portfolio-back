import type { TSocialLink } from './social-links.type';

import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';

import { EndpointDB } from '@constant/endpoints';

@Injectable()
export class SocialLinksService {
  async findAll() {
    const socialLinksJson = await readFile(
      join(process.cwd(), EndpointDB.SocialLinks),
      { encoding: 'utf-8' },
    );

    return JSON.parse(socialLinksJson) as TSocialLink;
  }
}
