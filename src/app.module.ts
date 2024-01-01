import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ClaseModule } from './clase/clase.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/formandera'),
    ClaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
