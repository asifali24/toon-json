# toon-js

Tiny JSON ⇄ TOON (Token-Oriented Object Notation) converter.

## Install
Locally:
```bash
npm install toon-json


const { jsonToToon, toonToJson } = require("toon-json");

// Sample JSON object
const sample = {
  name: "Asif",
  age: 27,
  skills: ["node", "react"],
  active: true,
  address: {
    city: "Delhi",
    zip: 110001
  },
  notes: null
};

// Convert JSON → TOON
const toon = jsonToToon(sample);
console.log("TOON Format:\n", toon);

// Convert TOON → JSON
const parsed = toonToJson(toon);
console.log("\nBack To JSON:\n", parsed);

