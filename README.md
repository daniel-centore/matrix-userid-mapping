# matrix-userid-mapping
Handles mapping mapping arbitrary UTF-8 into Matrix userids (MXID) and back according to the specifications layed out in http://matrix.org/docs/spec/intro.html#mapping-from-other-character-sets

Usage:
```
var userid_map = require("matrix-userid-mapping");
userid_map.toMxid("Test");   // Converts 'Test' to '_test'
userid_map.fromMxid("_test");   // Converts 'test' to 'Test'
```

There is an optional second parameter in both functions which allows you to use the case-insensitive version of the conversion specification if you set it to false.
