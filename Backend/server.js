const express = require("express");
const cors = require("cors");
const app = express();
const port = 8383;

app.use(cors());
app.use(express.json());

console.log("Connecting to SQL");
//MySQL connection
const mysql = require('mysql2');

// create a new MySQL connection
const connection = mysql.createConnection({
  host: '127.0.0.1',
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

console.log("Connection created");


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
        res.status(404).send('User not found');
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

//get charities - used in charities screen
app.get("/api/charities", function (req, res) 
{
    connection.query(`SELECT * FROM pat_2024.charities`, function(err, result) 
    {
      if (err) 
      {
        console.error('Error executing query:', err);
        res.status(500).send('Internal server error');
        return;
      }

      console.log(result);
      res.send(result);

    });

}
);

app.get("/api/requests", function (req, res) 
{

  //this will hold JSON array with charity objects which have a name and an array of requests (item name and quantity needed)
    var requests = [];

    connection.query(`SELECT DISTINCT name FROM pat_2024.requests INNER JOIN charities ON requests.charity_id = charities.charity_id`, function(err, resultCharities) 
    {
      if (err) 
      {
        console.error('Error executing query:', err);
        res.status(500).send('Failed in getting list of charities');
        return;
      }

      //we jhave to have a count of how many charities we have to get requests for because if you use forEach it will not wait for the queries to finish and then it will automatically sned the response
      var numberOfCharities = resultCharities.length;

      if (numberOfCharities == 0)
      {
        res.send(requests);
      }

      resultCharities.forEach(charity => {

        connection.query(`SELECT request_id, item_name, quantity FROM pat_2024.requests INNER JOIN charities ON requests.charity_id = charities.charity_id  INNER JOIN items ON items.item_id = requests.item_id WHERE name = '${charity.name}'`, function(err, result)
        {
          if (err) 
          {
            console.error('Error executing query:', err);
            res.status(500).send('Failed in getting the items for the charity');
            
          }

          requests.push({name: charity.name,requests: result});
          console.log({name: charity.name, requests: result});

          numberOfCharities --;

          if (numberOfCharities == 0)
          {
            res.send(requests);
          }
                  
        });
        
      });

      

    });


});


app.post("/api/addDonation", function (req, res)
{
  //we passed an array 
    const username = req.body.username;
    const donor_id = 0;
    const cartItem = req.body.cartItem;
    const request_id = cartItem.request_id;
    const donation_quantity = cartItem.donation_quantity;

    connection.query(`SELECT donor_id FROM pat_2024.donors WHERE username = '${username}'`, function(err, result) 
    {
      if (err) 
      {
        console.error('Error getting id:', err);
        res.status(500).send('error getting donor id');
        return;
      }

      if (result.length === 0) {
        res.status(404).send('Donor not found');
        return;
      }
      console.log(result);
      donor_id = result[0].donor_id;

    });

    console.log(donor_id)

    connection.query(`INSERT INTO pat_2024.donations (donor_id) VALUES ("'${donor_id}'");`, function(err, result) 
    {
      if (err) 
      {
        console.error('error inserting into donations:', err);
        res.status(500).send('error inserting into donations');
        return;
      }
      
      console.log('true');
      res.send('true');



    });

    const donation_id = result.insertId;


    //insert into donations_entry
    connection.query(`INSERT INTO pat_2024.donations_entry (donor_id, request_id, quantity) VALUES ("'${donor_id}'", "'${request_id}'", "'${donation_quantity}'");`, function(err, result) 
    {
      if (err) 
      {
        console.error('Error inserting into donations_entry :', err);
        res.status(500).send('eror inserting into donations_entry');
        return;
      }
      
      console.log('true');
      res.send('true');



    });





});
