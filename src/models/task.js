const mongoose = require('mongoose')
const User = require('./user')

const taskSchema = new mongoose.Schema({
    task_name: {
        type: String,
        required: true,
        unique: true
    },
    task_description: {
        type: String,
        required: true
    },
    task_type: {
        type: String,
        required: true,
        default:'PER',
        enum: ['OFF', 'FAM', 'FRD','FIN','PRO','PER']
    },
    task_status: {
        type: String,
        required: true,
        enum: ['I', 'C'],
        default: false
    },
    user_id: { type: mongoose.ObjectId, required:true,ref: 'User' }
}, {
    // add createdAt and updatedAt fields
    timestamps: true
}
)

taskSchema.path('user_id').ref(User);

taskSchema.pre('save',()=>{
    console.log('Inside Pre')
})


taskSchema.methods.toJSON = function(){
    return {
        task_name: this.task_name,
        task_description: this.task_description,
        task_status: this.task_status,
        task_type: this.task_type,
        user_id: this.user_id
    }
}

const Task = new mongoose.model('Task', taskSchema)

module.exports.Task=Task
