import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as bcrypt from 'bcrypt'; 
import * as request from 'supertest';   //!Чтобы делать запросы в эндпоинты
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { databaseConfig } from 'src/config/configuration';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { User } from 'src/users/users.model';
import { UsersModule } from 'src/users/users.module';

//!Тесты мы пишем в функции describe, в этой функции грубо говоря мы с нуля создаём наше приложение с пользователями
describe('Users Controller', () => {
  let app: INestApplication;

  //*beforeEach - здесь описывается что будем делать перед тестом
  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRootAsync({
          imports: [ConfigModule],
          useClass: SequelizeConfigService, //настройки нашего БД передадим в useClass
        }),
    
        ConfigModule.forRoot({
          //корневой config для nestjs
          load: [databaseConfig], //наш databaseConfig из configuration.ts
        }),
        
        UsersModule,  // Модуль пользователей
      ],
    }).compile();

    app = testModule.createNestApplication(); //в app записываем наш тестовый модуль 
    await app.init(); //и его инициализируем здесь
  });

  //*а здесь уже что будем делать после теста
  afterEach(async () => {
    await User.destroy({ where: { username: 'Test' } });
  });

  //*Это уже тесты, тесты пишутся в функции it
  it('should create user', async () => {
    const newUser = {
      username: 'Test',
      email: 'test@gmail.com',
      password: 'test123',
      role: 'USER'
    };

    const response = await request(app.getHttpServer())
      .post('/users/signup')  //делаем запрос на этот эндпоинт
      .send(newUser);   //отправляем это!

    //проверка, правильный ли пароль...
    const passwordIsValid = await bcrypt.compare(
      newUser.password,
      response.body.password,
    );

    //Здесь указываем ожидаемые значения
    expect(response.body.username).toBe(newUser.username);
    expect(passwordIsValid).toBe(true);
    expect(response.body.email).toBe(newUser.email);
    expect(response.body.role).toBe(newUser.role);
  });
});
