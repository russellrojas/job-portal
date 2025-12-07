CREATE TABLE Organisations(
    siren varchar(9) PRIMARY KEY,
    nom varchar(50) NOT NULL,
    types varchar(50) NOT NULL,
    siege_social varchar(50) NOT NULL
);

CREATE TABLE Utilisateurs(
    id integer AUTO_INCREMENT,
    nom varchar(50) NOT NULL,
    prenom varchar(50) NOT NULL,
    telephone varchar(20) NOT NULL,
    date_creation date NOT NULL,
    actif boolean NOT NULL,
    type_utilisateur ENUM('admin', 'recruteur','candidat') NOT NULL,
    siren_organisation varchar(9),
    email varchar(128) UNIQUE NOT NULL,
    mdp varchar(64) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (siren_organisation) REFERENCES Organisations(siren) ON DELETE SET NULL,
    date_demande_adhesion date,
    date_demande_recruteur date,
    date_demande_admin date,
    date_demande_organisation date,
    etat_demande_adhesion ENUM('en attente', 'acceptée', 'refusée'),
    etat_demande_recruteur ENUM('en attente', 'acceptée', 'refusée'),
    etat_demande_admin ENUM('en attente', 'acceptée', 'refusée'),
    etat_demande_organisation ENUM('en attente', 'acceptée', 'refusée'),
    siren_organisation_creation varchar(9),
    nom_organisation_creation varchar(50),
    type_organisation_creation varchar(50),
    siege_social_organisation_creation varchar(50) 
);

CREATE TABLE FichePostes(
    id integer PRIMARY KEY AUTO_INCREMENT,
    intitule varchar(30) NOT NULL,
    statut_poste varchar(30) NOT NULL,
    type_metier varchar(30) NOT NULL,
    lieu_mission varchar(50) NOT NULL,
    rythme varchar(30) NOT NULL,
    salaire_min decimal(10,2) NOT NULL,
    salaire_max decimal(10,2) NOT NULL,
    description text NOT NULL,
    siren_organisation varchar(9) NOT NULL,
    responsable_hierarchique varchar(50) NOT NULL,
    FOREIGN KEY (siren_organisation) REFERENCES Organisations(siren)
);

CREATE TABLE OffresEmploi(
    id integer PRIMARY KEY AUTO_INCREMENT,
    etat ENUM('non publiée', 'publiée', 'expirée') NOT NULL,
    date_validite date NOT NULL,
    indication text NOT NULL,
    fiche_poste integer NOT NULL,
    FOREIGN KEY (fiche_poste) REFERENCES FichePostes(id)
);

CREATE TABLE Candidatures(
    offre_emploi integer NOT NULL,
    candidat integer NOT NULL,
    date_candidature date NOT NULL,
    FOREIGN KEY (offre_emploi) REFERENCES OffresEmploi(id),
    FOREIGN KEY (candidat) REFERENCES Utilisateurs(id),
    PRIMARY KEY (offre_emploi, candidat)
);

CREATE TABLE PiecesJointes (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    offre_emploi INTEGER NOT NULL,
    candidat INTEGER NOT NULL,
    nom_fichier VARCHAR(255) NOT NULL,
    type_document ENUM('cv', 'photo', 'lettre_motivation', 'piece_identite', 'diplome', 'autre') NOT NULL DEFAULT 'autre',
    chemin VARCHAR(255) NOT NULL,
    taille INTEGER NOT NULL, 
    date_ajout DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (offre_emploi, candidat) REFERENCES Candidatures(offre_emploi, candidat)
);

