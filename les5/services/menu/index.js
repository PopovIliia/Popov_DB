const pool = require('../../config/db')


/**
 * 
 * @param {string} name - название продукта 
 */
async function findMenu(name){
    //Используем where 1=1 чтобы не
    //Делать условие добавления Where для
    // каждого фильтра
    let query=`
    Select *
    From menu
    Where 1=1
    `
    const values = []

    if(name){
        query += 'And name ILIKE $1'
        values.push(`%${name}%`)
    }
    
    console.log(query)

    const {rows} = await pool.query(query,values)
    return rows 

}

module.export ={
    findMenu,
}