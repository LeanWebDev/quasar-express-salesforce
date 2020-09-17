// Dependencies
const express = require("express");
const jsforce = require("jsforce");
const path = require("path");
const bodyParser = require("body-parser");
const conn = new jsforce.Connection({});
const cors = require("cors");
const dotenv = require("dotenv");

// Environment
dotenv.config();
console.log("Is it working? Ping ->", process.env.PING);
console.log("Is it working? Password ->", process.env.SF_PASSWORD);

// Express config
const app = express();
const port = process.env.PORT;
app.use(cors());

// Needed for POSTing
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

// Account -> update

app.post("/account/update", function(req, res) {
  console.log("Got body:", req.body);
  let accountId = req.body.accountId;
  let website = req.body.website;
  let phone = req.body.phone;
  let industry = req.body.industry;
  let numberOfEmployees = req.body.numberOfEmployees;
  // Billing
  let billingStreet = req.body.billingStreet;
  let billingCity = req.body.billingCity;
  let billingState = req.body.billingState;
  let billingPostalCode = req.body.billingPostalCode;
  let billingCountry = req.body.billingCountry;
  // Shipping
  let shippingStreet = req.body.shippingStreet;
  let shippingCity = req.body.shippingCity;
  let shippingState = req.body.shippingState;
  let shippingPostalCode = req.body.shippingPostalCode;
  let shippingCountry = req.body.shippingCountry;
  let params = [
    accountId,
    website,
    phone,
    industry,
    numberOfEmployees,
    billingStreet,
    billingCity,
    billingState,
    billingPostalCode,
    billingCountry,
    shippingStreet,
    shippingCity,
    shippingState,
    shippingPostalCode,
    shippingCountry
  ];
  console.log("Here are the params -->" + params);
  // Connection login setup
  conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
    function(loginErr, loginResult) {
      if (loginErr) {
        return console.error(loginErr);
      }
      console.log("Login result: " + loginResult);
      console.log("Account -> update");

      /* Start query logic */

      let query = conn.sobject("Account").update(
        {
          Id: accountId,
          Website: website,
          Phone: phone,
          Industry: industry,
          NumberOfEmployees: numberOfEmployees,
          BillingStreet: billingStreet,
          BillingCity: billingCity,
          BillingState: billingState,
          BillingPostalCode: billingPostalCode,
          BillingCountry: billingCountry,
          ShippingStreet: shippingStreet,
          ShippingCity: shippingCity,
          ShippingState: shippingState,
          ShippingPostalCode: shippingPostalCode,
          ShippingCountry: shippingCountry
        },
        function(err, ret) {
          if (err || !ret.success) {
            return console.error(err, ret);
          }
          console.log("Updated this account : " + ret.id);
          console.log(ret);
          res.send(ret);
        }
      );

      /* End query logic */
    }
  );
});

//////////// Contact /////////////

// Contact -> all

