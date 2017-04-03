## Prevent Accidental NPM publish

It is a pain when you accidentally published your private npm modules to Npm registry.
This module prevents this disaster.

### Installation

```
npm i -g prevent-publish

```

### Usage

Add the hook to the prepublish npm script of your package.json. 
By default, this prevents the module be published to `registry.npmjs.org`

```
  "scripts": {
    "prepublish": "prevent-publish"
  },
```

If you have installed local to your module.

```
  "scripts": {
    "prepublish": "node_modules/.bin/prevent-publish"
  },
```

If you want the modules be published only to certain registries

```
  "scripts": {
    "prepublish": "prevent-publish --whitelist=libraries.npmjs.org,registry.yarnpkg.com"
  },
```

If you don't want to the modules be published to certain registries

```
  "scripts": {
    "prepublish": "prevent-publish --blacklist=registry.yarnpkg.com"
  },
```

If you don't want to the modules be published to certain registries but allow them published to 
`registry.npmjs.org`

```
  "scripts": {
    "prepublish": "prevent-publish --any --blacklist=registry.yarnpkg.com"
  },
```