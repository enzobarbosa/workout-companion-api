// Import des libs
const mongoose = require('mongoose')
const { Schema } = mongoose
// = const Schema = mongoose.Schema

const bcrypt = require('bcryptjs')

// Déclaration du Schéma
const UserSchema = Schema({
  // Champs requis : Email + Password
  email: {
    type: String,
    required: true,
    match: /.+@.+..+/,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // Champs optionnels : firstName, lastName, phone
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  }
}, { timestamps: true })

// On crypte le mot de passe pour qu'il n'apparaisse pas en clair dans la base de données
// Méthode appelée à chaque enregistrement d'utilisateur
UserSchema.pre('save', function (next) {
  // this = user car la fonction save est appelée sur le User dans notre code
  const user = this
  // Si le mot de passe a été modifié ou si l'utilisateur est nouveau
  if (this.isModified('password') || this.isNew) {
    // Génération du "sel" nécessaire pour le cryptage du mot de passe
    bcrypt.genSalt(10, (error, salt) => {
      if (error) return next(error)
      bcrypt.hash(user.password, salt, (error, hash) => {
        if (error) return next(error)
        user.password = hash
        return next()
      })
    })
  }
})

UserSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, (error, isMatch) => {
    if (error) return callback(error)
    callback(null, isMatch)
  })
}

module.exports = mongoose.model('User', UserSchema)
