var express = require('express');
const utilisateurs = require('../model/utilisateurs');
const offres = require('../model/offres_emploi');
const organisations = require('../model/organisations');
const candidatures = require('../model/candidatures');
const fichiers = require('../model/pieces_jointes');
var router = express.Router();

/* GET users listing. */

router.get('/ecran_candidat', function (req, res, next) {
    const message = req.query.message || null;
    const userId = req.session.userid;
    offres.readAllOffresEmploiPubliees(function (offresList) {
        candidatures.readSesCandidatures(userId, function (candidaturesList) {
            const offresCandidatees = candidaturesList.map(c => c.offre_emploi); //crea un array (liste) con los id de offreEmploi
            res.render('ecran_candidat', {
                offres: offresList,
                offresCandidatures: offresCandidatees, //se pasa esta lista
                session: req.session,
                message: message,
                filtres : ["Intitulé", "Type métier", "Lieu mission"],
                filtres_customs: [{
                    default_value: "0",
                    type: "number",
                    variable: "Salaire minimum",
                    check_function: `function (input, row) {
                        const salaireCol = row.querySelector('td:nth-child(4)');
                        if (salaireCol) {
                            const salaire = parseFloat(salaireCol.innerText.split(' ')[0].replace('€', ''));
                            return salaire >= parseFloat(input.value);
                        }
                        return false;
                    }`
                    }]
                })
            });
        });
    });


router.post('/candidater', function(req, res, next) {
    const userId = req.session.userid;
    const offreId = req.body.offreEmploiId;
    candidatures.candidater(offreId, userId, function(err) {
        if (err) {
            console.error(err); 
            return res.redirect('/candidat/ecran_candidat?message=erreur');
        }
        req.body.candidatureRecente = 'true';
        res.redirect(307, '/candidat/page_d_une_candidature'); //307 en POST para mantener req.body
    });
});

router.post('/confirmer_candidature', function (req, res) {
    res.redirect('/candidat/ecran_candidat?message=success');
});

router.post('/annuler_candidature', function(req, res) {
    const offreId = req.body.offreEmploiId;
    const userId = req.session.userid;
    candidatures.annulerCandidature(offreId, userId, function(err) {
        if (err) {
            console.error(err);
            return res.redirect("/candidat/ecran_candidat?message=erreur_annulation");
        }
        res.redirect("/candidat/ecran_candidat?message=annulation_success");
    });
});


/* Demande pour devenir Admin */
router.get('/demander_devenir_admin', function (req, res, next) {
    const id = req.session.userid;

    utilisateurs.readDemandeDevenirAdmin(id, function (etatDemandeAdmin) {
        utilisateurs.readoneUser(id, function (utilisateur) {
            organisations.readOrganisationUtilisateur(id, function (organisation) {
                res.render('demander_devenir_admin', {
                    etatDemandeAdmin: etatDemandeAdmin,
                    utilisateur: utilisateur,
                    organisation: organisation, 
                    session: req.session
                });
            });
        });
    });
});


router.post('/demander_devenir_admin', function (req, res, next) {
    utilisateurs.DemanderDevenirAdmin(req.session.userid, function() {
        res.redirect('demander_devenir_admin');
    });
});


/* Demande pour devenir Recruteur */
router.get('/demander_devenir_recruteur', function (req, res, next) {
    const id = req.session.userid;
    utilisateurs.readDemandeDevenirRecruteur(id, function(etatDemandeRecruteur) {
        utilisateurs.readoneUser(id, function(utilisateur) {
            organisations.readOrganisationUtilisateur(id, function (organisation) {
                res.render('demander_devenir_recruteur', {
                    etatDemandeRecruteur: etatDemandeRecruteur,
                    utilisateur: utilisateur,
                    organisation: organisation, 
                    session: req.session
                });
            });
        });
    });  
});


router.post('/demander_devenir_recruteur', function (req, res, next) {
    utilisateurs.DemanderDevenirRecruteur(req.session.userid, function() {
        res.redirect('demander_devenir_recruteur');
    });
});

router.post('/annuler_demander_devenir_admin', function (req, res, next) {
    utilisateurs.annulerDemandeAdmin(req.session.userid, function() {
        res.redirect('demander_devenir_admin');
    });
});

router.post('/annuler_demander_devenir_recruteur', function (req, res, next) {
    utilisateurs.annulerDemandecruteur(req.session.userid, function() {
        res.redirect('demander_devenir_recruteur');
    });
});

router.get('/gestion_de_ses_candidatures', function (req, res, next) {
    candidatures.readSesCandidatures(req.session.userid, function (candidatures) {
        res.render('gestion_de_ses_candidatures', {  
            candidatures: candidatures,
            session: req.session,
            filtres_checkbox: [{
                label: "Voir les offres non actives",
                variable: "etat",
                check_function: `function (checkbox, row) {
                    const statusCol = row.querySelector('td:nth-child(7)').innerText.trim();
                    if (checkbox.checked === true || statusCol === "actif") {
                        return true;
                    }
                    return false;
                }`
            }]
        });
    });
});


router.post('/page_d_une_candidature', function (req, res) {
    const id = req.session.userid;
    const offreEmploiId = req.body.offreEmploiId; 
    const candidatureRecente = req.body.candidatureRecente === 'true'; 
    console.log("candidature recente: ",candidatureRecente);
    candidatures.readUneCandidature(id, offreEmploiId, function(rcandidature) {
        fichiers.getFichiersCandidatPourOffre(id, offreEmploiId, function(err, fichiersList) {
            if (err) return res.status(500).send("Erreur lecture fichiers");
            res.render('page_d_une_candidature', {
                candidature: rcandidature,
                candidatureRecente: candidatureRecente || false,
                fichiers: fichiersList,
                offre_emploi_id: offreEmploiId, // para el upload
                session: req.session
            });
        });
    });
});



router.post('/page_d_une_offre', function (req, res) {
    const offreId = req.body.offreId; 
    const message = req.query.message;
    const userId = req.session.userid;
    offres.readOffre(offreId, function (resultOffre) {
        candidatures.readSesCandidatures(userId, function (candidaturesList) {
            const offresCandidatees = candidaturesList.map(c => c.offre_emploi); 
            res.render('page_d_une_offre', {
                offre: resultOffre,
                offresCandidatures: offresCandidatees,
                session: req.session,
                message: message
            });
        });
    });
});


module.exports = router;