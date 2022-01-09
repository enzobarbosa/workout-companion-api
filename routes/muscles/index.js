const router = require('express').Router()

const { findByIdAndDelete } = require('../../models/Muscles')
const Muscle = require('../../models/Muscles')

router.route('/') // Correspond à /muscles
// GET (lister des éléments)
  .get((req, res) => {
    // Récuperer la liste des muscles depuis MongoDB
    Muscle.find((error, result) => {
      if (error) {
        // Envoi de l'erreur en cas de problème
        return res.status(500).send('Erreur lors de la récupération des muscles')
      } else {
        // Envoi de la liste des résultats (les muscles)
        return res.send(result)
      }
    })
  })

// POST (ajouter un élément)
  .post((req, res) => {
    // Extraction des paramètres du corps de la requête
    const { body } = req
    const { name, description, exercices } = body
    // Validation des paramètres du corps de la requête
    if (!name) return res.status(500).send('Name is missing')
    if (!description) return res.status(500).send('Description is missing')

    const muscle = new Muscle({
      name: name,
      description: description,
      exercices
    })

    muscle.save((error, result) => {
      if (error) return res.status(500).send(error)
      Muscle.find((error, result) => {
        if (error) {
          // Envoi de l'erreur en cas de problème
          return res.status(500).send('Erreur lors de la récupération des muscles')
        } else {
          // Envoi de la liste des résultats (les muscles)
          return res.send(result)
        }
      })
      res.send(result)
    })
  })

// DELETE
  .delete((req, res) => {
    // On a besoin de l'id de l'élément à supprimer
    const { body } = req
    const { id } = body
    if (!id) return res.status(500).send('ID is missing')
    // Récupération de l'objet à supprimer + suppression
    Muscle.findByIdAndDelete(id, (error, result) => {
      if (error) res.status(500).send(error)
      Muscle.find((error, result) => {
        if (error) {
          // Envoi de l'erreur en cas de problème
          return res.status(500).send('Erreur lors de la récupération des muscles')
        } else {
          // Envoi de la liste des résultats (les muscles)
          return res.send(result)
        }
      })
    })
  })

// UPDATE
  .patch((req, res) => {
    // On a besoin des infos à modifier, on prend l'objet entier afin d'avoir toutes ses propriétés
    const { muscle } = req.body
    // const { body: { id } } = req (c'est la même chose qu'au dessuss)
    // On a besoin de reconstituer un nouvel objet
    if (!muscle) return res.status(500).send('ID is missing')
    // On extrait l'ID
    const id = muscle._id
    // On verifie l'ID
    if (!id) return res.status(500).send('ID is missing !')
    Muscle.findByIdAndUpdate(id, muscle, (error, result) => {
      if (error) return res.status(500).send(error)
      Muscle.find((error, result) => {
        if (error) {
          // Envoi de l'erreur en cas de problème
          return res.status(500).send('Erreur lors de la récupération des muscles')
        } else {
          // Envoi de la liste des résultats (les muscles)
          return res.send(result)
        }
      })
    })
    // On a besoin de la méthode findByIdAndUpdate
  })

module.exports = router
