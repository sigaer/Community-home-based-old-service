import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', { name: 'content' })
  content: string;
}
