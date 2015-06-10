var compile = require('..');
var test = require('tap').test;

test('top-level', function (t) {
  var expected = [ /text/, /section/, /variable/ ];
  t.plan(expected.length * 2);
  var i = 0;
  function s () {
    var s = compile();
    s.on('error', function (err) {
      t.has(err.message, expected[i]);
      t.type(err, Error);
      ++ i;
    });
    return s;
  }
  s().end('bla');
  s().end('{#x}{/x}');
  s().end('{x}');
});