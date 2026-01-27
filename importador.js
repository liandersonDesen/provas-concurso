function importarCSV() {
    const input = document.getElementById("inputCSV");
    const file = input.files[0];

    if (!file) {
        alert("Selecione um arquivo CSV primeiro");
        return;
    }

    // Usando PapaParse para ler o arquivo com segurança
    Papa.parse(file, {
        header: true,         // Usa a primeira linha (Questao, Enunciado...) como chaves
        skipEmptyLines: true, // Ignora linhas vazias
        encoding: "UTF-8",
        complete: function(results) {
            const dadosExtraidos = results.data;
            
            // Converte o formato do PapaParse para o formato que sua preencherProva espera
            const questoesFormatadas = dadosExtraidos.map(linha => {
                return {
                    enunciado: linha.Enunciado,
                    alternativas: [
                        linha.A,
                        linha.B,
                        linha.C,
                        linha.D,
                        linha.E
                    ],
                    correta: linha.Resposta ? linha.Resposta.trim().toUpperCase() : "A"
                };
            });

            // Chama a função para injetar na tela
            preencherProva("PROVA IMPORTADA DO CSV", questoesFormatadas);
        },
        error: function(err) {
            alert("Erro ao ler o arquivo: " + err.message);
        }
    });
}

function preencherProva(nomeDaProva, questoes) {
    // 1. Limpa o que já existe para não duplicar
    document.getElementById("listaQuestoes").innerHTML = "";
    qtdQuestoes = 0; // Reset da variável global que está no HTML
    
    // 2. Abre a janela manual para o usuário ver as questões
    if (typeof selecionarMetodo === "function") {
        selecionarMetodo('manual');
    }

    document.getElementById("inputNomeProva").value = nomeDaProva;

    questoes.forEach((q, index) => {
        // Chama a função que cria o HTML da questão (que está no seu HTML principal)
        adicionarNovaQuestao();

        // Pega a caixa que acabou de ser criada
        const boxes = document.querySelectorAll(".questao-box");
        const questaoAtual = boxes[boxes.length - 1];

        // Preenche o enunciado
        questaoAtual.querySelector(".enunciado").value = q.enunciado || "";

        // Preenche as alternativas
        const inputs = questaoAtual.querySelectorAll(".opt");
        q.alternativas.forEach((alt, i) => {
            if (inputs[i]) inputs[i].value = alt || "";
        });

        // Define a resposta correta no select
        const select = questaoAtual.querySelector(".correta");
        const mapa = { A: 0, B: 1, C: 2, D: 3, E: 4 };
        
        if (select) {
            select.value = mapa[q.correta] !== undefined ? mapa[q.correta] : 0;
        }
    });

    alert(questoes.length + " questões importadas com sucesso!");
}