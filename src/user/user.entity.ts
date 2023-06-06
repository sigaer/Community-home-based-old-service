import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity('user')
export class User {
  @PrimaryColumn('varchar', { name: 'openid' })
  openid: string;
  @Column('varchar', { name: 'username' })
  username: string;
  @Column('varchar', { name: 'password', default: 'wx' })
  password: string;
  @Column('varchar', { name: 'role', default: 'user' })
  role: string;
  @Column('varchar', { name: 'avatar', default: null })
  avatar: string;
  @Column('varchar', { name: 'phone', default: null })
  phone: string;
  @Column('varchar', { name: 'address', default: null })
  address: string;
  @Column('varchar', { name: 'urgent', default: null })
  urgent: string;
  @Column('int', { name: 'gender', default: null })
  gender: number;
  @Column('int', { name: 'age', default: null })
  age: number;
  @Column('varchar', { name: 'regiTime', default: null })
  regiTime: string;
  @Column('varchar', { name: 'favorList', default: '[]' })
  favorList: string;
  @Column('varchar', { name: 'unfavorList', default: '[]' })
  unfavorList: string;
}
