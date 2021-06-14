import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import {AuthModule} from './auth/auth.module';
import {Config} from './config/config';
import { AssetsModule } from './assets/assets.module';

const dbConnection = Config.DB_CONNECTION;

@Module({
  imports: [
    MongooseModule.forRoot(dbConnection, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    AuthModule,
    AssetsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
