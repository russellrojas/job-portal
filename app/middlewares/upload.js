// modules nécessaires
const fs = require('fs');      // fs permet de manipuler le système de fichiers (création de dossiers, lectures, etc.)
const path = require('path');  // path permet de construire des chemins de manière compatible (Windows/Linux/Mac)
const multer = require('multer');

// Configuration du stockage avec Multer
const storage = multer.diskStorage({
  // Détermine dans quel dossier sauvegarder chaque fichier uploadé
  destination: function (req, file, cb) {
    const userId = req.session.userid;
    const offreId = req.body.offre_emploi; //verifier
    if (!userId || !offreId) {
      return cb(new Error('Faltan userId u offreId'));
    }

    const uploadPath = path.join('uploads', String(userId), String(offreId));

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); 
    }

    cb(null, uploadPath);
  },

  // Définit comment nommer le fichier uploadé sur le disque
  filename: function (req, file, cb) {
    // pour éviter les collisions: ajout d'un timestamp et d'un nombre aléatoire au nom original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // <-- Nom final du fichier
  }
});

// Création du middleware Multer avec ce storage perso
const upload = multer({ storage: storage });

module.exports = upload;
