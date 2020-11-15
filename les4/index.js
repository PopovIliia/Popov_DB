const express = require('express')
const app = express()

app.route('/get').get((req, res) => {
  res.send('Hello World')
})

//route c параметорм :group
// сработает на http://localhost:8080/group/123
app.route('/group/:group').get((req, res) => {
  //из params обьект мы можем достать свойство
  const group = req.params.group
  res.send(`Hello ${group}`)
})
app.listen(8080, () => {
  console.log('Server started on http://localhost:8080')
})
