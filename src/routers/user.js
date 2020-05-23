const express = require('express')
const { auth, restrictUrl } = require('../middleware/auth')
const bcrypt = require('bcryptjs')
const {accountSetup,accountCancellation} = require('../utils/emails')

const router = new express.Router()

const mongoose = require('mongoose')
const { User } = require('../models/user')

var multer = require('multer')
const sharp = require('sharp')



router.get('/users', restrictUrl, async (req, res) => {

    try {
        users = await User.find()
        res.send({ users })
    }
    catch (e) {
        res.status(500).send({ error: 'Unable to fetch' })
    }
});

router.post('/user/signup', async (req, res) => {

    let user = new User(req.body)

    try {
        const token = await user.generateToken()
        await accountSetup(user.email,user.name)
        res.send({ user })
    }
    catch (e) {
        res.status(500).send({ error: e.message })
    }
});

router.patch('/user/me', auth, async (req, res) => {

    const updates = Object.keys(req.body)

    console.log(updates)

    const allowedColumns = ['name', 'email', 'password', 'age']

    let isValidOperation = updates.every((update) => allowedColumns.includes(update))

    console.log(isValidOperation)

    if (!isValidOperation) {
        res.status(404).send({ Error: 'Invalid Updates' })
    }

    try {
        let user = req.user
        console.log(user)

        if (!user) {
            return res.status(404).send()
        }

        updates.forEach((update) => user[update] = req.body[update])

        await user.save()

        res.status(200).send(user)
    }
    catch (e) {
        console.log(e)
        res.status(500).send({ error: e.message })
    }
});

router.get('/user/me', auth, async (req, res) => {

    user = await req.user.populate('tasks').execPopulate()

    console.log(user.tasks)

    res.status(200).send({user:req.user,tasks:user.tasks})

});

router.delete('/user/me', auth, async (req, res) => {

    try {
        let user = req.user

        console.log('inside delete')

        console.log(user)

        user = await User.findById(user._id)

        user.remove()

        await accountCancellation(user.email,user.name)


        res.status(200).send(user)
    }
    catch (e) {
        console.log(e)
        res.status(500).send({ error: e.message })
    }
});

router.post('/user/login', async (req, res) => {

    try {
        user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(401).send()
        }


        console.log(user)

        isPasswordSame = await bcrypt.compare(req.body.password, user.password)

        console.log('isPasswordSame:', isPasswordSame)

        if (!isPasswordSame) {
            return res.status(401).send()
        }
        const token = await user.generateToken()
        res.status(200).send({ user, token })

    }
    catch (e) {
        res.status(500).send(e)
    }


});

router.post('/user/logout', auth, async (req, res) => {

    try {
        user = req.user

        user.tokens = []

        user.save()

        res.status(200).send('Logged out successfully')
    }
    catch (e) {

        res.status(501).send()
    }



});

const upload = multer({
    //dest: './uploads/',
    limits: {
        fileSize: 1000000
    },
    fileFilter: (req, file, cb) => {

        if (!file.originalname.toLowerCase().endsWith('jpg')){
            return cb(new Error('not a valid JPG file'))
        }
        else{
            cb(undefined,true)
        }

    }
})

router.post('/user/me/profile', auth,upload.single('upload'), async function (req, res, next) {
    user = req.user
    user.avatar = await sharp(req.file.buffer).resize(250,250).png().toBuffer();
    //user.avatar = req.file.buffer
    await user.save()
    res.status(200).send(user)
},(error,req,res,next)=>{
    res.status(400).send({error: error.message})
    //next
})

router.get('/user/:id/profile', async function (req, res, next) {
    user = await User.findById(req.params.id)
    if (!user){
        return res.status(400)
    }

    res.set('content-type','image/png')
    res.status(200).send(user.avatar)
},(error,req,res,next)=>{
    res.status(400).send({error: error.message})
    //next
})

module.exports = router