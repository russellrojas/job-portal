const { NULL } = require('mysql/lib/protocol/constants/types.js');
var db = require('./connexion.js');

module.exports = {
    getFichiersCandidatPourOffre: function(candidatId, offreEmploiId, callback) {
        const query = `
            SELECT id, offre_emploi, candidat, nom_fichier, type_document, chemin,
            taille, DATE_FORMAT(date_ajout, '%d/%m/%Y') AS date_ajout FROM PiecesJointes 
            WHERE candidat = ? AND offre_emploi = ? 
            ORDER BY date_ajout DESC
        `;
        db.query(query, [candidatId, offreEmploiId], function(err, results) {
            if (err) return callback(err);
            callback(null, results); // results es un array de archivos
        });
    },

    ajoutFichier: function(data, callback) {
        const query = `
            INSERT INTO PiecesJointes
            (offre_emploi, candidat, nom_fichier, type_document, chemin, taille, date_ajout)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;

        db.query(query, [data.offre_emploi,data.candidat,data.nom_fichier,data.type_document,data.chemin,data.taille],
            function(err, result) {
                if (err) return callback(err);
                callback(null, result.insertId); // Devuelve el id de nueva row insertada
            }
        );
    },

    getFichierById: function(id, callback) {
        const query = "SELECT id, offre_emploi, candidat, nom_fichier, type_document, chemin, taille, DATE_FORMAT(date_ajout, '%d/%m/%Y') AS date_ajout FROM PiecesJointes WHERE id = ?";
        db.query(query, [id], function(err, results) {
            if (err) return callback(err);
            callback(results[0]); 
        });
    },

    supprimerFichierById: function(id, callback) {
        const query = "DELETE FROM PiecesJointes WHERE id = ?";
        db.query(query, [id], function(err, result) {
            if (err) return callback(err);
            callback(result);
        });
    },

    existeFichierPourOffreEtCandidat: function(offreId, candidatId, callback) {
        const query = `
            SELECT COUNT(*) AS total
            FROM PiecesJointes
            WHERE offre_emploi = ? AND candidat = ?
        `;

        db.query(query, [offreId, candidatId], function(err, results) {
            if (err) return callback(err);
            const existe = results[0].total > 0;
            callback(null, existe);
        });
    }

};
