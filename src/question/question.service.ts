import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { Comment } from './entities/comment.entity';
import { User } from 'src/user/user.entity';
import * as stringSimilarity from 'string-similarity';
@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createQuestionDto: CreateQuestionDto) {
    await this.questionRepository.save(createQuestionDto);
    return 'This action adds a new question';
  }

  async findAll() {
    return await this.questionRepository.find();
  }

  async findOne(id: number) {
    return await this.questionRepository.findOneBy({ id });
  }
  async findList(prompt: string) {
    const list = await this.questionRepository.find();
    const matches = stringSimilarity.findBestMatch(
      prompt,
      list.map((v) => v.title),
    );
    const sortedQuestions = matches.ratings
      .map((rating, index) => ({
        rating: rating.rating,
        question: list[index],
      }))
      .sort((a, b) => b.rating - a.rating)
      .map((item) => {
        return {
          rating: item.rating,
          ...item.question,
        };
      });
    return sortedQuestions;
  }
  async getCommentList(question_id: number) {
    const commentList = await this.commentRepository.findBy({ question_id });
    const userMap = new Map<string, User>();
    for (const comment of commentList) {
      const openid = comment.sender_id;
      if (userMap.has(openid)) {
        const user = userMap.get(openid);
        comment['sender_avatar'] = user.avatar;
        comment['sender_name'] = user.username;
      } else {
        const user = await this.userRepository.findOneBy({ openid });
        userMap.set(openid, user);
        comment['sender_avatar'] = user.avatar;
        comment['sender_name'] = user.username;
      }
    }
    return commentList;
  }

  async remove(id: number) {
    await this.questionRepository.delete({ id });
    return { code: 200, errMsg: 'ok' };
  }
}
