import prompt from "prompt-sync";
import { cadastrarEmprestimo, listarEmprestimosAtivos, listarEmprestimosHistorico, realizarDevolucao } from "../Utils/UtilsEmprestimo";
import { menuPrincipal } from "../Main";
import { listarLivros } from "../Utils/UtilsLivro";
import { listarMembros } from "../Utils/UtilsMembro";

const teclado = prompt();

// É necessário exportar a função pois é utilizado no MenuPrincipal.ts
export function menuEmprestimos() {
    console.log("+======= Menu de Empréstimos =======+");
    console.log("|1 - Cadastrar Empréstimo.          |");
    console.log("|2 - Listar empréstimos ativos.     |");
    console.log("|3 - Registrar Devolução.           |");
    console.log("|4 - Histórico de Empréstimos.      |");
    console.log("|0 - Retornar ao Menu Principal.    |");
    console.log("+======= Menu de Empréstimos =======+");

    const opcao = +teclado('Escolha uma opção: ');
    if (opcao === 0) {
        menuPrincipal();
    }

    switch (opcao) {
        case 1:

            listarLivros();
            listarMembros();

            // Perguntas a serem feitas para o usuário ao tentar cadastrar um empréstimo.
            let matriculaAluno = teclado("Digite o Nº de matrícula do aluno: ")
            let isbnLivro = teclado("Digite o ISBN do Livro: ")
            let diasDevolucao = +teclado("Por quantos dias será feito o empréstimo? ")

            cadastrarEmprestimo(matriculaAluno, isbnLivro, diasDevolucao);
            break;

        case 2:
            listarEmprestimosAtivos(false);
            break;

        case 3:
            listarEmprestimosAtivos(true)

            // Perguntas a serem feitas para o usuário ao tentar fazer uma devolução.
            let ind = +teclado("Qual o número do empréstimo que foi feito a devolução? ")

            realizarDevolucao(ind);
            break;

        case 4:
            listarEmprestimosHistorico();
            break;

        default:
            break;
    }
}