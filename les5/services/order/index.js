const pool = require('../../config/db')

async function findOrderByClientID(id){
    const {rows}=await pool.query(
    `
    Select id,client_id, created_at 
    From order_ 
    Where client_id=$1 
    Order by created_at DESC`,
    [id]
    )
    return rows

}

/**
 * 
 * @param {number} id - ID клиента 
 * @param {Array.<{menu_id: Number, count: Number}>} order
 *  
 */
async function makeOrder(id,order){
    let pgclient = await pool.connect()
    try{
    

    // открываем транзакцию
    await pgclient.query('BEGIN')

    // Создали заказ и получили его ID
    const { rows } = await pgclient.query(
      `
    INSERT INTO order_ (client_id) VALUES ($1) RETURNING id
    `,
      [id]
    )
    const orderID = rows[0].id

    // делаем цикл по body
    // чтобы подготовить запрос на получение цены
    // по каждому товару из заказа

    // параметры для подготовки IN запроса
    // пример: IN ($1,$2,$3)
    let params = [] // ["$1", "$2", "$3"]
    let values = [] // [1, 2, 3]
    for (const [i, item] of order.entries()) {
      params.push(`$${i + 1}`)
      values.push(item.menu_id)
    }

    // Получить стоимость из меню
    const { rows: costQueryRes } = await pgclient.query(
      `
      SELECT id, price::numeric
      FROM menu
      WHERE id IN (${params.join(',')})
    `,
      values
    )

    // мы хотим содать новую переменную, которая
    // будет включать тоже самое, что и
    // входной body, только с вычисленной ценой
    let orderWithCost = []
    // для этого надо пройтись по каждому элементу
    // в body
    for (const item of order) {
      // и для каждого элемента найти цену в costQuery
      // полученном при помощи запроса
      let cost = null
      for (const i of costQueryRes) {
        // ищем совпадение id в costQuery
        // с menu_id переданном в body
        if (i.id === item.menu_id) {
          cost = i.price
        }
      }

      // тут cost либо null, либо с значением цены
      // и если cost null, означает, что такого товара
      // в таблице menu не найдено, т.е. ошибка
      // Нам надо сделать rollback, вернуть сообщение клиенту
      if (!cost) {
        throw new Error(`Not found in menu: ${item.menu_id}`)
      }

      orderWithCost.push({
        ...item,
        cost: cost * item.count, // найденную стоимость на кол-во
      })
    }

    // добавляем все продукты заказа в order_menu
    // оптимальный вариант, это сгенерировать один
    // INSERT, который сразу добавит всё в таблицу
    // order_menu (как мы делали раньше)
    // Но тут попробуем сделать с Promise.all
    // т.е. отправить одновременно в базу все запросы
    // а уже после отправки ждать выполнение их всех
    // вместе.
    let promises = []
    for (const item of orderWithCost) {
      promises.push(
        pgclient.query(
          `INSERT INTO order_menu (order_id, menu_id, count, price) 
          VALUES ($1, $2, $3, $4);`,
          [orderID, item.menu_id, item.count, item.cost]
        )
      )
    }

    // ждём, пока выполнятся все запросы
    await Promise.all(promises)

    // коммитим изменения в базе
    await pgclient.query('COMMIT')
    return orderID
    }catch (err) {
    await pgclient.query('ROLLBACK')
    
    throw err
  } finally {
    await pgclient.release()
    console.log('close db connection')
  }
} 

module.exports={
    findOrderByClientID,
    makeOrder,
}