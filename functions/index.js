const functions = require('firebase-functions');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const nodemailer = require('nodemailer');

const emailTransporterDetails = require('./secrets/emailTransporter');

const sendEmail = (emailAddress, subject, html) => {
  console.log(`Sending an email invite to ${emailAddress}`);

  try {
    const fromEmailAddress = emailTransporterDetails.email;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: fromEmailAddress,
        pass: emailTransporterDetails.password
      }
    });

    const mailOptions = {
      from: fromEmailAddress,
      to: emailAddress,
      subject,
      html
    };

    transporter.sendMail(mailOptions).then(info => {
      console.log(`Message sent: ${info.response}`);
    });
  } catch (error) {
    throw new Error(`Email error: ${error}`);
  }
};

// cors
const cors = require('cors')({
  origin: true
});

const urlBase = "https://attestari.me";

exports.sendAttestationEmail = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    try {
      console.log(request.body);
      const pendingAttestation = request.body;
      console.log(pendingAttestation);
      const { requestorName, requestorAddress, requestorEmail, skillName, skillSignature, skillTimeStamp, attestatorEmail } = pendingAttestation;
      let url = `${urlBase}/attest/${encodeURIComponent(requestorAddress)}/${encodeURIComponent(skillName)}/${encodeURIComponent(skillTimeStamp)}/${encodeURIComponent(skillSignature)}/${encodeURIComponent(attestatorEmail)}/${encodeURIComponent(requestorEmail)}`;
      console.log(url);
      const emailBody = `<p>Hi!</p>
      <br />
      <p>Your friend <b>${requestorName}</b> asked you to attest that he/she knows <b>${skillName}</b>.</p>
      <br />
      <p>Please <a href="${url}">click here</a> to attest ${requestorName}.</p>
      <br />
      <p>Attestari.me</p>
      `;
      console.log(emailBody);
      sendEmail(attestatorEmail, `Attestari.me - Request to attest ${requestorName}`, emailBody).then(res => {
        response.status(200).send();
        return '';
      }).catch(error => {
        console.log(error);
      });
    } catch (error) {
      console.log(error);
      // console.log(`Error creating custom token for user ${address}: ${error}`);
      response.status(500).send('Authentication failed');
    }
  });



});

exports.sendApprovedAttestationEmail = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    try {
      console.log(request.body);
      const attestation = request.body;
      console.log(attestation);
      const { skillName, skillTimeStamp, attestorName, attestorAddress, timeStamp, attestationSignature, requestorAddress, requestorEmail, requesterName } = attestation;
      let url = `${urlBase}/acceptAttestation/${encodeURIComponent(requestorAddress)}/${encodeURIComponent(skillName)}/${encodeURIComponent(skillTimeStamp)}/${encodeURIComponent(attestationSignature)}/${encodeURIComponent(attestorAddress)}/${timeStamp}/${encodeURIComponent(requesterName)}`;

      const emailBody = `<p>Hi ${requestorAddress}!</p>
      <br />
      <p>Good news!!! Your friend <b>${attestorName}</b> has just confirmed that you know <b>${skillName}</b>.</p>
      <br />
      <p>Please <a href="${url}">click here</a> to store your attestation on your Ethereum Profile.</p>
      <br />
      <p>Your friend from Attestari.me</p>
      <p><small>Let's build this global network of attestations together, ask your friends for attestations!<small></p>
      `;
      console.log(emailBody);
      sendEmail(requestorEmail, `Attestari.me - Attestation received from ${attestorName}`, emailBody).then(res => {
        response.status(200).send();
        return '';
      }).catch(error => {
        console.log(error);
      });
    } catch (error) {
      console.log(error);
      response.status(500).send('Authentication failed');
    }
  });



});