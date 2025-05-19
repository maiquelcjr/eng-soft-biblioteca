import fs from 'fs';
import promptSync from 'prompt-sync';
import { attInformacoesMembros, cadastrarMembro, excluirMembro, listarMembros } from './Utils/UtilsMembro';
import { attInformacoesLivros, criarLivro, excluirLivro, listarLivros } from './Utils/UtilsLivro';
import { cadastrarEmprestimo, realizarDevolucao } from './Utils/UtilsEmprestimo';
import { carregarLivros, carregarMembros } from './Dados/Dados';

const teclado = promptSync();
const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

export const limparArquivos = (...arquivos: string[]) => {
  arquivos.forEach(arquivo => fs.writeFileSync(arquivo, ''));
};

const carregarDados = (arquivo: string) => {
  return fs.readFileSync(arquivo, 'utf-8').split('\n').filter(Boolean);
};

beforeEach(() => {
  limparArquivos('Dados/membros.txt', 'Dados/livros.txt', 'Dados/emprestimos.txt');
});


test('deve cadastrar um empréstimo com sucesso', () => {
  cadastrarMembro('João Silva', 'MAT123', 'Rua A, 123', '999999999');
  criarLivro('O Alquimista', 'Paulo Coelho', '9780061122415', '1988');
  cadastrarEmprestimo('MAT123', '9780061122415', 7);

  const dadosEmprestimos = carregarDados('Dados/emprestimos.txt');
  expect(dadosEmprestimos.length).toBe(1);
});

test('não deve permitir empréstimo de livro para matrícula inexistente', () => {
  criarLivro('O Alquimista', 'Paulo Coelho', '9780061122415', '1988');
  cadastrarEmprestimo('MAT999', '9780061122415', 7);

  expect(consoleSpy).toHaveBeenCalledWith("\nMatrícula ou ISBN não encontrados no sistema.");
});

test('não deve permitir criar dois empréstimos duplicados ( os dois não foram devolvidos )', () => {
  cadastrarMembro('João Silva', 'MAT123', 'Rua A, 123', '999999999');
  criarLivro('O Alquimista', 'Paulo Coelho', '9780061122415', '1988');

  cadastrarEmprestimo('MAT123', '9780061122415', 7);
  cadastrarEmprestimo('MAT123', '9780061122415', 7);

  const dadosEmprestimos = carregarDados('Dados/emprestimos.txt');
  expect(dadosEmprestimos.length).toBe(1);
});

test('deve permitir criar empréstimo com o mesmo isbn e matricula, caso o primeiro já tenha sido devolvido', () => {
  cadastrarMembro('João Silva', 'MAT123', 'Rua A, 123', '999999999');
  criarLivro('O Alquimista', 'Paulo Coelho', '9780061122415', '1988');

  cadastrarEmprestimo('MAT123', '9780061122415', 7);

  let dadosEmprestimos = carregarDados('Dados/emprestimos.txt');
  expect(dadosEmprestimos.length).toBe(1);

  realizarDevolucao(1);

  cadastrarEmprestimo('MAT123', '9780061122415', 7);

  dadosEmprestimos = carregarDados('Dados/emprestimos.txt');
  expect(dadosEmprestimos.length).toBe(2);

  expect(consoleSpy).toHaveBeenCalledWith("\nEmpréstimo cadastrado com sucesso.\n");
});

test('não deve permitir empréstimo de livro com ISBN inexistente', () => {
  cadastrarMembro('João Silva', 'MAT123', 'Rua A, 123', '999999999');
  cadastrarEmprestimo('MAT123', '9780061122425', 7);

  expect(consoleSpy).toHaveBeenCalledWith("\nMatrícula ou ISBN não encontrados no sistema.");
});

test('deve realizar a devolução de um empréstimo com sucesso', () => {
  cadastrarMembro('João Silva', 'MAT123', 'Rua A, 123', '999999999');
  criarLivro('O Alquimista', 'Paulo Coelho', '9780061122415', '1988');

  cadastrarEmprestimo('MAT123', '9780061122415', 7);
  let dadosEmprestimos = carregarDados('Dados/emprestimos.txt');
  expect(dadosEmprestimos.length).toBe(1);

  realizarDevolucao(1);

  dadosEmprestimos = carregarDados('Dados/emprestimos.txt');
  expect(dadosEmprestimos[0].includes('Devolvido')).toBe(true);

  expect(consoleSpy).toHaveBeenCalledWith("Status alterado para Devolvido.");
});

