// Un appel d'API qui renvoit l'utilisateur par son ID
// Route : localhost:3000
// L'ID est en dur dans une constante (en choisir 1 dans la base de données)
// La fonction retourne l'utilisateur au client

const router = require('express').Router()

const User = require('../../models/User')

const withAuth = require('../../middleware/authMiddleware')
const { extractIdFromRequestAuthHeader } = require('../../helpers/TokenHelper')

// Récupére et retourne un utilisateur par son ID
router.route('/') // Correspond à /users
// GET (lister des éléments)
  .get(withAuth, (req, res) => {
    const id = extractIdFromRequestAuthHeader

    // // Méthode callback
    // // Récuperer la liste des user depuis MongoDB
    // User.findById(id, (error, result) => {
    //     // Envoi de l'erreur en cas de problème
    //     if (error) return res.status(500).send('Erreur lors de la récupération du user')
    //         // Envoi de la liste des résultats (le user)
    //         return res.send(result)
    // })

    // Méthode Promese
    User.findById(id).select('-password')
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error))
  })

module.exports = router
