const jsforce = require("jsforce");
const sanitizer = require("sanitizer");
const dotenv = require("dotenv");
const express = require("express");
// Environment
dotenv.config();

const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

const firestore = admin.firestore();

// const firebaseConfig = {
//   apiKey: process.env.LWD_API_KEY,
//   authDomain: process.env.LWD_AUTH_DOMAIN,
//   databaseURL: process.env.LWD_DATABASE_URL,
//   projectId: process.env.LWD_PROJECT_ID,
//   storageBucket: process.env.LWD_STORAGE_BUCKET,
//   messagingSenderId: process.env.LWD_MESSAGING_SENDER_ID,
//   appId: process.env.LWD_APP_ID,
//   measurementId: process.env.LWD_MEASUREMENT_ID
// };

// // Initialise Firebase services
// firebase.initializeApp(firebaseConfig);

////////////////////////////////
///// Trigger functions /////
////////////////////////////////

// Express
const triggersApp = require("express")();
const basicAuth = require("express-basic-auth");
const cors = require("cors");
const bodyParser = require("body-parser");
triggersApp.use(bodyParser.json());
triggersApp.use(express.urlencoded({ extended: true }));

// Automatically allow cross-origin requests
triggersApp.use(cors({ origin: true }));

triggersApp.use(
  basicAuth({
    users: { atlas_agent: "7ggTM=KrF$W94b$M" }
  })
);

triggersApp.get("*", (req, res) => {
  functions.logger.log(req.body);
  functions.logger.log(res);
  functions.logger.log(req.body);
});

exports.onAtlasEnabledUpdate = functions
  .region("europe-west2")
  .https.onRequest(triggersApp);

// exports.onAtlasEmailUpdate = functions.https.onRequest((req, res) => {});

////////////////////////////////
///// Background functions /////
////////////////////////////////

/* Account creation */
exports.createUserDocument = functions
  .region("europe-west2")
  .auth.user()
  .onCreate(user => {
    const userDoc = {
      preferences: {
        darkMode: false
      },
      sf: {
        accountId: "0014K000004X8MNQA0"
      }
    };

    return firestore
      .collection("users")
      .doc(user.uid)
      .set(userDoc)
      .then(() => {
        console.log(`User documented created for uid: ${user.uid}`);
      })
      .catch(error => {
        console.log("Error when creating user document: " + error);
      });
  });

/* Account deletion */
exports.deleteUserDocument = functions
  .region("europe-west2")
  .auth.user()
  .onDelete(user => {
    return firestore
      .collection("users")
      .doc(user.uid)
      .delete()
      .then(() => {
        console.log(`User documented deleted for uid: ${user.uid}`);
      })
      .catch(error => {
        console.log("Error when deleting user document: " + error);
      });
  });

////////////////////////////////
////// Callable functions //////
////////////////////////////////

////// Account Object //////

// Accounts -> All
exports.getAccounts = functions
  .region("europe-west2")
  .https.onRequest(async (req, res) => {
    const conn = new jsforce.Connection();
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

// Account -> All (callable)
exports.getAccountsCallable = functions
  .region("europe-west2")
  .https.onCall((data, context) => {
    /* Context */

    // Authentication information found on the request.
    const uid = context.auth.uid;
    const name = context.auth.token.name || null;
    const email = context.auth.token.email || null;

    // Checking that the user is authenticated.
    if (!context.auth) {
      // Throwing a HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Only authenticated requests are accepted."
      );
    }

    /* Data */

    /* Function logic */

    const conn = new jsforce.Connection();
    let records = [];
    let q = "SELECT Id, Name, AccountNumber, Industry, Type FROM Account";
    // Connection login setup
    return new Promise((resolve, reject) => {
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
              return resolve(records);
            })
            .on("error", function(err) {
              // THROW errors
              console.error(err);
              return reject(err);
            })
            .run();

          /* End query logic */
        }
      );
    });
  });

////// Contact Object //////

// Contact -> all

