import prompt from "prompt-sync";
import { carregarEmprestimos, carregarLivros, carregarMembros, salvarDados } from "../Dados/Dados";
import { Emprestimo } from "../Classes/Emprestimo";

const teclado = prompt();

// Em todas funções foi utilizado "export" para ser possivel utilizar essas funções nos menus correspondentes.

// Função de cadastrar um novo empréstimo no sistema.
export function cadastrarEmprestimo(matriculaAluno: string, isbnLivro: string, diasDevolucao: number) {
    // Abaixo, é carregado os membros, livros e emprestimos registrados no sistema.
    const membros = carregarMembros();
    const livros = carregarLivros();
    const emprestimos = carregarEmprestimos();

    // Verificação caso algum dos campos esteja vazio ou incorreto.
    if (matriculaAluno == "" || isbnLivro == "" || isNaN(diasDevolucao)) {
        console.log("\nInforme os dados necessários.\n");
        return;
    }

    // Abaixo é feito uma identificação do index do Membro e Livro para relacionar ao empréstimo.
    const indMembro = membros.findIndex(membro => membro.matricula.toLowerCase() === matriculaAluno.toLowerCase());
    const indLivro = livros.findIndex(livro => livro.isbn.toLowerCase() === isbnLivro.toLowerCase());

    // Caso não encontrar algum membro ou livro, irá alertar que não foi encontrado.
    if (indMembro === -1 || indLivro === -1) {
        console.log("\nMatrícula ou ISBN não encontrados no sistema.")
        return;
    } else {

        // Checagem caso já exista algum empréstimo para a mesma pessoa do mesmo livro, por exemplo:
        // "Joãozinho" da matrícula "MAT01" tem o livro "Penguim" do ISBN "ISBN01"
        // O sistema não permite que Joãozinho tenha o Penguim, mas permite que tenha outro.
        // E permite que outra pessoa receba o empréstimo do livro Penguim, tendo em vista que é uma biblioteca e normalmente tem mais de uma cópia do livro.
        const emprestimoExistente = emprestimos.find(emprestimo => emprestimo.livro.isbn.toLowerCase() === isbnLivro.toLowerCase()
            && emprestimo.membro.matricula.toLowerCase() === matriculaAluno.toLowerCase()
            && emprestimo.status === "Não Devolvido"
        );

        if (emprestimoExistente) {
            console.log(`\nO membro ${membros[indMembro].nome} já possui um empréstimo em aberto do livro ${livros[indLivro].titulo}.\n`);
            return;
        }

        // Ao achar o membro e livro, será criado um Empréstimo, relacionando o Livro, Membro, Data de Empréstimo, Data de Devolução e Status de "Não Devolvido".
        const emprestimo = new Emprestimo(livros[indLivro], membros[indMembro], new Date(), new Date(), "Não Devolvido");

        // A linha abaixo modifica a dataDevolução do empréstimo, adicionando os dias que irá durar o empréstimo.
        emprestimo.dataDevolucao.setDate(emprestimo.dataEmprestimo.getDate() + diasDevolucao);

        // Carrega os empréstimos e adiciona o empréstimo criado.

        emprestimos.push(emprestimo);
        
        // Salva o empréstimo no sistema com o padrão: livro.isbn | membro.matricula | dataEmprestimo | dataDevolucao | status
        salvarDados('Dados/emprestimos.txt', emprestimos.map(emprestimo => `${emprestimo.livro.isbn}|${emprestimo.membro.matricula}|${emprestimo.dataEmprestimo.toISOString().split('T')[0]}|${emprestimo.dataDevolucao.toISOString().split('T')[0]}|${emprestimo.status}`));
        console.log("\nEmpréstimo cadastrado com sucesso.\n")
        return;
    }
}

export function listarEmprestimosAtivos(mostrarIndex: boolean) {
    // Carrega os empréstimos do sistema.
    const emprestimos = carregarEmprestimos();

    // Para cada empréstimo que tem carregado no sistema, irá retornar o método "mostrarDados" de cada Empréstimo, retornando os dados.
    // É necessário o .trim() para remover os espaços em branco, caso remover essa função, não irá funcionar corretamente o código.
    // O código abaixo faz uma verificação se o Status do Empréstimo é "Não Devolvido".
    if (mostrarIndex) {
        console.log("+======== Empréstimos Ativos ========+\n");
        emprestimos.forEach((emprestimo, index) => {
            if (emprestimo.status.trim() == "Não Devolvido") {
                console.log(`Empréstimo Nº${index+1}:\n${emprestimo.mostrarDados()}`);
            }
        });
        console.log("+====================================+");
    } else {
        console.log("+======== Empréstimos Ativos ========+\n");
        emprestimos.forEach((emprestimo) => {
            if (emprestimo.status.trim() == "Não Devolvido") {
                console.log(emprestimo.mostrarDados());
            }
        });
        console.log("+====================================+");
    }
}

export function listarEmprestimosHistorico() {
    // Carrega os empréstimos do sistema.
    const emprestimos = carregarEmprestimos();

    // Para cada empréstimo que tem carregado no sistema, irá retornar o método "mostrarDados" de cada Empréstimo, retornando os dados.
    console.log("+======== Histórico de Empréstimos ========+\n");
    emprestimos.forEach((emprestimo) => {
        console.log(emprestimo.mostrarDados());
    });
    console.log("+====================================+");
}

export function realizarDevolucao(ind: number) {
    // Carrega os empréstimos do sistema.
    const emprestimos = carregarEmprestimos();

    // Abaixo são apenas verificações pra verificar se o usuário forneceu algum número válido.
    if (ind - 1 < emprestimos.length && !isNaN(ind)) {
        let confirma = teclado(`Você tem certeza que deseja confirmar a devolução do livro ${emprestimos[ind - 1].livro.titulo}? (S/N) `).toLowerCase()
        if (confirma == "s") {
            // É modificado o status do Empréstimo para "Devolvido", é necessário o [ind-1] para acessar o index corretamente.
            // Pois ao mostrar o número de todos livros, foi adicionado +1.
            emprestimos[ind - 1].status = "Devolvido";
            console.log("Status alterado para Devolvido.")
        } else {
            // Caso o usuário cancelar, será cancelado a ação.
            console.log("Ação cancelada.")
        }
        // Salva o empréstimo no sistema com o padrão: livro.isbn | membro.matricula | dataEmprestimo | dataDevolucao | status
        salvarDados('Dados/emprestimos.txt', emprestimos.map(emprestimo => `${emprestimo.livro.isbn}|${emprestimo.membro.matricula}|${emprestimo.dataEmprestimo.toISOString().split('T')[0]}|${emprestimo.dataDevolucao.toISOString().split('T')[0]}|${emprestimo.status}`));
    } else {
        console.log("Nº do Empréstimo não encontrado no sistema.")
        return;
    }
}