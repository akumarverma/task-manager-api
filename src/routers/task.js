const mongoose = require('mongoose')
const {Task}  = require('../models/task')
const express = require('express')
const {auth} = require('../middleware/auth')

router = new express.Router()

//  /task?complete=true/false
//  /task
router.get('/',auth,async (req,res)=>{

    match ={}

    if (req.query.completed){
        match = {task_status: req.query.completed==='true'?'C':'I'}

    }

    console.log(req.query.limit)
    console.log(req.query.skip)

    user = await req.user.populate({
        path: 'tasks',
        match: match,
        options:{
            limit:parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort:{
                task_status :-1,
                createdAt: -1
            }
        }
    }).execPopulate()

    console.log(user.tasks)

    return res.status(200).send(user.tasks)

    /*
    if (req.params.status == 'all'){

        tasks = await Task.find({user_id: req.user._id})

        console.log(tasks)

        res.status(200).send(tasks)

    }

    else if (req.params.status == 'incomplete'){

        tasks = await Task.find({user_id: req.user._id,task_status:'I'})

        console.log(tasks)

        res.status(200).send(tasks)

    }
    else if(req.params.status == 'complete'){

        tasks = await Task.find({user_id: req.user._id,task_status:'C'})

        console.log(tasks)

        res.status(200).send(tasks)

    }
    else{
        res.status(400).send()
    }
*/

})


router.post('',auth,async (req,res)=>{
    try{
        task = new Task(req.body)
        task.user_id = req.user._id
        await task.save()
        res.status(200).send(task)
    }
    catch(e){

        res.status(400).send({error:e.message})

    }
})

router.patch('/:id',auth,async (req,res)=>{
    let updateAllowed =['task_description','task_type']
    let updates = Object.keys(req.body)

    let isupdateAllowed = updates.every((val)=> updateAllowed.includes(val))

    if(!isupdateAllowed){
        return res.status(400).send()
    }

    let task = await Task.findById(req.params.id)

    if(!task){
        return res.status(400).send()
    }

    updates.forEach(update => {
        task[update] = req.body[update]
    });

    await task.save()

    res.status(200).send({updates,isupdateAllowed,task})

})

router.patch('/:id/complete',auth,async (req,res)=>{
 
    let task = await Task.findById(req.params.id)

    if(!task){
        return res.status(400).send()
    }

    task.task_status = 'C'

    await task.save()

    res.status(200).send({task})

})

router.delete('/:id',auth,async (req,res)=>{
    task = await Task.findByIdAndDelete(req.params.id)

    if(!task){
        return res.status(404).send()
    }
    task.save()
    res.status(200).send(task)
},(error,req,res,next)=>{
    res.send(500).send({error:error.message})
})

module.exports = router

