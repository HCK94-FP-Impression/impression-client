export type CriteriaScore = {
  label: string;
  score: number;
  max: number;
};

export type PostData = {
  image: string;
  targetJob: string;
  criteria: string[];
};

export type CvData = {
  experiences: Array<{ 
    title: string; 
    company: string; 
    startDate: Date; 
    endDate: Date; 
    description: string; 
  }>;
  educations: Array<{ degree: string; institution: string; startDate: Date; endDate: Date; gpa: number }>;
  skills: string[];
};
