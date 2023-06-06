import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ExtractJwt } from 'passport-jwt';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeader,
      ignoreExpiration: false,
      //加密secret，换成你自己的
      secretOrKey: 'test123456',
      signOptions: { expiresIn: '1d' },
    });
  }
  async validate(username: string, password: string) {
    console.log('local');
    console.log(username, password);
    let user = null;
    if (password == 'wx') {
      user = await this.authService.validateWxUser(username);
    } else {
      user = await this.authService.validateUser(username, password);
    }
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    return user;
  }
}
