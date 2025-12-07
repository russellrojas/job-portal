var db = require('./connexion.js');
module.exports = {

readall: function (callback){
    db.query("select * from Utilisateurs", function (err, results){
        if (err) return callback(err);
        callback(results);
    });
},
 
login: function (email, password, callback){
    sql = "SELECT id, mdp, type_utilisateur, nom, prenom FROM Utilisateurs WHERE email = ? ;";
    rows = db.query(sql, email, function (err, results){
        if (err) {return callback(err);}
        if (results.length == 1 && results[0].mdp === password){
            callback(null, true, results[0].id, results[0].type_utilisateur, results[0].nom, results[0].prenom);
        } else {
            callback(null, false, null, null, null, null);
        }
    });
},
// hack@gmail.com'; INSERT INTO Utilisateurs(nom, prenom, telephone, date_creation, actif, email, mdp, type_utilisateur) VALUES  ('Hackeur', 'Malveillant', '0123456789', '2023-10-01', true, 'hackeur@hackeur.malveillance', '1234','admin');--

creation_compte: function (nom, prenom, telephone, email, mdp, callback){
    sql = `INSERT INTO Utilisateurs(nom, prenom, telephone, date_creation, actif, email, mdp, type_utilisateur) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    var ladate=new Date()
    rows = db.query(sql, [nom, prenom, telephone, ladate.getFullYear()+"-"+(ladate.getMonth()+1)+"-"+ladate.getDate(), true, email, mdp, "candidat"], function (err, results){
        if (err) return callback(err);
        callback();
    });
},


readoneUser: function(id,callback){
    db.query("SELECT nom, prenom, telephone, email, type_utilisateur, actif, siren_organisation, date_creation FROM Utilisateurs WHERE id = ?",id,function(err,result){
        if(err) return callback(err);
        callback(result[0]);
    });
},


deleteUserViaEmail: function(email, callback){
    db.query("DELETE FROM Utilisateurs WHERE email = ?", email, function(err,result){
        if(err) return callback(err);
        callback();
    });
},

deleteUserViaId: function(id, callback){
    db.query("DELETE FROM Utilisateurs WHERE id = ?", id, function(err,result){
        if(err) return callback(err);
        callback();
    });
},

updateUser: function(id, nom, prenom, telephone, actif, type_utilisateur, siren_organisation, email, callback){
    //console.log(id, nom, prenom, telephone, actif, siren_organisation, email);
    query = `UPDATE Utilisateurs SET nom = ?, prenom = ?, telephone = ?, actif = ?, type_utilisateur=?, siren_organisation = ?, email = ? WHERE id = ?`;
    res = db.query(query, [nom, prenom, telephone, actif, type_utilisateur, siren_organisation, email, id], function (err, results){
        callback(err); // si error est null, alors le callback traitera un succès
        //console.log("User updated successfully", res);
    });
},


readallDemandesRecruteursNonTraitees: function (callback) {
    db.query("select id, nom, prenom, email, telephone, type_utilisateur, date_demande_recruteur from Utilisateurs where etat_demande_recruteur = 'en attente'", function
    (err, results) {
    if (err) return callback(err);
    callback(results);
    });
},


readallDemandesRecruteursTraitees: function (callback) {
    db.query("select id, nom, prenom, email, telephone, type_utilisateur, etat_demande_recruteur from Utilisateurs where etat_demande_recruteur IS NOT NULL and etat_demande_recruteur != 'en attente'", function
    (err, results) {
    if (err) return callback(err);
    callback(results);
    });
},


readallDemandesOrganisationsNonTraitees: function (callback) {
    db.query("select id, type_utilisateur, nom_organisation_creation, type_organisation_creation, siren_organisation_creation, siege_social_organisation_creation, date_demande_organisation, etat_demande_organisation from Utilisateurs where etat_demande_organisation = 'en attente'", function
    (err, results) {
    if (err) return callback(err);
    callback(results);
    });
},


readallDemandesOrganisationsTraitees: function (callback) {
    db.query("select id, nom_organisation_creation, type_organisation_creation, siren_organisation_creation, siege_social_organisation_creation, etat_demande_organisation, etat_demande_organisation from Utilisateurs where etat_demande_organisation IS NOT NULL and etat_demande_organisation != 'en attente'", function
    (err, results) {
    if (err) return callback(err);
    callback(results);
    });
},


readallDemandesAdhesionsNonTraitees: function (callback) {
    db.query(`select id, siren_organisation, Utilisateurs.nom, Organisations.nom as nom_organisation, prenom, email, date_demande_adhesion from Utilisateurs 
    JOIN Organisations ON siren_organisation = Organisations.siren where etat_demande_adhesion = 'en attente'`,
    function(err, results) {
    if (err) return callback(err);
    callback(results);
    });
},


readallDemandesAdhesionsTraitees: function (callback) {
    db.query(`select id, siren_organisation, Utilisateurs.nom, Organisations.nom as nom_organisation, prenom, email, etat_demande_adhesion from Utilisateurs 
    JOIN Organisations ON siren_organisation = Organisations.siren where etat_demande_adhesion IS NOT NULL and etat_demande_adhesion != 'en attente'`,
    function(err, results) {
    if (err) return callback(err);
    callback(results);
    });
},


readallDemandesAdminsNonTraitees: function (callback) {
    db.query("select id, nom, prenom, email, telephone, date_demande_admin from Utilisateurs where etat_demande_admin = 'en attente'", function
    (err, results) {
    if (err) return callback(err);
    callback(results);
    });
},


readallDemandesAdminsTraitees: function (callback) {
    db.query("select id, nom, prenom, email, telephone, etat_demande_admin, etat_demande_recruteur from Utilisateurs where etat_demande_admin IS NOT NULL and etat_demande_admin != 'en attente'", function
    (err, results) {
    if (err) return callback(err);
    callback(results);
    });
},


readallDemandesAdminsNonTraitees: function (callback) {
    db.query("select id, nom, prenom, email, telephone, date_demande_admin from Utilisateurs where etat_demande_admin = 'en attente'", function
    (err, results) {
    if (err) return callback(err);
    callback(results);
    });
},


/* Demande pour devenir Admin*/ 
readDemandeDevenirAdmin: function (id, callback) {
    db.query("SELECT etat_demande_admin FROM Utilisateurs WHERE id = ?",[id],function (err, results) {
            if (err) return callback(err, null);
            return callback(results[0].etat_demande_admin); 
        }
    );
},

DemanderDevenirAdmin: function (id, callback) {
    db.query("UPDATE Utilisateurs SET etat_demande_admin='en attente' WHERE id = ?",[id],function (err) {
        if (err) return callback(err);
        callback(null);
    });
},


/* Demande pour devenir Recruteur*/ 
readDemandeDevenirRecruteur: function (id, callback) {
    db.query("SELECT etat_demande_recruteur FROM Utilisateurs WHERE id = ?",[id],function (err, results){
        if (err) return callback(err,null);
        callback(results[0].etat_demande_recruteur);
    });
},


DemanderDevenirRecruteur: function (id, callback) {
    db.query("UPDATE Utilisateurs SET etat_demande_recruteur = 'en attente' WHERE id = ?",[id],function (err) {
        if (err) return callback(err);
        callback(null);
    });
},

annulerDemandecruteur: function (id, callback) {
    db.query("UPDATE Utilisateurs SET etat_demande_recruteur = NULL WHERE id = ?",[id],function (err) {
        if (err) return callback(err);
        callback(null);
    });
},

annulerDemandeAdmin: function (id, callback) {
    db.query("UPDATE Utilisateurs SET etat_demande_admin= NULL WHERE id = ?",[id],function (err) {
        if (err) return callback(err);
        callback(null);
    });
},


/* Demande Adhésion Organisation */ 
accepterDemandeAdhesionOrganisation: function(id, callback){
    db.query("UPDATE Utilisateurs SET etat_demande_adhesion='acceptée' WHERE id = ?", id, function(err,result){
        if(err) return callback(err);
        callback();
    });
},


refuserDemandeAdhesionOrganisation: function(id, callback){
    db.query("UPDATE Utilisateurs SET etat_demande_adhesion='refusée' WHERE id = ?", id, function(err,result){
        if(err) return callback(err);
        callback();
    });
},


retraiterDemandeAdhesionOrganisation: function(id, callback){
    db.query("UPDATE Utilisateurs SET etat_demande_adhesion='en attente' WHERE id = ?", id, function(err,result){
        if(err) return callback(err);
        callback();
    });
},


/* Demande création Organisation */ 
accepterDemandeOrganisation: function(id, type_utilisateur, siren_organisation_creation, nom_organisation_creation,
    type_organisation_creation, siege_social_organisation_creation, callback){
    db.query("INSERT INTO Organisations VALUES(?, ?, ?, ?)",
        [siren_organisation_creation, nom_organisation_creation, type_organisation_creation, siege_social_organisation_creation], function(err, result){
        if(err) return callback(err);
        db.query("UPDATE Utilisateurs SET etat_demande_organisation='acceptée', etat_demande_adhesion='acceptée', siren_organisation = ? WHERE id = ?",
            [siren_organisation_creation, id], function(err, result){
            if(err) return callback(err);
            if (type_utilisateur !== "admin") { // on garde le role admin si on le possède déjà
                db.query("UPDATE Utilisateurs SET type_utilisateur = 'recruteur' WHERE id = ?",
                [id], function(err, result){
                    if(err) return callback(err);
                    callback();
                });
            } else {
               callback(); 
            }
        });
    });
},


refuserDemandeOrganisation: function(id, callback){
    db.query("UPDATE Utilisateurs SET etat_demande_organisation='refusée' WHERE id = ?", id, function(err,result){
        if(err) return callback(err);
        callback();
    });
},


retraiterDemandeOrganisation: function(id, siren_organisation_creation, etat_demande_organisation, callback){
    if (etat_demande_organisation === 'acceptée') { // on supprime l'organisation créée en enlevant les permissions recruteurs des utilisateurs associés
        db.query("UPDATE Utilisateurs SET etat_demande_adhesion = NULL, siren_organisation = NULL WHERE siren_organisation = ?", siren_organisation_creation, function(err,result){
            if(err) return callback(err);    
            db.query("DELETE FROM Organisations WHERE siren = ?", siren_organisation_creation, function(err,result){
                if(err) return callback(err);
                db.query("UPDATE Utilisateurs SET etat_demande_organisation='en attente' WHERE id = ?", id, function(err,result){
                    if(err) return callback(err);
                    callback();
                });
            });
        });
    } else {
        db.query("UPDATE Utilisateurs SET etat_demande_organisation='en attente' WHERE id = ?", id, function(err,result){
            if(err) {return callback(err);};
            callback();
        });
    }
},


/* Demande Recruteur */ 
accepterDemandeRecruteur: function(id, type_utilisateur, callback){
    if(type_utilisateur === 'admin'){ // on laisse les admins à leur role
        db.query("UPDATE Utilisateurs SET etat_demande_recruteur='acceptée' WHERE id = ?", id, function(err,result){
            if(err) return callback(err);
            callback();
        });
    }
    else{
        db.query("UPDATE Utilisateurs SET etat_demande_recruteur='acceptée', type_utilisateur='recruteur' WHERE id = ?", id, function(err,result){
            if(err) return callback(err);
            callback();
        });
    }
},


refuserDemandeRecruteur: function(id, callback){
    db.query("UPDATE Utilisateurs SET etat_demande_recruteur='refusée' WHERE id = ?", id, function(err,result){
        if(err) return callback(err);
        callback();
    });
},


retraiterDemandeRecruteur: function(id, type_utilisateur, callback){
    if (type_utilisateur === 'admin'){ // on garde le role admin pendant la période de retraitement
        db.query("UPDATE Utilisateurs SET etat_demande_recruteur='en attente' WHERE id = ?", id, function(err,result){
        if(err) return callback(err);
        callback();
    });
    } else {
        db.query("UPDATE Utilisateurs SET etat_demande_recruteur='en attente', type_utilisateur='candidat' WHERE id = ?", id, function(err,result){
        if(err) return callback(err);
        callback();
    });
    }
},


/* Demande Admin */ 
accepterDemandeAdmin: function(id, callback){ 
    db.query("UPDATE Utilisateurs SET etat_demande_admin='acceptée', type_utilisateur='admin' WHERE id = ?", id, function(err,result){
        if(err) return callback(err);
        callback();
    });
},


refuserDemandeAdmin: function(id, callback){
    db.query("UPDATE Utilisateurs SET etat_demande_admin='refusée' WHERE id = ?", id, function(err,result){
        if(err) return callback(err);
        callback();
    });
},


retraiterDemandeAdmin: function(id, etat_demande_recruteur, callback){
    if(etat_demande_recruteur === "acceptée"){ //on garde le role recruteur durant la période de retraitement
        db.query("UPDATE Utilisateurs SET etat_demande_admin='en attente', type_utilisateur='recruteur' WHERE id = ?", id, function(err,result){
        if(err) return callback(err);
        callback();
    });
    } else {
        db.query("UPDATE Utilisateurs SET etat_demande_admin='en attente', type_utilisateur='candidat' WHERE id = ?", id, function(err,result){
            if(err) return callback(err);
            callback();
        });
    }
},

/*information de la organisation d'un utilisateur*/
readInformationOrganisationDunUtilisateur: function (userId, callback) {
    const query = `
        SELECT 
            siren_organisation, 
            siren_organisation_creation, 
            etat_demande_organisation, 
            etat_demande_adhesion,
            nom_organisation_creation
        FROM Utilisateurs
        WHERE id = ?
    `;
    db.query(query, [userId], function (err, results) {
        if (err) return callback(err);
        if (results.length === 0) return callback(null);
        callback(results[0]);
    });
}

}
