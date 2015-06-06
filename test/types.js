module.exports = { Text: Text, Node: Node };

function Text (text) { this.text = text }

function Node (tag, attrs, children) {
  this.tag = tag;
  this.attrs = attrs;
  this.children = children;
}