const limparArquivoLivro = () => {
  fs.writeFileSync('Dados/livros.txt', '');
};

const carregarDadosLivro = () => {
  return fs.readFileSync('Dados/livros.txt', 'utf-8').split('\n').filter(Boolean);
};

test('deve criar um novo livro com sucesso', () => {
  criarLivro('O Alquimista', 'Paulo Coelho', '9780061122415', '1988');

  const dados = carregarDadosLivro();
  expect(dados.length).toBe(1);
  expect(dados[0]).toBe('O Alquimista|Paulo Coelho|9780061122415|1988');
});

test('não deve criar livro com título vazio', () => {
  criarLivro('', 'Paulo Coelho', '9780061122415', '1988');

  const dados = carregarDadosLivro();
  expect(dados.length).toBe(0);
});

test('não deve criar livro com ISBN vazio', () => {
  criarLivro('O Alquimista', 'Paulo Coelho', '', '1988');

  const dados = carregarDadosLivro();
  expect(dados.length).toBe(0);
});

test('não deve criar livro com ano de publicação vazio', () => {
  criarLivro('O Alquimista', 'Paulo Coelho', '9780061122415', '');

  const dados = carregarDadosLivro();
  expect(dados.length).toBe(0);
});

test('não deve permitir criar dois livros com o mesmo ISBN', () => {
  criarLivro('O Alquimista', 'Paulo Coelho', '9780061122415', '1988');
  criarLivro('Brida', 'Paulo Coelho', '9780061122415', '1990');

  const dados = carregarDadosLivro();
  expect(dados.length).toBe(1);
  expect(dados[0]).toBe('O Alquimista|Paulo Coelho|9780061122415|1988');
});

test('deve listar os livros', () => {
  criarLivro('O Alquimista', 'Paulo Coelho', '9780061122415', '1988');

  const livros = carregarLivros();
  expect(livros.length).toBe(1);
});

test('deve excluir um livro (aceitar o prompt)', () => {
  criarLivro('O Alquimista', 'Paulo Coelho', '9780061122415', '1988');
  criarLivro('Brida', 'Paulo Coelho', '9780061122425', '1990');

  excluirLivro('9780061122415');

  const livros = carregarLivros();
  expect(livros.length).toBe(1);
});

test('não deve excluir livro (recusar o prompt)', () => {
  criarLivro('O Alquimista', 'Paulo Coelho', '9780061122415', '1988');
  criarLivro('Brida', 'Paulo Coelho', '9780061122425', '1990');

  excluirLivro('9780061122415');
  const membros = carregarLivros();
  expect(membros.length).toBe(2);
});

test('deve alterar o título do livro', () => {
  criarLivro('O Alquimista', 'Paulo Coelho', '9780061122415', '1988');

  attInformacoesLivros('9780061122415', 1, 'O Alquimista: Nova Edição');
  const livros = carregarLivros();
  expect(livros.length).toBe(1);
  expect(livros[0].titulo).toBe('O Alquimista: Nova Edição');
});

test('deve alterar o autor do livro', () => {
  criarLivro('O Alquimista', 'Paulo Coelho', '9780061122415', '1988');

  attInformacoesLivros('9780061122415', 2, 'Coelho, Paulo');
  const livros = carregarLivros();
  expect(livros.length).toBe(1);
  expect(livros[0].autor).toBe('Coelho, Paulo');
});

test('deve alterar o ISBN do livro', () => {
  criarLivro('O Alquimista', 'Paulo Coelho', '9780061122415', '1988');

  attInformacoesLivros('9780061122415', 3, '9780061122500');
  const livros = carregarLivros();
  expect(livros.length).toBe(1);
  expect(livros[0].isbn).toBe('9780061122500');
});

