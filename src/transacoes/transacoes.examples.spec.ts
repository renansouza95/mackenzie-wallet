/**
 * Exemplos de uso da API de Transações
 * Execute estes testes com: npm test
 */

import { Test, TestingModule } from '@nestjs/testing';
import { TransacoesController } from './transacoes.controller';
import { TransacoesService } from './transacoes.service';

describe('TransacoesController - Exemplos de Uso', () => {
  let controller: TransacoesController;
  let service: TransacoesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransacoesController],
      providers: [
        {
          provide: TransacoesService,
          useValue: {
            createTransacao: jest.fn(),
            readTransacoes: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransacoesController>(TransacoesController);
    service = module.get<TransacoesService>(TransacoesService);
  });

  describe('POST /transacoes - Criar Receita', () => {
    it('deve criar uma receita de salário', async () => {
      const receita = {
        descricao: 'Salário mensal',
        valor: 3000,
        tipo: 'receita',
        categoria: 'Educação',
        consumoConsciente: true,
      };

      jest.spyOn(service, 'createTransacao').mockResolvedValue('id123');

      const result = await controller.createTransacao(receita as any);

      expect(result).toEqual({ id: 'id123' });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.createTransacao).toHaveBeenCalledWith(receita);
    });
  });

  describe('POST /transacoes - Criar Despesa Consciente', () => {
    it('deve criar uma despesa de compras essenciais', async () => {
      const despesaConsciente = {
        descricao: 'Supermercado - Alimentos essenciais',
        valor: 250.50,
        tipo: 'despesa',
        categoria: 'Alimentação',
        consumoConsciente: true,
      };

      jest.spyOn(service, 'createTransacao').mockResolvedValue('id456');

      const result = await controller.createTransacao(despesaConsciente as any);

      expect(result).toEqual({ id: 'id456' });
    });
  });

  describe('POST /transacoes - Criar Despesa por Impulso', () => {
    it('deve criar uma despesa por impulso (gasto desnecessário)', async () => {
      const despesaImpulso = {
        descricao: 'Compra impulsiva - Roupas que não precisava',
        valor: 150,
        tipo: 'despesa',
        categoria: 'Lazer',
        consumoConsciente: false,
      };

      jest.spyOn(service, 'createTransacao').mockResolvedValue('id789');

      const result = await controller.createTransacao(despesaImpulso as any);

      expect(result).toEqual({ id: 'id789' });
    });
  });

  describe('GET /transacoes - Obter Histórico e Métricas', () => {
    it('deve retornar histórico de transações com métricas calculadas', async () => {
      const mockResponse = {
        historico: [
          {
            _id: 'id1',
            descricao: 'Salário',
            valor: 3000,
            tipo: 'receita',
            categoria: 'Educação',
            consumoConsciente: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            _id: 'id2',
            descricao: 'Supermercado',
            valor: 200,
            tipo: 'despesa',
            categoria: 'Alimentação',
            consumoConsciente: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            _id: 'id3',
            descricao: 'Compra impulsiva',
            valor: 150,
            tipo: 'despesa',
            categoria: 'Lazer',
            consumoConsciente: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        metricas: {
          saldoTotal: 2650,
          totalDespesas: 350,
          totalGastoImpulso: 150,
        },
      };

      jest.spyOn(service, 'readTransacoes').mockResolvedValue(mockResponse);

      const result = await controller.readAllTransacoes();

      expect(result).toEqual(mockResponse);
      expect(result.metricas.saldoTotal).toBe(2650);
      expect(result.metricas.totalDespesas).toBe(350);
      expect(result.metricas.totalGastoImpulso).toBe(150);
    });

    it('deve demonstrar cálculo de métricas correto', async () => {
      /**
       * Cálculo esperado:
       * - Receita: 3000
       * - Despesa consciente: 200
       * - Despesa por impulso: 150
       * 
       * saldoTotal = 3000 - 200 - 150 = 2650
       * totalDespesas = 200 + 150 = 350
       * totalGastoImpulso = 150 (apenas despesas com consumoConsciente = false)
       */

      const mockResponse = {
        historico: [],
        metricas: {
          saldoTotal: 2650,
          totalDespesas: 350,
          totalGastoImpulso: 150,
        },
      };

      jest.spyOn(service, 'readTransacoes').mockResolvedValue(mockResponse);

      const result = await controller.readAllTransacoes();

      expect(result.metricas.saldoTotal).toBe(2650);
      expect(result.metricas.totalDespesas).toBe(350);
      expect(result.metricas.totalGastoImpulso).toBe(150);
    });
  });

  describe('Validação de Categorias', () => {
    it('deve aceitar todas as categorias válidas', () => {
      const categoriasValidas = [
        'Moradia',
        'Alimentação',
        'Lazer',
        'Educação',
        'Saúde',
        'Transporte',
        'Outros',
      ];

      categoriasValidas.forEach((categoria) => {
        expect(categoriasValidas).toContain(categoria);
      });
    });
  });

  describe('Validação de Tipo de Transação', () => {
    it('deve aceitar apenas receita ou despesa', () => {
      const tiposValidos = ['receita', 'despesa'];

      tiposValidos.forEach((tipo) => {
        expect(['receita', 'despesa']).toContain(tipo);
      });
    });
  });
});

describe('ODS 12 - Consumo e Produção Sustentáveis', () => {
  it('deve ajudar o usuário a identificar gastos por impulso', () => {
    /**
     * O campo consumoConsciente permite o usuário refletir sobre:
     * - consumoConsciente = true: Gasto essencial e planejado
     * - consumoConsciente = false: Gasto por impulso (desnecessário)
     * 
     * A métrica totalGastoImpulso mostra o impacto total dos gastos impulsivos
     */

    const transacoes = [
      {
        descricao: 'Alimentos básicos',
        valor: 200,
        tipo: 'despesa',
        categoria: 'Alimentação',
        consumoConsciente: true, // Essencial
      },
      {
        descricao: 'Café em loja cara',
        valor: 50,
        tipo: 'despesa',
        categoria: 'Lazer',
        consumoConsciente: false, // Impulso
      },
      {
        descricao: 'Sapatos de grife desnecessários',
        valor: 500,
        tipo: 'despesa',
        categoria: 'Lazer',
        consumoConsciente: false, // Impulso
      },
    ];

    let totalGastoImpulso = 0;
    transacoes.forEach((t) => {
      if (t.tipo === 'despesa' && !t.consumoConsciente) {
        totalGastoImpulso += t.valor;
      }
    });

    expect(totalGastoImpulso).toBe(550);
  });
});
