var express = require('express');
const utilisateurs = require("../model/utilisateurs");
const offres_emploi = require('../model/offres_emploi');
var router = express.Router();

router.get('/users', function (req, res, next) { 
    result=utilisateurs.readall(function(result){
        res.status(200).json(result);   
    }); 
}); 

router.get('/liste_offres',function(req,res,next){
    result=offres_emploi.readAllOffresEmploiPubliees(function(result){
        res.status(200).json(result); 
    }); 
});

module.exports = router;
