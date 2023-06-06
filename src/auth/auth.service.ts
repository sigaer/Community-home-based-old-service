import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { Not } from 'typeorm';
// import { ExtractJwt } from 'passport-jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.getUser({ username });
    // const user = { password: 'a' };
    if (!user) return null;
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }
    if (user && passwordValid) {
      return user;
    }
    return null;
  }
  async validateWxUser(openid: string): Promise<any> {
    const user = await this.userService.getUser({ openid });
    // const user = { password: 'a' };
    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }
    if (user) {
      return user;
    }
    return null;
  }
  async login(user: any) {
    console.log(user);
    let u = null;
    if (user.password == 'wx') {
      u = await this.userService.getUser({
        openid: user.username,
      });
    } else {
      u = await this.userService.getUser({
        username: user.username,
        password: user.password == 'wx' ? 'wx' : Not('wx'),
      });
    }
    return {
      code: 200,
      openid: u.openid,
      access_token: this.jwtService.sign(user),
    };
  }
}
