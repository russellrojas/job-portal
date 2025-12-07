var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cors=require('cors');  //td vues
//var session = require('express session')
var apiRouter = require('./routes/api');  //td vues

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var candidatRouter = require('./routes/candidat');
var recruteurRouter = require('./routes/recruteur');
var fichierRouter = require('./routes/gestion_des_fichiers');

var app = express();
var session = require("./session.js");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session.init());


// check user before app.use (path, router)

app.all("*", function (req, res, next) {
  if (req.path === '/favicon.ico') return next(); // Ignore la favicon
 
  const nonSecurePaths = [ "/", "/creer_un_compte"];
  const adminPaths = ["/admin/gestion_des_recruteurs", "/admin/gestion_des_adhesions_aux_organisations", "/admin/gestion_des_admins", "/admin/gestion_des_organisations",
    "/admin/gestion_des_utilisateurs", "/admin/modification_d_un_utilisateur"]; //list des urls admin
  const recruteurPaths = ["/recruteur/ecran_recruteur","/recruteur/gestion_des_candidatures"]; //list des urls recruteur

  /* debugging des sessions
  console.log("req.path : ", req.path);
  console.log("non secure include : ", nonSecurePaths.includes(req.path));
  console.log("admin include : ", adminPaths.includes(req.path));
  console.log("recruteur include : ", adminPaths.includes(req.path));
  console.log("isConnected : ", session.isConnected(req.session));
*/

  
  //if (req.path.startsWith("/api") || nonSecurePaths.includes(req.path)) return next();  PARA TD VUE/REST
  if (nonSecurePaths.includes(req.path)) return next(); 
  //authenticate user
  if (adminPaths.includes(req.path)) {
    if (session.isConnected(req.session, "admin")) { return next();} 
    else
    res
    .status(403)
    .render("error", { message: " Unauthorized access", error: {} });
  } else {
    if (recruteurPaths.includes(req.path)) {
      if (session.isConnected(req.session, "recruteur")) return next();
      else
      res
      .status(403)
      .render("error", { message: " Unauthorized access", error: {} });
    } else {
      if (session.isConnected(req.session)) return next();
      // not authenticated
      else res.redirect("/");
    }
  } 
}); 

app.use(cors());  //primero
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/candidat',candidatRouter);
app.use('/recruteur',recruteurRouter);
app.use('/gestion_des_fichiers',fichierRouter);
app.use('/api',apiRouter);   //td vues

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
