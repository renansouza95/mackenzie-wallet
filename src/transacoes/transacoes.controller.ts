import { Body, Controller, Get, Post } from '@nestjs/common';
import { TransacoesService, TransacoesResponse } from './transacoes.service';
import type { Transacao } from './transacoes.model';

@Controller('transacoes')
export class TransacoesController {
    constructor(private readonly transacoesService: TransacoesService) {}

    @Get()
    async readAllTransacoes(): Promise<TransacoesResponse> {
        return this.transacoesService.readTransacoes();
    }

    @Post()
    async createTransacao(@Body() transacao: Transacao): Promise<{ id: string }> {
        const id = await this.transacoesService.createTransacao(transacao);
        return { id };
    }
}
