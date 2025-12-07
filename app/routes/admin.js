var express = require('express');
const utilisateurs = require('../model/utilisateurs');
var router = express.Router();

/* gestion_des_recruteurs */

router.get('/gestion_des_recruteurs', function (req, res, next) {
  result=utilisateurs.readallDemandesRecruteursNonTraitees(function(result_non_traitees){
    result=utilisateurs.readallDemandesRecruteursTraitees(function(result_traitees){
      res.render('gestion_des_recruteurs', {
        demandes_recruteurs_non_traitees: result_non_traitees,
        demandes_recruteurs_traitees: result_traitees,
        session: req.session,
        filtres_non_traitees: ["Nom", "Prénom", "Email", "Telephone", "Date"],
        filtres_traitees: ["Nom", "Prénom", "Email", "Telephone", "Etat"]
      });
    });
  });
});


router.post('/gestion_des_recruteurs/accepter', function (req, res, next) {
  const id = req.body.id;
  const type_utilisateur = req.body.type_utilisateur;
  result=utilisateurs.accepterDemandeRecruteur(id, type_utilisateur,function(result_non_traitees){
    res.redirect('/admin/gestion_des_recruteurs');
  });
});


router.post('/gestion_des_recruteurs/refuser', function (req, res, next) {
  const id = req.body.id;
  result=utilisateurs.refuserDemandeRecruteur(id, function(result_non_traitees){
    res.redirect('/admin/gestion_des_recruteurs');
  });
});


router.post('/gestion_des_recruteurs/retraiter', function (req, res, next) {
  const id = req.body.id;
  const type_utilisateur = req.body.type_utilisateur;
  result=utilisateurs.retraiterDemandeRecruteur(id, type_utilisateur,function(result_non_traitees){
    res.redirect('/admin/gestion_des_recruteurs');
  });
});


/* gestion_des_admins */
router.get('/gestion_des_admins', function (req, res, next) {
  result=utilisateurs.readallDemandesAdminsNonTraitees(function(result_non_traitees){
    result=utilisateurs.readallDemandesAdminsTraitees(function(result_traitees){
      res.render('gestion_des_admins', {
        demandes_admins_non_traitees: result_non_traitees,
         demandes_admins_traitees: result_traitees,
          session: req.session,
          filtres_non_traitees: ["Nom", "Prénom", "Email", "Telephone", "Date"],
          filtres_traitees: ["Nom", "Prénom", "Email", "Telephone", "Etat"]
        });
    });
  });
});


router.post('/gestion_des_admins/accepter', function (req, res, next) {
  const id = req.body.id;
  result=utilisateurs.accepterDemandeAdmin(id, function(result_non_traitees){
    res.redirect('/admin/gestion_des_admins');
  });
});


router.post('/gestion_des_admins/refuser', function (req, res, next) {
  const id = req.body.id;
  result=utilisateurs.refuserDemandeAdmin(id, function(result_non_traitees){
    res.redirect('/admin/gestion_des_admins');
  });
});


router.post('/gestion_des_admins/retraiter', function (req, res, next) {
  const id = req.body.id;
  const etat_demande_recruteur = req.body.etat_demande_recruteur;
  result=utilisateurs.retraiterDemandeAdmin(id, etat_demande_recruteur, function(result_non_traitees){
    res.redirect('/admin/gestion_des_admins');
  });
});


/* gestion_des_adhesions_aux_organisations */
router.get('/gestion_des_adhesions_aux_organisations', function (req, res, next) {
  result=utilisateurs.readallDemandesAdhesionsNonTraitees(function(result_non_traitees){
    result=utilisateurs.readallDemandesAdhesionsTraitees(function(result_traitees){
      res.render('gestion_des_adhesions_aux_organisations', {
        demandes_adhesions_non_traitees: result_non_traitees, 
        demandes_adhesions_traitees: result_traitees, 
        session: req.session,
        filtres_non_traitees: ["Nom", "Prénom", "Email", "Telephone", "Date"],
        filtres_traitees: ["Nom", "Prénom", "Email", "Siren", "Nom organisation", "Etat"]
      });
    });
  });
});


router.post('/gestion_des_adhesions_aux_organisations/accepter', function (req, res, next) {
  const id = req.body.id;
  result=utilisateurs.accepterDemandeAdhesionOrganisation(id, function(result_non_traitees){
    res.redirect('/admin/gestion_des_adhesions_aux_organisations');
  });
});


router.post('/gestion_des_adhesions_aux_organisations/refuser', function (req, res, next) {
  const id = req.body.id;
  result=utilisateurs.refuserDemandeAdhesionOrganisation(id,function(result_non_traitees){
    res.redirect('/admin/gestion_des_adhesions_aux_organisations');
  });
});


