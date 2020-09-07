// Dependencies
const express = require("express");
const jsforce = require("jsforce");
const path = require("path");
const bodyParser = require("body-parser");
const conn = new jsforce.Connection();
const cors = require("cors");
const dotenv = require("dotenv");

// Environment
dotenv.config();
console.log("Is it working? Ping ->", process.env.PING);

// Express config
const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// JSForce connection initial test
conn.login(
  process.env.SF_USERNAME,
  process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
  function(loginErr, loginResult) {
    if (loginErr) {
      return console.error(loginErr);
    }
    console.log("We logged in", loginResult);
    console.log(conn.accessToken);
    console.log(conn.instanceUrl);
    console.log("User ID: " + loginResult.id);
    console.log("Org ID: " + loginResult.organizationId);
  }
);

/* Routes */

//////////// Account /////////////

// Account -> all

app.get("/account/all", function(req, res) {
  let records = [];
  let q = "SELECT Id, Name, AccountNumber, Industry, Type FROM Account";
  // Connection login setup
  conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
    function(loginErr, loginResult) {
      if (loginErr) {
        return console.error(loginErr);
      }
      console.log("Account -> all");

      /* Start query logic */

      let query = conn
        .query(q)
        .on("record", function(record) {
          // console.log(record);
          records.push(record);
          // console.log(records);
        })
        .on("end", function() {
          console.log("total in database : " + query.totalSize);
          console.log("total fetched : " + query.totalFetched);
          res.json(records);
        })
        .on("error", function(err) {
          console.error(err);
        })
        .run({ autoFetch: true, maxFetch: 4000 }); // synonym of Query#execute();

      /* End query logic */
    }
  );
});

// Account -> single (getAccountInfo)

app.get("/account/:id", function(req, res) {
  let accountId = req.params.id;
  console.log(accountId);
  let account = {};
  let q = "SELECT Id, Name FROM Account";
  // Connection login setup
  conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
    function(loginErr, loginResult) {
      if (loginErr) {
        return console.error(loginErr);
      }
      console.log("Account -> single(:id)");

      /* Start query logic */

      let query = conn
        .sobject("Account")
        .retrieve(accountId, function(queryError, queryResult) {
          if (queryError) {
            return console.error(queryError);
          }
          console.log("Name : " + queryResult.Name);
          account = queryResult;
          console.log(account);
          res.send(account);
        });

      /* End query logic */
    }
  );
});

//////////// Contact /////////////

// Contact -> all

app.get("/contact/all", function(req, res) {
  let records = [];
  let q = "SELECT Id, Name FROM Contact";
  // Connection login setup
  conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
    function(loginErr, loginResult) {
      if (loginErr) {
        return console.error(loginErr);
      }
      console.log("Contact -> all");

      /* Start query logic */

      let query = conn
        .query(q)
        .on("record", function(record) {
          // console.log(record);
          records.push(record);
          // console.log(records);
        })
        .on("end", function() {
          console.log("total in database : " + query.totalSize);
          console.log("total fetched : " + query.totalFetched);
          console.log(records);
          res.json(records);
        })
        .on("error", function(err) {
          console.error(err);
        })
        .run({ autoFetch: true, maxFetch: 4000 }); // synonym of Query#execute();

      /* End query logic */
    }
  );
});

// Contact -> single (getContactDetail)

app.get("/contact/:id", function(req, res) {
  let contactId = req.params.id;
  console.log(contactId);
  let contact = {};
  let q = "SELECT Id, Name FROM Contact";
  // Connection login setup
  conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
    function(loginErr, loginResult) {
      if (loginErr) {
        return console.error(loginErr);
      }
      console.log("Contact -> single(:id)");

      /* Start query logic */

      let query = conn
        .sobject("Contact")
        .retrieve(contactId, function(queryError, queryResult) {
          if (queryError) {
            return console.error(queryError);
          }
          console.log("Name : " + queryResult.Name);
          contact = queryResult;
          console.log(contact);
          res.send(contact);
        });

      /* End query logic */
    }
  );
});

//////////// Case /////////////

// Case -> all

app.get("/case/all", function(req, res) {
  let records = [];
  let q =
    "SELECT Id, Subject, Type, CaseNumber, Description, OwnerId, Reason, SourceId, CreatedDate, ClosedDate, Product__c FROM Case";
  // Connection login setup
  conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
    function(loginErr, loginResult) {
      if (loginErr) {
        return console.error(loginErr);
      }
      console.log("Case -> all");

      /* Start query logic */

      let query = conn
        .query(q)
        .on("record", function(record) {
          // console.log(record);
          records.push(record);
          // console.log(records);
        })
        .on("end", function() {
          console.log("total in database : " + query.totalSize);
          console.log("total fetched : " + query.totalFetched);
          res.json(records);
        })
        .on("error", function(err) {
          console.error(err);
        })
        .run({ autoFetch: true, maxFetch: 4000 }); // synonym of Query#execute();

      /* End query logic */
    }
  );
});

// Case -> single (getCaseDetail)

