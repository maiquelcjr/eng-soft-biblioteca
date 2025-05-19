import { Pessoa } from "./Pessoa";

export class Membro extends Pessoa {
    constructor(nome: string, matricula: string, endereco: string, telefone: string) {
        // É utilizado super para definir os atributos de Membro, pois são puxados da classe mãe "Pessoa".
        super(nome, matricula, endereco, telefone);
    }

    // Método para listar as informações do Membro.
    public mostrarDados(): string {
        return `Nome: ${this.nome}\nMatrícula: ${this.matricula}\nEndereço: ${this.endereco}\nTelefone: ${this.telefone}\n`;
    }
}