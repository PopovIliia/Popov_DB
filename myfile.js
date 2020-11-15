const t = [1,2]
console.log(t)
t.push(3)
console.log(t)
//t =[3,4]

console.log('check')

const obj = {
    a: 1,
    b: 2
}
console.log(obj)

obj.c=3
console.log(obj)
console.log(obj.a)

const student={
    name:'Иван',
    surname:'Иванов'
}

//Имя: Иван, Фамилия: Иванов
let formattedStr1 = "Имя: " +student.name + ", Фамилия: " + student.surname
//лучший вариант
formattedStr1= `Имя: ${student.name}, Фамилия: ${student.surname}`
console.log(formattedStr1)

let one = 1
let two = 2
//number + number = addition

console.log(one + two)
//boolean + number = addition
one=true
console.log(one + two)

// boolean + boolean
console.log(true + true)

//string + number = concatenation 
one = '1'
console.log(one + two)

//string + boolen = 
console.log(true + one)

//string + string = concatenation
console.log('1' + '2')

one = 1
two = '1'
//==
if(one == two){
    console.log('its equal')
}
//===
if(one === two){
    console.log('its equal')
}

let fl = ""

if(!fl){
    console.log('its false')
}

const obj1 = {
    a: 1
}

console.log(obj1.b.c)