const socket = io()

// Inputs
let submitProduct = document.querySelector('#submitProduct')
let title = document.querySelector('#title')
let description = document.querySelector('#description')
let price = document.querySelector('#price')
let thumbnail = document.querySelector('#thumbnail') 
let code = document.querySelector('#code')
let stock = document.querySelector('#stock')
let category = document.querySelector('#category') 
let productID = document.querySelector('#titleDelete')
let deleteBtn = document.querySelector('#deleteProduct')

let contenedor = document.querySelector('#container')

// Enviar producto
submitProduct.addEventListener('click', (event) => {
    event.preventDefault()

    if (title.value.trim() === '' || description.value.trim() === '' || price.value.trim() === '' || code.value.trim() === '' || category.value.trim() === '') {
        alert('Por favor completa todos los campos obligatorios.')
        return
    }

    let product = {
        title: title.value,
        description: description.value,
        code: parseInt(code.value),
        price: price.value,
        status: true,
        stock: parseInt(stock.value),
        category: category.value,
        thumbnail: thumbnail.value
    }

    socket.emit('product', product)

    // Limpiar campos
    title.value = ''
    description.value = ''
    code.value = ''
    price.value = ''
    stock.value = ''
    category.value = ''
    thumbnail.value = ''
})

// Eliminar producto
deleteBtn.addEventListener('click', (event) => {
    event.preventDefault()
    let pid = productID.value
    socket.emit('deleteProduct', pid)
})

// Función para renderizar productos
function renderProducts(data) {
    contenedor.innerHTML = ''
    data.forEach(element => {
        contenedor.innerHTML += `<div>
                                    <h4>${element.title}</h4>
                                    <p>${element.description}</p>
                                    <p>Code: ${element.code}</p> 
                                    <p>Price: ${element.price}</p> 
                                    <p>Status: ${element.status}</p> 
                                    <p>Stock: ${element.stock}</p> 
                                    <p>Category: ${element.category}</p> 
                                    <p>Thumbnail: ${element.thumbnail}</p> 
                                    <p>ID: ${element.id}</p> 
                                </div>`
    })
}

// Listeners
socket.on('mensajeServer', data => {
    renderProducts(data)
})

socket.on('productoAgregado', data => {
    renderProducts(data)
})

socket.on('productoEliminado', data => {
    renderProducts(data)
})
