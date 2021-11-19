const router = require('express').Router()
// Librairie de gestion des tokens
const { generateToken } = require('../../helpers/TokenHelper')

const User = require('../../models/User')

// Ajout d'un utulisateur à la base de données
router.route('/register')
  .post((req, res) => {
    // Récupération des paramètres
    const { email, password, firstName, lastName, phone } = req.body
    // Gestion des erreurs
    if (!email || !password) { return res.status(500).send('Email or password is missing') }
    // Créeation de l'utilisateur
    const user = new User({
      email, password, firstName, lastName, phone
    })
    // Enregistrement de l'utilisateur, ici la fonction save() va faire appel à la méthode de hachage du mot de passe
    user.save((error, result) => {
      if (error) return res.status(500).send(error)
      const _user = result.toObject()
      // On supprime le mot de passe présent dans l'objet
      delete _user.password
      // Génération du token
      const payload = {
        id: _user._id
      }
      generateToken(payload, (error, token) => {
        if (error) return res.status(500).send('Error while generating token')
        // On renvoit l'utilisateur crée et le token
        return res.send({
          user: _user, token
        })
      })
    })
  })

// Créer une route /login
router.route('/login')
  .post((req, res) => {
    // Récuperer les paramètres envoyés (email, password)
    const { email, password } = req.body
    // Gestion des erreurs
    if (!email || !password) { return res.status(500).send('Email or password is missing') }
    // Récupérer l'utilisateur (findOne par email)
    User.findOne({ email: email }, (error, user) => {
      if (error || !user) return res.status(403).send('Invalid Credentials')
      // Comparer les mots de passe (celui en paramètre et celui stocké dans l'utilisatuer récupéré) avec la méthode comparePassword
      user.comparePassword(password, (error, isMatch) => {
        if (error || !isMatch) return res.status(403).send('Invalid Credentials')
        // Si mot de passe correct, on génère un token et on l'envoie
        // On convertit le Document MongoDB en objet Javascript
        user = user.toObject()
        // On supprime le mot de passe présent dans l'objet (sécurité)
        delete user.password
        // Données à stocker dans le token
        const payload = {
          id: user._id
        }
        // Génération du token
        generateToken(payload, (error, token) => {
          if (error) return res.status(500).send('Error while generating token')
          return res.send({
            user,
            token
          })
        })
      })
    })
  })

module.exports = router
