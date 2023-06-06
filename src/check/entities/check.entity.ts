import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('check')
export class Check {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', { name: 'cTime', default: null })
  cTime: string;
  @Column('float', { name: 'height', default: null })
  height: number;
  @Column('float', { name: 'weight', default: null })
  weight: number;
  @Column('varchar', { name: 'internal', default: '正常' })
  internal: string;
  @Column('varchar', { name: 'external', default: '正常' })
  external: string;
  @Column('varchar', { name: 'blood', default: '正常' })
  blood: string;
  @Column('varchar', { name: 'urine', default: '正常' })
  urine: string;
  @Column('varchar', { name: 'liver', default: '正常' })
  liver: string;
  @Column('varchar', { name: 'kidney', default: '正常' })
  kidney: string;
}
