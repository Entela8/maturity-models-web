export interface Answer {
    id: number | undefined;
    content: string;
    score: number;
}

export interface AnswerQuestion {
  questionTitle: any;
  question: string;
  score: number;
}

export interface Responses {
  userId: number;
  userName: string;
  answers: AnswerQuestion[];
}
