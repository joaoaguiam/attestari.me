const IFPS_HOST = 'ipfs.infura.io';
const IPFS_PROTOCOL = 'https';

//using the infura.io node, otherwise ipfs requires you to run a daemon on your own computer/server. See IPFS.io docs
// const IPFS = require('ipfs-api');

// const IPFS = require('ipfs-api/dist/index.min.js');
const IPFS = require('ipfs-api');

export const getIpfs = () => {
    return new IPFS({ host: IFPS_HOST, port: 5001, protocol: IPFS_PROTOCOL });
}

//run with local daemon
// const ipfsApi = require('ipfs-api');
// const ipfs = new ipfsApi('localhost', '5001', {protocol: 'http'});

export const getIpfsUrl = (hash) => {
    return IPFS_PROTOCOL + '://' + IFPS_HOST + '/ipfs/' + hash;
}

export const uploadObjectIpfs = (obj) => {
    return new Promise((resolve, reject) => {
        
        let ipfs = getIpfs();
        var buffer = Buffer.from(JSON.stringify(obj));

        //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
        ipfs.add(buffer, (err, ipfsHash) => {
            if(err) {
                reject(err);
            }
            else {
                let hash = ipfsHash[0].hash;
                let url = getIpfsUrl(hash);
                resolve({hash, url});
            }
        
            //setState by setting ipfsHash to ipfsHash[0].hash 
            
        })
    })

    

}