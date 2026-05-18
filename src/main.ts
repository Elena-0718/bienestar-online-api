import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { loggerGlobal } from './middelwares/loggerGlobal';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Bootstrap');

  /* =========================
      📂 ARCHIVOS ESTÁTICOS
  ========================= */
  app.useStaticAssets(join(__dirname, '..', 'upload'), {
    prefix: '/upload/',
  });

  app.enableCors({
    origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
  });

  /* =========================
      ❌ DESACTIVAR CACHE (DEV)
  ========================= */
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  app.use(loggerGlobal);
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Bienestar Online API')
    .setDescription('API para gestión de bienestar')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = 3002;
  await app.listen(port);

  logger.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  logger.log(`📁 Carpeta de fotos lista en: http://localhost:${port}/upload/`);
}

bootstrap();