import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session'
import * as passport from 'passport'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(session({
    secret: 'very_secret_keyword',
    resave: false,
    saveUninitialized: false,
    
  }))
  app.use(passport.initialize());
  app.use(passport.session());  //Регистрируем session через passport

  app.enableCors({
    credentials: true,
    //*Указываем из каких доменах мы можем делать запрос на этот сервер
    origin: ['http://localhost:3001']
  })

  //*Документация Swagger
  const config = new DocumentBuilder()
    .setTitle('Атлас - магазин одежда для всей семьи')
    .setDescription('api documentation')
    .setVersion('1.0')
    .addTag('api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagDocumentation', app, document);  //! URL (localhost:3000/swagDocumentation)



  await app.listen(3000);
}
bootstrap();
