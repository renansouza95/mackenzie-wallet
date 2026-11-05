import * as mongoose from 'mongoose';

export const Transacao = new mongoose.Schema({
    descricao: { type: String, required: true },
    valor: { type: Number, required: true, min: 0 },
    tipo: { 
        type: String, 
        required: true,
        enum: ['receita', 'despesa'],
        lowercase: true
    },
    categoria: { type: String, required: true },
    consumoConsciente: { type: Boolean, required: true }
}, { timestamps: true });

export interface Transacao extends mongoose.Document {
    id: string;
    descricao: string;
    valor: number;
    tipo: 'receita' | 'despesa';
    categoria: string;
    consumoConsciente: boolean;
}