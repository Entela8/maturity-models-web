import { Question } from "./question"

export interface Form {
    id: number;
    title: string;
    questions: Question[];
  }
  