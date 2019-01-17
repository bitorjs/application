// 引入模块
// let PathToReg = require('path-to-regexp')
// // 要使用路径中找到的键填充的数组
// let keys = []

// let reg = PathToReg('/user/:id', keys, {
//   end: false
// })
// // console.log(keys)
// keys = []
// let reg1 = PathToReg('/user/:id', keys, {
//   end: false
// })
// console.log(keys)
// keys = []
// let reg2 = PathToReg('/user/1/(.*)', keys, {
//   end: false
// })
// let result = '/user/1/hello'.match(reg2)
// console.log(result, keys)

// for star
// let reg3 = PathToReg('*', keys, {
//   end: false,
//   // start: false
// })
// let result = reg3.exec('/') //.match(reg3)
// console.log(result, reg3)

// let reg3 = PathToReg('/user/(.*)', keys, {
//   // end: false,
//   // start: false
// })
// let result = reg3.exec('/user/f345/sdfsd') //.match(reg3)
// console.log(result, keys)

// let reg3 = PathToReg('/user/f:id/:if', keys, {
//   end: false,
//   start: false
// })
// let result = reg3.exec('/dd/fff/user/f345/3453/ff') //.match(reg3)
// console.log(result, keys)

// let reg3 = PathToReg('/', keys, {
//   // end: false,
//   // start: false
// })
// let result = reg3.exec('//') //.match(reg3)
// console.log(result, reg3)

// var str = "abc12456def45646ghi";
// var regExp = /\d+/;
// var array = regExp.exec(str);
// printArray(array);
/*
0=12456
index=3
input=abc12456def45646ghi
*/

// 索引0：存放第一个匹配的子字符串。
// 属性index：匹配文本在字符串中的起始索引位置。
// 属性input：整个字符串对象(stringObject)。

console.log('..start')

var ori = [
  '*',
  "/:id",
  "/a/b/c",
  "/e/:id/f",
  "/e/adf:id/f",
  "/:f0/:f1/:f2",
  "/a/:d/m",
  "/a/:e",
  "/a/e/*"
]

var ret = [];

function calc(path) {
  const r = path.split('/');
  let ret = 0;
  for (let i = 0; i < r.length; i++) {
    const item = r[i];
    let base = 100 / Math.pow(10, i)

    if (item === '*') {
      base *= 1;
    } else {
      let ind = item.indexOf(':');
      if (ind > -1) {
        base *= 0.9;
        base *= Math.pow(0.9, ind);
      } else {
        base *= 0.1;
      }
    }

    ret += base;
  }

  return ret;
}

for (let i = 0; i < ori.length; i++) {
  const path = ori[i];
  const r = path.split('/')
  console.log(r, calc(path))

  // [ '*' ] 100
  // [ '', ':id' ] 19
  // [ '', 'a', 'b', 'c' ] 11.11
  // [ '', 'e', ':id', 'f' ] 11.91
  // [ '', 'e', 'adf:id', 'f' ] 11.6661
  // [ '', ':f0', ':f1', ':f2' ] 19.99
  // [ '', 'a', ':d', 'm' ] 11.91
  // [ '', 'a', ':e' ] 11.9
  // [ '', 'a', 'e', '*' ] 11.2
}

console.log('..end')