const jsforce = require("jsforce");

const dotenv = require("dotenv");

// Environment
dotenv.config();

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
// const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

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

    // Saving the new message to the Realtime Database.
    const sanitizedMessage = sanitizer.sanitizeText(text); // Sanitize the message.

    return admin
      .database()
      .ref("/messages")
      .push({
        text: sanitizedMessage,
        author: { uid, name, picture, email }
      })
      .then(() => {
        console.log("New Message written");
        // Returning the sanitized message to the client.
        return { text: sanitizedMessage };
      });
  });

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
