const mongoose = require('mongoose')
const { Schema } = mongoose

const OrderSchema = Schema({
  user: {
    // Relier à un id de MongoDB
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cart: [{
    type: Schema.Types.ObjectId,
    ref: 'Dish',
    required: true
  }],
  address: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Order', OrderSchema)
