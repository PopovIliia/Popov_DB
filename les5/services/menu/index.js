const pool = require('../../config/db')


/**
 * 
 * @param {string} name - название продукта 
 * @param {number} price - максимальная цена
 */
async function findMenu(name, price){
    //Используем where 1=1 чтобы не
    //Делать условие добавления Where для
    // каждого фильтра
    let query=`
    Select *
    From menu
    Where 1=1
    `
    const values = []
    
    let counter = 1
    if(name){
        query += `And name ILIKE $${counter}`
        values.push(`%${name}%`)
        counter++
    }
    
    if (price) {
        query += ` AND price < $${counter}`
        values.push(price)
        counter++
      }

    const {rows} = await pool.query(query,values)
    return rows 

}

module.export ={
    findMenu,
}