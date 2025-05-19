export class Pessoa {
    protected _nome: string;
    protected _matricula: string;
    protected _endereco: string;
    protected _telefone: string;

    constructor(nome: string, matricula: string, endereco: string, telefone: string) {
        this._nome = nome;
        this._matricula = matricula;
        this._endereco = endereco;
        this._telefone = telefone;
    }

    public mostrarDados() {
        return
    }

    // Getters: é necessário para conseguir puxar os dados nas funções necessárias, tendo em vista que o atributos estão protegidos.
    public get nome(): string {
        return this._nome;
    }

    public get endereco(): string {
        return this._endereco;
    }

    public get telefone(): string {
        return this._telefone;
    }

    public get matricula(): string {
        return this._matricula;
    }

    // Setters: é necessário para conseguir modificados os dados nas funções necessárias, tendo em vista que o atributos estão protegidos.
    public set nome(nome: string) {
        this._nome = nome;
    }

    public set matricula(matricula: string) {
        this._matricula = matricula;
    }

    public set endereco(endereco: string) {
        this._endereco = endereco;
    }

    public set telefone(telefone: string) {
        this._telefone = telefone;
    }

}