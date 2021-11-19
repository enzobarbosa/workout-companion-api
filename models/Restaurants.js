const mongoose = require('mongoose')
const { Schema } = mongoose
// = const Schema = mongoose.Schema

// Déclaration du Schéma
const RestaurantSchema = Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  dishes: [{
    type: Schema.Types.ObjectId,
    ref: 'Dishes'
  }]
}, { timestamps: true })

module.exports = mongoose.model('Restaurant', RestaurantSchema)
