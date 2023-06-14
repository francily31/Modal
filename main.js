

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_aluno')) ?? []
const setLocalStorage = (dbAluno) => localStorage.setItem("db_aluno", JSON.stringify(dbAluno))

//botao input com number

// CRUD - create read update delete
const deleteAluno = (index) => {
    const dbAluno = readAluno()
    dbAluno.splice(index, 1)
    setLocalStorage(dbAluno)
}

const updateAluno = (index, aluno) => {
    const dbAluno = readAluno()
    dbAluno[index] = aluno
    setLocalStorage(dbAluno)
}

const readAluno = () => getLocalStorage()

const createAluno = (aluno) => {
    const dbAluno = getLocalStorage()
    dbAluno.push (aluno)
    setLocalStorage(dbAluno)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
    document.querySelector(".modal-header>h2").textContent  = 'Novo Aluno'
}

const saveAluno = () => {
    if (isValidFields()) {
        const aluno = {
            ra: document.getElementById('ra').value,
            nome: document.getElementById('nome').value,
            curso: document.getElementById('curso').value,
            periodo: document.getElementById('periodo').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createAluno(aluno)
            updateTable()
            closeModal()
        } else {
            updateAluno(index, aluno)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (aluno, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${aluno.ra}</td>
        <td>${aluno.nome}</td>
        <td>${aluno.curso}</td>
        <td>${aluno.periodo}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableAluno>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableAluno>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbAluno = readAluno()
    clearTable()
    dbAluno.forEach(createRow)
}

const fillFields = (aluno) => {
    document.getElementById('ra').value = aluno.ra
    document.getElementById('nome').value = aluno.nome
    document.getElementById('curso').value = aluno.curso
    document.getElementById('periodo').value = aluno.periodo
    document.getElementById('nome').dataset.index = aluno.index
}

const editAluno = (index) => {
    const aluno = readAluno()[index]
    aluno.index = index
    fillFields(aluno)
    document.querySelector(".modal-header>h2").textContent  = `Editando ${aluno.nome}`
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editAluno(index)
        } else {
            const aluno = readAluno()[index]
            const response = confirm(`Deseja realmente excluir o aluno ${aluno.nome}`)
            if (response) {
                deleteAluno(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarAluno')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveAluno)

document.querySelector('#tableAluno>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)