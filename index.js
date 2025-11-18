'use strict';

const { Buffer } = require('buffer');

function b64Encode(str) {
  return Buffer.from(str, 'utf8').toString('base64');
}
function b64Decode(b64) {
  return Buffer.from(b64, 'base64').toString('utf8');
}

// Encoder: JS value -> TOON string
function jsonToToon(value) {
  const parts = [];
  function encode(v) {
    if (v === null) {
      parts.push('NULL');
    } else if (Array.isArray(v)) {
      parts.push('ARR', String(v.length));
      for (const item of v) encode(item);
    } else if (typeof v === 'object') {
      const keys = Object.keys(v);
      parts.push('OBJ', String(keys.length));
      for (const k of keys) {
        parts.push('STR', b64Encode(k));
        encode(v[k]);
      }
    } else if (typeof v === 'string') {
      parts.push('STR', b64Encode(v));
    } else if (typeof v === 'number') {
      if (!isFinite(v)) throw new Error('Cannot encode non-finite number');
      parts.push('NUM', String(v));
    } else if (typeof v === 'boolean') {
      parts.push('BOOL', v ? 'true' : 'false');
    } else {
      throw new Error('Unsupported type: ' + typeof v);
    }
  }
  encode(value);
  return parts.join(' ');
}

// Decoder: TOON string -> JS value
function toonToJson(toonStr) {
  if (typeof toonStr !== 'string') throw new Error('TOON must be a string');
  const tokens = toonStr.length === 0 ? [] : toonStr.split(' ');
  let idx = 0;
  function next() {
    if (idx >= tokens.length) throw new Error('Unexpected end of TOON tokens');
    return tokens[idx++];
  }
  function parse() {
    const t = next();
    if (t === 'NULL') return null;
    if (t === 'ARR') {
      const count = Number(next());
      if (!Number.isInteger(count) || count < 0) throw new Error('Invalid array count');
      const arr = [];
      for (let i = 0; i < count; i++) arr.push(parse());
      return arr;
    }
    if (t === 'OBJ') {
      const count = Number(next());
      if (!Number.isInteger(count) || count < 0) throw new Error('Invalid object count');
      const obj = {};
      for (let i = 0; i < count; i++) {
        const keyType = next();
        if (keyType !== 'STR') throw new Error('Object key must be STR token');
        const keyB64 = next();
        const key = b64Decode(keyB64);
        obj[key] = parse();
      }
      return obj;
    }
    if (t === 'STR') {
      const b64 = next();
      return b64Decode(b64);
    }
    if (t === 'NUM') {
      const n = Number(next());
      if (Number.isNaN(n)) throw new Error('Invalid NUM token');
      return n;
    }
    if (t === 'BOOL') {
      const b = next();
      if (b === 'true') return true;
      if (b === 'false') return false;
      throw new Error('Invalid BOOL token');
    }
    throw new Error('Unknown token: ' + t);
  }
  const result = parse();
  if (idx !== tokens.length) throw new Error('Extra tokens after parsing');
  return result;
}

module.exports = {
  jsonToToon,
  toonToJson
};
