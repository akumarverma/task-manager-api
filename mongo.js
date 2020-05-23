const MongoClient = require('mongodb').MongoClient;

// Database Name
const dbName = 'task-manager-api';

// Connection URL
const url = `mongodb://localhost:27017/`

// Use connect method to connect to the server
module.exports.db = 
    MongoClient.connect(url)
        .then((client) => {
            resolve(client.db(dbName))
        }
        ).catch((e) => {
            reject(new Error('DB Connection error'))
        })



// Testing the DB Connection
// db.then((db) => {
//     console.log(`connected to ${dbName} database`)
// }).catch((error) => {

//     console.log('Failed to connected. Error: ' + error)

// })

