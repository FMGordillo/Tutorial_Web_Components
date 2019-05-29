const template = document.createElement('template')

template.innerHTML = `
<style>
    :host {
        display: block;
        font-family: sans-serif;
        text-align: center;
    }

    button {
        border: none;
        cursor: pointer;
        padding: 1rem;
        background: none;
    }

    ul {
        list-style: none;
        padding: 0;
    }
</style>

<h1>ToDo App</h1>

<input type="text" placeholder="Add a new ToDo"></input>
<button>Add</button>

<ul id="todos"></ul>
`;

class TodoApp extends HTMLElement {
    constructor() {
        super()
        this._shadowRoot = this.attachShadow({ mode: 'open'})
        this._shadowRoot.appendChild(template.content.cloneNode(true))

        this.$todoList = this._shadowRoot.querySelector('ul')
        this.$input = this._shadowRoot.querySelector('input')

        this.$submitButton = this._shadowRoot.querySelector('button')

        this.$input.addEventListener('keypress', this._addTodoKeyPress.bind(this))
        this.$submitButton.addEventListener('click', this._addTodo.bind(this))
    }

    

    _addTodo() {
        if(this.$input.value.length > 0) {
            this._todos.push({ text: this.$input.value, checked: false})
            this._renderTodoList()
            this.$input.value = ''
        }
    }

    _addTodoKeyPress(e) {
        const code = e.which || e.keyCode
        if(code === 13) {
            this._addTodo()
        }   
    }

    _renderTodoList() {
        this.$todoList.innerHTML = ''

        this._todos.forEach((todo, index) => {
            let $todoItem = document.createElement('to-do-item')
            $todoItem.setAttribute('text', todo.text)

            if(todo.checked) {
                $todoItem.setAttribute('checked', '')
            }

            $todoItem.setAttribute('index', index)

            $todoItem.addEventListener('onRemove', this._removeTodo.bind(this))
            $todoItem.addEventListener('onToggle', this._toggleTodo.bind(this))

            this.$todoList.appendChild($todoItem)
        });
    }

    set todos(value) {
        this._todos = value
        this._renderTodoList()
    }

    get todos() {
        return this._todos
    }

    _toggleTodo(e) {
        const todo = this._todos[e.detail]
        this._todos[e.detail] = Object.assign({}, todo, {
            checked: !todo.checked
        })
        this._renderTodoList()
    }

    _removeTodo(e) {
        this._todos.splice(e.detail, 1)
        this._renderTodoList()
    }
}


window.customElements.define('to-do-app', TodoApp)

// Populate with some example data
document.querySelector('to-do-app').todos = [
    {text: "Make a todo list", checked: false},
    {text: "Be cool", checked: true}
]