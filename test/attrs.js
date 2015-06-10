var compile = require('..');
var Template = require('../template');
var test = require('tap').test;
var extend = require('util')._extend;

test('attributes', function (t) {
  var s = compile();
  s.on('data', function (render) {
    var actual = render({ title: 'qq' }, require('./types'), Template);
    t.deepEqual(actual, {
      tag: "x", props: { 
        attributes: { 
          "data-qq": "555",
          "style": "background-color: #fff; color: #ccc"
        } 
      }, children: []
    });
    t.end();
  });
  s.end('<x data-qq="555" style="background-color: #fff; color: #ccc"></x>')
});