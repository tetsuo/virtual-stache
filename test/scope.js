var compile = require('..');
var Template = require('../template');
var test = require('tap').test;
var fs = require('fs');

test('scope', function (t) {
  var s = compile();
  var expected = [
    {
      tag: "x", attrs: {},
      children: [
        { text: "555" },
        { text: "xyz" },
        { tag: "k", attrs: {}, children: [ { text: "rre" } ] }
      ]
    },
    {
      tag: "x", attrs: {},
      children: [
        {
          tag: "u", attrs: {},
          children: [
            {
              tag: "k", attrs: {},
              children: [
                { text: "ram" },
                { text: "8" },
                { tag: "z", attrs: {}, children: [] },
                { text: "8" },
                { tag: "z", attrs: {}, children: [] },
                { text: "8" },
                { tag: "z", attrs: {}, children: [] }
              ]
            }
          ]
        },
        { text: "ghj" },
        { text: "77" },
        { text: "55" },
        { text: "55" },
        { text: "55" },
        { text: "df" },
        { text: "s1" },
        { text: "1s" },
        { text: "63" },
        { text: "6734" },
        { text: "qkw" }
      ]
    },
    {
      tag: "x", attrs: {},
      children: [
        { text: "sd" },
        { text: "12" },
        { text: "34" },
        { text: "23" },
        { text: "55" },
        { text: "65" },
        { text: "89" }
      ]
    }
  ];
  var state = [
    {
      yar: "555",
      bar: [ { nor: "xyz", ssw: "rre" } ]
    },
    {
      kq: "qkw",
      bar: {
        da: {
          m: "ram",
          ow: [
            1, 1, 1
          ]
        },
        dor: {
          kw: "ghj",
          mor: [
            { sd: "77" },
            { sd: "55" },
          ],
          ke: "s1"
        },
        jh: "6734"
      }
    },
    {
      s: {
        s: "sd",
        z: false,
        u: [
          { k: "12", r: [ { u: "34" }, { u: "23", y: true } ] },
          { k: "65", r: [ { u: "89" } ] },
        ]
      }
    }
  ];

  fs.createReadStream(__dirname + '/scope.html').pipe(s);
  var i = 0;
  t.plan(expected.length);
  s.on('data', function (render) {
    var actual = render.call(new Template, state[i], require('./types'));
    t.deepEqual(actual, expected[i]);
    ++ i;
  });
});