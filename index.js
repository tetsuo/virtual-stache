var through = require('through2');
var tokenize = require('tokenize-stache');
var splicer = require('labeled-stream-splicer');

module.exports = function () {
  var pipeline = [ 
    'parse', [ tokenize(), parse() ],
    'pack', [ compile() ]
  ];
  return splicer.obj(pipeline);
};

function compile () {
  return through.obj(function (row, enc, next) {
    var code = 't=t?new t:this;t.s(' + JSON.stringify(row) + ');return t.r(d,m)';
    this.push((new Function('d', 'm', 't', code)));
    next();
  });
}

var IN_TEXT = 0, IN_TAG = 1,
    ATTRS = 1, CHILDREN = 2, PARENT = 3,
    SECTION = 2, VARIABLE = 3;

function parse () {
  var state = IN_TEXT, cursor = null,
      top = [];

  return through.obj(function (row, enc, next) {
    var node;

    switch (row.shift()) {
      case 'open':
        node = row.concat([ [], cursor ? cursor : null ]);
        if (state == IN_TEXT)
          state = IN_TAG;
        else
          top[top.length - 1].push(node);
        cursor = node;
        top.push(node[CHILDREN]);
        break;
      case 'close':
        node = cursor;
        if (cursor[PARENT] === null) {
          state = IN_TEXT;
          cursor = null;
          top = [];
          this.push(node.slice(0, -1));
        } else {
          state = IN_TAG;
          cursor = cursor[PARENT];
          top.pop();
          node.splice(-1, 1);
        }
        break;
      case 'text':
        node = row[0];
        if (state == IN_TEXT) {
          if (node.match(/^[\s\xa0]+$/g))
            break;
          else
            throw new Error('top-level text node');
        } else
          top[top.length - 1].push(node);
        break;
      case 'variable':
        node = [VARIABLE, row[0]];
        top[top.length - 1].push(node);
        break;
      case 'section:open':
        node = [SECTION, row[0], []];
        top.push(node[CHILDREN]);
        top[top.length - 2].push(node);
        break;
      case 'section:close':
        top.pop();
    }
    next();
  });
}