app.get("/contact/all", function(req, res) {
  let records = [];
  let q = "SELECT Id, Name, Department FROM Contact";
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

// Contact => update
app.post("/contact/update", function(req, res) {
  console.log("Got body:", req.body);
  let contactId = req.body.contactId;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let phone = req.body.phone;
  let department = req.body.department;
  let params = [contactId, firstName, lastName, email, phone, department];
  console.log("Here are the params -->" + params);
  // Connection login setup
  conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
    function(loginErr, loginResult) {
      if (loginErr) {
        return console.error(loginErr);
      }
      console.log("Login result: " + loginResult);
      console.log("Contact -> update");

      /* Start query logic */

      let query = conn.sobject("Contact").update(
        {
          Id: contactId,
          FirstName: firstName,
          LastName: lastName,
          Email: email,
          Phone: phone,
          Department: department
        },
        function(err, ret) {
          if (err || !ret.success) {
            return console.error(err, ret);
          }
          console.log("Updated this contact : " + ret.id);
          console.log(ret);
          res.send(ret);
        }
      );

      /* End query logic */
    }
  );
});

//////////// Case /////////////

// Case -> all

app.get("/case/all", function(req, res) {
  let records = [];
  let q =
    "SELECT Id, Subject, Status, Type, CaseNumber, Description, OwnerId, Reason, SourceId, CreatedDate, ClosedDate, Product__c FROM Case ORDER BY CreatedDate DESC";
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

// Case -> describe(Reason) (Option select fields metadata)

app.get("/case/describe/reason", function(req, res) {
  // Connection login setup
  conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
    function(loginErr, loginResult) {
      if (loginErr) {
        return console.error(loginErr);
      }
      console.log("Case -> describe(Reason)");

      /* Start query logic */

      let query = conn.sobject("Case").describe(function(err, meta) {
        if (err) {
          return console.error(err);
        }
        console.log("Getting the reason options");
        console.log("Label : " + meta.label);
        console.log("Num of Fields : " + meta.fields.length);
        // console.log("Reason options" + meta.fields);
        // Loop through to find the Case reason options with https://usefulangle.com/post/3/javascript-search-array-of-objects
        let reasonFieldIndex = -1;
        for (let i = 0; i < meta.fields.length; i++) {
          if (meta.fields[i].name == "Reason") {
            reasonFieldIndex = i;
            break;
          }
        }
        reasonFieldOptions = meta.fields[reasonFieldIndex].picklistValues;

        // Attempting to map into the desired [{label: "", value: ""}] form
        // Using Array.prototype.map() methods

        //
        res.send(reasonFieldOptions);
      });

      /* End query logic */
    }
  );
});

// Case -> describe(Type) (Option select fields metadata)

app.get("/case/describe/type", function(req, res) {
  // Connection login setup
  conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
    function(loginErr, loginResult) {
      if (loginErr) {
        return console.error(loginErr);
      }
      console.log("Case -> describe(Type)");

      /* Start query logic */

      let query = conn.sobject("Case").describe(function(err, meta) {
        if (err) {
          return console.error(err);
        }
        console.log("Getting the type options");
        console.log("Label : " + meta.label);
        console.log("Num of Fields : " + meta.fields.length);
        // console.log("Type options" + meta.fields);
        // Loop through to find the Case type options with https://usefulangle.com/post/3/javascript-search-array-of-objects
        let typeFieldIndex = -1;
        for (let i = 0; i < meta.fields.length; i++) {
          if (meta.fields[i].name == "Type") {
            typeFieldIndex = i;
            break;
          }
        }
        typeFieldOptions = meta.fields[typeFieldIndex].picklistValues;

        // Attempting to map into the desired [{label: "", value: ""}] form
        // Using Array.prototype.map() methods

        //
        res.send(typeFieldOptions);
      });

      /* End query logic */
    }
  );
});

// Case -> new

app.post("/case/new", function(req, res) {
  console.log("Got body:", req.body);
  let accountId = req.body.accountId;
  let subject = req.body.subject;
  let reason = req.body.reason;
  let type = req.body.type;
  let description = req.body.description;
  let origin = "Atlas";
  let params = [accountId, subject, reason, type, description, origin];
  console.log("Here are the params -->" + params);
  // Connection login setup
  conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
    function(loginErr, loginResult) {
      if (loginErr) {
        return console.error(loginErr);
      }
      console.log("Login result: " + loginResult);
      console.log("Case -> new");

      /* Start query logic */

      let query = conn.sobject("Case").create(
        {
          AccountId: accountId,
          Subject: subject,
          Reason: reason,
          Type: type,
          Description: description,
          Origin: origin
        },
        function(err, ret) {
          if (err || !ret.success) {
            return console.error(err, ret);
          }
          console.log("Created case id : " + ret.id);
          console.log(ret);
          res.send(ret);
        }
      );

      /* End query logic */
    }
  );
});

// Case -> related (to this account)

