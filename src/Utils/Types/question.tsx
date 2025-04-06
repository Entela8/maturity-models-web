import { Answer } from "./answer"
  
  export interface Question {
    id: number | undefined;
    content: string;
    answers: Answer[];
  }
  
 