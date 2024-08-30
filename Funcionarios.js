'use strict'

// Funções para abrir e fechar o modal de criação/edição de funcionário
const openModal = () => document.getElementById('modal').classList.add('active')
const closeModal = () => document.getElementById('modal').classList.remove('active')

// Funções para abrir e fechar o modal de informações do funcionário
const openModalInfo = () => document.getElementById('modalInfo').classList.add('active')
const closeModalInfo = () => document.getElementById('modalInfo').classList.remove('active')

// Função para abrir o modal de confirmação de exclusão
const openDeleteModal = () => document.getElementById('modal2').classList.add('active')
const closeDeleteModal = () => document.getElementById('modal2').classList.remove('active')

// Função para abrir o modal de confirmação de exclusão
document.getElementById('cadastrarFuncionario').addEventListener('click', openModal)
document.getElementById('modalClose').addEventListener('click', closeModal)
document.getElementById('cancelar').addEventListener('click', closeModal)

// Função para fechar o modal de informações
document.getElementById('modalCloseInfo').addEventListener('click', closeModalInfo)
document.getElementById('fecharInfo').addEventListener('click', closeModalInfo)

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_funcionario')) ?? []
const setLocalStorage = (dbFuncionario) => localStorage.setItem('db_funcionario', JSON.stringify(dbFuncionario))

// CRUD - create read update delete
const deleteFuncionario = (index) => {
    const dbFuncionario = readFuncionario()
    dbFuncionario.splice(index, 1)
    setLocalStorage(dbFuncionario)
}

const updateFuncionario = (index, funcionario) => {
    const dbFuncionario = readFuncionario()
    dbFuncionario[index] = funcionario
    setLocalStorage(dbFuncionario)
}

const readFuncionario = () => getLocalStorage()

const createFuncionario = (funcionario) => {
    const dbFuncionario = getLocalStorage()
    dbFuncionario.push(funcionario)
    setLocalStorage(dbFuncionario)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

// Interação com o layout
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
}

const saveFuncionario = () => {
    if (isValidFields()) {
        const funcionario = {
            nome: document.getElementById('nome').value,
            matricula: document.getElementById('matricula').value,
            telefone: document.getElementById('telefone').value,
            celular: document.getElementById('celular').value,
            email: document.getElementById('email').value,
            rua: document.getElementById('rua').value,
            numero: document.getElementById('numero').value,
            complemento: document.getElementById('complemento').value,
            cidade: document.getElementById('cidade').value,
            estado: document.getElementById('estado').value,
            cpf: document.getElementById('cpf').value,
            funcao: document.getElementById('funcao').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createFuncionario(funcionario)
            updateTable()
            closeModal()
        } else {
            updateFuncionario(index, funcionario)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (funcionario, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${funcionario.nome}</td>
        <td>${funcionario.matricula}</td>
        <td>${funcionario.cpf}</td>
        <td>${funcionario.funcao}</td>
        <td>${funcionario.celular}</td>
        <td>${funcionario.email}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
            <button type="button" class="button blue" id="info-${index}">Informações</button>
        </td>
    `
    document.querySelector('#tableFuncionario>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableFuncionario>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbFuncionario = readFuncionario()
    clearTable()
    dbFuncionario.forEach(createRow)
}

const fillFields = (funcionario) => {
    document.getElementById('nome').value = funcionario.nome
    document.getElementById('matricula').value = funcionario.matricula
    document.getElementById('telefone').value = funcionario.telefone
    document.getElementById('celular').value = funcionario.celular
    document.getElementById('email').value = funcionario.email
    document.getElementById('rua').value = funcionario.rua
    document.getElementById('numero').value = funcionario.numero
    document.getElementById('complemento').value = funcionario.complemento
    document.getElementById('cidade').value = funcionario.cidade
    document.getElementById('estado').value = funcionario.estado
    document.getElementById('cpf').value = funcionario.cpf
    document.getElementById('funcao').value = funcionario.funcao
    document.getElementById('nome').dataset.index = funcionario.index
}

const editFuncionario = (index) => {
    const funcionario = readFuncionario()[index]
    funcionario.index = index
    fillFields(funcionario)
    openModal()
}

const infoFuncionario = (index) => {
    const funcionario = readFuncionario()[index]
    document.getElementById('infoContent').innerHTML = `
        <p><strong>Nome:</strong> ${funcionario.nome}</p>
        <p><strong>Matrícula:</strong> ${funcionario.matricula}</p>
        <p><strong>CPF:</strong> ${funcionario.cpf}</p>
        <p><strong>Função:</strong> ${funcionario.funcao}</p>
        <p><strong>Telefone:</strong> ${funcionario.telefone}</p>
        <p><strong>Celular:</strong> ${funcionario.celular}</p>
        <p><strong>E-mail:</strong> ${funcionario.email}</p>
        <p><strong>Endereço:</strong> ${funcionario.rua}, ${funcionario.numero}, ${funcionario.complemento}</p>
        <p><strong>Cidade:</strong> ${funcionario.cidade}</p>
        <p><strong>Estado:</strong> ${funcionario.estado}</p>
    `
    openModalInfo()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editFuncionario(index)
        } else if (action == 'delete') {
            const funcionario = readFuncionario()[index]
            document.getElementById('avisoDelete').innerHTML = `
                <p>Tem certeza que deseja excluir o funcionário <strong>${funcionario.nome}</strong>?</p>
            `
            openDeleteModal()
            document.getElementById('apagar').onclick = () => {
                deleteFuncionario(index)
                updateTable()
                closeDeleteModal()
            }
            document.getElementById('cancelar2').onclick = closeDeleteModal
        } else if (action == 'info') {
            infoFuncionario(index)
        }
    }
}

document.getElementById('salvar').addEventListener('click', saveFuncionario)
document.querySelector('#tableFuncionario>tbody').addEventListener('click', editDelete)

updateTable()
