import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {UserModule} from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://shooterGame:VEOO4OyiouZPhkaK@game-shooter-xjxyx.mongodb.net/shooter?retryWrites=true&w=majority'),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
