import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('int', { name: 'question_id' })
  question_id: number;
  @Column('varchar', { name: 'sender_id' })
  sender_id: string;
  @Column('varchar', { name: 'c_time', default: null })
  c_time: string;
  @Column('varchar', { name: 'content', default: null })
  content: string;
  @Column('int', { name: 'likes', default: null })
  likes: number;
}
