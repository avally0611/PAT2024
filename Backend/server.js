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


// JSON get request for hello world - basically testing server works
app.get("/api/hello", function (req, res) {
  // Respond with a JSON message
  res.json({message: "result"});
});

// Start the server and listen on the specified port
app.listen(port, function () {
  console.log(`app listening on port ${port}!`);
});

// Method header to verify logins
app.post("/api/verifyLogin", function (req, res) {
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;

    console.log(username, password);

    // Query to select password from donors table where username matches
    connection.query('SELECT password FROM pat_2024.donors WHERE username = ?', [username], function(err, result) {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal server error');
        return;
      }

      if (result.length == 0) {
        res.send('false');
        res.status(404).send('User not found');
      } else {
        if (result[0].password == password) {
          res.send('true');
          console.log('true');
        } else {
          res.send('false');
        }
      }
    });
});

// Add user - used in signup screen
app.post("/api/addUser", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const pnum = req.body.pnum;

    console.log(username, password, fname, lname, email, pnum);

    // Check if username already exists
    connection.query('SELECT * FROM pat_2024.donors WHERE username = ?', [username], function(err, result) {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Unsuccessful');
        return;
      }

      if (result.length > 0) {
        res.status(409).send('Username already exists');
        return;
      } else {
        // Perform an insert query
        connection.query('INSERT INTO pat_2024.donors (first_name, last_name, email, phone_number, username, password) VALUES (?, ?, ?, ?, ?, ?)', [fname, lname, email, pnum, username, password], function(err, result) {
          if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Unsuccessful');
            return;
          }
        
          console.log('true');
          res.send('Successful');
        });
      }
    });
});

// Get charities - used in charities screen
app.get("/api/charities", function (req, res) {
    // Query to select all charities
    connection.query(`SELECT * FROM pat_2024.charities`, function(err, result) {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal server error');
        return;
      }

      console.log(result);
      res.send(result);
    });
});

// Get requests - used in requests screen
app.get("/api/requests", function (req, res) {
    // This will hold JSON array with charity objects which have a name and an array of requests (item name and quantity needed)
    var requests = [];

    // Get the list of charities which have a request
    connection.query(`SELECT DISTINCT name FROM pat_2024.requests INNER JOIN charities ON requests.charity_id = charities.charity_id WHERE status = 0`, function(err, resultCharities) {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Failed in getting list of charities');
        return;
      }

      // We have to have a count of how many charities we have to get requests for because if you use forEach it will not wait for the queries to finish and then it will automatically send the response
      var numberOfCharities = resultCharities.length;

      if (numberOfCharities == 0) {
        res.send(requests);
      }

      resultCharities.forEach(charity => {
        connection.query(`SELECT request_id, item_name, quantity FROM pat_2024.requests INNER JOIN charities ON requests.charity_id = charities.charity_id  INNER JOIN items ON items.item_id = requests.item_id WHERE name = ? AND status = 0`, [charity.name], function(err, result) {
          if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Failed in getting the items for the charity');
          }

          requests.push({name: charity.name, requests: result});
          console.log({name: charity.name, requests: result});

          numberOfCharities--;

          if (numberOfCharities == 0) {
            res.send(requests);
          }
        });
      });
    });
});

// This is a post request to add a donation to the database
app.post("/api/addDonation", function (req, res) {
    // Gets all fields from the body
    const username = req.body.username;
    const cartItem = req.body.cartItem;
    const request_id = cartItem.request_id;
    const donation_quantity = cartItem.donation_quantity;

    console.log(username);

    // Gets the donor id using username (we can assume username is unique as there is a method that makes sure each donor has unique username)
    connection.query('SELECT donor_id FROM pat_2024.donors WHERE username = ?', [username], function(err, result) {
      if (err) {
        console.error('Error getting id:', err);
        res.status(500).send('error getting donor id');
        return;
      }

      if (result.length === 0) {
        res.status(404).send('Donor not found');
        return;
      }
      console.log(result);
      const donor_id = parseInt(result[0].donor_id);

      // Then inserts into donations table using donor id that we got from the previous query
      connection.query('INSERT INTO pat_2024.donations (donor_id) VALUES (?)', [donor_id], function(err, result) {
        if (err) {
          console.error('error inserting into donations:', err);
          res.status(500).send('error inserting into donations');
          return;
        }
        
        console.log('true');
        // When you do an insert query, you can use insertId to get the id of the row that was inserted (since it is a primary key)
        const donation_id = parseInt(result.insertId);

        // Insert into donations_entry using donation id that we got and body elements
        connection.query('INSERT INTO pat_2024.donations_entry (donation_id, request_id, quantity) VALUES (?, ?, ?)', [donation_id, request_id, donation_quantity], function(err, result) {
          if (err) {
            console.error('Error inserting into donations_entry :', err);
            res.status(500).send('error inserting into donations_entry');
            return;
          }
          
          console.log('true');

          // NOW WE HAVE TO UPDATE REQUESTS DB

          // Get the quantity needed of the request from the body
          const quantityNeeded = parseInt(cartItem.donation_quantity_needed);

          if (donation_quantity == quantityNeeded) {
            // Update status of request to 0 to show that it is fulfilled
            connection.query('UPDATE pat_2024.requests SET status = 1 WHERE request_id = ?', [request_id], function(err, result) {
              if (err) {
                console.error('Error updating request status:', err);
                res.status(500).send('error updating request status');
                return;
              }
              
              console.log('true');
              res.send('true');
            });
          } else if (donation_quantity < quantityNeeded) {
            // Update the quantity needed in the requests table
            const updatedQuantity = quantityNeeded - donation_quantity;
            connection.query('UPDATE pat_2024.requests SET quantity = ? WHERE request_id = ?', [updatedQuantity, request_id], function(err, result) {
              if (err) {
                console.error('Error updating request quantity:', err);
                res.status(500).send('error updating request quantity');
                return;
              }
              
              console.log('true');
              res.send('true');
            });
          }
        });
      });
    });
});