test('não deve alterar para um ISBN já existente', () => {
  criarLivro('O Alquimista', 'Paulo Coelho', '9780061122415', '1988');
  criarLivro('Brida', 'Paulo Coelho', '9780061122425', '1990');

  attInformacoesLivros('9780061122415', 3, '9780061122425');
  expect(consoleSpy).toHaveBeenCalledWith("\nJá existe um livro com esse ISBN.\n");
});

test('deve alterar o ano de publicação do livro', () => {
  criarLivro('O Alquimista', 'Paulo Coelho', '9780061122415', '1988');

  attInformacoesLivros('9780061122415', 4, '1989');
  const livros = carregarLivros();
  expect(livros.length).toBe(1);
  expect(livros[0].anoPublicacao).toBe('1989');
});

test('Ao colocar um ISBN inexistente, irá dar um erro informando que não foi encontrado o ISBN.', () => {
  criarLivro('O Alquimista', 'Paulo Coelho', '9780061122415', '1988');

  attInformacoesLivros('9780061122000', 1, 'O Alquimista: Nova Edição');
  expect(consoleSpy).toHaveBeenCalledWith("Não foi encontrado algum livro com a numeração informada.");
});

test('deve informar quando não há livros cadastrados', () => {
  const livros = carregarLivros();
  expect(livros.length).toBe(0);

  listarLivros();
  expect(consoleSpy).toHaveBeenCalledWith("Não há nenhum livro cadastrado.");
});
const limparArquivoMembro = () => {
  fs.writeFileSync('Dados/membros.txt', '');
};

const carregarDadosMembro = () => {
  return fs.readFileSync('Dados/membros.txt', 'utf-8').split('\n').filter(Boolean);
};

test('deve cadastrar um novo membro com sucesso', () => {
  cadastrarMembro('Maiquel', 'MAT-0001', 'Rua Jardim, 205', '123456789');

  const dados = carregarDadosMembro();
  expect(dados.length).toBe(1);
  expect(dados[0]).toBe('Maiquel|MAT-0001|Rua Jardim, 205|123456789');
});

test('não deve cadastrar membro com nome vazio', () => {
  cadastrarMembro('', 'MAT-0002', 'Rua Silva, 202', '987654321');

  const dados = carregarDadosMembro();
  expect(dados.length).toBe(0);
});

test('não deve cadastrar membro com matrícula vazia', () => {
  cadastrarMembro('Carlos', '', 'Rua Nova, 101', '321654987');

  const dados = carregarDadosMembro();
  expect(dados.length).toBe(0);
});

test('não deve cadastrar membro com endereço vazio', () => {
  cadastrarMembro('Lucas', 'MAT-0003', '', '456789123');

  const dados = carregarDadosMembro();
  expect(dados.length).toBe(0);
});

test('não deve cadastrar membro com telefone vazio', () => {
  cadastrarMembro('Fernanda', 'MAT-0004', 'Rua Pacaembu, 300', '');

  const dados = carregarDadosMembro();
  expect(dados.length).toBe(0);
});

test('não deve permitir cadastrar dois membros com a mesma matrícula', () => {
  cadastrarMembro('Maiquel', 'MAT-0005', 'Rua Jardim, 205', '123456789');
  cadastrarMembro('Pedro', 'MAT-0005', 'Rua Flores, 101', '987654321');

  const dados = carregarDadosMembro();
  expect(dados.length).toBe(1);
  expect(dados[0]).toBe('Maiquel|MAT-0005|Rua Jardim, 205|123456789');
});

test('deve listar o membro', () => {
  cadastrarMembro('Maiquel', 'MAT-0005', 'Rua Jardim, 205', '123456789');

  const membros = carregarMembros()
  expect(membros.length).toBe(1)
});

test('deve listar os dois membros', () => {
  cadastrarMembro('Maiquel', 'MAT-0005', 'Rua Jardim, 205', '123456789');
  cadastrarMembro('Pedro', 'MAT-0045', 'Rua Flores, 101', '987654321');

  const membros = carregarMembros()
  expect(membros.length).toBe(2)
});