// app.get("/contact/all", function(req, res) {
//   let records = [];
//   let q = "SELECT Id, Name, Department FROM Contact";
//   // Connection login setup
//   conn.login(
//     process.env.SF_USERNAME,
//     process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
//     function(loginErr, loginResult) {
//       if (loginErr) {
//         return console.error(loginErr);
//       }
//       console.log("Contact -> all");

//       /* Start query logic */

//       let query = conn
//         .query(q)
//         .on("record", function(record) {
//           // console.log(record);
//           records.push(record);
//           // console.log(records);
//         })
//         .on("end", function() {
//           console.log("total in database : " + query.totalSize);
//           console.log("total fetched : " + query.totalFetched);
//           console.log(records);
//           res.json(records);
//         })
//         .on("error", function(err) {
//           console.error(err);
//         })
//         .run({ autoFetch: true, maxFetch: 4000 }); // synonym of Query#execute();

//       /* End query logic */
//     }
//   );
// });

// Contact -> single (getContactDetail)

// app.get("/contact/:id", function(req, res) {
//   let contactId = req.params.id;
//   console.log(contactId);
//   let contact = {};
//   let q = "SELECT Id, Name FROM Contact";
//   // Connection login setup
//   conn.login(
//     process.env.SF_USERNAME,
//     process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
//     function(loginErr, loginResult) {
//       if (loginErr) {
//         return console.error(loginErr);
//       }
//       console.log("Contact -> single(:id)");

//       /* Start query logic */

//       let query = conn
//         .sobject("Contact")
//         .retrieve(contactId, function(queryError, queryResult) {
//           if (queryError) {
//             return console.error(queryError);
//           }
//           console.log("Name : " + queryResult.Name);
//           contact = queryResult;
//           console.log(contact);
//           res.send(contact);
//         });

//       /* End query logic */
//     }
//   );
// });

// Contact => update
// app.post("/contact/update", function(req, res) {
//   console.log("Got body:", req.body);
//   let contactId = req.body.contactId;
//   let firstName = req.body.firstName;
//   let lastName = req.body.lastName;
//   let email = req.body.email;
//   let phone = req.body.phone;
//   let department = req.body.department;
//   let params = [contactId, firstName, lastName, email, phone, department];
//   console.log("Here are the params -->" + params);
//   // Connection login setup
//   conn.login(
//     process.env.SF_USERNAME,
//     process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
//     function(loginErr, loginResult) {
//       if (loginErr) {
//         return console.error(loginErr);
//       }
//       console.log("Login result: " + loginResult);
//       console.log("Contact -> update");

//       /* Start query logic */

//       let query = conn.sobject("Contact").update(
//         {
//           Id: contactId,
//           FirstName: firstName,
//           LastName: lastName,
//           Email: email,
//           Phone: phone,
//           Department: department
//         },
//         function(err, ret) {
//           if (err || !ret.success) {
//             return console.error(err, ret);
//           }
//           console.log("Updated this contact : " + ret.id);
//           console.log(ret);
//           res.send(ret);
//         }
//       );

//       /* End query logic */
//     }
//   );
// });

////// Case Object //////

// GET Case -> All (callable)
exports.getCasesCallable = functions
  .region("europe-west2")
  .https.onCall((data, context) => {
    /* Context */
    console.log("THIS IS THE AUTH CONTEXT " + context.auth);
    // Authentication information found on the request.

    // Checking that the user is authenticated.
    if (!context.auth) {
      // Throwing a HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Only authenticated requests are accepted."
      );
    }

    const conn = new jsforce.Connection();
    let records = [];
    let q =
      "SELECT Id, Subject, Status, Type, CaseNumber, Description, OwnerId, Reason, SourceId, CreatedDate, ClosedDate, Product__c FROM Case ORDER BY CreatedDate DESC";
    // Connection login setup
    return new Promise((resolve, reject) => {
      conn.login(
        process.env.SF_USERNAME,
        process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
        function(loginErr, loginResult) {
          if (loginErr) {
            return console.error(loginErr);
          }
          console.log("Cases -> all");

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
              return resolve(records);
            })
            .on("error", function(err) {
              console.error(err);
              return reject(err);
            })
            .run({ autoFetch: true, maxFetch: 4000 }); // synonym of Query#execute();

          /* End query logic */
        }
      );
    });
  });

