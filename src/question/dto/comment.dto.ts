export class CreateCommentDto {
  id: number;
  question_id: number;
  sender_id: string;
  c_time: string;
  content: string;
  likes: number;
}
