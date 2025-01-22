import type { TContact } from './contacts.type';

import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class ContactsService {
  async findAll() {
    const contactsJson = await readFile(
      join(process.cwd(), 'db/contacts.json'),
      {
        encoding: 'utf-8',
      },
    );

    return JSON.parse(contactsJson) as TContact[];
  }
}
