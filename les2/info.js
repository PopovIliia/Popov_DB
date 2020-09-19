const a ={
    first:1,
    second:2
}
console.log(a.first)

let varfirst =a.first
console.log(varfirst)

const {first: firstL,second } =a
console.log(firstL)
console.log(second)

//переменные окружения
console.log(process.env)