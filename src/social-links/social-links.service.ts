import type { TSocialLink } from './social-links.type';

import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class SocialLinksService {
  async getSocialLinks() {
    const socialLinksJson = await readFile(
      join(process.cwd(), 'db/social-links.json'),
      { encoding: 'utf-8' },
    );

    return JSON.parse(socialLinksJson) as TSocialLink;
  }
}
