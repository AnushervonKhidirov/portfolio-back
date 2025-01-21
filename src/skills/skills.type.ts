export type TSkill = {
  id: string;
  name: string;
  progress: number;
  group: string;
};

export type TSkillQuery = {
  group?: string;
  min_progress?: string;
};
