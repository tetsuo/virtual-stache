var compile = require('..');
var through = require('through2');
var test = require('tap').test;

test('pipeline', function (t) {
  var s = compile();
  s.get('parse').splice(1, 0, through.obj(function (row, enc, next) {
    row[1] = 'span';
    this.push(row);
    next();
  }));
  s.get('pack').unshift(through.obj(function (row, enc, next) {
    t.deepEqual(row, [ 'span', {}, [] ]);
    t.end();
  }));
  s.end('<div></div>');
});