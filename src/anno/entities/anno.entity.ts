import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';
@Entity('anno')
export class Anno {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', { name: 'title' })
  title: string;
  @Column('varchar', { name: 'time', default: null })
  time: string;
  @Column('varchar', { name: 'content', default: null })
  content: string;
}
