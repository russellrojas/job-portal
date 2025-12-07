const express = require('express');
const router = express.Router();
const multer  = require('multer');
const piecesJointes = require('../model/pieces_jointes');
const upload = require('../middlewares/upload');
const path = require('path'); 
const fs = require('fs'); 
const archiver = require('archiver'); // npm install archiver


router.post('/ajoutfichier', upload.single('document'), function(req, res) {
    const fichier = req.file;
    const { offre_emploi, type_document } = req.body;
    const candidat = req.session.userid;

    if (!fichier) {
        return res.status(400).json({ success: false, message: "Aucun fichier n'a été téléchargé." });
    }

    const data = {
        offre_emploi: offre_emploi,
        candidat: candidat,
        nom_fichier: fichier.originalname,
        type_document: type_document,
        chemin: fichier.path,
        taille: fichier.size
    };

    piecesJointes.ajoutFichier(data, function(err, id) {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Erreur lors de l'upload du fichier." });
        }

        piecesJointes.getFichierById(id, function(fichier) {
            if (!fichier) {
                return res.status(500).json({ success: false, message: "Erreur lors de la récupération du fichier." });
            }

            res.json({ success: true, fichier }); //  fichero.date_ajout ya viene en formato 'dd/mm/yyyy'
        });        

    });
});



router.post('/telecharger_fichier', function(req, res) {
    const fichierId = req.body.id;
    piecesJointes.getFichierById(fichierId, function(fichier) {
        res.download(
            path.resolve(fichier.chemin),  
            fichier.nom_fichier           
        );
    });
});



router.post('/supprimer_fichier', function(req, res) {
    const fichierId = req.body.id;
    piecesJointes.getFichierById(fichierId, function(fichier) {
        // Suppresion dans le repertoire
        fs.unlink(fichier.chemin, function(fsErr) {
            if (fsErr && fsErr.code !== 'ENOENT') {
                console.error(fsErr);
                return res.status(500).send("Erreur lors de la suppression du fichier.");
            }
            // suppresion de la BD
            piecesJointes.supprimerFichierById(fichierId, function() {
                // Suppresion de dossier vide
                const dossier = require('path').dirname(fichier.chemin);
                fs.readdir(dossier, function(err, files) {
                    if (!err && files.length === 0) {
                        fs.rmdir(dossier, function() {});
                    }
                    res.redirect("/candidat/ecran_candidat?message=fichier_supprime");
                });
            });
        });
    });
});

router.post('/telecharger_dossier', function(req, res) {
    const candidatId = req.body.candidatId;
    const offreId = req.body.offreId;
    // uploads/<candidatId>/<offreId>/
    const dossierPath = path.resolve('uploads', `${candidatId}`, `${offreId}`);

    if (!fs.existsSync(dossierPath)) {
        return res.status(404).send('Aucun dossier trouvé pour ce candidat et cette offre.');
    }

    const zipName = `dossier_candidat_${candidatId}_offre_${offreId}.zip`;
    res.attachment(zipName);

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    archive.directory(dossierPath, false);

    archive.finalize();
});




module.exports = router;
