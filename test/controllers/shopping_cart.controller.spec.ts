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
import { GoodsModule } from 'src/goods/goods.module';
import { GoodsService } from 'src/goods/goods.service';
import { UsersService } from 'src/users/users.service';
import { ShoppingCart } from 'src/shopping_cart/shopping_cart.model';
import { ShoppingCartModule } from 'src/shopping_cart/shopping_cart.module';

const mockedUser = {
  username: 'Test',
  email: 'test@gmail.com',
  password: 'test123',
  role: 'USER',
};

describe('Shoping_Cart Controller', () => {
  let app: INestApplication;
  let goodService: GoodsService
  let userService: UsersService

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
        ShoppingCartModule,
        GoodsModule,
      ],
    }).compile();

    goodService = testModule.get<GoodsService>(GoodsService)
    userService = testModule.get<UsersService>(UsersService)

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

  //*Создаём тестового пользователя
  beforeEach(async () => {
    const user = new User();
    const hashedPassword = await bcrypt.hash(mockedUser.password, 10);
    user.username = mockedUser.username;
    user.password = hashedPassword;
    user.email = mockedUser.email;
    user.role = mockedUser.role;
    return user.save();
  });

  //*Создаём тестовую картину
  beforeEach(async () => {
    const cart = new ShoppingCart();
    const user = await userService.findOne(
      { where: { username: mockedUser.username } }  //Получаем user-a ктр добавил товар в корзину
    )
    const good = await goodService.findOne(1)    //получаем сам товар который будет добавлен в корзину
    
    cart.userId = user.id;
    cart.goodId = good.id;
    cart.name = good.name;
    cart.price = good.price;
    cart.size = good.size;
    cart.image = good.image;
    cart.image = JSON.parse(good.image)[0]; //Массив картинок в БД парсим и берём первый
    cart.category = good.category;
    cart.subcategory = good.subcategory;
    //*cart.count = 0 - по умолчанию он равен 0, для него напишем отдельный метод ниже
    cart.totalPrice = good.price;   //изначально так, потом при увелечение элемента, будет прибавлятся это цена 

  return cart.save(); //Сохраняем его в таблице
  });

  afterEach(async () => {
    await User.destroy({ where: { username: mockedUser.username } });
    await ShoppingCart.destroy({ where: { goodId: 1 } });
  });

  //*тест для получении одного товара
  it('should get all cart items', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const user = await userService.findOne(
      { where: { username: mockedUser.username } }  //Получаем user-a ктр добавил товар в корзину
    )

    const response = await request(app.getHttpServer())
      .get(`/shopping-cart/${user.id}`)
      .set('Cookie', login.headers['set-cookie']);

      expect(response.body).toEqual(
        expect.arrayContaining([
          {
            id: expect.any(Number),
            userId: user.id,
            goodId: expect.any(Number),
            name: expect.any(String),
            price: expect.any(Number),
            size: expect.any(String),
            image: expect.any(String),
            category: expect.any(String),
            subcategory: expect.any(String),
            count: expect.any(Number),
            totalPrice: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }
        ]),
      );

  });

  //*тест для добавление ттовара в корзину
  it('should add items to cart', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    await request(app.getHttpServer())
      .post('/shopping-cart/add')
      .send({ username: mockedUser.username, goodId: 3 })
      .set('Cookie', login.headers['set-cookie']);

    const user = await userService.findOne({
      where: { username: mockedUser.username },
    });

    const response = await request(app.getHttpServer())
      .get(`/shopping-cart/${user.id}`)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body.find((item) => item.goodId === 3)).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        userId: user.id,
        goodId: 3,
        name: expect.any(String),
        price: expect.any(Number),
        size: expect.any(String),
        image: expect.any(String),
        category: expect.any(String),
        subcategory: expect.any(String),
        count: expect.any(Number),
        totalPrice: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });

  //*тест для обноавление поле count
  it('should get updated count', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const response = await request(app.getHttpServer())
      .patch(`/shopping-cart/count/3`)
      .send({ count: 1 })
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body).toEqual({ count: 1})
  });

  //*тест для обноавление поле totalPrice
  it('should get updated totalPrice', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const good = await goodService.findOne(3)

    const response = await request(app.getHttpServer())
      .patch(`/shopping-cart/totalPrice/3`)
      .send({ totalPrice: good.price * 3 })
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body).toEqual({ totalPrice: good.price * 3 })
  });

  //*тест для удаление одного товара
  it('should remove one', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    await request(app.getHttpServer())
      .delete(`/shopping-cart/removeOne/3`)
      .set('Cookie', login.headers['set-cookie']);

    const user = await userService.findOne(
      { where: { username: mockedUser.username } }  //Получаем user-a ктр добавил товар в корзину
    )

    const response = await request(app.getHttpServer())
      .get(`/shopping-cart/${user.id}`)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body.find((item) => item.goodId === 3)).toBeUndefined();
  });

  //*тест для удаление удаление всех элементов корзины
  it('should remove all', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const user = await userService.findOne(
      { where: { username: mockedUser.username } }  //Получаем user-a ктр добавил товар в корзину
    )

    await request(app.getHttpServer())
      .delete(`/shopping-cart/removeAll/${user.id}`)
      .set('Cookie', login.headers['set-cookie']);

    const response = await request(app.getHttpServer())
      .get(`/shopping-cart/${user.id}`)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body).toStrictEqual([]);
  });
});
