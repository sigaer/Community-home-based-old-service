import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Query,
  Patch,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from 'src/DTO/user.dto';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentDto } from 'src/question/dto/comment.dto';
import { UserserviceDto } from 'src/DTO/userservice.dto';
import { UserhealthDto } from 'src/DTO/userhealth.dto';
import { UseractionDto } from 'src/DTO/useraction.dto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  async createUser(@Body() body: UserDto) {
    console.log(body);
    const saltOrRounds = 10;
    if (body.password) {
      const hashedPassword = await bcrypt.hash(body.password, saltOrRounds);
      body.password = hashedPassword;
    }
    console.log(body.password);
    return this.userService.create(body);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('info')
  GetInfo(@Body() body) {
    console.log(body);
    console.log(body.openid);
    return this.userService.getUserinfo(body.openid);
  }
  @Post('changepwd')
  async changePassword(@Body() body) {
    console.log(body);
    const saltOrRounds = 10;
    if (body.password) {
      const hashedPassword = await bcrypt.hash(body.password, saltOrRounds);
      body.password = hashedPassword;
    }
    console.log(body.password);
    return await this.userService.changePwd(body);
  }

  @Post('updateinfo')
  async updateInfo(@Body() body) {
    return await this.userService.updateUserInfo(
      body.type,
      body.content,
      body.openid,
    );
  }
  @Post('action')
  async recordAction(@Body() body: UseractionDto) {
    return await this.userService.recordAction(body);
  }
  @Get('action')
  async getAction(@Query() query) {
    const actionList = await this.userService.getAction(query.openid);
    const actionMap = new Map<string, string>();
    //hardcore
    actionMap.set('auth', '您的实名认证通过。');
    actionMap.set('addhealth', '您的健康信息添加成功。');
    actionMap.set('phone', '紧急联系人呼叫成功。');
    actionMap.set('publishQuestion', '您发布了一个新问题。');
    actionMap.set('publishComment', '您进行了一条评论。');
    actionMap.set('reserveService', '您预约了一项服务。');
    actionMap.set('finishService', '您已确认完成服务，可以进行评价。');
    actionMap.set('rateService', '您已完成服务的评价，感谢您的支持。');
    actionMap.set('complainService', '您对服务的投诉反馈已提交。');
    actionMap.set('updateInfo', '您的个人信息修改成功。');
    actionMap.set('feedback', '您的意见已收到，我们会尽快查看并反馈。');
    const result = actionList.map((v) => {
      const msg = actionMap.get(v['content']);
      return { ...v, msg };
    });
    console.log(result);
    return result;
  }
  @Post('service')
  async reserveService(@Body() body: UserserviceDto) {
    return await this.userService.reserveService(body);
  }
  @Post('addhealth')
  async addHealth(@Body() body: UserhealthDto) {
    return await this.userService.recordHealth(body);
  }
  @Get('healthlist')
  async getHealthlist(@Query() query) {
    return await this.userService.getHealthList(query.openid);
  }
  @Get('healthinfo')
  async getHealthInfo(@Query() query) {
    return await this.userService.getHealthInfo(query.openid);
  }
  @Get('health')
  async getHealth(@Query() query) {
    return await this.userService.getHealth(query.openid, query.id);
  }
  @Get('service')
  async getService(@Query() query) {
    return await this.userService.getService(query.id);
  }
  @Post('rateservice')
  async rateService(@Body() body) {
    await this.userService.rateService(body);
    return { code: 200, errMsg: 'ok' };
  }
  @Post('transfer')
  async transferRecord(@Body() body) {
    const result = await this.userService.recordToText(body.url);
    return { code: 200, errMsg: 'ok', result };
  }
  @HttpCode(200)
  @Patch('dispatchService')
  async patchService(@Body() body) {
    await this.userService.dispatchService(body);
    return { code: 200, errMsg: 'ok' };
  }
  @Post('dispatchService')
  async patchServiceWithPost(@Body() body) {
    await this.userService.dispatchService(body);
    return { code: 200, errMsg: 'ok' };
  }
  @Get('servicelist')
  async getServicelist(@Query() query) {
    return await this.userService.getServiceList(query.openid);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('serviceall')
  async getServiceAll() {
    return await this.userService.getServiceAll();
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  async getUserlist() {
    const userlist = await this.userService.getUserlist();
    return {
      code: 200,
      errMsg: 'ok',
      userlist,
    };
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('agencylist')
  async getAgencylist() {
    const agencylist = await this.userService.getAgencylist();
    return {
      code: 200,
      errMsg: 'ok',
      agencylist,
    };
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('wxlist')
  async getWxlist() {
    const wxlist = await this.userService.getWxlist();
    return {
      code: 200,
      errMsg: 'ok',
      wxlist,
    };
  }
  @Get('questionlist')
  async getQuestionlist(@Query() query) {
    const questionlist = await this.userService.getQuestionList(query.openid);
    return {
      code: 200,
      errMsg: 'ok',
      questionlist,
    };
  }
  @Post('comment')
  async comment(@Body() body: CreateCommentDto) {
    return await this.userService.deliverComment(body);
  }
  @Post('favorQuestion')
  async favor(@Body() body) {
    return await this.userService.favorQuestion(
      body.openid,
      body.comment_id,
      body.question_id,
    );
  }
  @Post('unfavorQuestion')
  async unfavor(@Body() body) {
    return await this.userService.unfavorQuestion(
      body.openid,
      body.comment_id,
      body.question_id,
    );
  }
  @Post('remove')
  async deleteUser(@Body() body) {
    await this.userService.deleteUser({ openid: body.openid });
    return {
      code: 200,
      errMsg: 'ok',
    };
  }
  @Post('logout')
  async logout() {
    return {
      code: 200,
      msg: 'success',
    };
  }
}
