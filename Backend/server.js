const express = require("express");
const cors = require("cors");
const app = express();
const port = 8383;

app.use(cors());
app.use(express.json());
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


//JSON get request for hello world - basically testing server works
app.get("/api/hello", function (req, res) {

  res.json({message: "result"});
  
});


app.listen(port, function () {
  console.log(`app listening on port ${port}!`);
});


//method header to verify logins
app.post("/api/verifyLogin", function (req, res) 
{
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;

    console.log(username, password);

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
        res.send('false');
      }
      else
      {
        if (result[0].password == password)
        {
          res.send('true');
          console.log('true');
        }
        else
        {
          res.send('false');
        }
      }
    });

} );

//add user - used in signup screen
app.post("/api/addUser", function (req, res) 
{
    const username = req.body.username;
    const password = req.body.password;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const pnum = req.body.pnum;

    console.log(username, password, fname, lname, email, pnum);

    //perform a insert query
    connection.query(`INSERT INTO pat_2024.donors (first_name, last_name, email, phone_number, username, password) VALUES ("'${fname}'", "'${lname}'", "'${email}'", "'${pnum}'", "'${username}'", "'${password}'");`, function(err, result) 
    {
      if (err) 
      {
        console.error('Error executing query:', err);
        res.status(500).send('Internal server error');
        return;
      }
      
      console.log('true');
      res.send('true');
      



    });

} );


