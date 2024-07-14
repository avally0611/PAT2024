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
  database: 'pat_2024'
});

//connect to the MySQL database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL database:', error);
  } else {
    console.log('Connected to MySQL database!');
  }
});

app.get("/api/passwords", function (req, res) {
  connection.query('SELECT password FROM pat_2024.donors', function(err, result, fields) {
    if (err) throw err;
    res.json({message: result});
  });
});
//JSON get request for hello world with cors
app.get("/api/hello", function (req, res) {

  res.json({message: "result"});
  
});


app.listen(port, function () {
  console.log(`app listening on port ${port}!`);
});


//so we will have to use a post request to send the username and password to the server to verify them and then send a boolean back from the server

app.post("/api/verifyLogin", function (req, res) 
{
    const username = req.body.username;
    const password = req.body.password;

    connection.query(`SELECT password FROM pat_2024.donors WHERE username = '${username}'`, function(err, result) 
    {
      if (err) 
      {
        console.error('Error executing query:', err);
        res.status(500).send('Internal server error');
        return;
      }

      if (result.length == 0)
      {
        res.json({message: false});
      }
      else
      {
        if (result[0].password == password)
        {
          res.json({message: true});
        }
        else
        {
          res.json({message: false});
        }
      }
    });

} );


