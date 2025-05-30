document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formPaciente");
    const tabela = document.getElementById("tabeladadosuser");

    const campoComorbidades = document.getElementById("campoComorbidades");
    const campoAlergias = document.getElementById("campoAlergias");
    const campoResponsavel = document.getElementById("campoResponsavel");
    const dataHoraEntrada = document.getElementById("dataHoraEntrada");

    

    function salvarPacientes(pacientes) {
        localStorage.setItem('pacientes', JSON.stringify(pacientes));
    }

    function carregarPacientes() {
        const dados = localStorage.getItem('pacientes');
        return dados ? JSON.parse(dados) : [];
    }

    function calcularIdade(data) {
        const hoje = new Date();
        const nascimento = new Date(data);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        return idade;
    }

    function atualizarHorario() {
        const elementoHorario = document.getElementById('horario');
        if (!elementoHorario) return;

        const agora = new Date();
        const horas = String(agora.getHours()).padStart(2, '0');
        const minutos = String(agora.getMinutes()).padStart(2, '0');
        const segundos = String(agora.getSeconds()).padStart(2, '0');
        elementoHorario.textContent = `${horas}:${minutos}:${segundos}`;
    }

    setInterval(atualizarHorario, 1000);
    atualizarHorario();

    document.querySelectorAll('input[name="comorbidades"]').forEach(radio => {
        radio.addEventListener("change", function () {
            campoComorbidades.style.display = this.value === "Sim" ? "block" : "none";
        });
    });

    document.querySelectorAll('input[name="alergias"]').forEach(radio => {
        radio.addEventListener("change", function () {
            campoAlergias.style.display = this.value === "Sim" ? "block" : "none";
        });
    });

    document.getElementById("data-nascimento").addEventListener("change", function () {
        const idade = calcularIdade(this.value);
        campoResponsavel.style.display = (idade < 18 || idade > 65) ? "block" : "none";
    });

    dataHoraEntrada.value = new Date().toLocaleString();

    let pacientes = carregarPacientes();

    function adicionarPacienteTabela(paciente) {
        const novaLinha = document.createElement("tr");

        const colunaNome = document.createElement("td");
        colunaNome.textContent = paciente.nome;

        const colunaIdade = document.createElement("td");
        colunaIdade.textContent = paciente.idade;

        const colunaAcoes = document.createElement("td");

        const botaoDetalhes = document.createElement("button");
        botaoDetalhes.textContent = "Ver Detalhes";
        botaoDetalhes.classList.add("button");

        botaoDetalhes.addEventListener("click", function () {
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

        const botaoEditar = document.createElement("button");
        botaoEditar.textContent = "Editar";
        botaoEditar.classList.add("button");
        botaoEditar.style.marginLeft = "10px";

        botaoEditar.addEventListener("click", function () {
            document.getElementById("nome").value = paciente.nome;
            document.getElementById("data-nascimento").value = paciente.dataNascimento;
            document.getElementById("cpf").value = paciente.cpf;
            document.getElementById("sintomas").value = paciente.sintomas;
            document.getElementById("grau-urgencia").value = paciente.grauUrgencia;
            document.getElementById("estadoCivil").value = paciente.estadoCivil;
            document.getElementById("profissao").value = paciente.profissao;

            const radiosSexo = document.getElementsByName("sexo");
            for (let radio of radiosSexo) {
                radio.checked = (radio.value === paciente.sexo);
            }

            const radiosComorb = document.getElementsByName("comorbidades");
            for (let radio of radiosComorb) {
                radio.checked = (radio.value === paciente.comorbidade);
            }
            campoComorbidades.value = paciente.textoComorbidade;
            campoComorbidades.style.display = paciente.comorbidade === "Sim" ? "block" : "none";

            const radiosAlerg = document.getElementsByName("alergias");
            for (let radio of radiosAlerg) {
                radio.checked = (radio.value === paciente.alergia);
            }
            campoAlergias.value = paciente.textoAlergia;
            campoAlergias.style.display = paciente.alergia === "Sim" ? "block" : "none";

            if (paciente.idade < 18 || paciente.idade > 65) {
                document.getElementById("nomeResponsavel").value = paciente.nomeResponsavel;
                document.getElementById("telefoneResponsavel").value = paciente.telefoneResponsavel;
                campoResponsavel.style.display = "block";
            } else {
                campoResponsavel.style.display = "none";
            }

            novaLinha.remove();
            pacientes = pacientes.filter(p => p.id !== paciente.id);
            salvarPacientes(pacientes);
        });

        const botaoApagar = document.createElement("button");
        botaoApagar.textContent = "Apagar";
        botaoApagar.classList.add("button");
        botaoApagar.style.marginLeft = "10px";

        botaoApagar.addEventListener("click", function () {
            const confirmacao = confirm(`Tem certeza que deseja apagar a ficha de ${paciente.nome}?`);
            if (confirmacao) {
                novaLinha.remove();
                pacientes = pacientes.filter(p => p.id !== paciente.id);
                salvarPacientes(pacientes);
            }
        });

        colunaAcoes.appendChild(botaoDetalhes);
        colunaAcoes.appendChild(botaoEditar);
        colunaAcoes.appendChild(botaoApagar);

        novaLinha.appendChild(colunaNome);
        novaLinha.appendChild(colunaIdade);
        novaLinha.appendChild(colunaAcoes);

        tabela.appendChild(novaLinha);
    }

    pacientes.forEach(paciente => {
        adicionarPacienteTabela(paciente);
    });

        form.addEventListener("submit", function (event) {
        event.preventDefault();

        const nome = document.getElementById("nome").value;
        const dataNascimento = document.getElementById("data-nascimento").value;
        const cpf = document.getElementById("cpf").value;

        // ✅ VALIDAÇÃO DE CPF COMPLETO
        if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) {
            alert("Por favor, preencha o CPF corretamente com todos os números (ex: 000.000.000-00).");
            return;
        }

        const sintomas = document.getElementById("sintomas").value;
        const grauUrgencia = document.getElementById("grau-urgencia").value;
        const sexoSelecionado = document.querySelector('input[name="sexo"]:checked');
        const sexo = sexoSelecionado ? sexoSelecionado.value : "Não informado";

        const idade = calcularIdade(dataNascimento);
        const estadoCivil = document.getElementById("estadoCivil").value;
        const profissao = document.getElementById("profissao").value;

        const comorbidade = document.querySelector('input[name="comorbidades"]:checked').value;
        const textoComorbidade = comorbidade === "Sim" ? campoComorbidades.value : "Nenhuma";

        const alergia = document.querySelector('input[name="alergias"]:checked').value;
        const textoAlergia = alergia === "Sim" ? campoAlergias.value : "Nenhuma";

        const dataEntrada = dataHoraEntrada.value;

        let nomeResponsavel = "";
        let telefoneResponsavel = "";
        if (idade < 18 || idade > 65) {
            nomeResponsavel = document.getElementById("nomeResponsavel").value;
            telefoneResponsavel = document.getElementById("telefoneResponsavel").value;
        }

        const idPaciente = Date.now() + Math.floor(Math.random() * 1000);

        const paciente = {
            id: idPaciente,
            nome,
            dataNascimento,
            cpf,
            sintomas,
            grauUrgencia,
            sexo,
            idade,
            estadoCivil,
            profissao,
            comorbidade,
            textoComorbidade,
            alergia,
            textoAlergia,
            dataEntrada,
            nomeResponsavel,
            telefoneResponsavel
        };

        pacientes.push(paciente);
        salvarPacientes(pacientes);
        adicionarPacienteTabela(paciente);

        form.reset();
        campoComorbidades.style.display = "none";
        campoAlergias.style.display = "none";
        campoResponsavel.style.display = "none";
        dataHoraEntrada.value = new Date().toLocaleString();
    });

    document.addEventListener("DOMContentLoaded", function () {
    const pacienteEditandoId = localStorage.getItem("pacienteEditandoId");
    let pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];

    if (pacienteEditandoId) {
        const pacienteParaEditar = pacientes.find(p => p.id == pacienteEditandoId);
        if (pacienteParaEditar) {
            preencherFormularioParaEdicao(pacienteParaEditar);
            document.getElementById("Buttonfinalizarcad").textContent = "Atualizar Ficha";
        }
    }

    const form = document.getElementById("formPaciente");
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const novoPaciente = capturarDadosDoFormulario();
        if (!novoPaciente) return;

        if (pacienteEditandoId) {
            // Atualiza ficha existente
            pacientes = pacientes.map(p => p.id == pacienteEditandoId ? novoPaciente : p);
            localStorage.removeItem("pacienteEditandoId");
        } else {
            // Cria ficha nova
            pacientes.push(novoPaciente);
        }

        localStorage.setItem("pacientes", JSON.stringify(pacientes));
        window.location.href = "fichas.html";
    });
    });

    const campoCPF = document.getElementById("cpf");

    campoCPF.addEventListener("input", function (e) {
        let valor = e.target.value;

        // Remove tudo que não for número
        valor = valor.replace(/\D/g, "");

        // Aplica a máscara de CPF
        if (valor.length > 3 && valor.length <= 6) {
            valor = valor.replace(/(\d{3})(\d+)/, "$1.$2");
        } else if (valor.length > 6 && valor.length <= 9) {
            valor = valor.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
        } else if (valor.length > 9) {
            valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, "$1.$2.$3-$4");
        }

        // Limita o número máximo de caracteres
        valor = valor.substring(0, 14);

        e.target.value = valor;
    });

    

});