// POST Case -> New (callable)
exports.createCaseCallable = functions
  .region("europe-west2")
  .https.onCall((data, context) => {
    /* Context */
    console.log("THIS IS THE AUTH CONTEXT " + context.auth);
    // Authentication information found on the request.

    // Checking that the user is authenticated.
    if (!context.auth) {
      // Throwing a HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Only authenticated requests are accepted."
      );
    }

    const uid = context.auth.uid || null;
    const name = context.auth.token.name || null;
    const email = context.auth.token.email || null;

    /* Data */

    // Message text passed from the client.
    const accountId = data.accountId;
    const subject = data.subject;
    const description = data.description;
    const reason = data.reason;
    const type = data.type;
    const origin = "atlas";

    // Checking data attributes.
    if (!(typeof accountId === "string") || accountId.length === 0) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with the account Id which must be a string"
      );
    } else if (!(typeof subject === "string")) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The subject must be a string value."
      );
    } else if (!(typeof description === "string")) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The description must be a string value."
      );
    } else if (!(typeof reason === "string")) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The reason must be a string value."
      );
    } else if (!(typeof type === "string")) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The type must be a string value."
      );
    } else {
      console.log("All data attribute checks passed successfully.");
    }
    /* Function logic */

    const conn = new jsforce.Connection();

    // Connection login setup
    return new Promise((resolve, reject) => {
      conn.login(
        process.env.SF_USERNAME,
        process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
        function(loginErr, loginResult) {
          if (loginErr) {
            console.error("A login error has occurred: " + loginErr);
            throw new functions.https.HttpsError(
              "unknown",
              "A service error has occurred."
            );
          }
          console.log("Case -> New");

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
                console.error(err, ret);
                throw new functions.https.HttpsError(
                  "unknown",
                  "A service error has occurred."
                );
                // return reject(err);
              }
              console.log("Created case id : " + ret.id);
              console.log(ret);
              return resolve(ret);
            }
          );

          /* End query logic */
        }
      );
    });
  });

// GET Case -> detail

exports.getCaseDetail = functions
  .region("europe-west2")
  .https.onCall((data, context) => {
    /* Context */

    // Authentication information found on the request.
    // Checking that the user is authenticated.
    if (!context.auth) {
      // Throwing a HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Only authenticated requests are accepted."
      );
    }

    /* Data */
    // Extract attributes from data object.
    const caseId = data.caseId;

    // Checking data attributes.
    if (!(typeof caseId === "string") || caseId.length === 0) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with the case Id which must be a string"
      );
    }

    /* Function logic */
    const conn = new jsforce.Connection();
    let caseObj = {};
    // Connection login setup
    return new Promise((resolve, reject) => {
      conn.login(
        process.env.SF_USERNAME,
        process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
        function(loginErr, loginResult) {
          if (loginErr) {
            console.error("A login error has occurred: " + loginErr);
            throw new functions.https.HttpsError(
              "unknown",
              "A service error has occurred."
            );
          }
          console.log("Case -> detail");

          /* Start query logic */

          let query = conn
            .sobject("Case")
            .retrieve(caseId, function(queryError, queryResult) {
              if (queryError) {
                console.error(queryError);
                return reject(err);
              }
              console.log("Name : " + queryResult.Subject);
              caseObj = queryResult;
              console.log(caseObj);
              return resolve(caseObj);
            });

          /* End query logic */
        }
      );
    });
  });

// GET Case -> describe(Reason) (Option select fields metadata)

