const mongoose = require('mongoose')
const { Schema } = mongoose
// = const Schema = mongoose.Schema

// Déclaration du Schéma
const MuscleSchema = Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  Exercices: [{
    type: Schema.Types.ObjectId,
    ref: 'Exercices'
  }]
}, { timestamps: true })

module.exports = mongoose.model('Muscle', MuscleSchema)
