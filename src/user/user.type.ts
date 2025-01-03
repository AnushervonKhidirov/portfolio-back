export type User = {
  name: string;
  surname: string;
  birthDate: string;
  about: string;
  contacts: Contact[];
  socialLink: SocialLink[];
};

export type Contact = {
  title: string;
  value: string;
  link?: string;
};

export type SocialLink = {
  title: string;
  href: string;
};
