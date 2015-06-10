module.exports = { Text: Text, Node: Node };

function Text (text) { this.text = text }

function Node (tag, props, children) {
  this.tag = tag;
  this.props = props;
  this.children = children;
}
