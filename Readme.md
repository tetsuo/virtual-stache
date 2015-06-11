# virtual-stache

template engine for creating virtual trees.

# example

given this template:

```
<h1>{title}</h1>
<ul>
  {#fruits}<li>{name}</li>{/fruits}
</ul>
```

produce rows of compiled functions for each top-level node:

```js
var compile = require('virtual-stache');
var fs = require('fs');

var dup = compile();
fs.createReadStream(__dirname + '/layout.html')
  .pipe(dup);

dup.on('data', function (render) {
  console.log(String(render));
});
```

then we can call the generated function in a `Template` context and create a [virtual-dom](https://github.com/Matt-Esch/virtual-dom) `VTree`:

```js
var Template = require('virtual-stache/template');
var createElement = require('virtual-dom/create-element');

dup.on('data', function (render) {
  var state = {
    fruits: [
      { name: 'kiwi '},
      { name: 'mango '}
    ]
  };
  var opts = {
    Node: require('virtual-dom/vnode/vnode'),
    Text: require('virtual-dom/vnode/vtext')
  };
  var tree = render.call(new Template, state, opts);
  var rootNode = createElement(tree);
  document.body.appendChild(rootNode);
});
```

# api

```js
var compile = require('virtual-stache');
```

## var pipeline = compile()

Returns a `pipeline` duplex stream that takes [stache](#stache) input and produces rows of output. The output rows are pre-compiled functions that can be evaluated for rendering and have the following signature:

```js
function render (state, options, constructor)
```

You can pass a `constructor` to create an execution context at runtime, or use `call()` to bind an existing one:

```js
var tpl = new Template();
render.call(tpl, state, options);
```

## template

`virtual-stache` provides a [virtual-dom](https://github.com/Matt-Esch/virtual-dom/) compatible `Template` that can be used at runtime to create virtual trees.

```js
var Template = require('virtual-stache/template');
```

However, `Template` is not bundled with [virtual-dom](https://github.com/Matt-Esch/virtual-dom/), so you need to provide [VNode](https://github.com/Matt-Esch/virtual-dom/blob/v2.0.1/docs/vnode.md) and [VText](https://github.com/Matt-Esch/virtual-dom/blob/v2.0.1/docs/vtext.md) explicitly. This is done by passing `Node` and `Text` in `options` object.

```js
var options = {
  Node: require('virtual-dom/vnode/vnode'),
  Text: require('virtual-dom/vnode/vtext')
};
var tree = render(state, options, Template);
```

`options` object must have following properties:

* `Node` is a virtual node constructor that implements the [VNode](https://github.com/Matt-Esch/virtual-dom/blob/v2.0.1/vnode/vnode.js) interface
* `Text` is a virtual node contructor that implements the [VText](https://github.com/Matt-Esch/virtual-dom/blob/v2.0.1/vnode/vtext.js) interface

The only optional property of `options` is `escape`, when enabled, it escapes html entities in strings to be safe for use in text nodes; by default nothing is escaped.

Also note that, `Template` always sets parsed attributes in [`properties.attributes`](https://github.com/Matt-Esch/virtual-dom/blob/v2.0.1/docs/vnode.md#propertiesattributes) object. You can override this behaviour if you need something else.

## compiler pipeline

There is an internal [labeled-stream-splicer](https://www.npmjs.com/package/labeled-stream-splicer) pipeline with these labels:

* `parse` - tokenize and parse stache templates
* `pack` - wrap the parse tree as a `Function`

You can call `compile().get()` with a label name to get a handle on a stream pipeline that you can `push()`, `unshift()`, or `splice()` to insert your own transform streams.

# stache

`virtual-stache` uses [tokenize-stache](https://github.com/tetsuo/tokenize-stache) to parse templates and supports a minimal set of [mustache spec](http://mustache.github.io/mustache.5.html) that covers variable interpolation and sections only. Currently stache tags in attributes are not supported.

## variables

template:

```
<h1>{name}</h1>
```

state:

```json
{
  "name": "Paul Atreides"
}
```

output:

```html
<h1>Paul Atreides</h1>
```

## sections

A section property can be an object, boolean or an array that will be iterated.

template:

```
<ul>
  {#fruits}
  <li>{name}</li>
  <ul>
    {#vitamins}
    <li>{name}</li>
    {/vitamins}
  </ul>
  {/fruits}
</ul>
```

state:

```json
{
  "fruits": [
    {
      "name": "Kiwi",
      "vitamins": [ { "name": "B-6" }, { "name": "C" } ]
    },
    {
      "name": "Mango"
    }
  ]
}
```

output:

```html
<ul>
  <li>Kiwi</li>
  <ul>
    <li>B-6</li>
    <li>C</li>
  </ul>
  <li>Mango</li>
</ul>
```

# todo

See [issues](https://github.com/tetsuo/virtual-stache/issues).

# license

mit