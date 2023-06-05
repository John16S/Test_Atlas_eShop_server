import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
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
import { ShoppingCartService } from 'src/shopping_cart/shopping_cart.service';

const mockedUser = {
  username: 'Test',
  email: 'test@gmail.com',
  password: 'test123',
  role: 'USER',
};

describe('Shoping_Cart Service', () => {
  let app: INestApplication;
  let goodService: GoodsService
  let userService: UsersService
  let shopping_cartService: ShoppingCartService

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
        GoodsModule
      ],
    }).compile();

    goodService = testModule.get<GoodsService>(GoodsService)
    userService = testModule.get<UsersService>(UsersService)
    shopping_cartService = testModule.get<ShoppingCartService>(ShoppingCartService)

    app = testModule.createNestApplication();

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

  //*тест для получении всех товара
  it('should return all cart items', async () => {
    const user = await userService.findOne(
      { where: { username: mockedUser.username } }  //Получаем user-a ктр добавил товар в корзину
    )

    const cart = await shopping_cartService.findAll(user.id)

    cart.forEach((item => expect(item.dataValues).toEqual(
        expect.objectContaining(
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
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          }
        ),
      ))
    )
  });

  //*тест для добавление одного товара
  it('should add cart items', async () => {
    await shopping_cartService.add({
      username: mockedUser.username,
      goodId: 3,
    });

    const user = await userService.findOne(
      { where: { username: mockedUser.username } }  //Получаем user-a ктр добавил товар в корзину
    )

    const cart = await shopping_cartService.findAll(user.id)

    expect(cart.find((item) => item.goodId === 3)).toEqual(
      expect.objectContaining(
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
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          }
        ),
      )
  });

  //*тест для обновление поле count
  it('should return updated count', async () => {
    const result = await shopping_cartService.updateCount(2, 1);

    expect(result).toEqual({ count: 2 });
  });

  //*тест для обновление поле totalPrice
  it('should return updated totalPrice', async () => {
    const good = await goodService.findOne(1);
    const result = await shopping_cartService.updateTotalPrice(good.price * 3, 1);

    expect(result).toEqual({ totalPrice: good.price * 3 });
  });

  //*тест для удаление одного элемента
  it('should delete cart item', async () => {
    await shopping_cartService.remove(1);

    const user = await userService.findOne({
      where: { username: mockedUser.username },
    });

    const cart = await shopping_cartService.findAll(user.id);

    expect(cart.find((item) => item.goodId === 1)).toBeUndefined();
  });

  //*тест для удаление всех элументов
  it('should delete all cart items', async () => {
    const user = await userService.findOne({
      where: { username: mockedUser.username },
    });

    await shopping_cartService.removeAll(user.id);

    const cart = await shopping_cartService.findAll(user.id);

    expect(cart).toStrictEqual([]);
  });

});
