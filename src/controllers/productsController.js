const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');

const readProducts = () => {	
	const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));	
	return products
}

const saveProducts = (products) => fs.writeFileSync(productsFilePath, JSON.stringify(products,null,3))

const toThousand = n => n.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		let products = readProducts()

		return res.render("products" , {
			products,
			toThousand
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {

		const product = readProducts().find(product => product.id === +req.params.id)

		return res.render("detail" , {
			product,
			toThousand
		})
	},

	// Create - Form to create
	create: (req, res) => {
		return res.render("product-create-form" , {

		})
	},
	
	// Create -  Method to store
	store: (req, res) => {
		let products = readProducts()

		const {name,price,discount,description, category} = req.body

		let newProduct = {
			id : products[products.length -1].id + 1,
			name : name.trim(),
			description : description.trim(),
			price : +price,
			discount : +discount,
			image: "default-image.png",
			category,
			toThousand
		}

		products.push(newProduct)
		saveProducts(products)
		

		return res.redirect("/products")
	},

	// Update - Form to edit
	edit: (req, res) => {
		let products = readProducts()
		let product = products.find(product => product.id === +req.params.id)

		return res.render("product-edit-form" , {
			product
		})
	},

	// Update - Method to update
	update: (req, res) => {
		let products = readProducts()
		const {name,price,discount,description,category} = req.body

		const productsModify = products.map(product => {
			if (product.id === +req.params.id) {
				let productModify = {
					...product,
					name : name.trim(),
					price : +price,
					discount: +discount,
					description : description.trim(),
					category 
				}	
				return 	productModify		
			}
			return product
		})

		saveProducts(productsModify)

		return res.redirect("/products")
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		let products = readProducts()
		const productsModify = products.filter(product => product.id !== +req.params.id)

		saveProducts(productsModify)

		return res.redirect("/products")

	}
};

module.exports = controller;