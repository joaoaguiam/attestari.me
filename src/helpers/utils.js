export const signMessage = (userAddress, message) => {
  var msg = '0x' + Buffer.from(message, 'utf8').toString('hex')
  var params = [msg, userAddress]
  var method = 'personal_sign'
  return new Promise((resolve, reject) => {
    window.web3.currentProvider.sendAsync({
      method,
      params,
      userAddress
    }, function (err, result) {
      if (err) reject(err)
      if (result.error) reject(result.error)
      resolve(result.result)
    })
  })
}
