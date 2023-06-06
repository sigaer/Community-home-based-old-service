import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('userqueue')
export class Userqueue {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', { name: 'openid' })
  openid: string;
  @Column('varchar', { name: 'roomid' })
  roomid: string;
  @Column('varchar', { name: 'queuename' })
  queuename: string;
}
