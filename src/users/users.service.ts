import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from './users.model';
import { createUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User, //userModel - хранить в себе нашу модель User c которым мы можем манипулировать
  ) {}

  //*методы для работы с пользовательями

  findOne(filter: {
    where: { id?: string; username?: string; email?: string };
  }): Promise<User> {
    return this.userModel.findOne({ ...filter });
  }

  async create(
    createUserDto: createUserDto,
  ): Promise<User | { warningMessage: string }> {
    const user = new User(); //*Создаём новый объект User

    //!Проверка, существует ли уже такой пользователь
    const existingByUserName = await this.findOne({
      where: { username: createUserDto.username },
    });
    const existingByEmail = await this.findOne({
      where: { email: createUserDto.email },
    });
    if (existingByUserName) {
      return { warningMessage: 'Пользователь с таким именем уже существует' };
    }
    if (existingByEmail) {
      return { warningMessage: 'Пользователь с таким email уже существует' };
    }

    //!Если такого пользователя нет в БД, то создаём новый
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10); //10-уровень сложности хеширования

    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.password = hashedPassword;
    user.role = createUserDto.role;

    return user.save(); //*Сохраняем user в БД
  }
}
