import type { TTask } from 'src/tasks/tasks.type';
import type { TAchievement } from 'src/achievements/achievements.type';
import type { TAvailableSkill } from 'src/skills/skills.type';

export type TCompany = {
  id: string;
  name: string;
  link?: string;
  country?: string;
  positionId: string;
  startDate: number;
  endDate?: number;
  about?: string;
  tasksIds: string[];
  achievementsIds?: string[];
  stackIds: string[];
  type: string;
};

export type TCompanyResponse = TCompany & {
  position: string;
  tasks: TTask[];
  achievements: TAchievement[];
  stacks: TAvailableSkill[];
};

export type TCompanyQuery = {
  type?: string;
};
