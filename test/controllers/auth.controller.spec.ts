import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';
import * as session from 'express-session';
import * as passport from 'passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { databaseConfig } from 'src/config/configuration';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { User } from 'src/users/users.model';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

const mockedUser = {
  username: 'Test',
  email: 'test@gmail.com',
  password: 'test123',
  role: 'USER',
};

describe('Auth Controller', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRootAsync({
          imports: [ConfigModule],
          useClass: SequelizeConfigService,
        }),
        ConfigModule.forRoot({
          load: [databaseConfig],
        }),
        AuthModule,
      ],
    }).compile();

    app = testModule.createNestApplication();
    app.use(
      session({
        secret: 'keyword',
        resave: false,
        saveUninitialized: false,
      }),
    );
    app.use(passport.initialize());
    app.use(passport.session());

    await app.init();
  });

  beforeEach(async () => {
    const user = new User();
    const hashedPassword = await bcrypt.hash(mockedUser.password, 10);
    user.username = mockedUser.username;
    user.password = hashedPassword;
    user.email = mockedUser.email;
    user.role = mockedUser.role;
    return user.save();
  });

  afterEach(async () => {
    await User.destroy({ where: { username: mockedUser.username } });
  });

  it('should login user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    expect(response.body.user.userName).toBe(mockedUser.username);
    expect(response.body.msg).toBe('Logged in');
    expect(response.body.user.email).toBe(mockedUser.email);
    expect(response.body.user.role).toBe(mockedUser.role);

  });

  //*Тест на LoginCheck
  it('should login check', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const loginCheck = await request(app.getHttpServer())
      .get('/users/loginCheck')
      .set('Cookie', login.headers['set-cookie']);

    expect(loginCheck.body.userName).toBe(mockedUser.username);
    expect(loginCheck.body.email).toBe(mockedUser.email);
    expect(loginCheck.body.role).toBe(mockedUser.role);

  });

  //*Тест на LoginOut
  it('should logout', async () => {
    const response = await request(app.getHttpServer())
      .get('/users/logout')

    expect(response.body.msg).toBe('Logged out, session has ended');

  });
});
