import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransacoesModule } from './transacoes/transacoes.module';

@Module({
  imports: [TransacoesModule, MongooseModule.forRoot('mongodb+srv://srenan_db_user:2tSXT9COql5NGFuf@webmobile.fr2xgzf.mongodb.net/')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
