import prompt from "prompt-sync";
import { attInformacoesLivros, criarLivro, excluirLivro, listarLivros, selectInfoLivro } from "../Utils/UtilsLivro";
import { menuPrincipal } from "../Main";
import { carregarLivros } from "../Dados/Dados";

const teclado = prompt();

// É necessário exportar a função pois é utilizado no MenuPrincipal.ts
export function menuLivros() {
    console.log();
    console.log("+======== Menu de Livros ========+");
    console.log("|1 - Cadastrar Livro.            |");
    console.log("|2 - Listar livros cadastrados.  |");
    console.log("|3 - Atualizar info. de livros.  |");
    console.log("|4 - Remover livros do cadastro. |");
    console.log("|0 - Retornar ao Menu Principal. |");
    console.log("+======== Menu de Livros ========+");

    const opcao = +teclado('Escolha uma opção:');
    if (opcao === 0) {
        return menuPrincipal();
    }
    switch (opcao) {
        case 1:
            // Perguntas necessárias para o cadastro de um livro.
            let titulo = teclado("Qual o título do livro? ");
            let autor = teclado("Qual o nome do autor do livro? ");
            let isbn = teclado("Qual o código ISBN do livro? ");
            let anoPublicacao = teclado("Qual o ano de publicação do livro? ");

            // Executa a função de criar um livro.
            criarLivro(titulo, autor, isbn, anoPublicacao);
            break;

        case 2:
            listarLivros();
            break;

        case 3:
            // Carrega e lista os filmes.
            const livros = carregarLivros();
            
            listarLivros();

            let numISBN = teclado("Qual o ISBN do livro que você deseja atualizar as informações? ")
            
            // Função para verificar se o ISBN está associado a um livro.
            let ind = livros.findIndex(livro => livro.isbn.toLowerCase() === numISBN.toLowerCase());

            // Caso não encontrar algum livro com o ISBN correspondente, irá cancelar a ação.
            if (ind == -1) {
                console.log("ISBN não encontrada.");
                return;
            }

            // Mostra os campos que podem ser alterados.
            selectInfoLivro();

            let opcao = +teclado("Qual o campo você deseja alterar? ")
            let campo = teclado("Qual será a nova informação que deseja por: ")

            attInformacoesLivros(numISBN, opcao, campo);
            break;
        case 4:
            listarLivros()

            let isbnExcluir = teclado("Qual o ISBN do livro que deseja excluir? ")
            excluirLivro(isbnExcluir);
            break;

        default:
            console.log('Opção inválida!');
            break;
    }
    menuLivros();
}