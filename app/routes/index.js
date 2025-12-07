var express = require('express');
var router = express.Router();
const utilisateurs = require('../model/utilisateurs');
const session = require('../session');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('accueil', {message: ""});
});

router.post('/logout', function(req, res, next) {
  session.deleteSession(req.session, function(){
    res.redirect('/')
  }); 
});


router.get('/creer_un_compte', function(req, res, next) {
  res.render('creer_un_compte', {error: false});
});


router.post('/', function(req, res, next) {
  const user_email = req.body.email;
  const user_mdp = req.body.password;
  result = utilisateurs.login(user_email, user_mdp, function(err, validite_user, id, type_utilisateur, nom, prenom){
    if(validite_user){
      session.creatSession(req.session, id, user_email, type_utilisateur, nom, prenom);
      if(type_utilisateur==="admin")
        res.redirect('/admin/gestion_des_recruteurs')
      else{
        res.redirect('/candidat/ecran_candidat');
      }
    }
    else{
      console.log(validite_user, type_utilisateur);
      res.render('accueil', {message: "Identifiant ou mot de passe incorrect"});
    }
  });
});


router.post('/creer_un_compte', function(req, res, next) {
  const user_nom = req.body.nom;
  const user_prenom = req.body.prenom;
  const user_tel = req.body.telephone;
  const user_email = req.body.email;
  const user_mdp = req.body.password;
  try{result = utilisateurs.creation_compte(user_nom, user_prenom, user_tel, user_email, user_mdp, function(){
    res.render('accueil');
  });
  }
  catch(err){
    console.log(err);
    res.render('creer_un_compte', {error: true});
  };
});
module.exports = router;
