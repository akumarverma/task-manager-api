const express = require('express')
var jwt = require('jsonwebtoken');
const { User } = require('../models/user')

router = new express.Router()


const auth = async (req,res,next)=>{
    console.log('inSide Auth')
    try{
        let token = req.header('Authorization').replace('Bearer ','')
        //console.log('Token: ',token)
        let decoded = await jwt.verify(token, process.env.JWT_SECRET);
        //console.log(decoded)
        let user = await User.findOne({_id:decoded._id,'tokens.token': token})
        //console.log(user)
        if(!user){
            res.status(401).send()
        }
        req.user = user
        //console.log(req.user)
        next()
    }
    catch(e) {
        console.log(e)
        res.status(401).send()
    }
}

const restrictUrl = async (req,res,next)=>{
    console.log('inSide restrictUrl')
    try{

        console.log('method: ',req.method)
        console.log('path: ',req.path)

        if (req.method=== 'GET' && req.path === '/users'){
            res.status(405).send('Method Not Allowed!')
        }
 
        next()
    }
    catch(e) {
        console.log(e)
        res.status(401).send()
    }
}

module.exports = {
    auth,
    restrictUrl
}