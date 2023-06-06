import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('useraction')
export class Useraction {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', { name: 'userid' })
  userid: string;
  @Column('varchar', { name: 'c_time' })
  c_time: string;
  @Column('varchar', { name: 'content' })
  content: string;
}
