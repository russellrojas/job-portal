const DB= require ("../model/connexion.js");
const model= require ("../model/utilisateurs.js");

describe("Model Tests", () => {

    beforeAll(() => {
    // des instructions à exécuter avant le lancement des tests
    });

    afterAll((done) => {
        function callback (err){
            if (err) done (err);
            else done();
        }
        DB.end(callback);
    });

    test("read user",(done)=>{
        nom=null; 
        function cbRead(resultat){
            nom = resultat[0].nom;
            try {
                expect(nom).toBe("luciani");
                done();
            }catch(error) {
                done(error);
            }
        }
        model.read(2, cbRead);
    });

    test("lire toutes les demandes pour devenir Recruteur non Traitees",(done)=>{ 
        function cbRead(resultat){
            try {
                expect(resultat.length).toBeGreaterThan(0);
                done();
            }catch (error) {
                done(error);
            }
        }
        model.readallDemandesRecruteursNonTraitees(cbRead);
    });


    test("lire toutes les demandes pour d'adhésion à une organisation traitees",(done)=>{ 
        function cbRead(resultat){
            try {
                expect(resultat.length).toBeGreaterThan(0);
                done();
            }catch (error) {
                done(error);
            }
        }
        model.readallDemandesAdhesionsTraitees(cbRead);
    });

    test("authentification d'un utilisateur valide",(done)=>{ 
        function cbRead(valid, type_utilisateur){
            try {
                expect(valid).toBeTruthy();
                expect(type_utilisateur).toBe("admin");
                done();
            }catch (error) {
                done(error);
            }
        }
        model.login("lucianileoajaccio@gmail.com","test",cbRead);
    });

    test("test d'authentification d'un utilisateur non valide",(done)=>{ 
        function cbRead(valid, type_utilisateur){
            try {
                expect(valid).toBeFalsy();
                expect(type_utilisateur).toBeNull;
                done();
            }catch (error) {
                done(error);
            }
        }
        model.login("testdauthentificationdunutilisateurnonvalide@pitieee.quilnyaitpersonneaveclamemeadresse","testtestestzjinbnz15AAADLPVE151894-*/*8-55eff-fe*-f8e*",cbRead);
    });
    
    test("vérifier l'ajout et la suppression d'un utilisateur",(done)=>{ 
        function suppression(){
            try {
                model.deleteUserViaEmail("testajoututilisateur@pitiequilnyaitpasuneadressepareil.piiiiitiiiieee",done);
            }catch (error) {
                done(error);
            }
        }
        try{
            model.creation_compte("nom","prenom","tel","testajoututilisateur@pitiequilnyaitpasuneadressepareil.piiiiitiiiieee","mdp",suppression);
        }catch (error) {
            done(error);
        }
    });

})
