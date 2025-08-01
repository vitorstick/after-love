import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get ConfigService
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: configService.get<string>('cors.origin'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enhanced CORS configuration for development
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      // Add your actual frontend URL if different
      configService.get<string>('FRONTEND_URL') || 'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Get port from configuration
  const port = configService.get<number>('PORT') || 8000;
  const frontendUrl =
    configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log(`📡 CORS enabled for: ${frontendUrl}`);
  console.log(
    `🔧 Environment: ${configService.get<string>('NODE_ENV') || 'development'}`,
  );
}
bootstrap().catch((err) => console.error('Error starting application:', err));
