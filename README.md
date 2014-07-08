sass-fixed-sicky
================

SASS library for making elements `position sticky` based on top of https://github.com/filamentgroup/fixed-sticky.

## Installation
````
bower install sass-fixed-sicky
````

In your .scss (or .sass) file:
````
@import "sass-fixed-sticky";

#fixed-element {
  @include position(sticky);
  top: 0;
}

````

And then include the JS file: [dist/sass-fixed-sticky.js](./dist/sass-fixed-sticky.js)

````
<script src="sass-fixed-sticky/dist/sass-fixed-sticky.js"></script>
````

Then you're done, all the elements you applied the mixin to will have a 'sticky' position. You don't need to need any further Javascript.

## Links
* https://github.com/filamentgroup/fixed-sticky
* http://updates.html5rocks.com/2012/08/Stick-your-landings-position-sticky-lands-in-WebKit

Also see the [demo file](./test/demo.html)

## License
Available under the [MIT License](LICENSE.md).
