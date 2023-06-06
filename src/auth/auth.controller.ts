import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() body) {
    // console.log('666body :>> ', body);
    // const resdata = await this.userService.login(body);
    // if (resdata.code == 200) {
    //   resdata['token'] = this.authService.login(body);
    // }
    console.log('login');
    console.log(body);
    return this.authService.login(body);
  }
}
