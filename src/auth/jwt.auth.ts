import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, StrategyOptions, Strategy } from 'passport-jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //加密secret，换成你自己的
      secretOrKey: 'test123456',
    } as StrategyOptions);
  }
  async validate(user: User) {
    console.log(user);
    let existuser = null;
    if (user.password == 'wx') {
      existuser = await this.userService.getUser({
        openid: user.username,
      });
    } else {
      existuser = await this.userService.getUser({
        username: user.username,
      });
    }
    if (!existuser) {
      throw new UnauthorizedException('token error');
    }
    return existuser;
  }
}
