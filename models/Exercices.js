const mongoose = require('mongoose')
const { Schema } = mongoose

const ExercicesSchema = Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  muscle: {
    type: Schema.Types.ObjectId,
    ref: 'Muscle',
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Exercices', ExercicesSchema)
