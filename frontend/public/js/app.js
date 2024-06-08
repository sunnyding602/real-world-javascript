
const APP_PORT = 3001
const APP_HOSTNAME = 'localhost'

async function fetchFromAPI(method, pathname, data = {}) {
    const url = `http://${APP_HOSTNAME}:${APP_PORT}${pathname}`
    const body = Object.keys(data).length > 0 ? data : undefined
    const result = await fetch(url, { method, body }).then((response) => response.json())
    return result
}

async function doSomethingFancy() {
    const todos = await fetchFromAPI('get', '/todos')
    const $el = document.getElementById('todo-body')
    const todoHTML = todos.map((todo) => {
        return `<li><input type="checkbox" /> ${todo.title}</li>`
    })

    $el.innerHTML = `<ul>${todoHTML.join('')}</ul>`
}
