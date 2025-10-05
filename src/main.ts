import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import morgan from 'morgan';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './exceptions/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'));
  app.enableCors({ origin: '*' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true 
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Drone Dispatch Service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      filter: true,
      displayRequestDuration: true,
    },
  });


  await app.listen(4000);
}
bootstrap();
