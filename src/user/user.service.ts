import type { User } from './user.type';

import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly user: User = {
    name: 'Anushervon',
    surname: 'Khidirov',
    birthDate: '02/11/1998',
    about:
      'I am a punctual and sociable front-end developer who likes working in a team, learning new technologies and improving skills. While working with the code, I am trying to write readable code and keeping it up to date.',
    contacts: [
      {
        title: 'Phone',
        value: '+992 77 100 7676',
        link: 'tel:+992771007676',
      },
      {
        title: 'Email',
        value: 'ankhid98@gmail.com',
        link: 'mailto:ankhid98@gmail.com',
      },
      {
        title: 'Telegram',
        value: '@akhid',
        link: 'https://t.me/akhid',
      },
    ],
    socialLink: [
      {
        title: 'GitHub',
        href: 'https://github.com/AnushervonKhidirov',
      },
      {
        title: 'LinkedIn',
        href: 'https://www.linkedin.com/in/anushervon-khidirov/',
      },
      {
        title: 'LeetCode',
        href: 'https://leetcode.com/u/anushervonkhidirov/',
      },
      {
        title: 'Roadmap',
        href: 'https://roadmap.sh/u/anushervon',
      },
    ],
  };

  getUser() {
    return this.user;
  }
}
