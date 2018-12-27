const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
const port = process.env.PORT;

require('dotenv').config({ path: 'variables.env' });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(port || 3000, console.log(`Server running on port ${port}.`));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/signup.html`);
});

app.post('/', (req, res) => {
  let firstName = req.body.inputFirstName;
  let lastName = req.body.inputLastName;
  let emailAddress = req.body.inputEmailAddress;

  let data = {
    members: [
      {
        email_address: emailAddress,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  jsonData = JSON.stringify(data);

  let options = {
    url: 'https://us2.api.mailchimp.com/3.0/lists/5bd5b5bafc',
    method: 'POST',
    headers: {
      "Authorization": `re ${process.env.MAILCHIMP_KEY}`
    },
    body: jsonData
  };

  request(options, (err, response, body) => {
    if (err || response.statusCode != "200") {
      res.sendFile(`${__dirname}/failure.html`);
    } else {
      res.sendFile(`${__dirname}/success.html`);
    }
  });
});

app.post('/failure', (req, res) => {
  res.redirect('/');
});

// c59d359e29892ffa2c2ec0dbf53c89cb-us2

// 5bd5b5bafc