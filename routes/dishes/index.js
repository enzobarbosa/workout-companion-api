// Créer modèle de Document mongoDB
//  - nom, description, prix, catégorie(énumération) (starter, dish, dessert, boisson)
// Créer la route d'API
//  - CRUD (create, read, update, delete) pour la gestion des plats en utilisant les bonnes méthodes HTTP
// Bonus : associer les plats à un ou des restaurants

const router = require('express').Router()

const Dish = require('../../models/Dishes')
const Restaurant = require('../../models/Restaurants')

router.route('/')
  .get((req, res) => {
    // Récupération des plats pour un restaurant donné
    const id = req.query.id
    if (id) {
      Dish.find({ restaurant: id }, (error, result) => {
        if (error) return res.status(500).send('Database error')
        return res.send(result)
      })
    } else {
      Dish.find((error, result) => {
        if (error) return res.status(500).send('Database error')
        return res.send(result)
      })
    }
  })

  .post((req, res) => {
    const { name, description, price, category, restaurant } = req.body
    if (!name || !price || !category || !restaurant) return res.status(500).send('Missing data')

    const dish = new Dish({
      name: name,
      description: description,
      price: price,
      category: category,
      restaurant: restaurant
    })

    dish.save((error, result) => {
      if (error) return res.status(500).send(error)

      // Lien vers le restaurant
      // On récupére le restaurant
      Restaurant.findById(restaurant, (error, resto) => {
        // O ajoute le plat dans le restaurant
        if (error) return res.status(500).send(error)
        resto.dishes.push(dish)
        resto.save((error, result) => {
          if (error) return res.status(500).send(error)
          // On envoie la liste des platss
          Dish.find((error, result) => {
            if (error) return res.status(500).send('Erreur lors de la récupération des plats')
            return res.send(result)
          })
        })
      })
    })
  })

  .delete((req, res) => {
    const { body: { id } } = req
    console.log(id)
    if (!id) return res.status(500).send('ID is missing')
    Dish.findByIdAndDelete(id, (error, result) => {
      if (error) res.status(500).send(error)
      Dish.find((error, result) => {
        if (error) return res.status(500).send('Erreur lors de la récupération des plats')
        return res.send(result)
      })
    })
  })

  .patch((req, res) => {
    const { body: { dish } } = req
    if (!dish) return res.status(500).send('Data is missing')
    const { _id } = dish
    if (!_id) return res.status(500).send('ID is missing !')
    Dish.findByIdAndUpdate(_id, dish, (error, result) => {
      if (error) return res.status(500).send(error)
      Dish.find((error, result) => {
        if (error) return res.status(500).send('Erreur lors de la récupération des plats')
        return res.send(result)
      })
    })
  })

module.exports = router
