import { Table, Model, Column } from "sequelize-typescript";

@Table
export class ShoppingCart extends Model{
    @Column
    userId: number;
    @Column
    goodId: number;
    @Column
    name: string;
    @Column({ defaultValue: 0 }) // Установка значения по умолчанию
    price: number;
    @Column({ defaultValue: 'USER' }) // Установка значения по умолчанию
    size: string;
    @Column
    image: string;  
    @Column
    category: string;
    @Column
    subcategory: string;
    @Column({ defaultValue: 0 })
    count: number;
    @Column({ defaultValue: 0 })
    totalPrice: number;
  find: void;
}