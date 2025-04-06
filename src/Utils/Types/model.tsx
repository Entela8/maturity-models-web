import { Question } from "./question"

export interface Model {
    id: number | undefined;
    title: string;
    questions: Question[];
}

export interface ModelDTO {
  id: number | undefined;
  title: string;
}