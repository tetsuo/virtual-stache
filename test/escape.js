var compile = require('..');
var Template = require('../template');
var test = require('tap').test;
var extend = require('util')._extend;

test('escape', function (t) {
  var s = compile();
  s.on('data', function (render) {
    var actual = render.call(new Template, { s: "<<" },
                             extend({ escape: true }, require('./types')));
    t.deepEqual(actual, {
      tag: "x", props: {},
      children: [ { text: "y&gt;y" }, { text: "&lt;&lt;" } ]
    });
    t.end();
  });
  s.end('<x>y>y{s}</x>')
});