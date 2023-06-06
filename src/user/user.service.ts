import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from '../DTO/user.dto';
import { DeleteResult, Not, Repository } from 'typeorm';
import { User } from './user.entity';
import { v4 } from 'uuid';
import * as Client from '@alicloud/nls-filetrans-2018-08-17';
import { UserserviceDto } from 'src/DTO/userservice.dto';
import { Userser } from './userservice.entity';
import { Question } from 'src/question/entities/question.entity';
import { Comment } from 'src/question/entities/comment.entity';
import { UserhealthDto } from 'src/DTO/userhealth.dto';
import { Userhealth } from './userhealth.entity';
import { Useraction } from './useraction.entity';
import { CreateCommentDto } from 'src/question/dto/comment.dto';
import { UseractionDto } from 'src/DTO/useraction.dto';
// interface Response {
//   code: number;
//   errMsg: string;
//   role?: string;
//   token?: string;
// }
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Userser)
    private readonly userServiceRepository: Repository<Userser>,
    @InjectRepository(Question)
    private readonly userQuestionRepository: Repository<Question>,
    @InjectRepository(Userhealth)
    private readonly userHealthRepository: Repository<Userhealth>,
    @InjectRepository(Useraction)
    private readonly userActionRepository: Repository<Useraction>,
    @InjectRepository(Comment)
    private readonly userCommentRepository: Repository<Comment>,
  ) {}
  async create(UserDto: UserDto) {
    console.log(UserDto);
    console.log(UserDto.openid);
    try {
      // console.log(__dirname + '/**/*.entity{.ts,.js}');
      if (!UserDto.openid) {
        const exist = await this.userRepository.findOneBy({
          username: UserDto.username,
          password: Not('wx'),
        });
        console.log(exist);
        if (exist) {
          return { code: 403, errMsg: 'Username has been used' };
        }
        UserDto.openid = v4();
      }
      await this.userRepository.save(UserDto);
      return { code: 200, errMsg: 'ok' };
    } catch (e) {
      Logger.log(e);
      return { code: 400, errMsg: 'Invalid args' };
    }
  }
  async changePwd(body: any) {
    const user = await this.userRepository.findOneBy({ openid: body.openid });
    user.password = body.password;
    await this.userRepository.update(
      {
        openid: body.openid,
      },
      {
        password: body.password,
      },
    );
    return { code: 200, errMsg: 'ok' };
  }
  async login(body: User) {
    Logger.log(body.username);
    try {
      const userdata = await this.userRepository.findOneBy({
        username: body.username,
      });
      if (!userdata) {
        return { code: 404, errMsg: 'User is not exist' };
      } else {
        if (userdata.password === body.password) {
          return {
            code: 200,
            errMsg: 'ok',
            role: userdata.role,
          };
        } else {
          return { code: 403, errMsg: 'Password error' };
        }
      }
    } catch (e) {
      Logger.log(e);
      return e;
    }
  }
  async getUserinfo(id: string) {
    const userdata = await this.userRepository.findOneBy({ openid: id });
    const { openid, password, role, ...resdata } = userdata;
    console.log(openid);
    console.log(password);
    return {
      code: 200,
      errMsg: 'ok',
      data: {
        ...resdata,
        roles: [role],
      },
    };
  }
  updateUserInfo(type: string, content: string, openid: string) {
    Logger.log(type);
    Logger.log(content);
    Logger.log(openid);
    if (type === 'all') {
      return new Promise(async (resolve) => {
        await this.userRepository.save(JSON.parse(content));
        resolve({ code: 200, errMsg: 'ok' });
      });
    }
    return new Promise((resolve, reject) => {
      this.userRepository
        .query(`update user set ${type}='${content}' where openid='${openid}'`)
        .then((res) => {
          Logger.log(res);
          resolve({ code: 200, errMsg: 'ok' });
        })
        .catch((err) => {
          Logger.log(err);
          reject({ code: 500, errMsg: err });
        });
    });
  }
  async recordAction(body: UseractionDto) {
    return await this.userActionRepository.save(body);
  }
  async getAction(userid: string) {
    return await this.userActionRepository.findBy({ userid });
  }
  async deleteUser(query: object): Promise<DeleteResult> {
    return await this.userRepository.delete(query);
  }
  async getUser(query: object): Promise<User> {
    return this.userRepository.findOneBy(query);
  }
  async getUserlist(): Promise<User[]> {
    return this.userRepository.findBy({ role: Not('user') });
  }
  async getAgencylist(): Promise<User[]> {
    return this.userRepository.findBy({ role: '服务机构' });
  }
  async getWxlist(): Promise<User[]> {
    return this.userRepository.findBy({ role: 'user' });
  }
  async reserveService(body: UserserviceDto) {
    await this.userServiceRepository.save(body);
    return { code: 200, errMsg: 'ok' };
  }
  async getService(id: number) {
    return await this.userServiceRepository.findOneBy({ id });
  }
  async getServiceAll() {
    const list = await this.userServiceRepository.find();
    const userMap = new Map<string, User>();
    for (const us of list) {
      if (userMap.has(us.userid)) {
        const user = userMap.get(us.userid);
        us['username'] = user['username'];
        us['address'] = user['address'];
      } else {
        const user = await this.userRepository.findOneBy({ openid: us.userid });
        userMap.set(us.userid, user);
        us['username'] = user['username'];
        us['address'] = user['address'];
      }
    }
    return { code: 200, servicelist: list };
  }
  async getServiceList(userid: string) {
    return await this.userServiceRepository.findBy({ userid });
  }
  async dispatchService(body: UserserviceDto) {
    return await this.userServiceRepository.save(body);
  }
  async rateService(body: UserserviceDto) {
    return await this.userServiceRepository.save(body);
  }
  async recordHealth(body: UserhealthDto) {
    const allRecord = await this.userHealthRepository.find();
    allRecord.sort((a, b) => Date.parse(a.c_time) - Date.parse(b.c_time));
    const lastRecord = allRecord.pop();
    for (const i in body) {
      if (body[i] === '') {
        body[i] = lastRecord[i];
      }
    }
    await this.userHealthRepository.save(body);
    return { code: 200, errMsg: 'ok' };
  }
  async getHealthInfo(userid: string) {
    return await this.userHealthRepository.findBy({ userid });
  }
  async getHealthList(userid: string) {
    const healthList = await this.userHealthRepository.findBy({ userid });
    healthList.sort((a, b) => Date.parse(a.c_time) - Date.parse(b.c_time));
    const categories = healthList.map((v) => v.c_time.split(' ')[0]);
    const bpData = {
      categories,
      series: [
        {
          name: '舒张压',
          data: healthList.map((v) => v.dp),
        },
        {
          name: '收缩压',
          data: healthList.map((v) => v.sp),
        },
      ],
    };
    const weightData = {
      categories,
      series: [
        {
          name: '体重',
          data: healthList.map((v) => v.weight),
        },
      ],
    };
    const gluData = {
      categories,
      series: [
        {
          name: '血糖',
          data: healthList.map((v) => v.glu),
        },
      ],
    };
    const lipidData = {
      categories,
      series: [
        {
          name: '总胆固醇',
          data: healthList.map((v) => v.lipid_a),
        },
        {
          name: '甘油三脂',
          data: healthList.map((v) => v.lipid_b),
        },
        {
          name: '高密度脂蛋白',
          data: healthList.map((v) => v.lipid_c),
        },
        {
          name: '低密度脂蛋白',
          data: healthList.map((v) => v.lipid_d),
        },
      ],
    };
    // hardcore
    const healthyRange = {
      dp: {
        min: 60,
        max: 90,
        minInfo:
          '您本次的舒张压水平偏低，可能会出现头晕、胸闷、心慌、心悸、乏力等情况，应注意平时的营养平衡，多吃肉类和富含蛋白质的食物，并适当做一些有氧运动。如果症状明显，建议服用生脉饮等药物升高血压。',
        maxInfo:
          '您本次的舒张压水平偏高，近期注意饮食调节，控制盐分摄入；同时放松自己的情绪，保持充足的睡眠，并视情况服用降压药。',
      },
      sp: {
        min: 90,
        max: 139,
        minInfo:
          '您本次的收缩压水平偏低，需要增加营养，可以摄入适量的脂肪和蛋白质来补充营养，平时加强锻炼并多喝水。如果头晕乏力等症状明显，建议服用生脉饮等药物来升高血压。',
        maxInfo:
          '您本次的收缩压水平偏高，最近饮食要低盐低脂，多吃蔬菜水果。并注意戒烟、戒酒，调整自己的情绪，视情况服用降压药。',
      },
      glu: {
        min: 3.9,
        max: 6.1,
        minInfo:
          '您本次的血糖水平偏低，可能会出现出冷汗、饥饿、心慌、手抖等症状。注意规律饮食，多吃一点大枣和红糖等能起到补血的食物，也可以适量吃一些能快速升高血糖的食物。如果汁、水果、糖果等。除此之外，最好能进行一定程度的有氧运动，对改善低血糖也有很大帮助。',
        maxInfo:
          '您本次的血糖水平偏高，需要合理饮食控制热量摄入，提倡高纤维饮食、清淡饮食，少吃甜食多喝水。同时还要注意休息，保持良好的生活态度。',
      },
      lipid_a: {
        min: 2.8,
        max: 5.17,
        minInfo:
          '您本次的血脂水平偏低，近期可以适量进食营养丰富的鱼、虾、猪肝、绿豆等，也可以吃一些优质蛋白质以及绿叶蔬菜，都有利于改善低血脂情况。除此之外，日常也可以适量的参加一些户外运动。',
        maxInfo:
          '您本次的血脂水平偏高，建议多食用绿色蔬菜水果，减少动物内脏、肥肉、坚果、油炸类、烧烤类等脂肪和胆固醇含量高的食物的摄入；同时加强锻炼，减少脂肪堆积，保持适当的体重，并保持愉悦的心情；必要时可以采用药物降脂。',
      },
      lipid_b: {
        min: 0.56,
        max: 1.7,
        minInfo:
          '您本次的血脂水平偏低，近期可以适量进食营养丰富的鱼、虾、猪肝、绿豆等，也可以吃一些优质蛋白质以及绿叶蔬菜，都有利于改善低血脂情况。除此之外，日常也可以适量的参加一些户外运动。',
        maxInfo:
          '您本次的血脂水平偏高，建议多食用绿色蔬菜水果，减少动物内脏、肥肉、坚果、油炸类、烧烤类等脂肪和胆固醇含量高的食物的摄入；同时加强锻炼，减少脂肪堆积，保持适当的体重，并保持愉悦的心情；必要时可以采用药物降脂。',
      },
      lipid_c: {
        min: 0.96,
        max: 1.15,
        minInfo:
          '您本次的血脂水平偏低，近期可以适量进食营养丰富的鱼、虾、猪肝、绿豆等，也可以吃一些优质蛋白质以及绿叶蔬菜，都有利于改善低血脂情况。除此之外，日常也可以适量的参加一些户外运动。',
        maxInfo:
          '您本次的血脂水平偏高，建议多食用绿色蔬菜水果，减少动物内脏、肥肉、坚果、油炸类、烧烤类等脂肪和胆固醇含量高的食物的摄入；同时加强锻炼，减少脂肪堆积，保持适当的体重，并保持愉悦的心情；必要时可以采用药物降脂。',
      },
      lipid_d: {
        min: 0,
        max: 3.1,
        minInfo:
          '您本次的血脂水平偏低，近期可以适量进食营养丰富的鱼、虾、猪肝、绿豆等，也可以吃一些优质蛋白质以及绿叶蔬菜，都有利于改善低血脂情况。除此之外，日常也可以适量的参加一些户外运动。',
        maxInfo:
          '您本次的血脂水平偏高，建议多食用绿色蔬菜水果，减少动物内脏、肥肉、坚果、油炸类、烧烤类等脂肪和胆固醇含量高的食物的摄入；同时加强锻炼，减少脂肪堆积，保持适当的体重，并保持愉悦的心情；必要时可以采用药物降脂。',
      },
    };
    let advices = [];
    const body = healthList.pop();
    delete body['id'];
    delete body['c_time'];
    delete body['userid'];
    delete body['weight'];
    for (const i in body) {
      console.log(i);
      const data = body[i];
      const { min, max, minInfo, maxInfo } = healthyRange[i];
      if (data < min) {
        advices.push(minInfo);
      } else if (data > max) {
        advices.push(maxInfo);
      }
    }
    advices = [...new Set(advices)];
    return { bpData, gluData, weightData, lipidData, advices };
  }
  async getHealth(userid: string, id: number) {
    return await this.userHealthRepository.findOneBy({ userid, id });
  }
  async getQuestionList(userid: string) {
    return await this.userQuestionRepository.findBy({ userid });
  }
  async deliverComment(body: CreateCommentDto) {
    return await this.userCommentRepository.save(body);
  }
  async favorQuestion(
    user_id: string,
    comment_id: number,
    question_id: number,
  ) {
    const user = await this.userRepository.findOneBy({ openid: user_id });
    let favorList = JSON.parse(user.favorList) as Array<number>;
    let unfavorList = JSON.parse(user.unfavorList) as Array<number>;
    if (favorList.find((v) => v === comment_id)) {
      await this.userCommentRepository.update(
        { id: comment_id, question_id },
        {
          likes: () => `likes - 1`,
        },
      );
      favorList = favorList.filter((v) => v !== comment_id);
    } else if (unfavorList.find((v) => v === comment_id)) {
      await this.userCommentRepository.update(
        { id: comment_id, question_id },
        {
          likes: () => `likes + 2`,
        },
      );
      unfavorList = unfavorList.filter((v) => v !== comment_id);
      favorList.push(comment_id);
      favorList.sort((a, b) => a - b);
    } else {
      await this.userCommentRepository.update(
        { id: comment_id, question_id },
        {
          likes: () => `likes + 1`,
        },
      );
      favorList.push(comment_id);
      favorList.sort((a, b) => a - b);
    }
    user.favorList = JSON.stringify(favorList);
    user.unfavorList = JSON.stringify(unfavorList);
    await this.userRepository.save(user);
    return { code: 200, errMsg: 'ok' };
  }
  async unfavorQuestion(
    user_id: string,
    comment_id: number,
    question_id: number,
  ) {
    const user = await this.userRepository.findOneBy({ openid: user_id });
    let favorList = JSON.parse(user.favorList) as Array<number>;
    let unfavorList = JSON.parse(user.unfavorList) as Array<number>;
    if (favorList.find((v) => v === comment_id)) {
      await this.userCommentRepository.update(
        { id: comment_id, question_id },
        {
          likes: () => `likes - 2`,
        },
      );
      favorList = favorList.filter((v) => v !== comment_id);
      unfavorList.push(comment_id);
      unfavorList.sort((a, b) => a - b);
    } else if (unfavorList.find((v) => v === comment_id)) {
      await this.userCommentRepository.update(
        { id: comment_id, question_id },
        {
          likes: () => `likes + 1`,
        },
      );
      unfavorList = unfavorList.filter((v) => v !== comment_id);
    } else {
      await this.userCommentRepository.update(
        { id: comment_id, question_id },
        {
          likes: () => `likes - 1`,
        },
      );
      unfavorList.push(comment_id);
      unfavorList.sort((a, b) => a - b);
    }
    user.favorList = JSON.stringify(favorList);
    user.unfavorList = JSON.stringify(unfavorList);
    await this.userRepository.save(user);
    return { code: 200, errMsg: 'ok' };
  }
  async recordToText(url: string) {
    //阿里云的语音转换API，以下三项填写你自己的
    //url是音频地址
    const akId = '';
    const akSecret = '';
    const appKey = '';
    const fileLink = url;
    //地域ID，固定值。
    const ENDPOINT = 'http://filetrans.cn-shanghai.aliyuncs.com';
    const API_VERSION = '2018-08-17';
    /**
     * 创建阿里云鉴权client
     */
    const client = new Client({
      accessKeyId: akId, //获取AccessKey ID和AccessKey Secret请前往控制台：https://ram.console.aliyun.com/manage/ak
      secretAccessKey: akSecret,
      endpoint: ENDPOINT,
      apiVersion: API_VERSION,
    });
    /**
     * 提交录音文件识别请求，请求参数组合成JSON格式的字符串作为task的值。
     * 请求参数appkey：项目appkey，获取Appkey请前往控制台：https://nls-portal.console.aliyun.com/applist
     * 请求参数file_link：需要识别的录音文件。
     */
    const task = {
      appkey: appKey,
      file_link: fileLink,
      enable_sample_rate_adaptive: true,
      version: '4.0', // 新接入请使用4.0版本，已接入（默认2.0）如需维持现状，请注释掉该参数设置。
      enable_words: false, // 设置是否输出词信息，默认值为false，开启时需要设置version为4.0。
    };
    const taskParams = {
      Task: JSON.stringify(task),
    };
    const options = {
      method: 'POST',
    };
    // 提交录音文件识别请求，处理服务端返回的响应。
    const result = await new Promise((resolve) => {
      client
        .submitTask(taskParams, options)
        .then((response) => {
          console.log(response);
          // 服务端响应信息的状态描述StatusText。
          const statusText = response.StatusText;
          if (statusText != 'SUCCESS') {
            console.log('录音文件识别请求响应失败!');
            return;
          }
          console.log('录音文件识别请求响应成功!');
          // 获取录音文件识别请求任务的TaskId，以供识别结果查询使用。
          const taskId = response.TaskId;
          /**
           * 以TaskId为查询参数，提交识别结果查询请求。
           * 以轮询的方式进行识别结果的查询，直到服务端返回的状态描述为"SUCCESS"、SUCCESS_WITH_NO_VALID_FRAGMENT，
           * 或者为错误描述，则结束轮询。
           */
          const taskIdParams = {
            TaskId: taskId,
          };
          const timer = setInterval(() => {
            client
              .getTaskResult(taskIdParams)
              .then((response) => {
                console.log('识别结果查询响应：');
                console.log(response);
                const statusText = response.StatusText;
                if (statusText == 'RUNNING' || statusText == 'QUEUEING') {
                  // 继续轮询，注意间隔周期。
                  console.log('Transfering...');
                } else {
                  if (
                    statusText == 'SUCCESS' ||
                    statusText == 'SUCCESS_WITH_NO_VALID_FRAGMENT'
                  ) {
                    console.log('录音文件识别成功：');
                    const sentences = response.Result;
                    console.log(sentences);
                    clearInterval(timer);
                    if (sentences) {
                      resolve(sentences);
                    } else {
                      resolve({ Sentences: [{ Text: '没有识别出文字。' }] });
                    }
                  } else {
                    console.log('录音文件识别失败!');
                    clearInterval(timer);
                  }
                  // 退出轮询
                }
              })
              .catch((error) => {
                console.error(error);
                // 异常情况，退出轮询。
                clearInterval(timer);
                return { code: 500, errMsg: 'Internal Server Error' };
              });
          }, 5000);
        })
        .catch((error) => {
          console.error(error);
          return { code: 500, errMsg: 'Internal Server Error' };
        });
    });
    console.log(result);
    return result;
  }
}
