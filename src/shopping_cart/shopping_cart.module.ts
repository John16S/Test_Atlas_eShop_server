import { Module } from '@nestjs/common';
import { ShoppingCartController } from './shopping_cart.controller';
import { ShoppingCartService } from './shopping_cart.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShoppingCart } from './shopping_cart.model';
import { UsersModule } from 'src/users/users.module';
import { GoodsModule } from 'src/goods/goods.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ShoppingCart]), 
    UsersModule,  //импортируем модуль User 
    GoodsModule   //импортируем модуль Good
  ],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService]
})
export class ShoppingCartModule {}
