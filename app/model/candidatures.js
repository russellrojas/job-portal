const { NULL } = require('mysql/lib/protocol/constants/types.js');
var db = require('./connexion.js');
var fs = require('fs');
var path = require('path');

module.exports = {
    readSesCandidatures: function (userId, callback) {
        const query = `
            SELECT DISTINCT  
                FP.intitule,
                FP.lieu_mission,
                FP.salaire_min,
                FP.salaire_max,
                FP.type_metier,
                O.etat,
                O.indication,
                O.id AS offre_emploi,
                C.date_candidature,
                O.date_validite,
                ORG.nom AS entreprise
            FROM Candidatures C
            JOIN OffresEmploi O ON C.offre_emploi = O.id
            JOIN FichePostes FP ON O.fiche_poste = FP.id
            JOIN Organisations ORG ON FP.siren_organisation = ORG.siren
            WHERE C.candidat = ?;
        `;
        db.query(query, [userId], function (err, results) {
            if (err) return callback(err);
            callback(results);
        });
    },

    readUneCandidature: function (idCandidat, offreEmploiId, callback) {
        const query = `
            SELECT 
                F.intitule AS poste,
                ORG.nom AS organisation,
                C.offre_emploi, 
                C.date_candidature
            FROM 
                Candidatures C
            JOIN 
                OffresEmploi O ON C.offre_emploi = O.id
            JOIN 
                FichePostes F ON O.fiche_poste = F.id
            JOIN 
                Organisations ORG ON F.siren_organisation = ORG.siren
            WHERE 
                C.candidat = ? AND C.offre_emploi = ?;
        `;
        db.query(query, [idCandidat, offreEmploiId], function (err, results) {
            if (err) return callback(err);
            results.forEach(row => {
                if (row.date_candidature) {
                    row.date_candidature = new Date(row.date_candidature).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                }
            });
            callback(results[0]); 
        });
    },


    readCandidaturesPourMonEntreprise: function (userId, callback) {
        const query = `
            SELECT O.*
            FROM Utilisateurs U
            JOIN Organisations O ON U.siren_organisation = O.siren
            WHERE U.id = ?
        `;
        db.query(query, [userId], function (err, results) {
            if (err) throw err;
            if (results.length === 0) return callback(null);
            callback(results[0]);
        });
    },

    readCandidatsParOffre: function (offreId, callback) {
        const query = `
            SELECT 
                U.id AS id_candidat,
                U.nom,
                U.prenom,
                C.date_candidature,
                COUNT(PJ.id) AS nb_documents
            FROM 
                Candidatures C
            JOIN 
                Utilisateurs U ON C.candidat = U.id
            LEFT JOIN 
                PiecesJointes PJ 
                ON C.offre_emploi = PJ.offre_emploi 
                AND C.candidat = PJ.candidat
            WHERE 
                C.offre_emploi = ?
            GROUP BY 
                U.id, U.nom, U.prenom, C.date_candidature
        `;  
        db.query(query, [offreId], function (err, results) {
            if (err) return callback(err);
            results.forEach(row => {
                if (row.date_candidature) {
                    row.date_candidature = new Date(row.date_candidature).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                }
            });
            callback(results);
        });
    },


    candidater: function (offreId, userId, callback) {
        const query = `
            INSERT INTO Candidatures (offre_emploi, candidat, date_candidature)
            VALUES (?, ?, CURDATE())
        `;

        db.query(query, [offreId, userId], function (err, result) {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return callback(new Error('Déjà candidaté à cette offre.'));
                }
                return callback(err);
            }
            callback(null, result);
        });
    },

    annulerCandidature: function(offreId, userId, callback) {
        const selectFichiers = `
            SELECT chemin FROM PiecesJointes
            WHERE offre_emploi = ? AND candidat = ?
        `;

        db.query(selectFichiers, [offreId, userId], function(err, fichiers) {
            if (err) return callback(err);

            // Supprimer fichiers physiques s'il y en a
            if (fichiers.length > 0) {
                fichiers.forEach(fichier => {
                    fs.unlink(fichier.chemin, (fsErr) => {
                        if (fsErr && fsErr.code !== 'ENOENT') {
                            console.error('Erreur suppression fichier:', fsErr);
                        }
                    });
                });
            }

            // Supprimer la ligne de PiecesJointes même s'il n'y avait aucun fichier
            const supprimerPieces = `
                DELETE FROM PiecesJointes
                WHERE offre_emploi = ? AND candidat = ?
            `;

            db.query(supprimerPieces, [offreId, userId], function(err2) {
                if (err2) return callback(err2);

                // Supprimer la ligne de Candidatures
                const supprimerCandidature = `
                    DELETE FROM Candidatures
                    WHERE offre_emploi = ? AND candidat = ?
                `;

                db.query(supprimerCandidature, [offreId, userId], function(err3) {
                    if (err3) return callback(err3);

                    // Nettoyer le dossier s'il est vide
                    const dossierOffre = path.resolve('uploads', `${userId}`, `${offreId}`);
                    fs.readdir(dossierOffre, function(err4, files) {
                        if (!err4 && files.length === 0) {
                            fs.rmdir(dossierOffre, () => {
                                // Después de borrar la carpeta de la oferta, verificamos la carpeta del usuario
                                const dossierUser = path.resolve('uploads', `${userId}`);
                                fs.readdir(dossierUser, function(err5, userFiles) {
                                    if (!err5 && userFiles.length === 0) {
                                        fs.rmdir(dossierUser, () => {});
                                    }
                                });
                            });
                        } else {
                            // Si no se borra carpeta oferta, igual verificamos la carpeta usuario
                            const dossierUser = path.resolve('uploads', `${userId}`);
                            fs.readdir(dossierUser, function(err5, userFiles) {
                                if (!err5 && userFiles.length === 0) {
                                    fs.rmdir(dossierUser, () => {});
                                }
                            });
                        }
                    });
                    callback(null); // succès final
                });
            });
        });
    }

}