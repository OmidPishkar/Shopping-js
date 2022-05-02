let products = JSON.parse(localStorage.getItem('products'))

let productId = ''
const subStringSplit = location.hash.substring().split('#')
subStringSplit.map(item => {
    productId = item
})


const parentElement = document.querySelector('#parent-element')

const findProduct = (products , id) => {
    const product = products.filter( item => {
        return item.id === id
    })
    product.forEach( item => {
        displayProduct(item)
    })
}

const displayProduct = (item) => {
    document.title = `${item.name} - Page`

    let element = `
    <div class="w-full sm:w-2/3 p-3 h-max">
        <div class="w-full h-max border rounded-lg p-3">
            <h1 class="text-xl my-5 text-teal-700">Product Name : <span>${item.name}</span></h1>
            <h1 class="text-xl my-5 text-teal-700">Product Price : <span>$${item.price}</span></h1>
            <h1 class="text-xl my-5 text-teal-700">Product Type : <span>${item.type}</span></h1>
            <hr>
            <h2 class="text-xl my-5 text-teal-700">Details :</h2>
            <p class="my-3">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque totam recusandae quisquam sunt vel error tempora ea mollitia fugit dignissimos molestiae, quos aspernatur rerum dicta dolorum! Enim distinctio ipsa exercitationem.
            </p>
        </div>
    </div>
    <div class="w-full sm:w-1/3 p-3 h-max">
        <div class="w-full h-max  border rounded-lg">
            <img src="${item.img}" class="rounded-lg" alt="">
        </div>
    </div>
    `
    parentElement.innerHTML = element
}

findProduct(products , productId)