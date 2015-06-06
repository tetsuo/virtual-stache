# virtual-stache

template engine for creating virtual trees.

# example

given this template:

```
<ul>
  {#fruits}<li>{name}</li>{/fruits}
</ul>
```

```js
var compile = require('virtual-stache');
var Template = require('virtual-stache/template')
var VNode = require('virtual-dom/vnode/vnode');
var VText = require('virtual-dom/vnode/vtext');
var fs = require('fs');

var dup = compile();
fs.createReadStream('./fruits.html').pipe(dup);

dup.on('data', function (render) {
  var state = {
    fruits: [
      { name: 'apple '},
      { name: 'orange '}
    ]
  };
  var opts = { Node: VNode, Text: VText };
  console.log(render.call(new Template, state, opts));
});
```

generates this output:

```html
<ul>
  <li>apple</li><li>orange</li>
</ul>
```

# api

todo

# license

mit