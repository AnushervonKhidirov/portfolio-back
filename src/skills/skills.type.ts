export type TSkill = {
  id: string;
  skillId: string;
  progress: number;
  typeId: string;
};

export type TSkillResponse = TSkill & {
  name: string;
  type: string;
};

export type TAvailableSkills = {
  id: string;
  value: string;
};

export type TSkillTypes = {
  id: string;
  value: string;
};

export type TSkillQuery = {
  type?: string;
  min_progress?: string;
};
