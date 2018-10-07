

export default {
  HOME: () => '/',
  PROFILE: () => '/profile',
  ATTEST: () => '/attest/:requestorAddress/:skillName/:skillTimeStamp/:skillSignature/:attestatorEmail/:requestorEmail',
  ACCEPT_ATTESTATION: () => '/acceptAttestation/:requestorAddress/:skillName/:skillTimeStamp/:attestationSignature/:attestorAddress/:timeStamp/:requesterName',
  PUBLIC_PROFILE: (address = ':address') => `/publicProfile/${address}`,


};
