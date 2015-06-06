module.exports = Template;

var TAG = 0, ATTRS = 1, CHILDREN = 2, PARENT = 3,
    SECTION = 2, VARIABLE = 3, NAME = 1;

function Template () {
  this.root = [];
}

Template.prototype = {
  s: function (root) {
    this.root = root;
  },

  r: function (state, opts) {
    if (!state) state = {};
    if (!opts) opts = {};

    var Node = opts.Node, Text = opts.Text,
        top = [ state ];

    return traverse(null, this.root);

    function traverse (acc, node) {
      if (Array.isArray(node)) {
        if ('string' === typeof node[TAG]) {
          node = new Node(node[TAG], node[ATTRS], node[CHILDREN].reduce(traverse, []));
          if (!acc) return node;
          acc.push(node);
        } else if (SECTION === node[TAG]) {
          var tail = top[top.length - 1];
              val = tail[node[NAME]], isarr = false;

          if (!val || ((isarr = Array.isArray(val)) && val.length === 0))
            return acc;

          if (isarr) {
            top.push(val);
            val.forEach(function (x) {
              top.push(x);
              node[CHILDREN].reduce(traverse, acc);
              top.pop();
            });
          } else {
            top.push(('object' === typeof val) ? val : tail);
            node[CHILDREN].reduce(traverse, acc);
          }

          top.pop();
        } else if (VARIABLE === node[TAG]) {
          tail = top[top.length - 1];
          acc.push(new Text(tail[node[NAME]]));
        }
      } else {
        acc.push(new Text(node));
      }
      return acc;
    }
  }
};