exports.getCaseDescriptionReason = functions
  .region("europe-west2")
  .https.onCall((data, context) => {
    /* Context */

    // Authentication information found on the request.
    // Checking that the user is authenticated.
    if (!context.auth) {
      // Throwing a HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Only authenticated requests are accepted."
      );
    }
    /* Function logic */
    const conn = new jsforce.Connection();
    // Connection login setup
    return new Promise((resolve, reject) => {
      conn.login(
        process.env.SF_USERNAME,
        process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
        function(loginErr, loginResult) {
          if (loginErr) {
            console.error("A login error has occurred: " + loginErr);
            throw new functions.https.HttpsError(
              "unknown",
              "A service error has occurred."
            );
          }
          console.log("Case -> describe(Reason)");

          /* Start query logic */

          let query = conn.sobject("Case").describe(function(err, meta) {
            if (err) {
              console.error(err);
              reject(err);
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
            resolve(reasonFieldOptions);
          });

          /* End query logic */
        }
      );
    });
  });

// GET Case -> describe(Type) (Option select fields metadata)

exports.getCaseDescriptionType = functions
  .region("europe-west2")
  .https.onCall((data, context) => {
    /* Context */

    // Authentication information found on the request.
    // Checking that the user is authenticated.
    if (!context.auth) {
      // Throwing a HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Only authenticated requests are accepted."
      );
    }
    /* Function logic */
    const conn = new jsforce.Connection();
    // Connection login setup
    return new Promise((resolve, reject) => {
      conn.login(
        process.env.SF_USERNAME,
        process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
        function(loginErr, loginResult) {
          if (loginErr) {
            console.error("A login error has occurred: " + loginErr);
            throw new functions.https.HttpsError(
              "unknown",
              "A service error has occurred."
            );
          }
          console.log("Case -> describe(Reason)");

          /* Start query logic */

          let query = conn.sobject("Case").describe(function(err, meta) {
            if (err) {
              console.error(err);
              reject(err);
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
            resolve(typeFieldOptions);
          });

          /* End query logic */
        }
      );
    });
  });

// Case -> related (to this account)

exports.getCaseRelated = functions
  .region("europe-west2")
  .https.onCall((data, context) => {
    /* Context */

    // Authentication information found on the request.
    // Checking that the user is authenticated.
    if (!context.auth) {
      // Throwing a HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Only authenticated requests are accepted."
      );
    }

    /* Data */
    // Extract attributes from data object.
    const accountId = data.accountId;

    // Checking data attributes.
    if (!(typeof accountId === "string") || accountId.length === 0) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with the case Id which must be a string"
      );
    }

    /* Function logic */
    const conn = new jsforce.Connection();
    let records = [];
    let q = `SELECT Id, Subject, Status, Type, CaseNumber, Description, OwnerId, Reason, Origin, CreatedDate, ClosedDate FROM Case WHERE AccountId = '${accountId}' ORDER BY CreatedDate DESC LIMIT 20`;
    // Connection login setup
    return new Promise((resolve, reject) => {
      conn.login(
        process.env.SF_USERNAME,
        process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
        function(loginErr, loginResult) {
          if (loginErr) {
            console.error("A login error has occurred: " + loginErr);
            throw new functions.https.HttpsError(
              "unknown",
              "A service error has occurred."
            );
          }
          console.log("Cases -> related this account: " + accountId);

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
              return resolve(records);
            })
            .on("error", function(err) {
              console.error(err);
              return reject(err);
            })
            .run({ autoFetch: true, maxFetch: 4000 }); // synonym of Query#execute();

          /* End query logic */
        }
      );
    });
  });

////// EmailMessage Object //////

// EmailMessage -> all

exports.getEmailMessage = functions
  .region("europe-west2")
  .https.onCall((data, context) => {
    /* Context */
    console.log("THIS IS THE AUTH CONTEXT " + context.auth);
    // Authentication information found on the request.

    // Checking that the user is authenticated.
    if (!context.auth) {
      // Throwing a HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Only authenticated requests are accepted."
      );
    }

    const conn = new jsforce.Connection();
    let records = [];
    let q =
      "SELECT ParentId, Status, Subject, TextBody, HtmlBody, MessageDate, CreatedById FROM EmailMessage ORDER BY MessageDate DESC";
    // Connection login setup
    return new Promise((resolve, reject) => {
      conn.login(
        process.env.SF_USERNAME,
        process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
        function(loginErr, loginResult) {
          if (loginErr) {
            console.error("A login error has occurred: " + loginErr);
            throw new functions.https.HttpsError(
              "unknown",
              "A service error has occurred."
            );
          }
          console.log("EmailMessages -> all");

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
              return resolve(records);
            })
            .on("error", function(err) {
              console.error(err);
              return reject(err);
            })
            .run({ autoFetch: true, maxFetch: 4000 }); // synonym of Query#execute();

          /* End query logic */
        }
      );
    });
  });

