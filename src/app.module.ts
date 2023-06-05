import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from './config/sequelizeConfig.service';
import { databaseConfig } from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { GoodsModule } from './goods/goods.module';
import { ShoppingCartModule } from './shopping_cart/shopping_cart.module';
import { PaymentModule } from './payment/payment.module';

@Module({
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
    
    AuthModule,   // Модуль для авторизации
    
    GoodsModule, // Модуль товаров
    
    ShoppingCartModule, //Модуль корзины
    
    PaymentModule, //Модуль платежа
  ],
})
export class AppModule {}
