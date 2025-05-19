export class Livro {
    private _titulo: string;
    private _autor: string;
    private _isbn: string;
    private _anoPublicacao: string;

    constructor(titulo: string, autor: string, isbn: string, anoPublicacao: string) {
        this._titulo = titulo;
        this._isbn = isbn;
        this._autor = autor;
        this._anoPublicacao = anoPublicacao;
    }

    // Método para listar as informações do Livro.
    public mostrarDados(): string {
        return `Título: ${this.titulo}\nAutor: ${this.autor}\nISBN: ${this.isbn}\nAno de Publicação: ${this.anoPublicacao}\n`;
    }

    // Getters: é necessário para conseguir puxar os dados nas funções necessárias, tendo em vista que o atributos estão protegidos.
    public get titulo(): string {
        return this._titulo;
    }

    public get autor(): string {
        return this._autor;
    }

    public get isbn(): string {
        return this._isbn;
    }

    public get anoPublicacao(): string {
        return this._anoPublicacao;
    }

    // Setters: é necessário para conseguir modificar os dados nas funções necessárias, tendo em vista que o atributos estão protegidos.
    public set titulo(novoTitulo: string) {
        this._titulo = novoTitulo;
    }

    public set autor(novoAutor: string) {
        this._autor = novoAutor;
    }

    public set isbn(novoISBN: string) {
        this._isbn = novoISBN;
    }

    public set anoPublicacao(novoAno: string) {
        this._anoPublicacao = novoAno;
    }

    
}