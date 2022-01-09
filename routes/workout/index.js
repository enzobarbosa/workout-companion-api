const router = require('express').Router()
const User = require('../../models/User')
const Workout = require('../../models/Workout')

router.route('/')
  .post(async (req, res) => {
    const { body } = req
    // On récupère les infos depuis la requête
    const { user, cart } = body

    if (!user || !cart) return res.status(500).send('Missing data')
    // On teste si l'utilisateur existe déjà par son email
    try {
      const userExist = await User.findOne({ email: user.email })
      let workoutUser
      if (!userExist) {
        // Si il n'existe pas, on créer un user
        const _user = new User({
          email: user.email,
          // Slice(-8) => garde que les 8 premiers chiffres de la chaîne
          password: Math.random().toString(36).slice(-8),
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone
        })
        // On enregistre le user
        workoutUser = await _user.save()
      } else {
        workoutUser = userExist
      }
      // On créer une commande en la reliant à l'utilisateur précédemment crée
      const workout = new Workout({
        user: workoutUser._id,
        cart: cart
      })
      const workoutSaved = await workout.save()
      return res.send(workoutSaved)
    } catch (error) {
      res.status(500).send(error)
    }
  })

module.exports = router
