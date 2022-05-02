const productsParent = document.querySelector('#products-parent')
const searchUser = document.querySelector('#search-product')
const filterProducts = document.querySelector('#filter-products')
const clearCartBtn = document.querySelector('#clear-cart')

const mainParent = document.querySelector('#main-parent')
const cartParent = document.querySelector('#cart-parent')
const showCart = document.querySelector('#show-cart')
const closeCart = document.querySelector('#close-cart')
showCart.addEventListener('click' , () => toggleCartHandler())
closeCart.addEventListener('click' , () => toggleCartHandler())
const toggleCartHandler = () => {
    mainParent.classList.toggle('hidden')
    mainParent.classList.toggle('h-0')
    cartParent.classList.toggle('hidden')
}

const totalPriceCart = document.querySelector('#total-price')
const totalAmountCart = document.querySelector('#total-amount')
const cartList = document.querySelector('#cart-list')

let userFilter = {
    searched : '',
    typeFilter : 'all'
}


let cart = []

class Products{
    async getProducts(){
        
        const result = await fetch('../../products.json')
        const data = await result.json()
        let products = data.products
        
        products =  products.map(item => {
            const name = item.name
            const price = item.price 
            const id = item.id
            const img = item.img
            const type = item.type
            const quantity = item.quantity
            const add = item.add
            
            return {name , type , price , id , img , quantity , add}
        })
        return products
    }
}

class View{
    displayProducts(products){


        
        let result = ''
        
        let data = products.filter( item => {
            return item.name.toLowerCase().includes( userFilter.searched.toLowerCase() )
        })

        data = data.filter( item => {
            if(userFilter.typeFilter === 'all'){
                return item
            }else if(userFilter.typeFilter === 'phone'){
                return item.type === 'phone'
            }else if(userFilter.typeFilter === 'laptop'){
                return item.type === 'laptop'
            }else{
                return item.type === 'hard'
            }
            // else if(userFilter.typeFilter === 'phone') item.type === 'phone'
            // else if(userFilter.typeFilter === 'laptop') item.type === 'laptop'
            // return item.type === 'hard'
        })

        data.forEach( element => {
            result += `
                <div class="w-full md:w-1/2 p-5">
                    <div class="w-full h-max border bg-white p-2">
                        <img src="${element.img}" alt="${element.name} - img" class="w-full mb-5">
                        <div class="my-3">
                            <hr>
                            <p class="text-lg my-2">- Name : <span class="font-semibold">${element.name}</span></p>
                            <p class="text-lg my-2">- Type : <span class="font-semibold">${element.type}</span></p>
                            <p class="text-lg my-2">- Price : <span class="font-semibold">$${element.price}</span></p>
                            <hr>
                            <div class="flex justify-between">
                                <a href="./more-page.html#${element.id}" class="bg-blue-500 my-3 px-5 cursor-pointer hover:bg-blue-400 py-2 rounded-lg text-white">More</a>
                                <button data-id="${element.id}" class="add-to-cart bg-blue-500 my-3 px-5 cursor-pointer hover:bg-blue-400 py-2 rounded-lg text-white">Add To Cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            `

            productsParent.innerHTML = result
        })
    }

    getCartButtons(){
        const buttons = [...document.querySelectorAll('.add-to-cart')]
        
        buttons.forEach(button => {
            const id = button.dataset.id
            button.addEventListener('click' , () => {
                let cartItem = {...Storage.getProduct(id) , amount: 1}
                cart = [...cart , cartItem]
                Storage.saveCart(cart)
                this.setCartValues(cart) 
                this.addNewCart(cartItem)
                button.textContent = 'Added'
            })
        })
    }

    setCartValues(cart){
        let totalAmount = 0
        let totalPrice = 0

        cart.map(item => {
            totalPrice = totalPrice + (item.amount * item[0].price)
            totalAmount = totalAmount + item.amount
        })

        totalPriceCart.innerHTML = `$${totalPrice}`
        totalAmountCart.innerHTML = totalAmount
    }