test('deve excluir o membro ( aceitar o prompt )', () => {
  cadastrarMembro('Maiquel', 'MAT-0005', 'Rua Jardim, 205', '123456789');
  cadastrarMembro('Pedro', 'MAT-0045', 'Rua Flores, 101', '987654321');

  excluirMembro("MAT-0005")

  const membros = carregarMembros()
  expect(membros.length).toBe(1)
});

test('não deve excluir o membro ( recusar o prompt )', () => {
  cadastrarMembro('Maiquel', 'MAT-0005', 'Rua Jardim, 205', '123456789');
  cadastrarMembro('Pedro', 'MAT-0045', 'Rua Flores, 101', '987654321');

  excluirMembro("MAT-0005")

  const membros = carregarMembros()
  expect(membros.length).toBe(2)
});

test('deve listar os membros', () => {
  cadastrarMembro('Maiquel', 'MAT-0005', 'Rua Jardim, 205', '123456789');
  cadastrarMembro('Pedro', 'MAT-0045', 'Rua Flores, 101', '987654321');

  listarMembros()
});

test('deve alterar o número do membro', () => {
  cadastrarMembro('Maiquel', 'MAT-0005', 'Rua Jardim, 205', '123456789');

  attInformacoesMembros('MAT-0005', 4, '555')
  const membros = carregarMembros();
  expect(membros.length).toBe(1);
  expect(membros[0].nome).toBe('Maiquel');
  expect(membros[0].matricula).toBe('MAT-0005');
  expect(membros[0].endereco).toBe('Rua Jardim, 205');
  expect(membros[0].telefone).toBe('555');
});

test('deve alterar o endereço do membro', () => {
  cadastrarMembro('Maiquel', 'MAT-0005', 'Rua Jardim, 205', '123456789');

  attInformacoesMembros('MAT-0005', 3, 'Rua Jardim, 201')
  const membros = carregarMembros();
  expect(membros.length).toBe(1);
  expect(membros[0].nome).toBe('Maiquel');
  expect(membros[0].matricula).toBe('MAT-0005');
  expect(membros[0].endereco).toBe('Rua Jardim, 201');
  expect(membros[0].telefone).toBe('123456789');
});

test('deve alterar a matrícula do membro', () => {
  cadastrarMembro('Maiquel', 'MAT-0005', 'Rua Jardim, 205', '123456789');

  attInformacoesMembros('MAT-0005', 2, 'MAT-0909')
  const membros = carregarMembros();
  expect(membros.length).toBe(1);
  expect(membros[0].nome).toBe('Maiquel');
  expect(membros[0].matricula).toBe('MAT-0909');
  expect(membros[0].endereco).toBe('Rua Jardim, 205');
  expect(membros[0].telefone).toBe('123456789');
});

test('deve alterar o nome do membro', () => {
  cadastrarMembro('Maiquel', 'MAT-0005', 'Rua Jardim, 205', '123456789');

  attInformacoesMembros('MAT-0005', 1, 'Maicom')
  const membros = carregarMembros();
  expect(membros.length).toBe(1);
  expect(membros[0].nome).toBe('Maicom');
  expect(membros[0].matricula).toBe('MAT-0005');
  expect(membros[0].endereco).toBe('Rua Jardim, 205');
  expect(membros[0].telefone).toBe('123456789');
});

test('Ao colocar uma matrícula inexistente, irá dar um erro informando que não foi encontrado a matrícula.', () => {

  cadastrarMembro('Maiquel', 'MAT-0005', 'Rua Jardim, 205', '123456789');

  attInformacoesMembros('MAT-0002', 1, 'Maicom')
  const membros = carregarMembros();
  expect(consoleSpy).toHaveBeenCalledWith("Matrícula não encontrada.");
});

test('não é possível por a mesma matricula que de outra apessoa', () => {
  cadastrarMembro('Maiquel', 'MAT-0005', 'Rua Jardim, 205', '123456789');
  cadastrarMembro('João das Neves', 'MAT-0001', 'Rua Nevasca, 205', '123456789');

  attInformacoesMembros('MAT-0005', 2, 'MAT-0001')
  const membros = carregarMembros();
  expect(consoleSpy).toHaveBeenCalledWith("\nJá existe um membro com essa matrícula.\n");
});
