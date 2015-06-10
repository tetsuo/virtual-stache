var compile = require('..');
var BaseTemplate = require('../template');
var test = require('tap').test;
var inherits = require('util').inherits;

inherits(Template, BaseTemplate);

function Template () {}

Template.prototype.e = function (s) { return 'qux' };

test('extend template', function (t) {
  var s = compile();
  s.on('data', function (render) {
    var actual = render.call(null, { s: "555" }, require('./types'), Template);
    t.deepEqual(actual, {
      tag: "x", props: {},
      children: [ { text: "qux" }, { text: "qux" } ]
    });
    t.end();
  });
  s.end('<x>y{s}</x>')
});