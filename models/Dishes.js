const mongoose = require('mongoose')
const { Schema } = mongoose

const DishesSchema = Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['Starter', 'Dish', 'Dessert', 'Drink'],
    required: true
  },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Dishes', DishesSchema)
