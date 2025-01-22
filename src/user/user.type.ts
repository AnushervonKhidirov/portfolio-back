export type TUser = {
  name: string;
  surname: string;
  birthDate: string;
  about: string;
  positionId: string;
  gradeId: string;
};

export type TUserResponse = TUser & {
  position: string;
  grade: string;
};
