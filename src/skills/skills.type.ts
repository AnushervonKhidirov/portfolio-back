export type TSkill = {
  id: string;
  skillId: string;
  progress: number;
  groupId: string;
};

export type TSkillQuery = {
  group?: string;
  min_progress?: string;
};
