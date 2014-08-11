sass-fixed-sicky
================

Easy "sticky position" elements. These are elements that are positioned normally most of the time, but as you scroll past them, they become "fixed position".

![](http://i.imgur.com/tB1UrtQ.gif)


## Installation
`bower install sass-fixed-sicky` or `npm install sass-fixed-sicky`

In your .scss (or .sass) file:
````
@import "sass-fixed-sticky";

#fixed-element {
  @include position(sticky);
  top: 0;
}

````

`top` should be equivalent to how far from the top you want the element to be. You can also use the `bottom` property.

And then include the JS file: [`dist/sass-fixed-sticky.js`](./dist/sass-fixed-sticky.js)

````
<script src="sass-fixed-sticky/dist/sass-fixed-sticky.js"></script>
````

Then you're done, all the elements you applied the mixin to will have a 'sticky' position. You don't even need to add any Javascript in your `<head>`.

For a complete example see [#demos](#demos).

## Demos

Basic example: [`basic.html`](http://britco.github.io/sass-fixed-sticky/demo/basic.html)

## FAQ

__Q:__
Do I need to require the [fixed-sticky library](https://github.com/filamentgroup/fixed-sticky) separately?

__A:__
No you do not, it is bundled together with `sass-fixed-sticky`.

## Development

````
bower install
npm install
gulp watch
````

## Release

````
gulp bump
git tag -a 0.1.7 -m "0.1.7"
````


## Links
* https://github.com/filamentgroup/fixed-sticky
* http://updates.html5rocks.com/2012/08/Stick-your-landings-position-sticky-lands-in-WebKit


## License
Available under the [MIT License](LICENSE.md).
