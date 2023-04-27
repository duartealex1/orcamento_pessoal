
class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    validarDados(){
        for(let i in this){
            if(this[i] == undefined ||this[i] == '' ||this[i] == null){
                return false
            }
         }   
        return true
            
       
    }
}

class Bd {
    constructor(){
        let id = localStorage.getItem('id')
        if(id === null){
            localStorage.setItem('id', 0)
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(d){
       
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    recuperarRegistros(){
        let despesas = Array()
        
        let id = localStorage.getItem('id')

        //recuperar despesas cadastradas
        for(let i = 1; i<=id; i++){
            let despesa = (JSON.parse(localStorage.getItem(i)))
            //despesa removida - ação: pular despesa
            if(despesa === null){
                continue
            }
            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }
    pesquisar(despesa){
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarRegistros()
       
        //ano
        if(despesa.ano != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
           // console.log(despesasFiltradas)
        }
        //mês
        if(despesa.mes != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
           // console.log(despesasFiltradas)
        }
        //dia
        if(despesa.dia != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        //tipo
        if(despesa.tipo != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        //descrição
        if(despesa.descricao != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
            
        }
        return despesasFiltradas

    }
    removerDespesa(id){
        localStorage.removeItem(id)
    }
}
let bd = new Bd()

function cadastrarDespesa(){
    let ano = document.querySelector('#ano')
    let mes = document.querySelector('#mes')
    let dia = document.querySelector('#dia')
    let tipo = document.querySelector('#tipo')
    let descricao = document.querySelector('#descricao')
    let valor = document.querySelector('#valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    let h1 = document.getElementById('exampleModalLabel')
    let div_Modal = document.getElementById('mensagemModal')
    let msg = document.getElementById('btnModal')
    let divCorModal = document.getElementById('corDivModal')

    if(despesa.validarDados()){
        bd.gravar(despesa)

        h1.innerText = `Registro feito com sucesso!` 
        div_Modal.innerText = 'Despesa incluida com sucesso!'
        msg.innerText = 'Voltar'

        msg.className ='btn btn-success'
        divCorModal.className = 'modal-header text-success'

        $('#modalRegistraDespesa').modal('show')
        // apagando formulário após preeenchimento
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value= ''
        valor.value = ''
    } else {
        
        
        h1.innerText = `Erro na Gravação` 
        div_Modal.innerText = 'Existem campos que ainda não foram preenchidos!'
        msg.innerText = 'Voltar e Corrigir'

        msg.className ='btn btn-danger'
        divCorModal.className = 'modal-header text-danger'

        $('#modalRegistraDespesa').modal('show')
    }
    

    
   
}
// página de Consulta
function carregaListaDespesa(despesas = Array(), filtro = false){
    if(despesas.length == 0 && filtro == false){
    despesas = bd.recuperarRegistros()
    }

    //criar tabela com elementos da despesa
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''
    despesas.forEach(d =>{ 
        //console.log(d)
        let linha = listaDespesas.insertRow()//tr
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`//td
        switch (d.tipo){
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }
        linha.insertCell(1).innerHTML = d.tipo//td
        linha.insertCell(2).innerHTML = d.descricao//td
        linha.insertCell(3).innerHTML = d.valor//td

        //criar botão de exclusão
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class= "fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function (){
            
            let id = this.id.replace('id_despesa_', '')
            console.log(id)
            //alert(id)
            
           bd.removerDespesa(id)
           window.location.reload()
        }
        linha.insertCell(4).append(btn)
    })
}
    function pesquisarDespesas(){
        let ano = document.querySelector('#ano').value
        let mes = document.querySelector('#mes').value
        let dia = document.querySelector('#dia').value
        let tipo = document.querySelector('#tipo').value
        let descricao = document.querySelector('#descricao').value
        let valor = document.querySelector('#valor').value

        let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

        let despesas = bd.pesquisar(despesa)

        carregaListaDespesa(despesas, true)
        // let listaDespesas = document.getElementById('listaDespesas')
        // listaDespesas.innerHTML = ''
        // despesas.forEach(d =>{ 
        //     //console.log(d)
        //     let linha = listaDespesas.insertRow()//tr
        //     linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`//td
        //     switch (d.tipo){
        //         case '1': d.tipo = 'Alimentação'
        //             break
        //         case '2': d.tipo = 'Educação'
        //             break
        //         case '3': d.tipo = 'lazer'
        //             break
        //         case '4': d.tipo = 'Saúde'
        //             break
        //         case '5': d.tipo = 'Transporte'
        //             break
        //     }
        //     linha.insertCell(1).innerHTML = d.tipo//td
        //     linha.insertCell(2).innerHTML = d.descricao//td
        //     linha.insertCell(3).innerHTML = d.valor//td
        // })
        
        
    }



