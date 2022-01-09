const jwt = require('jsonwebtoken')

// Intercepteur de validation d'authentification par jwt
const withAuth = (req, res, next) => {
    // On cherche le header Authorization dans la requête
    if(req.headers.authorization) {
        // On extrait le token car le format dans le header est "Bearer <token>"
        const token = req.headers.authorization.split(' ')[1]
        // On vérifie la présence du token
        if (!token) return res.status(401).send('Unauthorized: No token provided')
        // On verifie l'authenticité du token avec la phrase secrète
        jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
            if (error) return res.status(401).send('Unauthorized : Invalid token')
            // Vérification de l'expiration du token (optionnel car le jwt.verify le fait déjà)
            const now = new Date().getTime() / 1000
            // Si l'expiration du token est inferieure à l'heure actuelle
            if (decoded.exp < now) return res.status(401).send('Unauthorized: Expired token')
            next()
        })
    } else {
        res.status(401).send('Unauthorized: No authorization header')
    }
}

module.exports = withAuth