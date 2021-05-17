//Inputs
let sectionHTML = document.querySelector('section')
let nomeCliente = document.getElementById('nomeCliente')
let nomeAnuncio = document.getElementById('nomeAnuncio')
let dataInicioAnuncio = document.getElementById('dataInicio')
let dataTerminoAnuncio = document.getElementById('dataTermino')
let investimentoDiario = document.getElementById('investimentoDiario')
let btnAdicionar = document.querySelector('button#btn-adicionar')
let btnOrdernar = document.querySelector('button#btn-ordenar-cliente')

btnAdicionar.onclick = validaFormulario
btnOrdernar.onclick = ordenaListaPorCliente

let arrayAnuncios = getLocalStorage() || []
exibeTabelaAnuncios()

function validaFormulario() {
    if (!nomeCliente.value || !nomeAnuncio.value || !dataInicioAnuncio.value || !dataTerminoAnuncio.value || !investimentoDiario.value) {
        alert('Todos os campos são obrigatórios')
    } else if (!validaDatasInformadas()) {
        alert('A data de início menor que a data de término')
        } else {
            addItemLista()
        }
}

// Valida se a data de início do anúnco é anterior a data de término informada
function validaDatasInformadas() {
    const dataInicial = dataInicioAnuncio.value.split('-')
    const dataFinal = dataTerminoAnuncio.value.split('-')
    
    const diaInicial = dataInicial[2]
    const mesInicial = dataInicial[1]
    const anoInicial = dataInicial[0]

    const diaFinal = dataFinal[2]
    const mesFinal = dataFinal[1]
    const anoFinal = dataFinal[0]

    const data1 = new Date(anoInicial, mesInicial - 1, diaInicial)
    const data2 = new Date(anoFinal, mesFinal - 1, diaFinal)

    if (data1.getTime() > data2.getTime()) {
        return false
    } else {
        return true
    }
}

// Adiciona os anúncios cadastrados em um array
function addItemLista() {
    let anuncio = {
        nomeCliente: nomeCliente.value,
        nomeAnuncio: nomeAnuncio.value,
        dataInicial: converteData(dataInicioAnuncio.value),
        dataTermino: converteData(dataTerminoAnuncio.value),
        investimentoDiario: investimentoDiario.value,
        maximoVisualizacoes: projetaVisualizacaoMaxima(investimentoDiario.value),
        maximoCliques: projetaVisualizacaoMaxima(investimentoDiario.value) * 0.12,
        maximoCompartilhamentos: (projetaVisualizacaoMaxima(investimentoDiario.value) * 0.12) * 0.15,
        investimentoTotal: diasEntreDatas(dataInicioAnuncio.value, dataTerminoAnuncio.value) * investimentoDiario.value
    }
    arrayAnuncios.push(anuncio)
    exibeTabelaAnuncios()   // Carrega a tabela com os anúncios cadastrados
    setLocalStorage(arrayAnuncios) // Grava no armazenamento local
    limpaInputs() // Limpa todos os inputs da tela
}

// Monta uma tabela HTML com todos os anúncios que foram cadastrados
function exibeTabelaAnuncios() {
    var html = `<table border='1|1'><tr><th>Nome cliente</th><th>Nome anúncio</th>
                <th>Data início</th><th>Data término</th><th>Investimento diário</th>
                <th>Views por dia</th><th>Cliques por dia</th>
                <th>Compartilhamentos por dia</th><th>Valor total investido</th><th>Excluir</th></tr>`

    for (var i = 0; i < arrayAnuncios.length; i++) {
        html+=`<td> ${arrayAnuncios[i].nomeCliente} </td>`
        html+=`<td> ${arrayAnuncios[i].nomeAnuncio} </td>`
        html+=`<td> ${arrayAnuncios[i].dataInicial} </td>`
        html+=`<td> ${arrayAnuncios[i].dataTermino} </td>`
        html+=`<td> ${arrayAnuncios[i].investimentoDiario} </td>`
        html+=`<td> ${arrayAnuncios[i].maximoVisualizacoes} </td>`
        html+=`<td> ${arrayAnuncios[i].maximoCliques} </td>`
        html+=`<td> ${arrayAnuncios[i].maximoCompartilhamentos} </td>`
        html+=`<td> ${arrayAnuncios[i].investimentoTotal} </td>`
        html+=`<td> <a href="#" onclick="deleteItemLista(${i})">Excluir</a> </td>`
        html+=`</tr>`
    }
    html+=`</table>`
    sectionHTML.innerHTML = html
}

// Calcula a quantidade de dias entre as datas de início e término
function diasEntreDatas(data1, data2) {
    var date1 = new Date(data1)
    var date2 = new Date(data2)
    var timeDiff = Math.abs(date2.getTime() - date1.getTime())
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
    return diffDays
}

// Converte as datas do input HTML do formato AAAA-MM-DD para DD/MM/AAAA
function converteData(date){
    const data = date.split('-')
    const dia = data[2]
    const mes = data[1]
    const ano = data[0]
    const dataFinal = `${dia}/${mes}/${ano}`
    return dataFinal
}

// Deleta do array de eventos o objeto da posição especificada
function deleteItemLista(index) {
    arrayAnuncios.splice(index, 1)
    exibeTabelaAnuncios()
    setLocalStorage()
}

// Limpa todos os inputs da tela
function limpaInputs() {
    let inputs = document.querySelectorAll('input')
    for (const input of inputs) {
        input.value = ''
    }
}

function setLocalStorage() {
    localStorage.setItem('lista_anuncios', JSON.stringify(arrayAnuncios))
}

function getLocalStorage() {
    return JSON.parse(localStorage.getItem('lista_anuncios'))
}

function ordenaListaPorCliente() {
    arrayAnuncios.sort(function (a, b) {
        var nomeA = a.nomeCliente.toUpperCase()
        var nomeB = b.nomeCliente.toUpperCase()
        if (nomeA < nomeB) {
            return -1
        }
        if (nomeA > nomeB) {
            return 1
        }
        // Nomes iguais
        return 0
    });
    exibeTabelaAnuncios()
}

function ciclo(visualizacoes){
    // a cada 100 pessoas que visualizam o anúncio 12 clicam nele.
    const quantosClicam = visualizacoes * 0.12
    // a cada 20 pessoas que clicam no anúncio 3 compartilham nas redes sociais.
    const quantosCompartilham = quantosClicam * 0.15
    // cada compartilhamento nas redes sociais gera 40 novas visualizações.
    const compartilhamentoParaVisualizacao = quantosCompartilham * 40
    return compartilhamentoParaVisualizacao
}

function projetaVisualizacaoMaxima(investimento) {
    // 30 pessoas visualizam o anúncio original (não compartilhado) a cada R$ 1,00 investido.
    let visualizacaoInicial = investimento * 30
    let visualizacaoMaxima = visualizacaoInicial

    if (visualizacaoInicial >= 100) {
        const primeiroCiclo = ciclo(visualizacaoInicial)
        const segundoCiclo = ciclo(primeiroCiclo)
        const terceiroCiclo = ciclo(segundoCiclo)
        const quartoCiclo = ciclo(terceiroCiclo)
        visualizacaoMaxima += Math.floor(primeiroCiclo + segundoCiclo + terceiroCiclo + quartoCiclo)
    }

    return visualizacaoMaxima
}
