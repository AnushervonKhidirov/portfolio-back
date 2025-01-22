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
  achievementsIds: string[];
  stackIds: string[];
  type: string;
};

export type TCompanyResponse = TCompany & {
  position: string;
  tasks: string[];
  achievements: string[];
  stack: string[];
};
