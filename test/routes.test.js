const request= require("supertest");
const app = require("../app");

describe("Test the root path", () => { 
    test("It should response the GET method", done => { 
        request(app).get("/").then(response => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe("test de la route Admin",()=>{
    test("GET /admin/gestion_des_recruteurs",done =>{
        request(app).get("/admin/gestion_des_recruteurs").then(reponse => {
            expect(reponse.statusCode).toBe(200);
            done();
        });
    });
    test("GET /admin/gestion_des_adhesions_aux_organisations",done =>{
        request(app).get("/admin/gestion_des_adhesions_aux_organisations").then(reponse => {
            expect(reponse.statusCode).toBe(200); 
            done();
        });
    });

    test("GET /admin/gestion_des_admins",done =>{
        request(app).get("/admin/gestion_des_admins").then(reponse => {
            expect(reponse.statusCode).toBe(200); 
            done();
        });
    });

    test("GET /admin/gestion_des_organisations",done =>{
        request(app).get("/admin/gestion_des_organisations").then(reponse => {
            expect(reponse.statusCode).toBe(200); 
            done();
        });
    });

    test("GET /admin/gestion_des_utilisateurs",done =>{
        request(app).get("/admin/gestion_des_utilisateurs").then(reponse => {
            expect(reponse.statusCode).toBe(200); 
            done();
        });
    });

    /*
    test("GET /admin/modification_d_un_utilisateur",done =>{   //VERIFIER L'ERREUR
        request(app).get("/admin/modification_d_un_utilisateur").then(reponse => {
            expect(reponse.statusCode).toBe(200); 
            done();
        });
    });
    */
    

});

// tratar de variar con otras cosas que no sean 200
describe("test de la route Candidat",()=>{
    test("GET /candidat/ecran_candidat",done =>{
        request(app).get("/candidat/ecran_candidat").then(reponse => {
            expect(reponse.statusCode).toBe(200);
            done();
        });
    }); 

    test("GET /candidat/demander_devenir_admin",done =>{
        request(app).get("/candidat/demander_devenir_admin").then(reponse => {
            expect(reponse.statusCode).toBe(200);
            done();
        });
    }); 

    test("GET /candidat/demander_devenir_recruteur",done =>{
        request(app).get("/candidat/demander_devenir_recruteur").then(reponse => {
            expect(reponse.statusCode).toBe(200);
            done();
        });
    }); 

    test("GET /candidat/gestion_de_ses_candidatures",done =>{
        request(app).get("/candidat/gestion_de_ses_candidatures").then(reponse => {
            expect(reponse.statusCode).toBe(200);
            done();
        });
    }); 

    test("GET /candidat/page_d_une_candidature",done =>{
        request(app).get("/candidat/page_d_une_candidature").then(reponse => {
            expect(reponse.statusCode).toBe(200);
            done();
        });
    }); 

    test("GET /candidat/page_d_une_offre",done =>{
        request(app).get("/candidat/page_d_une_offre").then(reponse => {
            expect(reponse.statusCode).toBe(200);
            done();
        });
    }); 

    test("GET /candidat/rejoindre_creer_une_organisation",done =>{
        request(app).get("/candidat/rejoindre_creer_une_organisation").then(reponse => {
            expect(reponse.statusCode).toBe(200);
            done();
        });
    }); 
    //post?


});

describe("test de la route Recruteur",()=>{

    test("GET /recruteur/ecran_recruteur",done =>{
        request(app).get("/recruteur/ecran_recruteur").then(reponse => {
            expect(reponse.statusCode).toBe(200);
            done();
        });
    }); 

    test("GET /recruteur/gestion_des_candidatures",done =>{
        request(app).get("/recruteur/gestion_des_candidatures").then(reponse => {
            expect(reponse.statusCode).toBe(200);
            done();
        });
    }); 

});