// EmailMessage -> all(related to a case)

exports.getEmailMessageRelated = functions
  .region("europe-west2")
  .https.onCall((data, context) => {
    /* Context */

    // Authentication information found on the request.
    // Checking that the user is authenticated.
    if (!context.auth) {
      // Throwing a HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Only authenticated requests are accepted."
      );
    }

    /* Data */
    // Extract attributes from data object.
    const parentId = data.parentId;

    // Checking data attributes.
    if (!(typeof parentId === "string") || parentId.length === 0) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with the case Id which must be a string"
      );
    }

    /* Function logic */
    const conn = new jsforce.Connection();
    let records = [];
    let q = `SELECT ParentId, Status, Subject, TextBody, MessageDate FROM EmailMessage WHERE ParentId = '${parentId}' ORDER BY MessageDate DESC`;
    // Connection login setup
    return new Promise((resolve, reject) => {
      conn.login(
        process.env.SF_USERNAME,
        process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
        function(loginErr, loginResult) {
          if (loginErr) {
            console.error("A login error has occurred: " + loginErr);
            throw new functions.https.HttpsError(
              "unknown",
              "A service error has occurred."
            );
          }
          console.log("EmailMessage -> all(related to case)");

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
              return resolve(records);
            })
            .on("error", function(err) {
              console.error(err);
              return reject(err);
            })
            .run({ autoFetch: true, maxFetch: 4000 }); // synonym of Query#execute();

          /* End query logic */
        }
      );
    });
  });

// EmailMessage -> new

// POST Case -> New (callable)
exports.createEmailMessage = functions
  .region("europe-west2")
  .https.onCall((data, context) => {
    /* Context */
    console.log("THIS IS THE AUTH CONTEXT " + context.auth);
    // Authentication information found on the request.

    // Checking that the user is authenticated.
    if (!context.auth) {
      // Throwing a HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Only authenticated requests are accepted."
      );
    }

    /* Data */

    // Message text passed from the client.
    const parentId = data.parentId; // => equivalent to case ID
    const subject = data.subject;
    const textBody = data.textBody;
    const messageDate = data.messageDate;

    // Checking data attributes.
    if (!(typeof parentId === "string") || parentId.length === 0) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with the parent Id which must be a string"
      );
    } else if (!(typeof subject === "string")) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The subject must be a string value."
      );
    } else if (!(typeof textBody === "string")) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The textBody must be a string value."
      );
    } else if (!(typeof messageDate === "string")) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The messageDate must be a string value."
      );
    } else {
      console.log("All data attribute checks passed successfully.");
    }
    /* Function logic */

    const conn = new jsforce.Connection();

    // Connection login setup
    return new Promise((resolve, reject) => {
      conn.login(
        process.env.SF_USERNAME,
        process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
        function(loginErr, loginResult) {
          if (loginErr) {
            console.error("A login error has occurred: " + loginErr);
            throw new functions.https.HttpsError(
              "unknown",
              "A service error has occurred."
            );
          }
          console.log("EmailMessage -> New");

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
                console.error(err, ret);
                throw new functions.https.HttpsError(
                  "unknown",
                  "A service error has occurred."
                );
                // return reject(err);
              }
              console.log("Created EmailMessage, id : " + ret.id);
              console.log(ret);
              return resolve(ret);
            }
          );

          /* End query logic */
        }
      );
    });
  });

////// Subscription Object //////

// EmailMessage -> all(related to a case)