router.post('/gestion_des_adhesions_aux_organisations/retraiter', function (req, res, next) {
  const id = req.body.id;
  result=utilisateurs.retraiterDemandeAdhesionOrganisation(id, function(result_non_traitees){
    res.redirect('/admin/gestion_des_adhesions_aux_organisations');
  });
});


/* gestion_des_organisations */
router.get('/gestion_des_organisations', function (req, res, next) {
  result=utilisateurs.readallDemandesOrganisationsNonTraitees(function(result_non_traitees){
    result=utilisateurs.readallDemandesOrganisationsTraitees(function(result_traitees){
      res.render('gestion_des_organisations', {
        demandes_organisations_non_traitees: result_non_traitees, 
        demandes_organisations_traitees: result_traitees, 
        session: req.session,
        filtres_non_traitees: ["Siren", "Nom", "Type", "Siège social", "Date"],
        filtres_traitees: ["Siren", "Nom", "Type", "Siège social", "Etat"]
      });
    });
  });
});


router.post('/gestion_des_organisations/accepter', function (req, res, next) {
  const id = req.body.id;
  const type_utilisateur = req.body.type_utilisateur;
  const siren_organisation_creation = req.body.siren_organisation_creation;
  const nom_organisation_creation = req.body.nom_organisation_creation;
  const type_organisation_creation = req.body.type_organisation_creation;
  const siege_social_organisation_creation = req.body.siege_social_organisation_creation;

  result=utilisateurs.accepterDemandeOrganisation(id, type_utilisateur, siren_organisation_creation, nom_organisation_creation,
    type_organisation_creation, siege_social_organisation_creation, function(err, result_non_traitees){
      if (err) {
        console.error("Erreur lors de l'acceptation de la demande d'organisation:", err);
      }
      res.redirect('/admin/gestion_des_organisations');
  });
});


router.post('/gestion_des_organisations/refuser', function (req, res, next) {
  const id = req.body.id;
  result=utilisateurs.refuserDemandeOrganisation(id, function(result_non_traitees){
    res.redirect('/admin/gestion_des_organisations');
  });
});


router.post('/gestion_des_organisations/retraiter', function (req, res, next) {
  const id = req.body.id;
  const siren_organisation_creation = req.body.siren_organisation_creation;
  const etat_demande_organisation = req.body.etat_demande_organisation;
  result=utilisateurs.retraiterDemandeOrganisation(id, siren_organisation_creation, etat_demande_organisation, function(err, result_non_traitees){
    if (err) {
      console.error("Erreur lors de l'acceptation de la demande d'organisation:", err);
    }
    res.redirect('/admin/gestion_des_organisations');
  });
});


/* gestion des utilisateurs */
router.get('/gestion_des_utilisateurs', function (req, res, next) {
  result=utilisateurs.readall(function(result){
    res.render('gestion_des_utilisateurs', {
      users: result, 
      session: req.session,
      filtres: ["Nom", "Prénom", "Email", "Telephone", "Type"],
      filtres_checkbox: [{
        label:"Afficher les utilisateurs non actifs",
        variable:"actif",
        check_function: `(checkbox, row) => {
          const nomCell = row.querySelector('td:nth-child(1)'); //on prend l'élément de la première colonne de la ligne concernée
          const isActif = !nomCell.querySelector('strike'); //on regarde qu'il ne soit pas barré
          return checkbox.checked ? true : isActif;
        }`
      }]
    });
  });
});

router.post('/modification_d_un_utilisateur', function (req, res, next) {
  const user = req.body;
  res.render('modification_d_un_utilisateur', {user: user, message: "", session: req.session});
});

router.post('/modification_d_un_utilisateur/mise_a_jour', function (req, res, next) {
  const user = req.body;
  const actif = req.body.actif === 'true';
  const siren_organisation = req.body.siren_organisation ? req.body.siren_organisation : null;
  //console.log("user:", user);
  utilisateurs.updateUser(user.id, user.nom, user.prenom, user.telephone, actif, user.type_utilisateur, siren_organisation, user.email, function(error){
    if (error) {
      if (error.errno === 1062) {
        message = "L'email " + user.email + " est déjà utilisé par un autre utilisateur.";
      } else {
        message = error.message;
      }
      console.error("Erreur lors de l'update user:", error);
      user_non_modif = utilisateurs.readoneUser(user.id, function(user_non_modif){
        res.render('modification_d_un_utilisateur', {user:  user_non_modif, message: message, session: req.session});
      });
    } else {
      res.render('modification_d_un_utilisateur', {user:  user, message: "mise à jour réussie", session: req.session});
    }
  }); 
});

module.exports = router;
