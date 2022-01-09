const router = require('express').Router()

const Exercice = require('../../models/Exercices')
const Muscle = require('../../models/Muscles')

router.route('/')
  .get((req, res) => {
    // Récupération des exercices pour un muscle donné
    const id = req.query.id
    if (id) {
      Exercice.find({ muscle: id }, (error, result) => {
        if (error) return res.status(500).send('Database error')
        return res.send(result)
      })
    } else {
      Exercice.find((error, result) => {
        if (error) return res.status(500).send('Database error')
        return res.send(result)
      })
    }
  })

  .post((req, res) => {
    const { name, description, muscle } = req.body
    if (!name || !muscle) return res.status(500).send('Missing data')

    const exercice = new Exercice({
      name: name,
      description: description,
      muscle: muscle
    })

    exercice.save((error, result) => {
      if (error) return res.status(500).send(error)

      // Lien vers le muscle
      // On récupére le muscle
      Muscle.findById(muscle, (error, resto) => {
        // On ajoute l'exercice dans le muscle
        if (error) return res.status(500).send(error)
        muscle.exercices.push(exercice)
        muscle.save((error, result) => {
          if (error) return res.status(500).send(error)
          // On envoie la liste des exercices
          Exercice.find((error, result) => {
            if (error) return res.status(500).send('Erreur lors de la récupération des exercices')
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
    Exercice.findByIdAndDelete(id, (error, result) => {
      if (error) res.status(500).send(error)
      Exercice.find((error, result) => {
        if (error) return res.status(500).send('Erreur lors de la récupération des exercices')
        return res.send(result)
      })
    })
  })

  .patch((req, res) => {
    const { body: { exercice } } = req
    if (!exercice) return res.status(500).send('Data is missing')
    const { _id } = exercice
    if (!_id) return res.status(500).send('ID is missing !')
    Exercice.findByIdAndUpdate(_id, exercice, (error, result) => {
      if (error) return res.status(500).send(error)
      Exercice.find((error, result) => {
        if (error) return res.status(500).send('Erreur lors de la récupération des exercices')
        return res.send(result)
      })
    })
  })

module.exports = router
