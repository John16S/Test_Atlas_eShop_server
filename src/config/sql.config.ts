import { registerAs } from '@nestjs/config';
import { Dialect } from 'sequelize';

//sqlConfig - содержит в себе функцию который возращает конфигурацию
//функция registerAs (1 парам - token, 2 парам - callback) 
export const sqlConfig = registerAs('database', () => ({    //зарегаем наш config как //!'database'
    //возвращаем объект с полями конфигурации
    dialect: <Dialect>process.env.SQL_DIALECT || 'postgres',
    logging: process.env.SQL_LOGGING === 'true' ? true : false, //чтобы вместо bool значение не попадалось строчка
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,   //указываем + чтобы было число
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    autoLoadEntities: true,
    synchronize: true,
})) 