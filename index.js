require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

// On importe le middleware chargé d'enregistrer les appels d'API
const loggerMiddleWare = require('./middleware/logger')

const app = express()

// Autorise les requêtes depuis le front React (Access Control Allow Origin)
app.use(cors())

// On a dit à express d'utiliser le middleware
app.use(loggerMiddleWare)

// Initialisation de Express pour utiliser le body des requêtes au format UrlEncoded et JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const router = express.Router()

// On defini le port d'écoute
const port = process.env.PORT

// Chaîne de connexion à la base de données MongoDB
const mongoDbConnectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`

// Lancement de la connexion à la base de données avec kes paramètres précédents
mongoose.connect(mongoDbConnectionString, null, error => {
  if (error) throw Error
})
// Récupération de la connexion
const db = mongoose.connection
// Listener de connexion pour valider la connexion
db.once('open', () => {
  console.info('Connexion à la base : OK')
})

// Route "/" en GET
// req = request
// res = response
app.get('/', (req, res) => {
  res.send('Coucou !')
})

// Utilisation du routeur par express
app.use(router)

// Déclaration des routes d'API principales
app.use('/auth', require('./routes/users/auth'))
app.use('/me', require('./routes/users'))
app.use('/muscles', require('./routes/muscles'))
app.use('/exercices', require('./routes/exercices'))
app.use('/workout', require('./routes/workout'))
// Lancement du serveur
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