app.get("/case/:id", function(req, res) {
  let caseId = req.params.id;
  console.log(caseId);
  let caseting = {};
  // Connection login setup
  conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
    function(loginErr, loginResult) {
      if (loginErr) {
        return console.error(loginErr);
      }
      console.log("Case -> single(:id)");

      /* Start query logic */

      let query = conn
        .sobject("Case")
        .retrieve(caseId, function(queryError, queryResult) {
          if (queryError) {
            return console.error(queryError);
          }
          console.log("Name : " + queryResult.Subject);
          caseting = queryResult;
          console.log(caseting);
          res.send(caseting);
        });

      /* End query logic */
    }
  );
});

//////////// EmailMessage /////////////

// EmailMessage -> all

app.get("/email-message/all", function(req, res) {
  let records = [];
  let q =
    "SELECT ParentId, Status, Subject, TextBody, HtmlBody, MessageDate, CreatedById FROM EmailMessage";
  // Connection login setup
  conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
    function(loginErr, loginResult) {
      if (loginErr) {
        return console.error(loginErr);
      }
      console.log("EmailMessage -> all");

      /* Start query logic */

      let query = conn
        .query(q)
        .on("record", function(record) {
          // console.log(record);
          records.push(record);
          // console.log(records);
        })
        .on("end", function() {
          console.log("total in database : " + query.totalSize);
          console.log("total fetched : " + query.totalFetched);
          res.json(records);
        })
        .on("error", function(err) {
          console.error(err);
        })
        .run({ autoFetch: true, maxFetch: 4000 }); // synonym of Query#execute();

      /* End query logic */
    }
  );
});

// EmailMessage -> all(related to a case)

app.get("/email-message/related/:caseId", function(req, res) {
  let records = [];
  let caseId = req.params.caseId;
  console.log(`THIS IS THE CASE ID TO QUERY WITH!!!! ${caseId}`);
  let q = `SELECT ParentId, Status, Subject, TextBody, MessageDate FROM EmailMessage WHERE ParentId = '${caseId}'`;
  // Connection login setup
  conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
    function(loginErr, loginResult) {
      if (loginErr) {
        return console.error(loginErr);
      }
      console.log("Related EmailMessage -> all(:caseId");

      /* Start query logic */

      let query = conn
        .query(q)
        .on("record", function(record) {
          // console.log(record);
          records.push(record);
          // console.log(records);
        })
        .on("end", function() {
          console.log("total in database : " + query.totalSize);
          console.log("total fetched : " + query.totalFetched);
          res.json(records);
        })
        .on("error", function(err) {
          console.error(err);
        })
        .run({ autoFetch: true, maxFetch: 4000 }); // synonym of Query#execute();

      /* End query logic */
    }
  );
});

//////////// User (Typically to check the account manager[owner]) /////////////

app.get("/user/:id", function(req, res) {
  let userId = req.params.id;
  console.log(userId);
  let user = {};
  // Connection login setup
  conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
    function(loginErr, loginResult) {
      if (loginErr) {
        return console.error(loginErr);
      }
      console.log("User -> single(:id)");

      /* Start query logic */

      let query = conn
        .sobject("User")
        .retrieve(userId, function(queryError, queryResult) {
          if (queryError) {
            return console.error(queryError);
          }
          console.log("Name : " + queryResult.Name);
          user = queryResult;
          console.log(user);
          res.send(user);
        });

      /* End query logic */
    }
  );
});

////////////////////////////////////////// OLD

app.get("/home", function(req, res) {
  var conn = new jsforce.Connection();
  let records = [];
  conn.login(
    process.env.USERNAME,
    process.env.PASSWORD + process.env.SECURITY_TOKEN,
    function(err, res) {
      if (err) {
        return console.error(err);
      }
      console.log(conn.res);
      console.log(conn.accessToken);
      console.log(conn.instanceUrl);
      conn.query("SELECT Id, Name FROM Account", function(err, res) {
        if (err) {
          return console.error(err);
        }
        console.log(res);
      });
      var query = conn
        .query("SELECT Id, Name FROM Account")
        .on("record", function(record) {
          records.push(record);
        })
        .on("end", function() {
          console.log("total in database : " + query.totalSize);
          console.log("total fetched : " + query.totalFetched);
        })
        .on("error", function(err) {
          console.error(err);
        })
        .run({ autoFetch: true, maxFetch: 4000 });
      console.log(res);
    }
  );
  res.json(records);
});

////////////// OAuth2.0 flow

//
// Get authorization url and redirect to it.
//
app.get("/oauth2/auth", function(req, res) {
  res.redirect(oauth2.getAuthorizationUrl({ scope: "api id web" }));
});
//
// Pass received authorization code and get access token
//
app.get("/oauth2/callback", function(req, res) {
  var conn = new jsforce.Connection({ oauth2: oauth2 });
  var code = req.param("code");
  conn.authorize(code, function(err, userInfo) {
    if (err) {
      return console.error(err);
    }
    // Now you can get the access token, refresh token, and instance URL information.
    // Save them to establish connection next time.
    console.log(conn.accessToken);
    console.log(conn.refreshToken);
    console.log(conn.instanceUrl);
    console.log("User ID: " + userInfo.id);
    console.log("Org ID: " + userInfo.organizationId);
    // ...
    res.send("success"); // or your desired response
  });
});

// Endpoint1
app.get("/enpoint1", (req, res) => {
  console.log(req, res);
});

// Endpoint - Create post
app.post("/endpoint2", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.send(req.headers);
});

module.exports = app;
