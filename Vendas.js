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
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_venda')) ?? [];
const setLocalStorage = (dbVenda) => localStorage.setItem("db_venda", JSON.stringify(dbVenda));

// CRUD - criar, ler, atualizar e excluir
const deleteVenda = (index) => {
    const dbVenda = readVenda();
    dbVenda.splice(index, 1);
    setLocalStorage(dbVenda);
};

const updateVenda = (index, venda) => {
    const dbVenda = readVenda();
    dbVenda[index] = venda;
    setLocalStorage(dbVenda);
};

const readVenda = () => getLocalStorage();

const createVenda = (venda) => {
    const dbVenda = getLocalStorage();
    dbVenda.push(venda);
    setLocalStorage(dbVenda);
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

// Salvar informações de venda
const saveVenda = () => {
    if (isValidFields()) {
        const venda = {
            codigo: document.getElementById('codigo').value,
            produto: document.getElementById('produto').value,
            categoria: document.getElementById('categoria').value,
            quantidade: document.getElementById('quantidade').value,
            valorUnitario: document.getElementById('valorUnitario').value,
            valorTotal: document.getElementById('valorTotal').value,
            dataVenda: document.getElementById('dataVenda').value
        };
        const index = document.getElementById('codigo').dataset.index;
        if (index == 'new') {
            createVenda(venda);
            updateTable();
            closeModal();
        } else {
            updateVenda(index, venda);
            updateTable();
            closeModal();
        }
    }
};

// Criação de uma nova linha na tabela
const createRow = (venda, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${venda.codigo}</td>
        <td>${venda.produto}</td>
        <td>${venda.categoria}</td>
        <td>${venda.quantidade}</td>
        <td>${venda.valorUnitario}</td>
        <td>${venda.valorTotal}</td>
        <td>${venda.dataVenda}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>
    `;
    document.querySelector('#tableVendas>tbody').appendChild(newRow);
};

// Limpar tabela
const clearTable = () => {
    const rows = document.querySelectorAll('#tableVendas>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row));
};

// Atualizar tabela com dados do armazenamento
const updateTable = () => {
    const dbVenda = readVenda();
    clearTable();
    dbVenda.forEach(createRow);
};

// Preencher campos do formulário para edição
const fillFields = (venda) => {
    document.getElementById('codigo').value = venda.codigo;
    document.getElementById('produto').value = venda.produto;
    document.getElementById('categoria').value = venda.categoria;
    document.getElementById('quantidade').value = venda.quantidade;
    document.getElementById('valorUnitario').value = venda.valorUnitario;
    document.getElementById('valorTotal').value = venda.valorTotal;
    document.getElementById('dataVenda').value = venda.dataVenda;

    document.getElementById('codigo').dataset.index = venda.index;
};

// Editar informações de venda
const editVenda = (index) => {
    const venda = readVenda()[index];
    venda.index = index;
    fillFields(venda);
    openModal();
};

// Excluir informações de venda
const editDelete = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-');

        if (action == 'edit') {
            editVenda(index);
        } else {
            const venda = readVenda()[index];
            let avisoDelete = document.querySelector('#avisoDelete');

            avisoDelete.textContent = `Deseja realmente excluir a venda com código ${venda.codigo}?`;
            openModal2();

            // Apagar o registro
            document.getElementById('apagar').addEventListener('click', () => {
                deleteVenda(index);
                updateTable();
                closeModal2();
            }, { once: true }); // Garantir que o listener é adicionado uma única vez
        }
    }
};

// Inicializar a tabela ao carregar a página
updateTable();

// Eventos
document.getElementById('cadastrarVenda')
    .addEventListener('click', openModal);

document.getElementById('modalClose')
    .addEventListener('click', closeModal);

document.getElementById('modalClose2')
    .addEventListener('click', closeModal2);

document.getElementById('salvar')
    .addEventListener('click', saveVenda);

document.querySelector('#tableVendas>tbody')
    .addEventListener('click', editDelete);

document.getElementById('cancelar')
    .addEventListener('click', closeModal);

document.getElementById('cancelar2')
    .addEventListener('click', closeModal2);
