import { NestFactory } from '@nestjs/core';
import { Request, Response } from "express";
import { AppModule } from './modules/app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import configs from './configs';
import { ErrorHandlersFilter } from './core/errors/error-handler-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = configs.port || 3000;
 
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .setTitle(`${configs.projectName}`)
    .setDescription(`${configs.projectName} api description`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.use((req: Request, res: Response, next: any) => {
    if (req.originalUrl == '/' || req.originalUrl.includes('favicon.ico')) {
      return res.send(configs.projectName); 
    }

    return next();
  });

  app.useGlobalFilters(new ErrorHandlersFilter());
 
  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap(); 