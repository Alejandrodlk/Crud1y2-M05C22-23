
const db = require('../database/models')
const {Op} = require('sequelize')

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");


const controller = {
	index: (req, res) => {
		
	let productsVisited =	db.Product.findAll({
				where : {
					categoryId : 1
				},
				include : ['images']
			})
	const productsInSale = db.Product.findAll({
				where : {
					categoryId : 2
				},
				include : ['images']
			})
				Promise.all([productsVisited,productsInSale])
					.then(([productsVisited,productsInSale]) => {
						return res.render("index" , {
							productsVisited,
							productsInSale,
							toThousand
						})
					})
					.catch(error => console.log(error))
		
		/*  */
	},
	search: (req, res) => {
		const {keywords} = req.query
	
		db.Product.findAll({
			where : {
				[Op.or] : [
					{
						title : {
							[Op.substring] : keywords // substring: la keyword se encuentra en cualquier parte
						}
					},
					{
						description : {
							[Op.substring] : keywords
						}
					}
				]
			},
			include : ['images']
			//include : [{all:true}] // para traer todas las relaciones
		})
			.then((result) => {
				return res.render("results" , {
					result,
					keywords,
					toThousand
				})
			})
			.catch(error => console.log(error))
	},
};

module.exports = controller;
