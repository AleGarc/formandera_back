import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClasesModule } from './clases/clases.module';

@Module({
  imports: [ClasesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
