import prompt from "prompt-sync";
import { Livro } from "../Classes/Livro";
import { carregarLivros, salvarDados } from "../Dados/Dados";
const teclado = prompt();

// Em todas funções foi utilizado "export" para ser possivel utilizar essas funções nos menus correspondentes.

// Função para criar novos Livros.
export function criarLivro(titulo: string, autor: string, isbn: string, anoPublicacao: string) {

    // Caso algum dos campos estiver nulo, a ação será cancelada.
    if (titulo == "" || autor == "" || isbn == "" || anoPublicacao == "") {
        console.log("\nInforme os dados necessários.\n");
        return;
    }

    // Carrega os livros do sistema.
    const livros = carregarLivros();

    // Verifica se já existe algum livro com o mesmo ISBN.
    const livroExistente = livros.find(livro => livro.isbn.toLowerCase() === isbn.toLowerCase());
    if (livroExistente) {
        console.log("\nISBN já cadastrado no sistema, tente novamente.\n");
        return;
    }

    // Cria um novo objeto "Livros", os atributos serão aplicados conforme a resposta do usuário.
    const livro = new Livro(titulo, autor, isbn, anoPublicacao);

    // É adicionado novo livro no Array de Livros.
    livros.push(livro);

    // Salva o livro no sistema com o padrão: titulo | autor | isbn | anoPublicação
    salvarDados('Dados/livros.txt', livros.map(livro => `${livro.titulo}|${livro.autor}|${livro.isbn}|${livro.anoPublicacao}`));
    console.log("\nCadastro realizado com sucesso.\n");
    return;
}

// Na função abaixo, é listado todos os detalhes dos livros presentes no sistema.
export function listarLivros() {
    // Carrega todos os livros do sistema.
    const livros = carregarLivros();

    // Se não tiver nenhum livro cadastrado, irá dar um aviso.
    if (livros.length == 0) {
        console.log("Não há nenhum livro cadastrado.")
        return;
    }

    // A cada livro presente, será utilizado o método mostrarDados() da classe Livro, retornando os dados.
    console.log("+======== Livros Cadastrados ========+\n");
    livros.forEach((livro) => {
        console.log(livro.mostrarDados());
    });
    console.log("+====================================+");

}

export function excluirLivro(isbnExcluir: string) {
    // Carrega todos os livros do sistema.
    const livros = carregarLivros();

    // Processo para checar se existe algum livro com o ISBN informado.
    let ind = livros.findIndex(livro => livro.isbn.toLowerCase() === isbnExcluir.toLowerCase());

    if (ind !== -1) {
        let confirmar = teclado(`Você tem certeza que deseja excluir o Livro ${livros[ind].titulo} (S/N)? `).toLowerCase();

        if (confirmar == "s") {
            // Irá remover o livro do Array.
            livros.splice((ind), 1);

            // Salva todos os livros no sistema com o padrão: titulo | autor | isbn | anoPublicação
            salvarDados('Dados/livros.txt', livros.map(livro => `${livro.titulo}|${livro.autor}|${livro.isbn}|${livro.anoPublicacao}`));
            console.log("\nLivro excluido com sucesso.");
        } else {
            console.log("\nAção cancelada.");
        }

    } else {
        console.log("Não foi encontrado algum livro com a numeração informada, tente novamente.")
        return;
    }
}

export function selectInfoLivro() {
    console.log("+======== Att. Informações de Livros ========+\n");
    console.log("Escolha abaixo a informação que deseja alterar:")
    console.log("1- Alterar Título ")
    console.log("2- Alterar Autor ")
    console.log("3- Alterar ISBN ")
    console.log("4- Alterar ano de publicação ")
    console.log("\n+======== Att. Informações de Livros ========+");
}

export function attInformacoesLivros(numISBN: string, opcao: number, campo: string) {
    // Carrega todos os livros do sistema.
    const livros = carregarLivros();

    // Identifica o livro que tem o número do ISBN informado pelo usuário.
    let ind = livros.findIndex(livro => livro.isbn.toLowerCase() === numISBN.toLowerCase());

    // Caso o usuário fornecer um ISBN válido, irá prosseguir com o processo de alteração.
    if (ind !== -1) {
        if (opcao == 1) {
            livros[ind].titulo = campo;

            console.log("Título alterado com sucesso.")
        } else if (opcao == 2) {
            livros[ind].autor = campo;

            console.log("Autor alterado com sucesso.")
        } else if (opcao == 3) {
            // Verifica se já existe algum livro com o mesmo ISBN
            let isbnExistente = livros.some(livro => livro.isbn.toLowerCase() === campo.toLowerCase());

            if (isbnExistente) {
                console.log("\nJá existe um livro com esse ISBN.\n");
                return;
            }

            livros[ind].isbn = campo;
            console.log("ISBN alterado com sucesso.")
        } else if (opcao == 4) {
            livros[ind].anoPublicacao = campo;

            console.log("Ano de Publicação alterado com sucesso.")
        }

        // Salva todos os livros no sistema com o padrão: titulo | autor | isbn | anoPublicação
        salvarDados('Dados/livros.txt', livros.map(livro => `${livro.titulo}|${livro.autor}|${livro.isbn}|${livro.anoPublicacao}`));

    } else {
        console.log("Não foi encontrado algum livro com a numeração informada.")
        return;
    }
}