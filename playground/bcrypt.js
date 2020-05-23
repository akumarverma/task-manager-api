const bcrypt = require('bcryptjs')

let hash = bcrypt.hashSync('Shubh',8)

console.log(hash)

isSame = bcrypt.compareSync('Shubh',hash)

console.log(isSame)