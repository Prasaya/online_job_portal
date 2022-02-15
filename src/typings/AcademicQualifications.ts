export interface academicQualifications {
  [level: string]: {
    [discipline: string]: {
      id: number;
      name: string;
    }[];
  };
}
