// Import our custom CSS
import '../scss/styles.scss'
const apiURL = 'https://js1-todo-api.vercel.app/api/todos'
const apiKey = '47b35a3a-87c6-4fef-bdeb-a4cb2b91d23d'

const addTodo = async (title) => {
    await fetch(`${apiURL}?apikey=${apiKey}`,  {
        method: 'POST',
        body: JSON.stringify({
            title
        }),
        headers: {
            'Content-type': 'application/json;'
        } 
    })
}

const getTodos = async () => {
    const url = `${apiURL}?apikey=${apiKey}` 
    let data = []
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        data = await response.json()
        console.log(data)
    } catch (error) {
        console.error(error.message)
    }
    return data
}

const deleteTodo = async (id) => {
    await fetch(`${apiURL}/${id}?apikey=${apiKey}`,  {
        method: 'DELETE',
    }) 
}

const finishTodo =  (id, completed) => {
    fetch(`${apiURL}/${id}?apikey=${apiKey}`,  {
        method: 'PUT',
        body: JSON.stringify({
            completed
        }),
        headers: {
            'Content-type': 'application/json;'
        } 
    })  
} 

const renderTodoList = async ()  => {
    const todos = await getTodos()
    const ul = document.getElementById('todo-list')
    ul.innerHTML = ''
    
    todos.forEach((item) => {
        const li = document.createElement('li')
        const button = document.createElement('button')
        const checkbox = document.createElement('input')
        const span = document.createElement('span')
        li.classList.add('list-group-item')
        span.setAttribute('id', `todo-item-${item._id}`)
        span.appendChild(document.createTextNode(item.title))
        span.style.textDecoration = item.completed ? 'line-through' : ''
        checkbox.setAttribute('type', 'checkbox')
        checkbox.addEventListener('click', (e) => {
            console.log('lyka', item._id, e.target.checked) 
            finishTodo(item._id, e.target.checked) 
            document.getElementById(`todo-item-${item._id}`).style.textDecoration = e.target.checked ? 'line-through' : ''
        })
        button.classList.add('btn-close')
        button.addEventListener('click', async (e) => {
            console.log(item, 'lyka')
            await deleteTodo(item._id)
            renderTodoList()
        })
        li.appendChild(checkbox)
        li.appendChild(span)
        li.appendChild(button)
        ul.appendChild(li)
    })     
}

document.addEventListener('DOMContentLoaded', (event) => {
    const todoForm = document.getElementById('todo-form')
    renderTodoList() 
    todoForm.addEventListener('submit', (event) => {
        event.preventDefault()
    })
    document.querySelector('#add-button').addEventListener('click', async (e) => {
        const todoText = document.getElementById('todo-text')
        const alertMessage = document.getElementById('alert-message') 
        const alertMessageText = document.getElementById('alert-message-text')  
        alertMessage.classList.remove('d-none')
        if (todoText.value.trim().length === 0) {
            alertMessage.classList.add('alert-warning')
            alertMessage.classList.remove('alert-success')
            alertMessageText.innerHTML = 'Please enter title'
 
        } else {
            alertMessage.classList.add('alert-success')
            alertMessage.classList.remove('alert-warning')
            alertMessageText.innerHTML = 'To Do successfully added'

            await addTodo(todoText.value)
            renderTodoList()
            todoText.value = ''
        }
    });
});
