let data = [];
let value = 0,
    increment = 5
for(let i = 0; i <= 1000; i++){

  let newObj = {
    date: i * 10,
    value: value
  }
  data[i] = newObj;
  console.log(newObj)
  Math.random() > 0.5 ? value += increment : value -= increment
}

export default data
