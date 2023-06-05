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
import { AuthModule } from 'src/auth/auth.module';
import { GoodsModule } from 'src/goods/goods.module';

const mockedUser = {
  username: 'Test',
  email: 'test@gmail.com',
  password: 'test123',
  role: 'USER',
};

describe('Goods Controller', () => {
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
        GoodsModule,
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

  //*тест для получении одного товара
  it('should get one good', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const loginCheck = await request(app.getHttpServer())
      .get('/goods/find/1')
      .set('Cookie', login.headers['set-cookie']);

      expect(loginCheck.body).toEqual(
        expect.objectContaining({
          id: 1,
          name: expect.any(String),
          description: expect.any(String),
          price: expect.any(Number),
          size: expect.any(String),
          image: expect.any(String),
          quantity: expect.any(Number),
          category: expect.any(String),
          subcategory: expect.any(String),
          bestseller: expect.any(Boolean),
          new: expect.any(Boolean),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );

  });


  //*тест для получении bestsellers
  it('should get bestsellers', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const loginCheck = await request(app.getHttpServer())
      .get('/goods/bestsellers')
      .set('Cookie', login.headers['set-cookie']);

      expect(loginCheck.body.rows).toEqual(
        expect.arrayContaining([
          {
            id: expect.any(Number),
            name: expect.any(String),
            description: expect.any(String),
            price: expect.any(Number),
            size: expect.any(String),
            image: expect.any(String),
            quantity: expect.any(Number),
            category: expect.any(String),
            subcategory: expect.any(String),
            bestseller: true,
            new: expect.any(Boolean),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }
        ]),
      );

  });


  //*тест для получении new
  it('should get new', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const loginCheck = await request(app.getHttpServer())
      .get('/goods/new')
      .set('Cookie', login.headers['set-cookie']);

      expect(loginCheck.body.rows).toEqual(
        expect.arrayContaining([
          {
            id: expect.any(Number),
            name: expect.any(String),
            description: expect.any(String),
            price: expect.any(Number),
            size: expect.any(String),
            image: expect.any(String),
            quantity: expect.any(Number),
            category: expect.any(String),
            subcategory: expect.any(String),
            bestseller: expect.any(Boolean),
            new: true,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }
        ]),
      );

  });

  
  //*тест для поиска по строке
  it('should search by string', async () => {
    const body = { search: 'st' };
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const loginCheck = await request(app.getHttpServer())
      .post('/goods/search')
      .send(body)
      .set('Cookie', login.headers['set-cookie']);

      expect(loginCheck.body.rows.length).toBeLessThanOrEqual(15);

      loginCheck.body.rows.forEach((element) => {
        expect(element.name).toContain(body.search);
      });
      expect(loginCheck.body.rows).toEqual(
        expect.arrayContaining([
          {
            id: expect.any(Number),
            name: expect.any(String),
            description: expect.any(String),
            price: expect.any(Number),
            size: expect.any(String),
            image: expect.any(String),
            quantity: expect.any(Number),
            category: expect.any(String),
            subcategory: expect.any(String),
            bestseller: expect.any(Boolean),
            new: expect.any(Boolean),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }
        ]),
      );
  });
  

  //*тест для поиска по имени
  it('should get by name', async () => {
    const body = { name: 'Rem suscipit.' };
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const loginCheck = await request(app.getHttpServer())
      .post('/goods/searchByName')
      .send(body)
      .set('Cookie', login.headers['set-cookie']);

      expect(loginCheck.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: 'Rem suscipit.',
          description: expect.any(String),
          price: expect.any(Number),
          size: expect.any(String),
          image: expect.any(String),
          quantity: expect.any(Number),
          category: expect.any(String),
          subcategory: expect.any(String),
          bestseller: expect.any(Boolean),
          new: expect.any(Boolean),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
  });


  //*тест для фильтров
});
