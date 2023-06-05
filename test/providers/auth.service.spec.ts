import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { databaseConfig } from 'src/config/configuration';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { User } from 'src/users/users.model';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

const mockedUser = {
  username: 'John',
  email: 'john@gmail.com',
  password: 'john123',
  role: 'USER',
};

describe('Auth Service', () => {
  let app: INestApplication;
  let authService: AuthService;

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

    authService = testModule.get<AuthService>(AuthService);
    app = testModule.createNestApplication();
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

  //*тест на validateUser
  it('should validate user', async () => {
    const user = await authService.validateUser(
      mockedUser.username, 
      mockedUser.password
    );

    expect(user.userName).toBe(mockedUser.username);
    expect(user.email).toBe(mockedUser.email);

  });
});
