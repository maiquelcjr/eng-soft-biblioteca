import prompt from "prompt-sync";
import { menuLivros } from "./Menu/MenuLivros";
import { menuMembros } from "./Menu/MenuMembros";
import { menuEmprestimos } from "./Menu/MenuEmprestimos";

const teclado = prompt();

// É necessário exportar a função pois é utilizado em outros menus.
export function menuPrincipal() {
    console.log("+======== Biblioteca SenaGluz ========+");
    console.log("|1 - Menu de Livros                   |");
    console.log("|2 - Menu de Membros                  |");
    console.log("|3 - Menu de Empréstimos              |");
    console.log("|0 - Sair                             |");
    console.log("+======== Biblioteca SenaGluz ========+");
    console.log();

    const opcao = +teclado('Escolha uma opção: ');
    if (opcao === 0) {
        return;
    }
    switch (opcao) {
        case 1:
            menuLivros();
            break;

        case 2:
            menuMembros();
            break;

        case 3:
            menuEmprestimos();
            break;

        default:
            console.log('Opção inválida!');
            break;
    }
    menuPrincipal();
}

menuPrincipal();
