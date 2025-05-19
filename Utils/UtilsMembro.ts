import prompt from "prompt-sync";
import { Membro } from "../Classes/Membro";
import { carregarMembros, salvarDados } from "../Dados/Dados";

const teclado = prompt();

// Em todas funções foi utilizado "export" para ser possivel utilizar essas funções nos menus correspondentes.

// Função para cadastrar novos membros no sistema.
export function cadastrarMembro(nome: string, matricula: string, endereco: string, telefone: string) {

    // Verificação: Caso algum campo esteja vazio, não será feito o cadastro.
    if (nome == "" || matricula == "" || endereco == "" || telefone == "") {
        console.log("\nInforme os dados necessários.\n");
        return;
    }

    // Carrega todos os membros do sistema.
    const membros = carregarMembros();

    // Procura se já há algum membro cadastrado no sistema com a mesma matrícula.
    const membroExistente = membros.find(membro => membro.matricula.toLowerCase() === matricula.toLowerCase());
    if (membroExistente) {
        console.log("\nMatrícula já cadastrada. Por favor, use uma matrícula diferente.\n");
        return;
    }

    // Cria um novo objeto "Membro", informando os dados que o usuário colocou.
    const membro = new Membro(nome, matricula, endereco, telefone);

    // Adiciona o novo membro.
    membros.push(membro);

    // Salva os membros no sistema com o padrão: nome | matricula | endereço | telefone
    salvarDados('Dados/membros.txt', membros.map(membro => `${membro.nome}|${membro.matricula}|${membro.endereco}|${membro.telefone}`));
    console.log("\nCadastro realizado com sucesso.\n");
    return;
}

// Função para listar todos os Membros.
export function listarMembros() {
    // Carrega todos os membros do sistema.
    const membros = carregarMembros();

    // Se não tiver nenhum membro cadastrado, irá dar um aviso.
    if(membros.length == 0) {
        console.log("Não há nenhum membro registrado.")
        return;
    }

    // A cada membro cadastrado, será utilizado o método mostrarDados() da classe Membro, retornando os dados.
    console.log("+======== Membros Cadastrados ========+\n");
    membros.forEach((membro) => {
        console.log(membro.mostrarDados());
    });
    console.log("+====================================+");
}

// Função para excluir algum membro.
export function excluirMembro(matriculaExcluir: string) {
    // Carrega todos os membros do sistema.
    const membros = carregarMembros();

    // Processo para checar se existe algum membro com o número de matrícula informado.
    let ind = membros.findIndex(membro => membro.matricula.toLowerCase() === matriculaExcluir.toLowerCase());

    // Caso encontrar o membro com a matrícula correspondente, efetua o processo de exclusão.
    if (ind !== -1) {
        let confirmar = teclado(`Você tem certeza que deseja remover o membro ${membros[ind].nome} (S/N)? `).toLowerCase();
        if (confirmar == "s") {
            // Caso o usuário confirmar, será removido o membro do Array.
            membros.splice(ind, 1);

            // Salva os membros no sistema com o padrão: nome | matricula | endereço | telefone
            salvarDados('Dados/membros.txt', membros.map(membro => `${membro.nome}|${membro.matricula}|${membro.endereco}|${membro.telefone}`));
            console.log("\nMembro removido com sucesso.");
        } else {
            console.log("\nAção cancelada.");
        }
    } else {
        console.log("Matrícula não encontrada no sistema.")
        return;
    }
}

// Função para mostrar as informações ao modificar algum membro.
export function selectInfoMembro() {
    console.log("+======== Att. Informações de Membros ========+\n");
    console.log("Escolha abaixo o campo que deseja alterar:")
    console.log("1- Alterar Nome")
    console.log("2- Alterar Matrícula")
    console.log("3- Alterar Endereço")
    console.log("4- Alterar Telefone")
    console.log("\n+======== Att. Informações de Membros ========+");
}

// Função para alterar informações.
export function attInformacoesMembros(numMatricula: string, opcao: number, campo: string) {
    // Carrega todos os membros do sistema.
    const membros = carregarMembros();

    // Processo para checar se existe algum membro com o número de matrícula informado.
    let ind = membros.findIndex(membro => membro.matricula.toLowerCase() === numMatricula.toLowerCase());

    // Caso encontrar o membro com a matrícula correspondente, efetua o processo de modificação.
    if (ind !== -1) {
        if (opcao == 1) {
            membros[ind].nome = campo;

            console.log("Nome alterado com sucesso.")
        } else if (opcao == 2) {
            // Verifica se já existe algum membro com a nova matrícula
            let matriculaExistente = membros.some(membro => membro.matricula.toLowerCase() === campo.toLowerCase());

            if (matriculaExistente) {
                console.log("\nJá existe um membro com essa matrícula.\n");
                return;
            }

            membros[ind].matricula = campo;

            console.log("Matrícula alterada com sucesso.")
        } else if (opcao == 3) {
            membros[ind].endereco = campo;

            console.log("Endereço alterado com sucesso.")
        } else if (opcao == 4) {
            membros[ind].telefone = campo;

            console.log("Telefone alterado com sucesso.")
        }

        // Salva os membros no sistema com o padrão: nome | matricula | endereço | telefone
        salvarDados('Dados/membros.txt', membros.map(membro => `${membro.nome}|${membro.matricula}|${membro.endereco}|${membro.telefone}`));

    } else {
        console.log("Matrícula não encontrada.")
        return;
    }
}