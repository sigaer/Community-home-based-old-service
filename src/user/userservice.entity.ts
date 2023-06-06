import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('userservice')
export class Userser {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', { name: 'userid' })
  userid: string;
  @Column('varchar', { name: 'service' })
  service: string;
  @Column('varchar', { name: 'status', default: 0 })
  status: number;
  @Column('varchar', { name: 'rate', default: null })
  rate: number;
  @Column('varchar', { name: 'reserveTime', default: null })
  reserveTime: string;
  @Column('varchar', { name: 'content', default: null })
  content: string;
}
