var mysql = require("mysql");
var pool = mysql.createPool({
    host: "yourhost", 
    user: "your_user",
    password: "your_password",
    database: "your_data_base"
});
module.exports = pool;