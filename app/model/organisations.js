const { NULL } = require('mysql/lib/protocol/constants/types.js');
var db = require('./connexion.js');
module.exports = {
    readOrganisationUtilisateur: function (userId, callback) {
        const query = `
            SELECT U.etat_demande_adhesion, O.*
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

    readallOrganisations: function (callback) {
        db.query("SELECT * FROM Organisations ORDER BY nom ASC", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    ajouterOrganisation: function (userId, siren_creation, nom_creation, type_creation, siege_creation, callback) {
        const sirenStr = String(siren_creation).trim();
        const longueurOk = sirenStr.length === 9;
        const chiffresOk = /^[0-9]+$/.test(sirenStr);
        if (!longueurOk || !chiffresOk) {
            return callback(new Error("Le SIREN doit contenir exactement 9 chiffres."));
        }
        // Verification de Nom ou Siren existant
        const checkSql = 'SELECT * FROM Organisations WHERE siren = ? OR nom = ?';
        db.query(checkSql, [siren_creation, nom_creation], function (err, results) {
            if (err) return callback(err);
            if (results.length > 0) {
                return callback(new Error("Le SIREN ou le nom de l’organisation existe déjà."));
            }
            const updateSql = `
                UPDATE Utilisateurs
                SET
                    siren_organisation_creation = ?,
                    nom_organisation_creation = ?,
                    type_organisation_creation = ?,
                    siege_social_organisation_creation = ?,
                    etat_demande_organisation = 'en attente',
                    date_demande_organisation = CURDATE(),
                    etat_demande_adhesion = 'en attente',
                    date_demande_adhesion = CURDATE()
                WHERE id = ?
            `;
            const values = [siren_creation, nom_creation, type_creation, siege_creation, userId];
            db.query(updateSql, values, function (err, result) {
                if (err) return callback(err);
                callback(null,result);
            });
        });
    },

    /* On garde la siren de la nouvelle organisation dans le siren_organisation */
    demanderAdhesionOrganisation: function(userId, sirenOrganisation, callback) {
        const sql = `
            UPDATE Utilisateurs
            SET
                siren_organisation = ?,
                etat_demande_adhesion = 'en attente',
                date_demande_adhesion = CURDATE()
            WHERE id = ?
        `;
        db.query(sql, [sirenOrganisation, userId], function (err, result){
            if (err) return callback(err);
            callback(null);
        });
    },

    annulerDemandeOrganisation: function (userId, callback) {
        const sql = `
            UPDATE Utilisateurs
            SET
                siren_organisation_creation = NULL,
                nom_organisation_creation = NULL,
                type_organisation_creation = NULL,
                siege_social_organisation_creation = NULL,
                etat_demande_organisation = NULL,
                date_demande_organisation = NULL,
                etat_demande_adhesion = NULL,
                date_demande_adhesion = NULL
            WHERE id = ?
        `;
        db.query(sql, [userId], function (err, result) {
            if (err) return callback(err);
            callback(null);
        });
    }



}