import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { databaseConfig } from 'src/config/configuration';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { User } from 'src/users/users.model';
import { AuthService } from 'src/auth/auth.service';
import { GoodsModule } from 'src/goods/goods.module';
import { GoodsService } from 'src/goods/goods.service';

describe('Auth Service', () => {
  let app: INestApplication;
  let goodService: GoodsService;

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
      ],
    }).compile();

    goodService = testModule.get<GoodsService>(GoodsService);
    app = testModule.createNestApplication();
    await app.init();
  });

  //*тест на получение одного товара
  it('should find good', async () => {
    const good = await goodService.findOne(1);

    expect(good.dataValues).toEqual(
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
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );

  });


  //*тест на получение товара по имени
  it('should find by name', async () => {
    const good = await goodService.findOneByName('Rem suscipit.');

    expect(good.dataValues).toEqual(
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
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );

  });


  //*тест на получение товара по строчке
  it('should find by string', async () => {
    const goods = await goodService.searchByString('sus');

    expect(goods.rows.length).toBeLessThanOrEqual(15);

    goods.rows.forEach((element) => {
      expect(element.name).toContain('sus');
      expect(element.dataValues).toEqual(
        expect.objectContaining({
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
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });

  });


  //*тест на получение bestsellers
  it('should find bestsellers', async () => {
    const goods = await goodService.bestSellersGoods();

    goods.rows.forEach((element) => {
      expect(element.dataValues).toEqual(
        expect.objectContaining({
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
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });

  });


  //*тест на получение new
  it('should find new', async () => {
    const goods = await goodService.newGoods();

    goods.rows.forEach((element) => {
      expect(element.dataValues).toEqual(
        expect.objectContaining({
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
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });

  });
});
