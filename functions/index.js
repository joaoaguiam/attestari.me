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

exports.sendAttestationEmail2 = functions.https.onRequest((request, response) => {
  const pendingAttestation = request.body.penddingAttestation;
  const { requestorName, requestorAddress, skillName, skillSignature, skillTimeStamp, attestatorEmail } = pendingAttestation;
  let url = encodeURIComponent(`http://localhost:3000/attest/${requestorAddress}/${skillName}/${skillTimeStamp}/${skillSignature}/${attestatorEmail}`);

  const emailBody = `<p>Hi!</p>
          <br />
          <p>You have been asked by ${requestorName} to attest that he/she knows ${skillName}.</p>
          <br />
          <p><a href="${url}>Click here</a> to accept this attestation.</p>
          <br />
          <p>AttestU.me</p>
          `;

  sendEmail(attestatorEmail, "AttestU.me - Request to attest received", emailBody).then(res => {
    response.json({ msg: "Email sent" }).send();
  });
});

// const emailBody = `<p>Hi ${newAplicantProfile.firstName}!</p>
//       <p>Your staking transaction has been completed!</p>
//       <br />
//       <p>This doesn't mean that you have been accepted, we will still need to evaluate each application.</p>
//       <p>We will get in touch with you once we have a decision about your application.</p>
//       <br/>
//       <p>You have staked ${amountInEther} ether that will be returned to you in case you attend the ETHDenver 2019.</p>

//       <br />
//       <p>Thank you for willing to be part of this new decentralized world and we wish you good luck!</p>
//       <br />
//       <p>The ETHDenver team.<br/>https://www.ethdenver.com/</p>
//       `;

// await sendEmail(
//   userEmail,
//   "ETHDenver - Your staking has been confirmed",
//   emailBody
// );