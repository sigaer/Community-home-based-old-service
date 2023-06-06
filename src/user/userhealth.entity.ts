import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('userhealth')
export class Userhealth {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', { name: 'userid' })
  userid: string;
  @Column('varchar', { name: 'c_time' })
  c_time: string;
  @Column('float', { name: 'weight', default: 0 })
  weight: number;
  @Column('float', { name: 'dp', default: 0 })
  dp: number;
  @Column('float', { name: 'sp', default: 0 })
  sp: number;
  @Column('float', { name: 'glu', default: 0 })
  glu: number;
  @Column('float', { name: 'lipid_a', default: 0 })
  lipid_a: number;
  @Column('float', { name: 'lipid_b', default: 0 })
  lipid_b: number;
  @Column('float', { name: 'lipid_c', default: 0 })
  lipid_c: number;
  @Column('float', { name: 'lipid_d', default: 0 })
  lipid_d: number;
}
