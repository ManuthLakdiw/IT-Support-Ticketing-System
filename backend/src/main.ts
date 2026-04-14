import 'dotenv/config'; // Must be first — loads .env before NestJS boots
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [
      'http://localhost:3000', 
      'http://localhost:3001',
      'http://localhost:5173', 
      process.env.CORS_ORIGIN ?? '',
    ].filter(Boolean),
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            
      forbidNonWhitelisted: true, 
      transform: true,            
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('IT Support Ticketing API')
    .setDescription(
      'REST API for the IT Support Ticketing System. ' +
      'Authenticate via /api/auth/login, copy the access_token, ' +
      'then click "Authorize" above and paste it as: Bearer <token>',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your JWT token: Bearer <token>',
        in: 'header',
      },
      'JWT-auth', 
    )
    .addTag('Auth', 'Registration and login endpoints')
    .addTag('Tickets', 'Support ticket management')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, 
    },
  });
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀  Server running at  : http://localhost:${port}/api`);
  logger.log(`📄  Swagger docs at    : http://localhost:${port}/api/docs`);
}

bootstrap();
