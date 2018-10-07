## Inspiration
I decided to work on this project because today there isn't a good network of attestations that will allow us to create the web of trust and good reputation systems. This is one of the initial layers that will allow further developments in the future.

## What it does
This platform allow anyone to create their Ethereum Profile on 3Box and associate skills to it. At the same time, for each skill, the user can request its peers to attest that they have indeed this skill.
The request is sent by email to his peer that will then use his ethereum wallet to sign the attestations. 
Both the skills and the attestations are stored on 3Box over the IPFS.

## How I built it
I built this system using React and 3Box.

## Challenges I ran into
Understand the best way to sign and recover messages. Also need to understand 3Box and the way to integrate it, which is fairly easy.

## Accomplishments that I'm proud of
Being able to have a E2E process working.

## What I learned
The most important lesson learnt from this project is know exactly where to make the distinction of what needs to be stored on-chain and what should be resided off-chain over IPFS.

## What's next for Attestari.me
Next steps is to improve the UI of the signing of attestations and acceptance on the user profile, create a listing page and a reputation score for the search being made.
