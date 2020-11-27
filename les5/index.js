require('dotenv').config()
const express = require('express')
const pool = require('./config/db')


const cors = require('cors')

const bodyParser = require('body-parser')

// Middleware
const authMiddleware = require('./middleware/auth')

const clientService = require('./services/client')
const menuService = require('./services/menu')
const orderService = require('./services/order')

const app = express()

app.use(bodyParser.json())
app.use(cors)
//const router = express.Router()

app.route('/now').get(async (req, res) => {
  const pgclient = await pool.connect()
  const { rows } = await pgclient.query('Select now() as now')
  await pgclient.release()
  res.send(rows[0].now)
  return
})

/**
 * checkAuth валидирует токен,
 * в случае успеха возвращает payload
 * @param {*} req
 */
// async function checkAuth(req) {
//   const authHeader = req.headers.authorization

//   let token
//   if (authHeader) {
//     const h = authHeader.split(' ')
//     if (h[0] !== 'Bearer') {
//       throw new Error('Allowed only Bearer token')
//     }

//     token = h[1]
//   } else {
//     throw new Error('Token not found')
//   }

  
//     return jwt.verify(token, secret)
  
// }

app.route('/menu').get(async (req,res) =>{
  const {name, price} = req.query
  try{
    const menu = await menuService.findMenu(name, price)
    res.send(menu)
  } catch(err){
    res.status(401).send({
      error: err.message,
  })
}
})

//Сделать новый заказ
app.route('/user_order').get(authMiddleware, async (req, res) => {
  try {
    const order = await orderService.findOrderByClientID(req.client.id)
    res.send(order)
  } catch (err) {
    res.status(500).send({
      error: err.message,
    })
  }
})

app.route('/make_order').post(authMiddleware, async (req, res) => {
  try {
    const orderID = await orderService.makeOrder(req.client.id, req.body)

    res.send({
      order_id: orderID,
    })
  } catch (err) {
    res.status(500).send({
      error: err.message,
    })
  }
})

// Зарегистрироваться
app.route('/sign_up').post(async (req, res) => {
  // Если какой-то из параметров не будет передан, то
  // будет SQL ошибка (NOT NULL contraint)
  // По хорошему, нам надо тут проверить, что
  // параметры, которые не могут быть NULL переданы
  const { name, address, phone, email, password } = req.body

  
  try {
    const token = await clientService.signUp({name,address, password,phone,email})
    

    res.send({
      id: token,
    })
  } catch (err) {
    res.status(500).send({
      error: err.message,
    })
    console.error(err)
  } 
})





// app.route('user_order/:id').delete(async (req,res)=>{
//   let pgclient = await pool.connect()
//   try{
//     const { id } = req.params
//     const { rows } = await pgclient.query(
//       `
//       DELETE FROM menu
//       WHERE id = $1`,
//       [id]
//     )
   
//   }catch (err) {
//     res.status(500).send({
//       error: err.message,
//     })
//     console.error(err)
//   } finally {
//     await pgclient.release()
//   }
// })

app.route('/sign_in').post(async (req, res) => {
  const { email, password } = req.body

  try {
    const token = await clientService.signIn(email, password)

    res.send({
      token,
    })
  } catch (err) {
    res.status(500).send({
      error: err.message,
    })
  }
})

app.listen(80, () => {
  console.log('server started on http//localhost:80')
})
