import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('service')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', { name: 'name' })
  name: string;
  @Column('varchar', { name: 'agency' })
  agency: string;
}
