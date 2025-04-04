import { Question } from "./question"

export interface Model {
    id: number;
    title: string;
    questions: Question[];
  }
  