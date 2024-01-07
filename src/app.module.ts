import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ClaseModule } from './clase/clase.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ValoracionModule } from './valoracion/valoracion.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),

    ClaseModule,
    UsuarioModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ValoracionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
