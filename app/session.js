const sessions = require("express-session");
module.exports = {
    init: () => {
        return sessions({
            secret: "xxxzzzyyyaaabbbcc",
            saveUninitialized: true,
            cookie: { maxAge: 3600 * 1000, httpOnly: true}, // 60 minutes
            resave: false,
        });
    },
    creatSession: function (session, id, email, type_utilisateur, nom, prenom) {
        if (!session) {console.log("session undefined"); return false; }
        session.userid = id;
        session.email = email;
        session.type_utilisateur = type_utilisateur;
        session.nom = nom;
        session.prenom = prenom;
        session.save(function (err) {
            if (err) {
                console.error("Erreur lors de l'enregistrement de la session :", err);
            } else {
                console.log("Session enregistrée avec succès.");
            }
        });
        return session;
    },
    isConnected: (session, type_utilisateur) => {
        if (!session || !session.userid || session.userid === undefined){ return false;} 
        if (type_utilisateur && session.type_utilisateur !== type_utilisateur){return false;} 
        return true;
    },
    deleteSession: function (session, callback) {
        session.destroy(function () {
            callback(); // on appelle le callback uniquement après destruction
        });
    },
};
    