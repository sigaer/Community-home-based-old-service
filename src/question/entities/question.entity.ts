import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('question')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', { name: 'userid' })
  userid: string;
  @Column('varchar', { name: 'title' })
  title: string;
  @Column('varchar', { name: 'subscription' })
  subscription: string;
  @Column('varchar', { name: 'c_time', default: null })
  c_time: string;
  @Column('varchar', { name: 'comment', default: null })
  comment: string;
}
