'use strict'

// Funções para abrir e fechar os modais
const openModal = () => document.getElementById('modal').classList.add('active');
const openModal2 = () => document.getElementById('modal2').classList.add('active');

const closeModal2 = () => {
    document.getElementById('modal2').classList.remove('active');
};

const closeModal = () => {
    clearFields();
    document.getElementById('modal').classList.remove('active');
};

// Manipulação de armazenamento local
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_estoque')) ?? [];
const setLocalStorage = (dbEstoque) => localStorage.setItem("db_estoque", JSON.stringify(dbEstoque));

// CRUD - criar, ler, atualizar e excluir
const deleteEstoque = (index) => {
    const dbEstoque = readEstoque();
    dbEstoque.splice(index, 1);
    setLocalStorage(dbEstoque);
};

const updateEstoque = (index, estoque) => {
    const dbEstoque = readEstoque();
    dbEstoque[index] = estoque;
    setLocalStorage(dbEstoque);
};

const readEstoque = () => getLocalStorage();

const createEstoque = (estoque) => {
    const dbEstoque = getLocalStorage();
    dbEstoque.push(estoque);
    setLocalStorage(dbEstoque);
};

// Validação dos campos do formulário
const isValidFields = () => {
    return document.getElementById('form').reportValidity();
};

// Limpar campos do formulário
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach(field => field.value = "");
    document.getElementById('codigo').dataset.index = 'new';
};

// Salvar informações de estoque
const saveEstoque = () => {
    if (isValidFields()) {
        const estoque = {
            codigo: document.getElementById('codigo').value,
            nome: document.getElementById('nome').value,
            categoria: document.getElementById('categoria').value,
            quantidade: document.getElementById('quantidade').value,
            preco: document.getElementById('preco').value
        };
        const index = document.getElementById('codigo').dataset.index;
        if (index == 'new') {
            createEstoque(estoque);
            updateTable();
            closeModal();
        } else {
            updateEstoque(index, estoque);
            updateTable();
            closeModal();
        }
    }
};

// Criação de uma nova linha na tabela
const createRow = (estoque, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${estoque.codigo}</td>
        <td>${estoque.nome}</td>
        <td>${estoque.categoria}</td>
        <td>${estoque.quantidade}</td>
        <td>${estoque.preco}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>
    `;
    document.querySelector('#tableEstoque>tbody').appendChild(newRow);
};

// Limpar tabela
const clearTable = () => {
    const rows = document.querySelectorAll('#tableEstoque>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row));
};

// Atualizar tabela com dados do armazenamento
const updateTable = () => {
    const dbEstoque = readEstoque();
    clearTable();
    dbEstoque.forEach(createRow);
};

// Preencher campos do formulário para edição
const fillFields = (estoque) => {
    document.getElementById('codigo').value = estoque.codigo;
    document.getElementById('nome').value = estoque.nome;
    document.getElementById('categoria').value = estoque.categoria;
    document.getElementById('quantidade').value = estoque.quantidade;
    document.getElementById('preco').value = estoque.preco;

    document.getElementById('codigo').dataset.index = estoque.index;
};

// Editar informações de estoque
const editEstoque = (index) => {
    const estoque = readEstoque()[index];
    estoque.index = index;
    fillFields(estoque);
    openModal();
};

// Excluir informações de estoque
const editDelete = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-');

        if (action == 'edit') {
            editEstoque(index);
        } else {
            const estoque = readEstoque()[index];
            let avisoDelete = document.querySelector('#avisoDelete');

            avisoDelete.textContent = `Deseja realmente excluir o item ${estoque.nome}?`;
            openModal2();

            // Apagar o registro
            document.getElementById('apagar').addEventListener('click', () => {
                deleteEstoque(index);
                updateTable();
                closeModal2();
            });
        }
    }
};

// Inicializar a tabela ao carregar a página
updateTable();

// Eventos
document.getElementById('cadastrarProduto')
    .addEventListener('click', openModal);

document.getElementById('modalClose')
    .addEventListener('click', closeModal);

// Modal apagar
document.getElementById('modalClose2')
    .addEventListener('click', closeModal2);

document.getElementById('salvar')
    .addEventListener('click', saveEstoque);

document.querySelector('#tableEstoque>tbody')
    .addEventListener('click', editDelete);

document.getElementById('cancelar')
    .addEventListener('click', closeModal);

// Modal apagar
document.getElementById('cancelar2')
    .addEventListener('click', closeModal2);
