require('dotenv').config()
const{ Client }=require('pg')
const client = new Client(
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database:process.env.DB_DATABASE 

    }
)

const name='name1'

client.connect()

client
.query(`SELECT * FROM client WHERE name='${name}'`)
.then(result=> console.log(result))
.catch(e=> console.error(e.stack))
.then(()=> client.end())
// client.query(`SELECT * FROM client WHERE name='${name}'`, (err,res)=>{
//     console.log(err,res)
//     client.end()
// })
console.log(1)