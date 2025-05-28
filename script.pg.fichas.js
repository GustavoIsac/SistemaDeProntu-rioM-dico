document.addEventListener("DOMContentLoaded", function () {
    const tabela = document.querySelector("#tabelaPacientes tbody");

    function carregarPacientes() {
        const dados = localStorage.getItem('pacientes');
        return dados ? JSON.parse(dados) : [];
    }

    function salvarPacientes(pacientes) {
        localStorage.setItem('pacientes', JSON.stringify(pacientes));
    }

    function exibirPacientes(pacientes) {
        tabela.innerHTML = "";

        pacientes.forEach(paciente => {
            const linha = document.createElement("tr");

            const colunaNome = document.createElement("td");
            colunaNome.textContent = paciente.nome;

            const colunaIdade = document.createElement("td");
            colunaIdade.textContent = paciente.idade;

            const colunaAcoes = document.createElement("td");

            const btnDetalhes = document.createElement("button");
            btnDetalhes.textContent = "Ver Detalhes";
            btnDetalhes.addEventListener("click", function () {
                alert(
                    `Nome: ${paciente.nome}\n` +
                    `Idade: ${paciente.idade}\n` +
                    `CPF: ${paciente.cpf}\n` +
                    `Sexo: ${paciente.sexo}\n` +
                    `Estado Civil: ${paciente.estadoCivil}\n` +
                    `Profissão: ${paciente.profissao}\n` +
                    `Comorbidades: ${paciente.textoComorbidade}\n` +
                    `Alergias: ${paciente.textoAlergia}\n` +
                    `Data/Hora Entrada: ${paciente.dataEntrada}\n` +
                    (paciente.idade < 18 || paciente.idade > 65 ? `Responsável: ${paciente.nomeResponsavel} | Tel: ${paciente.telefoneResponsavel}\n` : "") +
                    `Sintomas: ${paciente.sintomas}\n` +
                    `Grau de Urgência: ${paciente.grauUrgencia}`
                );
            });

            const btnApagar = document.createElement("button");
            btnApagar.textContent = "Apagar";
            btnApagar.style.backgroundColor = "#d9534f";
            btnApagar.addEventListener("click", function () {
                const confirmacao = confirm(`Tem certeza que deseja apagar a ficha de ${paciente.nome}?`);
                if (confirmacao) {
                    let pacientesAtualizados = carregarPacientes().filter(p => p.id !== paciente.id);
                    salvarPacientes(pacientesAtualizados);
                    exibirPacientes(pacientesAtualizados);
                }
            });

            colunaAcoes.appendChild(btnDetalhes);
            // botão Editar removido daqui
            colunaAcoes.appendChild(btnApagar);

            linha.appendChild(colunaNome);
            linha.appendChild(colunaIdade);
            linha.appendChild(colunaAcoes);

            tabela.appendChild(linha);
        });
    }

    const pacientes = carregarPacientes();
    exibirPacientes(pacientes);
    
    function updateDateTime() {
      const dtElem = document.getElementById('datetime');
      const now = new Date();
      const date = now.toLocaleDateString('pt-BR', { weekday:'short', day:'2-digit', month:'short', year:'numeric' });
      const time = now.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
      dtElem.textContent = `${date} • ${time}`;
    }
    updateDateTime();
    setInterval(updateDateTime, 60000);
  
});
