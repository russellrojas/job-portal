var express = require('express');
const utilisateurs = require('../model/utilisateurs');
const offres_emploi = require('../model/offres_emploi');
const organisations = require('../model/organisations');
const candidatures = require('../model/candidatures');
var router = express.Router();

/* GET users listing. */
router.get('/ecran_recruteur', function (req, res, next) {
  const id= req.session.userid
  organisations.readOrganisationUtilisateur(id,function(organisation) { 
    if(organisation=== null || organisation.etat_demande_adhesion !== "acceptée"){
      return res.redirect('/recruteur/rejoindre_creer_une_organisation');
    }else{
      const siren=organisation.siren;
      offres_emploi.readOffresParOrganisation(siren,function(offresResult) {
        res.render('ecran_recruteur', {
          offres: offresResult,
          organisation: organisation,
          session: req.session,
          filtres : ["Intitulé", "Responsable hiérarchique"]
        });
    });
    }
  });
});

router.post('/gestion_des_candidatures', function (req, res) {
  const userId = req.session.userid;
  const offreId = req.body.offreId;
  offres_emploi.readOffre(offreId, function(offre) {
    candidatures.readCandidatsParOffre(offreId, function (candidats) {
      organisations.readOrganisationUtilisateur(userId, function (organisation) {
        res.render('gestion_des_candidatures', {
          candidats: candidats,
          organisation: organisation,
          offre: offre,
          session: req.session,
          filtres: ["Nom", "Prénom"],
        });
      });
    });
  });
});

router.get('/rejoindre_creer_une_organisation', function (req, res) {
    const userId = req.session.userid;
    organisations.readOrganisationUtilisateur(userId, function(maOrganisation) {
      organisations.readallOrganisations(function(organisations){
        utilisateurs.readInformationOrganisationDunUtilisateur(userId, function(utilisateur) {
          const success = req.session.success || null;
          delete req.session.success;
          const error = req.session.error || null;
          delete req.session.error;     
          res.render('rejoindre_creer_une_organisation', { 
            organisations: organisations,
            session: req.session,
            utilisateur: utilisateur,
            error: error,
            success: success,
            ma_organisation: maOrganisation,
            filtres: ["Nom", "SIREN"]
        });
      });
    });
  });
});



router.post('/demanderAdhesionOrganisation', function(req, res) {
    const userId = req.session.userid;
    const siren = req.body.siren;
    organisations.demanderAdhesionOrganisation(userId, siren, function(err) {
        if (err) {
            req.session.error = "Erreur lors de la demande d'adhésion.";
        } else {
            req.session.success = "Demande d'adhésion envoyée.";
        }
        res.redirect('/recruteur/rejoindre_creer_une_organisation');
    });
});

router.post('/annulerDemandeOrganisation', function (req, res) {
    const userId = req.session.userid;
    organisations.annulerDemandeOrganisation(userId, function (err) {
        if (err) {
            req.session.error = "Erreur lors de l'annulation de la demande.";
        } else {
            req.session.success = "Demande annulée avec succès.";
        }
        res.redirect('/recruteur/rejoindre_creer_une_organisation');
    });
});



router.post('/ajouterOrganisation', function(req, res, next) {
    const userId = req.session.userid;
    const siren = req.body.siren_creation;
    const nom = req.body.nom_creation;
    const type = req.body.type_creation;  
    const siege = req.body.siege_social_creation;

    organisations.ajouterOrganisation(userId, siren, nom, type, siege, function(err) {
        if (err) {
            req.session.error = err.message;
            return res.redirect('/recruteur/rejoindre_creer_une_organisation');

        } else {
          req.session.success="Organisation ajoutée avec succès !"
          res.redirect('/recruteur/rejoindre_creer_une_organisation');
        }
    });
});

module.exports = router;