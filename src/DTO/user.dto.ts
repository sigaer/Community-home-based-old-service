import { IsNotEmpty, Length } from 'class-validator';

export class UserDto {
  openid: string;
  @IsNotEmpty({ message: 'UserName is not empty' })
  username: string;
  @IsNotEmpty({ message: 'Password is not empty' })
  @Length(6, 16, { message: 'Password must between 6 and 16 characters' })
  password: string;
  @IsNotEmpty({ message: 'Role is not empty' })
  role: string;
  avatar: string;
  phone: string;
  address: string;
  urgent: string;
  sex: number;
  age: number;
  regiTime: string;
  favorList: string;
  unfavorList: string;
}
