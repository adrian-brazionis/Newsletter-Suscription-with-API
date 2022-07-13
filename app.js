const express = require('express');
const bodyParser = require('body-parser');
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");


const app = express();
const port = 3000;

mailchimp.setConfig({
    apiKey: "27be204db031edacbb0a6eee925b379b",
    server: "us14",
  });

  
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

app.post("/", (req,res) => {
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;

    const listId = "778aadcbe9";
    const subscribingUser = {
        firstName: fName,
        lastName: lName,
        email: email
    };

    async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
          email_address: subscribingUser.email,
          status: "subscribed",
          merge_fields: {
            FNAME: subscribingUser.firstName,
            LNAME: subscribingUser.lastName
          }
        });

        res.sendFile(__dirname + "/success.html");
      
        console.log(
          `Successfully added contact as an audience member. The contact's id is ${
            response.id
          }.`);

    };
      
    run().catch(e => res.sendFile(__dirname + "/failure.html"));
    
       
});

app.post("/failure", (req,res) => {
    res.redirect("/");
});

app.listen(process.env.PORT || port, () => {
    console.log(`Server running on port ${port}`);
});

//27be204db031edacbb0a6eee925b379b-us14
//778aadcbe9