import * as fs from 'fs';
import { Livro } from '../Classes/Livro';
import { Membro } from '../Classes/Membro';
import { Emprestimo } from '../Classes/Emprestimo';

// Função para salvar dados em um arquivo
export function salvarDados(caminho: string, dados: string[]): void {
  // Junta os dados em uma única string, separando por quebras de linha
  const conteudo = dados.join('\n');
  // Escreve o conteúdo no arquivo especificado
  fs.writeFileSync(caminho, conteudo, 'utf-8');
}

// Função para carregar dados de um arquivo
export function carregarDados(caminho: string): string[] {
  // Verifica se o arquivo existe
  if (!fs.existsSync(caminho)) {
    console.log(`Arquivo ${caminho} não encontrado.`);
    return [];
  }

  // Lê o conteúdo do arquivo, divide em linhas e remove linhas vazias utilizando trim().
  const linhas = fs.readFileSync(caminho, 'utf-8').split('\n').filter((linha) => linha.trim() !== '');

  // Retorna os dados.
  return linhas;
}

// Função para carregar os livros do arquivo
export function carregarLivros(): Livro[] {
  // Carrega os dados do arquivo de livros
  const linhas = carregarDados('./Dados/livros.txt');

  // A cada linha, será criado um novo objeto "Livro", separando cada atributo pelo "|".
  return linhas.map((linha) => {
    const [titulo, autor, isbn, anoPublicacao] = linha.split('|');
    return new Livro(titulo, autor, isbn, anoPublicacao);
  });
}

// Função para carregar os membros do arquivo
export function carregarMembros(): Membro[] {
  // Carrega os dados do arquivo de membros
  const linhas = carregarDados('./Dados/membros.txt');
  
  // A cada linha, será criado um novo objeto "Membro", separando cada atributo pelo "|".
  return linhas.map((linha) => {
    const [nome, telefone, matricula, endereco] = linha.split('|');
    return new Membro(nome, telefone, matricula, endereco);
  });
}

// Função para carregar os empréstimos do arquivo
export function carregarEmprestimos(): Emprestimo[] {
  // Carrega os livros e membros para associar aos empréstimos
  const livros = carregarLivros();
  const membros = carregarMembros();

  // Carrega os dados do arquivo de empréstimos
  const linhas = carregarDados('./Dados/emprestimos.txt');

  // Percorre cada linha, abaixo é o processo de criação de cada objeto "Empréstimo".
  // A cada linha, será criado um novo objeto "Empréstimo", separando cada atributo pelo "|".
  return linhas.map((linha) => {
    const [isbn, matricula, dataEmprestimo, dataDevolucao, status] = linha.split('|');

    // Encontra o livro e o membro correspondentes
    const livro = livros.find(livro => livro.isbn.toLowerCase() === isbn.toLowerCase());
    const membro = membros.find(membro => membro.matricula.toLowerCase() === matricula.toLowerCase());

    // Verifica se o livro e o membro foram encontrados
    if (livro && membro) {
      return new Emprestimo(livro, membro, new Date(dataEmprestimo), new Date(dataDevolucao), status);
    } else {
      console.error(`Erro ao carregar empréstimo: Livro ou Membro não encontrado para ${linha}`);
      return null;
    }
    // Filtra a lista de empréstimos para remover valores nulos e confirma que a array seja Emprestimo[].
  }).filter(emprestimo => emprestimo !== null) as Emprestimo[];
}