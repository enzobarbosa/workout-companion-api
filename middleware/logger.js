// next = methode qui sert à déclencher la suite
// Fonction appellée à chaque appel d'une route express
const loggerMiddleWare = (req, res, next) => {
    if (req) {
        console.info(
            `[${new Date().toLocaleString()}] Requête ${req.method} reçue de ${req.ip} à destination de ${req.url}`
        )
    }
    next()
}

module.exports = loggerMiddleWare