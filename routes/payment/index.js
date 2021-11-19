const router = require('express').Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

router.route('/create-session')
  .post(async (req, res) => {
    const { order } = req.body
    const { formData, cart } = order
    if (!formData || !cart) return res.status(500).send('Missing data')
    console.log(JSON.stringify(order))
    // Créer une session chez Stripe
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: order.cart.map(item => {
          return {
            price_data: {
              currency: 'EUR',
              product_data: {
                name: item.dish.name
              },
              // unit_amount: item.dish.price * 100
              // avec price en number :
              unit_amount: Number(Number(item.dish.price).toFixed(2) * 100).toFixed(0)
            },
            quantity: item.quantity
          }
        }),
        mode: 'payment',
        customer_email: formData.email,
        success_url: 'https://pacific-wave-87488.herokuapp.com/success',
        cancel_url: 'https://pacific-wave-87488.herokuapp.com/cancel'
      })
      return res.send(session)
    } catch (error) {
      console.error(error)
      return res.status(500).send(error)
    }

    // On redirige l'utilisateur vers l'url
  })
module.exports = router
