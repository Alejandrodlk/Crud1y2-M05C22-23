const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const readProducts = () => {	
	const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));	
	return products
}

// Base de datos
const db = require('../database/models') 

const saveProducts = (products) => fs.writeFileSync(productsFilePath, JSON.stringify(products,null,3))

const toThousand = n => n.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		
		db.Product.findAll({
			include: ['images'] // 'images' ese nombre es el que se recibe la vista para posteriormente hacer un forEach y sacar de ahi el image.file(nombre de la imagen)
		})
			.then(products => {
				return res.render("products" , {
					products,
					toThousand
				})
			})
			.catch(error => console.log(error))

		
	},

	// Detail - Detail from one product
	detail: (req, res) => {

		db.Product.findByPk(req.params.id , {
			include : ['images']
		})
			.then(product => {
				return res.render("detail" , {
					product,
					toThousand
				})
			})
			.catch(error => console.log(error))

	},

	// Create - Form to create
	create: (req, res) => {
		
		db.Category.findAll()

			.then(categories => {
				return res.render("product-create-form" , {
					categories
				})
			})
			.catch(error => console.log(error))	
	},
	
	// Create -  Method to store
	store: (req, res) => {
		
		let products = readProducts()

		const {title,price,discount,description, categoryId, images} = req.body

		db.Product.create({
			title : title.trim(),
			price : +price,
			discount : +discount,
			description : description.trim(),
			categoryId,			
		})

			.then(product => {
				if (req.files.length > 0) {  // Verifico que llegue alguna imagen
					let images = req.files.map(({filename},i) => { //desestructuro req.files su propiedad filename
						let image = { // Cuando mapeamos images creamos un objeto image
							file : filename, // Las 3 columnas hacen referencia a como esta configurado el modelo "Image"
							productId : product.id,
							primary : i === 0 ? 1 : 0  // 'i'  lugar que ocupa cada elemento en el array
						}
						return image //RETORNAMOS EL OBJETO EN CADA VUELTA DEL MAP
					})
					db.Image.bulkCreate(images,{validate : true}) // bulkCreate va a almacenar la cantidad de registros con el objeto nuevo que lleguen del map 
						.then((result) => console.log(result))
				}/* else{
					db.Image.create({
						file : "default-image.png",
							productId : product.id,
							primary : true
					})
				} */
				return res.redirect('/products')
			})
			.catch(error => console.log(error))
	},

	// Update - Form to edit
	edit: (req, res) => {
		
	let product = db.Product.findByPk(req.params.id , {
			include : ['images']
		})

	let categories = db.Category.findAll()

		Promise.all([product,categories])
			.then(([product,categories]) => {
				return res.render("product-edit-form" , {
					product,
					categories
				})
			})
			.catch(error => console.log(error))	
	},
	update: (req, res) => {
		const {title,price,discount,description,categoryId} = req.body

		db.Product.update(
			{
				title : title.trim(),
				price : +price,
				discount : +discount,
				description : description.trim(),
				categoryId,	
			},
			{
				where : {
					id : req.params.id
				}
			}
		)
			.then(() => {
				if (req.file) {
					db.Image.update(
						{
							file : req.file.filename
						},
						{
							where : {
								productId : req.params.id, //productId hace referencia a la table images al id que esta llegando de products
								primary : true
							}
						}
					)
						.then(() => {
							console.log('MODIFICACION EXITOSA!!');
						})
				}
				return res.redirect("/products")
			})
			.catch(error => console.log(error))	

			/* .then(async () => { // Forma que propone Eric ASYNC tema todavia no visto!
				if(req.file){
					try {
						await db.Image.update(
							{
								file : req.file.filename
							},
							{
								where : {
									productId : req.params.id,
									primary : true
								}
							}
						)
					} catch (error) {
						console.log(error);
					}
				}
				return res.redirect('/products');
	
			}).catch(error => console.log(error)) */
			
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {

		db.Product.destroy({
			where : {
				id : req.params.id
			}
		})
			.then((info) => {
				console.log('<<<<>>>>>>' , info)
				return res.redirect("/products")
			})
			.catch(error => console.log(error))
	}
}

module.exports = controller;