import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/functions';
import 'firebase/auth';

// Initialize Firebase
const config = {
  dev: {
    apiKey: 'AIzaSyAzRXSUXMud6Oto1-ISsUiGMdun5slDG3U',
    authDomain: 'att-net.firebaseapp.com',
    databaseURL: 'https://att-net.firebaseio.com',
    projectId: 'att-net',
    storageBucket: 'att-net.appspot.com',
    messagingSenderId: '817008533355'
  }
};


/* ------------- Instanciate DB ------------------ */
firebase.initializeApp(config.dev);

/* ------------- Base code ------------------ */
const pushNode = rootPosition => {
  try {
    const database = firebase.database();
    const ref = database.ref(rootPosition);
    var newNodeRef = ref.push();
    return newNodeRef.key;
  } catch (error) {
    throw error;
  }
};

const writeNode = async (rootPosition, key, jsonObject) => {
  try {
    const database = firebase.database();
    const ref = database.ref(rootPosition);
    await ref.child(key).set(jsonObject, error => {
      if (error) {
        console.log(error);
      } else {
        // do nothing on success
      }
    });
  } catch (error) {
    throw error;
  }
};

// const deleteNode = async (rootPosition, key) => {
//   try {
//     const database = firebase.database();
//     const ref = database.ref(rootPosition);
//     await ref.child(key).remove(error => {
//       if (error) {
//         console.log(error);
//       } else {
//         // do nothing on success
//       }
//     });
//   } catch (error) {
//     throw error;
//   }
// };

// const updateNode = async (rootPosition, key, jsonObject) => {
//   try {
//     const database = firebase.database();
//     const ref = database.ref(rootPosition);
//     await ref.child(key).update(jsonObject, error => {
//       if (error) {
//         console.log(error);
//       } else {
//         // do nothing on success
//       }
//     });
//   } catch (error) {
//     throw error;
//   }
// };

// const nodeExists = async (rootPosition, key) => {
//   try {
//     const database = firebase.database();
//     const dataSnapshot = await database.ref(rootPosition).once('value');
//     return dataSnapshot.child(key).exists();
//   } catch (error) {
//     return false;
//   }
// };

/* ------------- Business logic ------------------ */

const addPendingAttestation = async (requestorAddress, requestorName, requestorEmail, attestatorEmail, skillName, skillTimeStamp, skillSignature) => {
  try {
    const rootPosition = `/pendingAttestations`;
    let key = await pushNode(rootPosition);

    let pendingAttestation = {
      requestorAddress,
      requestorName,
      requestorEmail,
      attestatorEmail,
      skillName,
      skillTimeStamp,
      skillSignature,
      key,
      timeStamp: new Date().getTime()
    }
    await writeNode(rootPosition, key, pendingAttestation);


    await fetch('https://us-central1-taiga-events-dev.cloudfunctions.net/sendAttestationEmail', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        pendingAttestation
      )
    })

    // await fetch(url, {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ a: 7, str: 'Some string: &=&' })
    // });

    return pendingAttestation;
  } catch (error) {
    throw error;
  }
};


const addApprovedAttestation = async (skillName, skillTimeStamp, attestorName, attestorAddress, requestorAddress, requestorEmail, timeStamp, attestationSignature, requesterName) => {
  try {

    let attestation = {
      skillName, skillTimeStamp, attestorName, attestorAddress, timeStamp, attestationSignature, requestorAddress, requestorEmail, requesterName
    }


    await fetch('https://us-central1-taiga-events-dev.cloudfunctions.net/sendApprovedAttestationEmail', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        attestation
      )
    })
    debugger;
    return attestation;
  } catch (error) {
    throw error;
  }
};

export {
  addPendingAttestation,
  addApprovedAttestation
};
