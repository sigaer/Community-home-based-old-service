import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('complain')
export class Complain {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', { name: 'name' })
  content: string;
}
