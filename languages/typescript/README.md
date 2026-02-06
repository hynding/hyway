# hyway
A collection of common functions I use in my projects

## Install

`npm install hyway`

## Usage

### Core

Import from "hyway" or "hyway/core"

### Web

Import from "hyway/web"

When using as a dependency from `node_modules` directly from HTML, you can use script type `importmap` with script modules:

```
<html>
  <head>
    <script type="importmap">
    {
      "imports": {
        "hyway/core": "./node_modules/hyway/dist/core/index.js",
        "hyway/web": "./node_modules/hyway/dist/web/index.js"
      }
    }
    </script>
    <script type="module" defer>
      import { Circle } from "hyway/core";
      import { Canvas2dRenderer } from "hyway/web";

      // ...
    </script>
  </head>
  <body>
    ...
  </body>
</html>
```

### Node.js

Import from "hyway/node"
