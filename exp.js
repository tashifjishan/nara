// const result = [[1, 2], [3, 4], [5, 6]].reduce((acc, cur) => {
    
//     cur.forEach((el)=>{
//         acc.push(el)
//     })
//     return acc
// }, [])

// console.log(result)

const fruits = ['apple', 'banana', 'orange', 'apple', 'banana', 'apple']

// const occ = {}
// fruits.forEach(fruit=>{
//     if(occ[fruit]) occ[fruit]++
//     else occ[fruit] = 1
// })

// console.log(occ)

const occured = fruits.reduce((occ, cur)=>{
    if(occ[cur]) occ[cur]++
    else occ[cur] = 1
    return occ
}, {})

console.log(occured, "Bingo!")