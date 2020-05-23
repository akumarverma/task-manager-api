const express = require('express')
const dotenv = require('dotenv')

const result = dotenv.config()
 
if (result.error) {
  throw result.error
}
 
require('./mongoose')


const usersRouters = require('./routers/user')
const taskRouter = require('./routers/task')

console.log(process.env.PORT)


console.log(process.env.PORT)



const port = process.env.PORT || 3000


app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(usersRouters)
app.use('/task',taskRouter)

app.listen(port,()=>{
    console.log('Service has started at port 3000')
})