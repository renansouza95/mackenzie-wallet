import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransacoesController } from './transacoes.controller';
import { TransacoesService } from './transacoes.service';
import { Transacao } from './transacoes.model';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Transacao', schema: Transacao}])],
  controllers: [TransacoesController],
  providers: [TransacoesService]
})
export class TransacoesModule {}
