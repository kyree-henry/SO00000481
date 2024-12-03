import configs from './configs';
import { NestFactory } from '@nestjs/core'; 
import { AppModule } from './modules/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ErrorHandlersFilter } from './core/errors/error-handler-filter';
import { SwaggerRedirectMiddleware } from './core/middlewares/swagger-redirect.middleware';

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

  app.use(SwaggerRedirectMiddleware);
 
  app.useGlobalFilters(new ErrorHandlersFilter());
 
  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap(); 