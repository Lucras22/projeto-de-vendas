'use strict';

// Funções para abrir e fechar os modais
const openModal = () => document.getElementById('modal').classList.add('active');
const openModal2 = () => document.getElementById('modal2').classList.add('active');
const openModalInfoPedido = () => document.getElementById('modalInfoPedido').classList.add('active');

const closeModal = () => {
    clearFields();
    document.getElementById('modal').classList.remove('active');
};

const closeModal2 = () => document.getElementById('modal2').classList.remove('active');

// Fechar o modal de informações do pedido
const closeInfoPedidoModal = () => {
    document.getElementById('modalInfoPedido').classList.remove('active');
};

// Manipulação de armazenamento local
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_pedido')) ?? [];
const setLocalStorage = (dbPedido) => localStorage.setItem("db_pedido", JSON.stringify(dbPedido));

// CRUD - criar, ler, atualizar e excluir
const deletePedido = (index) => {
    const dbPedido = readPedido();
    dbPedido.splice(index, 1);
    setLocalStorage(dbPedido);
};

const updatePedido = (index, pedido) => {
    const dbPedido = readPedido();
    dbPedido[index] = pedido;
    setLocalStorage(dbPedido);
};

const readPedido = () => getLocalStorage();

const createPedido = (pedido) => {
    const dbPedido = getLocalStorage();
    dbPedido.push(pedido);
    setLocalStorage(dbPedido);
};

// Validação dos campos do formulário
const isValidFields = () => {
    return document.getElementById('form').reportValidity();
};

// Limpar campos do formulário
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach(field => field.value = "");
    document.getElementById('numero').dataset.index = 'new';
};

// Salvar informações de pedido
const savePedido = () => {
    if (isValidFields()) {
        const pedido = {
            numero: document.getElementById('numero').value,
            cliente: document.getElementById('cliente').value,
            produto: document.getElementById('produto').value,
            endereco: document.getElementById('endereco').value,
            numeroCliente: document.getElementById('numeroCliente').value,
            data: document.getElementById('data').value,
            entrega: document.getElementById('entrega').value
        };
        const index = document.getElementById('numero').dataset.index;
        if (index == 'new') {
            createPedido(pedido);
            updateTable();
            closeModal();
        } else {
            updatePedido(index, pedido);
            updateTable();
            closeModal();
        }
    }
};

// Criação de uma nova linha na tabela
const createRow = (pedido, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${pedido.numero}</td>
        <td>${pedido.cliente}</td>
        <td>${pedido.produto}</td>
        <td>${pedido.data}</td>
        <td>${pedido.entrega}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
            <button type="button" class="button blue" id="info-${index}">Informações</button>
        </td>
    `;
    document.querySelector('#tablePedido>tbody').appendChild(newRow);
};

// Limpar tabela
const clearTable = () => {
    const rows = document.querySelectorAll('#tablePedido>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row));
};

// Atualizar tabela com dados do armazenamento
const updateTable = () => {
    const dbPedido = readPedido();
    clearTable();
    dbPedido.forEach(createRow);
};

// Preencher campos do formulário para edição
const fillFields = (pedido) => {
    document.getElementById('numero').value = pedido.numero;
    document.getElementById('cliente').value = pedido.cliente;
    document.getElementById('produto').value = pedido.produto;
    document.getElementById('endereco').value = pedido.endereco;
    document.getElementById('numeroCliente').value = pedido.numeroCliente;
    document.getElementById('data').value = pedido.data;
    document.getElementById('entrega').value = pedido.entrega;

    document.getElementById('numero').dataset.index = pedido.index;
};

// Editar informações de pedido
const editPedido = (index) => {
    const pedido = readPedido()[index];
    pedido.index = index;
    fillFields(pedido);
    openModal();
};

// Excluir informações de pedido
const deletePedidoHandler = (index) => {
    const pedido = readPedido()[index];
    let avisoDelete = document.querySelector('#avisoDelete');

    avisoDelete.textContent = `Deseja realmente excluir o pedido número ${pedido.numero}?`;
    openModal2();

    // Apagar o registro
    document.getElementById('apagar').addEventListener('click', () => {
        deletePedido(index);
        updateTable();
        closeModal2();
    });
};

// Mostrar informações adicionais do pedido em um modal
const showInfoPedido = (index) => {
    const pedido = readPedido()[index];
    
    const infoContent = `
        <p><strong>Número do Pedido:</strong> ${pedido.numero}</p>
        <p><strong>Cliente:</strong> ${pedido.cliente}</p>
        <p><strong>Produto:</strong> ${pedido.produto}</p>
        <p><strong>Endereço:</strong> ${pedido.endereco}</p>
        <p><strong>Número do Cliente:</strong> ${pedido.numeroCliente}</p>
        <p><strong>Data do Pedido:</strong> ${pedido.data}</p>
        <p><strong>Data da Entrega:</strong> ${pedido.entrega}</p>
    `;
    
    document.getElementById('infoContentPedido').innerHTML = infoContent;
    openModalInfoPedido();
};

// Manipular cliques na tabela
const editDelete = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-');
        const parsedIndex = parseInt(index);

        if (action == 'edit') {
            editPedido(parsedIndex);
        } else if (action == 'delete') {
            deletePedidoHandler(parsedIndex);
        } else if (action == 'info') {
            showInfoPedido(parsedIndex);
        }
    }
};

// Inicializar a tabela ao carregar a página
updateTable();

// Eventos
document.getElementById('cadastrarPedido')
    .addEventListener('click', openModal);

document.getElementById('modalClose')
    .addEventListener('click', closeModal);

document.getElementById('modalClose2')
    .addEventListener('click', closeModal2);

document.getElementById('salvar')
    .addEventListener('click', savePedido);

document.querySelector('#tablePedido>tbody')
    .addEventListener('click', editDelete);

document.getElementById('cancelar')
    .addEventListener('click', closeModal);

document.getElementById('cancelar2')
    .addEventListener('click', closeModal2);

// Fechar o modal de informações do pedido
document.getElementById('fecharInfoPedido')
    .addEventListener('click', closeInfoPedidoModal);

document.getElementById('modalCloseInfoPedido')
    .addEventListener('click', closeInfoPedidoModal);
