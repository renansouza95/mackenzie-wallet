import { Injectable } from '@nestjs/common';
import { Transacao } from './transacoes.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export interface Metricas {
    saldoTotal: number;
    totalDespesas: number;
    totalGastoImpulso: number;
}

export interface TransacoesResponse {
    historico: Transacao[];
    metricas: Metricas;
}

@Injectable()
export class TransacoesService {
    constructor(@InjectModel('Transacao') private readonly transacoesModel: Model<Transacao>) {}

    //CREATE
    async createTransacao(transacao: Transacao) {
        const transacaoModel = new this.transacoesModel({
            descricao: transacao.descricao,
            valor: transacao.valor,
            tipo: transacao.tipo,
            categoria: transacao.categoria,
            consumoConsciente: transacao.consumoConsciente
        });
        const result = await transacaoModel.save();
        return result.id as string;
    }

    //READ
    async readTransacoes(): Promise<TransacoesResponse> {
        const transacoes = await this.transacoesModel.find().exec();
        
        const metricas = this.calcularMetricas(transacoes);

        return {
            historico: transacoes,
            metricas
        };
    }

    private calcularMetricas(transacoes: Transacao[]): Metricas {
        let saldoTotal = 0;
        let totalDespesas = 0;
        let totalGastoImpulso = 0;

        for (const transacao of transacoes) {
            if (transacao.tipo === 'receita') {
                saldoTotal += transacao.valor;
            } else if (transacao.tipo === 'despesa') {
                saldoTotal -= transacao.valor;
                totalDespesas += transacao.valor;

                if (!transacao.consumoConsciente) {
                    totalGastoImpulso += transacao.valor;
                }
            }
        }

        return {
            saldoTotal: Math.round(saldoTotal * 100) / 100,
            totalDespesas: Math.round(totalDespesas * 100) / 100,
            totalGastoImpulso: Math.round(totalGastoImpulso * 100) / 100
        };
    }
}
