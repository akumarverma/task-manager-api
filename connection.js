const MongoClient = require('mongodb').MongoClient;

// Database Name
const dbName = 'task-manager-api';

// Connection URL
const url = 'mongodb://localhost:27017/'

const getClient = async () => {
    try {
        return await MongoClient.connect(url)

    }
    catch (e) {
        throw new Error('Failed to get Mongo Client')
    }
}

const getDb = async () => {
    return await client.db(dbName)
}


const insertOne = async () => {
    try {

        let client = await getClient()

        let db = client.db(dbName)

        result = await db.collection('persons').insertOne({
            name: 'Amit',
            age: 42,
        })
        console.log(result.ops)

        await client.close()
    }
    catch (e) {
        console.log(e)
    }


}

const insertMany = async () => {
    try {

        let client = await getClient()

        let db = client.db(dbName)

        results = await db.collection('persons').insertMany([
            { name: 'Swati', age: 40, },
            { name: 'Shubh', age: 10 },
            { name: 'Prisha', age: 1 }])
        console.log(results.ops)
        await client.close()
    }
    catch (e) {
        console.log(e)
    }


}

const findOne = async () => {
    try {

        let client = await getClient()

        let db = client.db(dbName)

        result = await db.collection('persons').findOne({ name: 'Prisha' })
        console.log(result)
        await client.close()
    }
    catch (e) {
        console.log(e)
    }


}

const findMany = async () => {
    try {
        let client = await getClient()

        let db = client.db(dbName)

        results = await db.collection('persons').find({ name: 'Amit' }).toArray()
        console.log(results)
        await client.close()
    }
    catch (e) {
        console.log(e)
    }


}

const updateOne = async () => {
    try {
        let client = await getClient()

        let db = client.db(dbName)

        result = await db.collection('persons').updateOne({ name: 'Amit' },
            { $set: { age: 35 } })
            ;
        console.log('Record Updated: ', result.result.nModified)
        await client.close()
    }
    catch (e) {
        console.log(e)
    }


}

const updateMany = async () => {
    try {
        let client = await getClient()

        let db = client.db(dbName)

        result = await db.collection('persons').updateMany({ name: 'Amit' },
            { $inc: { age: 1 } })
            ;
        console.log('Record Updated: ', result.result.nModified)
        await client.close()
    }
    catch (e) {
        console.log(e)
    }


}

const deleteOne = async () => {
    try {
        let client = await getClient()

        let db = client.db(dbName)

        result = await db.collection('persons').deleteOne({ name: 'Amit' })
        console.log('Record Deleted: ', result.result.n)
        await client.close()
    }
    catch (e) {
        console.log(e)
    }


}

const deleteMany = async () => {
    try {
        let client = await getClient()

        let db = client.db(dbName)

        result = await db.collection('persons').deleteMany()
        console.log('Record Deleted: ', result.result.n)
        await client.close()
    }
    catch (e) {
        console.log(e)
    }


}

console.log('User Option is: ', process.argv[2])

switch (parseInt(process.argv[2])) {
    case 1:
        insertOne()
        break
    case 2:
        insertMany()
        break
    case 3:
        findOne()
        break
    case 4:
        findMany()
        break
    case 5:
        updateOne()
        break
    case 6:
        updateMany()
        break
    case 7:
        deleteOne()
        break
    case 8:
        deleteMany()
        break
    default:
        console.log('Invalid choice')


}
