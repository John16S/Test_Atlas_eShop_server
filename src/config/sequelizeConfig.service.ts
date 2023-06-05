import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User } from "src/users/users.model";
import { 
    SequelizeOptionsFactory,
    SequelizeModuleOptions, 
} from "@nestjs/sequelize";

//создадим класс конфигурации для Sequelize
//Основная конфигурация для config модуля nestjs
@Injectable()  
export class SequelizeConfigService implements SequelizeOptionsFactory{
    constructor(private readonly configService: ConfigService){}
    
    // Создадим метод для конфигурации модуля nestjs
    createSequelizeOptions(): SequelizeModuleOptions{
        const {
            sql: { dialect, logging, host, port, username, password, database },
        } = this.configService.get('database');
        
        return {
            dialect, 
            logging,
            host,
            port,
            username,
            password,
            database,
            models: [User],
            autoLoadModels: true,
            synchronize: true,
            define: {   //чтобы можно было хранить кирилицу в БД
                charset: 'utf8',
                collate: 'utf8_general_ci'
            },
        }       
    }
}