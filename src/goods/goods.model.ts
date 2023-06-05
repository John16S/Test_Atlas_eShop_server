import { Table, Model, Column } from "sequelize-typescript";

@Table
export class Goods extends Model{
    @Column
    name: string;
    @Column
    description: string;
    @Column({ defaultValue: 0 }) // Установка значения по умолчанию
    price: number;
    @Column({ defaultValue: 'USER' }) // Установка значения по умолчанию
    size: string;
    //*т.к. через Sequelize нельзя установить массив в БД, по этому через jsonstringify массив приводим в строку, и будем парсит при получении на фронте в массив
    @Column
    image: string;  
    @Column({ defaultValue: 0 }) // Установка значения по умолчанию
    quantity: number;
    @Column
    category: string;
    @Column
    subcategory: string;
    @Column({ defaultValue: 'false' }) // Установка значения по умолчанию
    bestseller: boolean;
    @Column({ defaultValue: 'false' }) // Установка значения по умолчанию
    new: boolean;
}