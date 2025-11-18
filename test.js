// test.js
const { jsonToToon, toonToJson } = require('./index');

const obj = {
  a: 1,
  b: ['x', false, null],
  nested: { hello: 'world', pi: 3.14 },
  emptyArr: [],
  emptyObj: {}
};

const toon = jsonToToon(obj);
console.log('TOON:', toon);

const back = toonToJson(toon);
console.log('BACK:', JSON.stringify(back, null, 2));

console.log('roundtrip ok?', JSON.stringify(obj) === JSON.stringify(back));
