var compile = require('..');
var test = require('tap').test;
var fs = require('fs');

test('tree', function (t) {
  var s = compile();
  fs.createReadStream(__dirname + '/tree.html').pipe(s);
  s.get('parse').on('data', function (data) {
    t.deepEqual(data, expected);
    t.end();
  });
});

var expected = [ "x", {},
  [
    [ "d", {}, [ "bla" ] ],
    " ",
    [ 2,
      "foo",
      [
        " ",
        [ "y", {},
          [
            " ",
            [ "z", {},
              [
                "bom ",
                [ "c", {},
                  [
                    [ 3, "qux" ],
                    " ",
                    [ 3, "sox" ]
                  ]
                ],
                [ "k", {}, [] ]
              ]
            ],
            [ 3, "quux" ],
            " "
          ]
        ],
      "bum ",
      [ 2, "bar", 
        [
          "555",
          [ "r", {}, [] ],
          [ "u", {}, [] ]
        ]
      ],
      " 888" ]
    ],
    " ",
    [ "k", {}, [] ],
    "333",
    [ "d", {}, [ [ 2, "qux", [ "999" ] ], [ "h", { "x": "{nope}" }, [] ] ] ],
    " ",
    [ 3, "jj" ],
    [ 3, "dd" ],
    "uu"
  ]
];