exports.getSubscriptionRelated = functions
  .region("europe-west2")
  .https.onCall((data, context) => {
    /* Context */

    // Authentication information found on the request.
    // Checking that the user is authenticated.
    if (!context.auth) {
      // Throwing a HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Only authenticated requests are accepted."
      );
    }

    /* Data */
    // Extract attributes from data object.
    const accountId = data.accountId;

    // Checking data attributes.
    if (!(typeof accountId === "string") || accountId.length === 0) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with the case Id which must be a string"
      );
    }

    /* Function logic */
    const conn = new jsforce.Connection();
    let records = [];
    let q = `SELECT Name, Active__c, SBQQ__BillingFrequency__c, SBQQ__Bundled__c, SBQQ__ContractNumber__c, SBQQ__StartDate__c, SBQQ__EndDate__c, MRR__c, SBQQ__Product__c, SBQQ__ProductId__c, ProductDescription__c, Product_Family__c, SBQQ__ProductName__c, SBQQ__Quantity__c, Status__c, SUBS__c FROM SBQQ__Subscription__c WHERE SBQQ__Account__c IN ('${accountId}') AND Active__c IN (true) ORDER BY SBQQ__EndDate__c DESC LIMIT 20`;
    // Connection login setup
    return new Promise((resolve, reject) => {
      conn.login(
        process.env.SF_USERNAME,
        process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
        function(loginErr, loginResult) {
          if (loginErr) {
            console.error("A login error has occurred: " + loginErr);
            throw new functions.https.HttpsError(
              "unknown",
              "A service error has occurred."
            );
          }
          console.log(
            "Related Subscriptions for this account -> all(:accountId"
          );

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
              return resolve(records);
            })
            .on("error", function(err) {
              console.error(err);
              return reject(err);
            })
            .run({ autoFetch: true, maxFetch: 4000 }); // synonym of Query#execute();

          /* End query logic */
        }
      );
    });
  });

////////////////////////////////
///////// Dev functions ////////
////////////////////////////////

// Take the text parameter passed to this HTTP endpoint and insert it into
// Cloud Firestore under the path /messages/:documentId/original
exports.addMessage = functions
  .region("europe-west2")
  .https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into Cloud Firestore using the Firebase Admin SDK.
    const writeResult = await admin
      .firestore()
      .collection("messages")
      .add({ original: original });
    // Send back a message that we've succesfully written the message
    res.json({ result: `Message with ID: ${writeResult.id} added.` });
  });

// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore
  .document("/messages/{documentId}")
  .onCreate((snap, context) => {
    // Grab the current value of what was written to Cloud Firestore.
    const original = snap.data().original;

    // Access the parameter `{documentId}` with `context.params`
    functions.logger.log("Uppercasing", context.params.documentId, original);

    const uppercase = original.toUpperCase();

    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to Cloud Firestore.
    // Setting an 'uppercase' field in Cloud Firestore document returns a Promise.
    return snap.ref.set({ uppercase }, { merge: true });
  });

exports.authedFunction = functions
  .region("europe-west2")
  .https.onCall((data, context) => {
    // Message text passed from the client.
    const text = data.text;
    // Authentication / user information is automatically added to the request.
    const uid = context.auth.uid;
    const name = context.auth.token.name || null;
    const picture = context.auth.token.picture || null;
    const email = context.auth.token.email || null;

    // Checking attribute.
    if (!(typeof text === "string") || text.length === 0) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with " +
          'one arguments "text" containing the message text to add.'
      );
    }
    // Checking that the user is authenticated.
    if (!context.auth) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called " + "while authenticated."
      );
    }

    // console.log(context);
    // stringContext = JSON.stringify(context);

    return { contextObj: context.auth };

    // return admin
    //   .database()
    //   .ref("/messages")
    //   .push({
    //     text: text,
    //     author: { uid, name, picture, email }
    //   })
    //   .then(() => {
    //     console.log("New Message written");
    //     // Returning the sanitized message to the client.
    //     return { text: text };
    //   });
  });
