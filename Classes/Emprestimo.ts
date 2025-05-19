import { Livro } from './Livro';
import { Membro } from './Membro';

export class Emprestimo {
  private _livro: Livro;
  private _membro: Membro;
  private _dataEmprestimo: Date;
  private _dataDevolucao: Date;
  private _status: string;

  constructor(livro: Livro, membro: Membro, dataEmprestimo: Date, dataDevolucao: Date, status: string) {
    this._livro = livro;
    this._membro = membro;
    this._dataEmprestimo = dataEmprestimo;
    this._dataDevolucao = dataDevolucao;
    this._status = status;
  }

  // Método para retornar os atributos do livro. 
  public mostrarDados(): string {
    return `Livro Emprestado: ${this.livro.titulo}\nEmprestimo feito para: ${this.membro.nome}\nData do Empréstimo: ${this.dataEmprestimo.toLocaleDateString("pt-br", { timeZone: 'UTC' })}\nData Final: ${this.dataDevolucao.toLocaleDateString("pt-br", { timeZone: 'UTC' })}\nStatus de Entrega: ${this.status}\n`;
  }

  // Getters: é necessário para conseguir puxar os dados nas funções necessárias, tendo em vista que o atributos estão protegidos.
  public get livro() {
    return this._livro;
  }

  public get membro() {
    return this._membro;
  }

  public get dataEmprestimo() {
    return this._dataEmprestimo;
  }

  public get dataDevolucao() {
    return this._dataDevolucao;
  }

  public get status() {
    return this._status;
  }

  // Setters: é necessário para conseguir modificar os dados nas funções necessárias, tendo em vista que o atributos estão protegidos.
  public set livro(livro: Livro) {
    this._livro = livro;
  }

  public set membro(membro: Membro) {
    this._membro = membro;
  }

  public set dataEmprestimo(dataEmprestimo: Date) {
    this._dataEmprestimo = dataEmprestimo;
  }

  public set dataDevolucao(dataDevolucao: Date) {
    this._dataDevolucao = dataDevolucao;
  }

  public set status(status: string) {
    this._status = status;
  }

}
