const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');

const {Task} = require('./task')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: false,
            validate: (value) => {
                if (value.toLowerCase().includes('password')) {
                    throw new Error('Password should not contain word "password"')
                }
                if (value.length < 8) {
                    throw new Error('Password must be 8 character long')
                }
            }
        },
        age: {
            type: Number,
            required: false,
            default: 0,
            validate: (value) => {
                if (value <= 0) {
                    throw new Error('Age must be greater than 0')
                }
            }
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }],
        avatar: {
            type: Buffer
        },
 
    },
    {
        // add createdAt and updatedAt fields
        timestamps: true
    }
);

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'user_id'
})

userSchema.statics.findByCredentials = async function (email, password) {

    user = await this.findOne({ email: email })

    if (!user) {
        throw new Error('Invalid User!')
    }
    console.log(user)
    isSamePassword = await bcrypt.compare(password, user.password)

    if (!isSamePassword) {
        throw new Error('Invalid User Credentials')
    }

    return user

}

userSchema.methods.generateToken = async function () {
    user = this
    console.log(user)
    let token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    user.tokens =[]
    user.tokens.push({token})
    await user.save()
    console.log('Token', token)
    return token
}

userSchema.methods.toJSON = function () {

    user = this

    return {
        name: user.name,
        email: user.email,
        age: user.age,
        tokens: user.tokens.map((token)=>  token.token),
    }
}

userSchema.pre('save', async function (next) {
    let user = this
    console.log('inside Hook', user)
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.pre('remove', async function (next){
    console.log('inside remove')
    user = this
    await Task.deleteMany({user_id:user._id})
    //await Task.save()
    next()
})

module.exports.User = mongoose.model('User', userSchema);
