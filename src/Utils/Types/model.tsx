import { Question } from "./question"

export interface Model {
    id: number | undefined;
    title: string;
    questions: Question[];
  }
  