    addNewCart(cartItem){
        const li = document.createElement('li')
        li.className = 'bg-teal-200 p-3 rounded-lg flex flex-col md:flex-row justify-between mb-4'

        let element = `
            <img src="${cartItem[0].img}" class="w-2/3 mx-auto md:mx-0 md:w-20 rounded-2xl" alt="${cartItem[0].name} img">

            <div class="mx-auto my-6 md:mx-0 md:my-0 flex flex-col sm:flex-row gap-6 text-center">
                <div>
                    <h4 class="mb-3 font-bold text-xl">Name</h4>
                    <p class="text-lg text-teal-700">${cartItem[0].name}</p>
                </div>
                
                <div>
                    <h4 class="mb-3 font-bold text-xl">Type</h4>
                    <p class="text-lg text-teal-700">${cartItem[0].type}</p>
                </div>

                <div>
                    <h4 class="mb-3 font-bold text-xl">Price</h4>
                    <p class="text-lg text-teal-700">${cartItem[0].price}</p>
                </div>
            </div>

            <div class="flex items-center mx-auto md:mx-0 gap-x-3">
                <button data-id="${cartItem[0].id}" class="bg-blue-500 text-white p-1 rounded-lg text-3xl       bx bx-chevron-up"></button>
                <span class="text-xl font-medium">${cartItem.amount}</span>
                <button data-id="${cartItem[0].id}" class="bg-blue-500 text-white p-1 rounded-lg text-3xl       bx bx-chevron-down"></button>
            </div>
        `
        li.innerHTML = element
        cartList.appendChild(li)
    }

    initApp(){
        cart = Storage.getCart()
        this.setCartValues(cart)
        this.propulate(cart)
    }

    propulate(cart){
        cart.forEach(item => {
            return this.addNewCart(item)
        })
    }

    cartProcess(){
        clearCartBtn.addEventListener('click' , () => this.clearCart())

        cartList.addEventListener('click' , event => {
            if(event.target.classList.contains('bx-chevron-up')){
                const addAmount = event.target
                const id = addAmount.dataset.id
                const foundElem = cart.find(item => item[0].id === id)
                
                foundElem.amount = foundElem.amount + 1
                Storage.saveCart(cart)
                this.setCartValues(cart)
                addAmount.nextElementSibling.innerHTML = foundElem.amount
            }

            if(event.target.classList.contains('bx-chevron-down')){
                const lowerAmount = event.target
                const id = lowerAmount.dataset.id
                const foundElem = cart.find(item => item[0].id === id)
                foundElem.amount -= 1

                if(foundElem.amount > 0){
                    Storage.saveCart(cart)
                    this.setCartValues(cart)
                    lowerAmount.previousElementSibling.innerHTML = foundElem.amount
                }
                else{
                    cartList.removeChild(lowerAmount.parentElement.parentElement)
                    this.removeProduct(id)
                }
                
            }
        })
    }

    clearCart(){
        let cartItem = cart.map(item => item[0].id)
        cartItem.forEach( item => {
            this.removeProduct(item)
        })
        while (cartList.children.length > 0) {
            cartList.removeChild(cartList.children[0])
        }
    }

    removeProduct(id){
        cart = cart.filter(item => item[0].id !== id)
        this.setCartValues(cart)
        Storage.saveCart(cart)
    }
}

class Storage{
    static saveProducts(products){
        localStorage.setItem('products' , JSON.stringify(products))
    }

    static getProduct(id){
        let product = JSON.parse( localStorage.getItem('products') )
        return product.filter(item => item.id === id)
    }

    static saveCart(cart){
        localStorage.setItem('cart' , JSON.stringify(cart))
    }

    static getCart(){
        return localStorage.getItem('cart') ? JSON.parse( localStorage.getItem('cart') ) : []
    }
}

document.addEventListener('DOMContentLoaded' , () => {
    const products = new Products()
    const view = new View()
    
    view.initApp()
    products.getProducts().then( resp => {
        view.displayProducts(resp)
        Storage.saveProducts(resp)
    }).then(resp => {
        view.getCartButtons()
        view.cartProcess()
    })
})
searchUser.addEventListener('input' , event => {
    userFilter.searched = event.target.value
    const products = new Products()
    const view = new View()
    
    view.initApp()
    products.getProducts().then( resp => {
        view.displayProducts(resp)
        Storage.saveProducts(resp)
    }).then(resp => {
        view.getCartButtons()
        view.cartProcess()
    })
})
filterProducts.addEventListener('change' , (event) => {
    userFilter.typeFilter = event.target.value
    
    const products = new Products()
    const view = new View()
    
    view.initApp()
    products.getProducts().then( resp => {
        view.displayProducts(resp)
        Storage.saveProducts(resp)
    }).then(resp => {
        view.getCartButtons()
        view.cartProcess()
    })
})
