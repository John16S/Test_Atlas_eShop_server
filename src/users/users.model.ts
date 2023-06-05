import { Table, Model, Column } from "sequelize-typescript";

@Table
export class User extends Model{
    @Column
    username: string;
    @Column
    password: string;
    @Column
    email: string;
    @Column({ defaultValue: 'USER' }) // Установка значения по умолчанию
    role: string;
}