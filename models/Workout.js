const mongoose = require('mongoose')
const { Schema } = mongoose

const WorkoutSchema = Schema({
  user: {
    // Relier à un id de MongoDB
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cart: [{
    type: Schema.Types.ObjectId,
    ref: 'Exercice',
    required: true
  }]
}, { timestamps: true })

module.exports = mongoose.model('Workout', WorkoutSchema)
