import { registerAs } from '@nestjs/config';
import { sqlConfig } from './sql.config';

//функция registerAs (1 парам - token, 2 парам - callback) 
export const databaseConfig = registerAs('database', () => ({ //зарегаем наш config как //!'database'
    //возвращаем объект с полей sql, где мы разворочиваем наш корневой config
    sql: {
        ...sqlConfig(), //переменная из файла sql.config.ts
    }
    
})) 