app.get("/case/related/:accountId", function(req, res) {
  let records = [];
  let accountId = req.params.accountId;
  console.log(`THIS IS THE ACCOUNT ID TO QUERY WITH!!!! ${accountId}`);

  let q = `SELECT Id, Subject, Status, Type, CaseNumber, Description, OwnerId, Reason, Origin, CreatedDate, ClosedDate FROM Case WHERE AccountId = '${accountId}' ORDER BY CreatedDate DESC LIMIT 20`;
  // Connection login setup
  conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
    function(loginErr, loginResult) {
      if (loginErr) {
        return console.error(loginErr);
      }
      console.log("Related Cases for this account -> all(:accountId");

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

//////////// EmailMessage /////////////

// EmailMessage -> all

app.get("/email-message/all", function(req, res) {
  let records = [];
  let q =
    "SELECT ParentId, Status, Subject, TextBody, HtmlBody, MessageDate, CreatedById FROM EmailMessage ORDER BY MessageDate DESC";
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
  let q = `SELECT ParentId, Status, Subject, TextBody, MessageDate FROM EmailMessage WHERE ParentId = '${caseId}' ORDER BY MessageDate DESC`;
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

// EmailMessage -> new

app.post("/email-message/new", function(req, res) {
  console.log("Got body:", req.body);
  let parentId = req.body.parentId;
  let subject = req.body.subject;
  let textBody = req.body.textBody;
  // let createdById = req.body.createdById;
  let messageDate = req.body.messageDate;
  let params = [parentId, subject, textBody, messageDate];
  console.log("Here are the params -->" + params);
  // Connection login setup
  conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
    function(loginErr, loginResult) {
      if (loginErr) {
        return console.error(loginErr);
      }
      console.log("Login result: " + loginResult);
      console.log("Case -> new");

      /* Start query logic */

      let query = conn.sobject("EmailMessage").create(
        {
          ParentId: parentId,
          Subject: subject,
          TextBody: textBody,
          // CreatedById: createdById,
          MessageDate: messageDate
        },
        function(err, ret) {
          if (err || !ret.success) {
            return console.error(err, ret);
          }
          console.log("Created EmailMessage id : " + ret.id);
          console.log(ret);
          res.send(ret);
        }
      );

      /* End query logic */
    }
  );
});

/////// Products ////////////

// Product -> all

app.get("/product/all", function(req, res) {
  let records = [];
  let q =
    "SELECT ProductCode, Name, Description, Family, StockKeepingUnit, DisplayUrl FROM Product2";
  // Connection login setup
  conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
    function(loginErr, loginResult) {
      if (loginErr) {
        return console.error(loginErr);
      }
      console.log("Product -> all");

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

// Product -> single (getProductDetail)

app.get("/product/:id", function(req, res) {
  let productId = req.params.id;
  console.log(productId);
  let product = {};
  // Connection login setup
  conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
    function(loginErr, loginResult) {
      if (loginErr) {
        return console.error(loginErr);
      }
      console.log("Product -> single(:id)");

      /* Start query logic */

      let query = conn
        .sobject("Product")
        .retrieve(productId, function(queryError, queryResult) {
          if (queryError) {
            return console.error(queryError);
          }
          console.log("Name : " + queryResult.Name);
          product = queryResult;
          console.log(product);
          res.send(product);
        });

      /* End query logic */
    }
  );
});

// Product => update
app.post("/product/update", function(req, res) {
  console.log("Got body:", req.body);
  let contactId = req.body.contactId;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let phone = req.body.phone;
  let department = req.body.department;
  let params = [contactId, firstName, lastName, email, phone, department];
  console.log("Here are the params -->" + params);
  // Connection login setup
  conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
    function(loginErr, loginResult) {
      if (loginErr) {
        return console.error(loginErr);
      }
      console.log("Login result: " + loginResult);
      console.log("Contact -> update");

      /* Start query logic */

      let query = conn.sobject("Contact").update(
        {
          Id: contactId,
          FirstName: firstName,
          LastName: lastName,
          Email: email,
          Phone: phone,
          Department: department
        },
        function(err, ret) {
          if (err || !ret.success) {
            return console.error(err, ret);
          }
          console.log("Updated this contact : " + ret.id);
          console.log(ret);
          res.send(ret);
        }
      );

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
