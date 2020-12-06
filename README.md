![logo](./logo.png)

![npm](https://img.shields.io/npm/v/scroom) [![Netlify Status](https://api.netlify.com/api/v1/badges/c2aef5c9-9162-43c1-96d6-e6c1884f92f4/deploy-status)](https://app.netlify.com/sites/scroom-site/deploys)

Scroom is a smart library for cool scrolling effects, based on Intersection Observer.

[Check Documentation and examples.](http://scroom.wsq.cool/)

## Features

- High Performance
- Friendly To Use
- Typrscript Support
- Lightweight ( 2kb or less by ES Module treeshaking )

## Installation

```shell
$ npm install scroom
```

## Usage

```js
import { setup } from "scroom";

const sc = setup({
  target: document.getElementById("#target-element"),
  offset: 0.5,
});

sc.onProgress((progress) => {
    ...
});
```

## Auto Resize Detection

You don't have to worry about "resize". You can change the size as much as you want, and Scroom will always worked.

## Browser Compatibility

Same with [Intersection Observer](https://caniuse.com/?search=Intersection%20Observer). You can optimize the compatibility by including [polyfill](https://github.com/w3c/IntersectionObserver#readme).

```shell
$ npm install intersection-observer
```

And import it.

```js
import "intersection-observer";
```

## Alternatives

- [Scrollama](https://github.com/russellgoldenberg/scrollama)
- [ScrollMagic](http://scrollmagic.io/)
- [Waypoints](http://imakewebthings.com/waypoints/)
