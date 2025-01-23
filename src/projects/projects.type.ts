import type { TAvailableSkill } from 'src/skills/skills.type';

export type TProject = {
  id: string;
  title: string;
  imageUrl: string;
  stackIds: string[];
  links?: TProjectLink[];
};

export type TProjectResponse = TProject & {
  stacks: TAvailableSkill[];
};

export type TProjectLink = {
  id: string;
  title: string;
  href: string;
};
