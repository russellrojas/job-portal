const { NULL } = require('mysql/lib/protocol/constants/types.js');
var db = require('./connexion.js');
module.exports = {
    readAllOffresEmploiPubliees: function (callback) {
        const query = `
            SELECT DISTINCT
                O.id AS id,
                FP.intitule,
                FP.type_metier,
                FP.lieu_mission,
                FP.salaire_min,
                FP.salaire_max
            FROM OffresEmploi O
            JOIN FichePostes FP ON O.fiche_poste = FP.id
            WHERE O.etat = 'publiée';
        `;
        db.query(query, function (err, results) {
            if (err) return callback(err);
            callback(results);
        });
    },

    readOffresParOrganisation: function (siren, callback) {
        const query = `
            SELECT 
                O.id,
                FP.intitule,
                FP.responsable_hierarchique,
                O.date_validite,
                O.indication,
                O.etat
            FROM OffresEmploi O
            JOIN FichePostes FP ON O.fiche_poste = FP.id
            WHERE FP.siren_organisation = ?
        `;
        db.query(query, [siren], function (err, results) {
            if (err) return callback(err);
            callback(results);
        });
    },

    readOffre: function (id, callback) {
        const query = `
            SELECT 
                O.etat AS statut_offre,
                O.date_validite AS date_validite,
                O.indication AS indication,
                O.id,
                FP.intitule AS intitule_poste,
                FP.statut_poste,
                FP.type_metier,
                FP.lieu_mission,
                FP.rythme,
                FP.salaire_min,
                FP.salaire_max,
                FP.description,
                FP.responsable_hierarchique,
                Org.nom AS organisation_nom  
            FROM 
                OffresEmploi O
            JOIN 
                FichePostes FP ON O.fiche_poste = FP.id
            JOIN
                Organisations Org ON FP.siren_organisation = Org.siren
            WHERE 
                O.id = ?;`;
        db.query(query, [id], function (err, results) {
            if (err) return callback(err);
            const offre = results[0];

            if (offre && offre.date_validite) {
                offre.date_validite = new Date(offre.date_validite).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            }
            callback(offre); 
        });
    }
}