// Add monetary donation
app.post("/api/addMonetaryDonation", function (req, res) {
    const username = req.body.username;
    const charityName = req.body.charity;
    const quantity = req.body.amount;

    // Gets the donor id using username (we can assume username is unique as there is a method that makes sure each donor has unique username)
    connection.query('SELECT donor_id FROM pat_2024.donors WHERE username = ?', [username], function(err, result) {
      if (err) {
        console.error('Error getting id:', err);
        res.status(500).send('error getting donor id');
        return;
      }

      if (result.length === 0) {
        res.status(404).send('Donor not found');
        return;
      }
      const donor_id = parseInt(result[0].donor_id);

      // Then inserts into donations table using donor id that we got from the previous query
      connection.query('INSERT INTO pat_2024.donations (donor_id) VALUES (?)', [donor_id], function(err, result) {
        if (err) {
          console.error('error inserting into donations:', err);
          res.status(500).send('error inserting into donations');
          return;
        }
        
        // When you do an insert query, you can use insertId to get the id of the row that was inserted (since it is a primary key)
        const donation_id = parseInt(result.insertId);

        // Get charity id using charity name
        connection.query('SELECT charity_id FROM pat_2024.charities WHERE name = ?', [charityName], function(err, result) {
          if (err) {
            console.log('Error getting charity id:', err);
            console.error('Error getting charity id:', err);
            res.status(500).send('error getting charity id');
            return;
          }

          if (result.length === 0) {
            res.status(404).send('Charity not found');
            return;
          }
          console.log(result);
          const charity_id = parseInt(result[0].charity_id);
        
          // Insert into monetary_donations using donation id that we got and body elements
          connection.query('INSERT INTO pat_2024.donations_monetary_entry (donation_id, charity_id, quantity) VALUES (?, ?, ?)', [donation_id, charity_id, quantity], function(err) {
            if (err) {
              console.error('Error inserting into monetary_donations :', err);
              res.status(500).send('error inserting into monetary_donations');
              return;
            }
            
            console.log('true');
            res.send('true');
          });
        });
      });
    });
});

// Get the user's details and send to profile
app.post("/api/getUserDetails", function (req, res) {
    const username = req.body.savedUsername;
    console.log(username);

    // Query to select user details from donors table where username matches
    connection.query('SELECT * FROM pat_2024.donors WHERE username = ?', [username], function(err, result) {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Internal server error', details: err.message });
      }

      console.log("Query result:", result);

      if (result.length === 0) {
        console.log("No user found for username:", username);
        return res.status(404).json({ error: 'User not found' });
      }

      console.log("Sending user details:", result);
      res.json(result);
    });
});

// Update user details
app.post("/api/updateDetails", function (req, res) {
    const donor_id = req.body.donor_id;
    const username = req.body.username;
    const fname = req.body.first_name;
    const lname = req.body.last_name;
    const email = req.body.email;
    const pnum = req.body.phone_number;

    // Query to update user details in donors table where donor_id matches
    connection.query('UPDATE pat_2024.donors SET first_name = ?, last_name = ?, email = ?, phone_number = ?, username = ? WHERE donor_id = ?', [fname, lname, email, pnum, username, donor_id], function(err, result) {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Unsuccessful');
        return;
      }

      console.log('true');
      res.send('Successful');
    });
});
