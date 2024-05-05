const express = require("express");
const cors = require("cors");
const app = express();
const port = 8383;

app.use(cors());

//MySQL connection
const mysql = require('mysql2');

// create a new MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1786',
  database: 'Recruits'
});

//connect to the MySQL database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL database:', error);
  } else {
    console.log('Connected to MySQL database!');
  }
});

app.get("/api/recruits", function (req, res) {
  connection.query('SELECT DISTINCT Name FROM tblTryOuts', function(err, result, fields) {
    if (err) throw err;
    res.json({message: result});
  });
});
//JSON get request for hello world with cors
app.get("/api/hello", function (req, res) {

  // res.json({ message: "Hello World!" });
  res.json({message: "result"});
  
});


app.listen(port, function () {
  console.log(`app listening on port ${port}!`);
});



