import prompt from "prompt-sync";
import { menuPrincipal } from "../Main";
import { attInformacoesMembros, cadastrarMembro, excluirMembro, listarMembros, selectInfoMembro } from "../Utils/UtilsMembro";
import { carregarMembros } from "../Dados/Dados";

const teclado = prompt();

// É necessário exportar a função pois é utilizado no MenuPrincipal.ts
export function menuMembros() {
    console.log("+======== Menu de Membros ========+");
    console.log("|1 - Cadastrar Membro.            |");
    console.log("|2 - Listar membros cadastrados.  |");
    console.log("|3 - Atualizar info. de membros   |");
    console.log("|4 - Remover cadastro de membros. |");
    console.log("|0 - Retornar ao Menu Principal.  |");
    console.log("+======== Menu de Membros ========+");

    const opcao = +teclado('Escolha uma opção: ');
    if (opcao === 0) {
        return menuPrincipal();
    }
    switch (opcao) {
        case 1:
            // Perguntas necessárias para o cadastro de um emmbro.
            let nome = teclado("Digite seu nome e sobrenome: ");
            let matricula = teclado("Digite sua matrícula: ");
            let endereco = teclado("Digite seu endereço: ");
            let telefone = teclado("Digite seu telefone: ");

            cadastrarMembro(nome, matricula, endereco, telefone);
            break;

        case 2:
            listarMembros();
            break;

        case 3:
            // Carrega todos membros e lista-os.
            const membros = carregarMembros();
            listarMembros();

            // Aqui irá fazer uma verificação se existe o membro realmente, através do número de matrícula.
            let matriculaMembro = teclado("Qual o Nº de matrícula do membro que você deseja atualizar as informações? ")
            let ind = membros.findIndex(membro => membro.matricula.toLowerCase() === matriculaMembro.toLowerCase());

            // Caso não encontrar o membro com a matrícula correspondente, irá cancelar a ação.
            if (ind == -1) {
                console.log("Matrícula não encontrada.");
                return;
            }

            selectInfoMembro();
            let opcao = +teclado("Qual o campo você deseja alterar? ")
            let campo = teclado("Qual será a nova informação que deseja por: ")

            attInformacoesMembros(matriculaMembro, opcao, campo);
            break;

        case 4:
            listarMembros();

            let matriculaExcluir = teclado("Qual o Nº de matrícula do membro que deseja remover? ")
            excluirMembro(matriculaExcluir);
            break;

        default:
            console.log('Opção inválida!');
            break;
    }
}
