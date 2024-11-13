import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
    app.use(cors());
    await app.listen(process.env.PORT || 3001);
}
bootstrap();
