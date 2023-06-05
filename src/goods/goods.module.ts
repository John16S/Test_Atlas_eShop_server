import { Module } from '@nestjs/common';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';
import { Goods } from './goods.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([Goods])],
  controllers: [GoodsController],
  providers: [GoodsService],
  exports: [GoodsService],
})
export class GoodsModule {}
