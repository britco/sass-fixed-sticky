!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.sassFixedSticky=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
;__browserify_shim_require__=_dereq_;(function browserifyShim(module, exports, _dereq_, define, browserify_shim__define__module__export__) {
;(function( win, $ ) {

	function featureTest( property, value, noPrefixes ) {
		// Thanks Modernizr! https://github.com/phistuck/Modernizr/commit/3fb7217f5f8274e2f11fe6cfeda7cfaf9948a1f5
		var prop = property + ':',
			el = document.createElement( 'test' ),
			mStyle = el.style;

		if( !noPrefixes ) {
			mStyle.cssText = prop + [ '-webkit-', '-moz-', '-ms-', '-o-', '' ].join( value + ';' + prop ) + value + ';';
		} else {
			mStyle.cssText = prop + value;
		}
		return mStyle[ property ].indexOf( value ) !== -1;
	}

	var S = {
		classes: {
			plugin: 'fixedsticky',
			active: 'fixedsticky-on',
			clone: 'fixedsticky-dummy',
			withoutFixedFixed: 'fixedsticky-withoutfixedfixed'
		},
		keys: {
			offset: 'fixedStickyOffset',
			position: 'fixedStickyPosition'
		},
		tests: {
			sticky: featureTest( 'position', 'sticky' ),
			fixed: featureTest( 'position', 'fixed', true )
		},
		// Thanks jQuery!
		getScrollTop: function() {
			var prop = 'pageYOffset',
				method = 'scrollTop';
			return win ? (prop in win) ? win[ prop ] :
				win.document.documentElement[ method ] :
				win.document.body[ method ];
		},
		hasFixSticky: function() {
			// Check  native sticky, check fixed and if fixed-fixed is also included on the page and is supported
			return !!( S.tests.sticky || !S.tests.fixed || win.FixedFixed && !$( win.document.documentElement ).hasClass( 'fixed-supported' ) );
		},
		update: function( el ) {
			if( !el.offsetWidth ) return;

			var $el = $( el ),
				height = $el.outerHeight(),
				initialOffset = $el.data( S.keys.offset ),
				scroll = S.getScrollTop(),
				isAlreadyOn = $el.is( '.' + S.classes.active ),
				toggle = function( turnOn ) {
					$el[ turnOn ? 'addClass' : 'removeClass' ]( S.classes.active );
				},
				viewportHeight = $( window ).height(),
				position = $el.data( S.keys.position ),
				skipSettingToFixed,
				elTop,
				elBottom;

			if( !initialOffset ) {
				initialOffset = $el.offset().top;
				$el.data( S.keys.offset, initialOffset );
				$el.after( $( '<div>' ).addClass( S.classes.clone ).height( height ) );
			}

			if( !position ) {
				// Some browsers require fixed/absolute to report accurate top/left values.
				skipSettingToFixed = $el.css( 'top' ) !== 'auto' || $el.css( 'bottom' ) !== 'auto';

				if( !skipSettingToFixed ) {
					$el.css( 'position', 'fixed' );
				}

				position = {
					top: $el.css( 'top' ) !== 'auto',
					bottom: $el.css( 'bottom' ) !== 'auto'
				};

				if( !skipSettingToFixed ) {
					$el.css( 'position', '' );
				}

				$el.data( S.keys.position, position );
			}

			elTop = parseInt( $( el ).css( 'top' ), 10 ) || 0;
			elBottom = parseInt( $( el ).css( 'bottom' ), 10 ) || 0;

			if( position.top && initialOffset < ( scroll + elTop ) ||
				position.bottom && initialOffset > scroll + viewportHeight - ( height || 0 ) - elBottom ) {

				if( !isAlreadyOn ) {
					toggle( true );
				}
			} else {
				if( isAlreadyOn ) {
					toggle( false );
				}
			}
		},
		destroy: function( el ) {
			var $el = $( el );
			if (S.hasFixSticky()) return;

			$( win ).unbind( '.fixedsticky' );

			return $el.each(function() {
				$( this )
					.removeData( [ S.keys.offset, S.keys.position ] )
					.removeClass( S.classes.active )
					.nextUntil( S.classes.clone ).remove();
			});
		},
		init: function( el ) {
			var $el = $( el );

			if( S.hasFixSticky() ) {
				return;
			}

			return $el.each(function() {
				var _this = this;
				$( win ).bind( 'scroll.fixedsticky', function() {
					S.update( _this );
				}).trigger( 'scroll.fixedsticky' );

				$( win ).bind( 'resize.fixedsticky', function() {
					if( $el.is( '.' + S.classes.active ) ) {
						S.update( _this );
					}
				});
			});
		}
	};

	win.FixedSticky = S;

	// Plugin
	$.fn.fixedsticky = function( method ) {
		if ( typeof S[ method ] === 'function') {
			return S[ method ].call( S, this);
		} else if ( typeof method === 'object' || ! method ) {
			return S.init.call( S, this );
		} else {
			throw new Error( 'Method `' +  method + '` does not exist on jQuery.fixedsticky' );
		}
	};

	// Add fallback when fixed-fixed is not available.
	if( !win.FixedFixed ) {
		$( win.document.documentElement ).addClass( S.classes.withoutFixedFixed );
	}

})( this, jQuery );
; browserify_shim__define__module__export__(typeof FixedSticky != "undefined" ? FixedSticky : window.FixedSticky);

}).call(global, undefined, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(_dereq_,module,exports){
// Adapted from https://gist.github.com/paulirish/1579671 which derived from
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller.
// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon

// MIT license

if (!Date.now)
    Date.now = function() { return new Date().getTime(); };

(function() {
    'use strict';

    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
                                   || window[vp+'CancelRequestAnimationFrame']);
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function() { callback(lastTime = nextTime); },
                              nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
}());
},{}],3:[function(_dereq_,module,exports){
(function(root, factory) {
  if (typeof exports === "object") {
    module.exports = factory();
  } else {
    factory();
  }
})(this, function() {
  var FixedSticky, S, animationEvents, wrap, _slice;
  _dereq_('./requestanimationframe');
  S = FixedSticky = _dereq_("./../bower_components/filament-sticky/fixedsticky.js");
  FixedSticky.tests.sticky = false;
  _slice = Array.prototype.slice;
  wrap = function(fn, wrap_fn) {
    return function() {
      return wrap_fn.apply(this, [fn].concat(_slice.call(arguments)));
    };
  };
  FixedSticky.update = wrap(FixedSticky.update, function(fn, el) {
    if (!FixedSticky._tickingUpdate) {
      window.requestAnimationFrame((function(_this) {
        return function() {
          FixedSticky._tickingUpdate = false;
          if (!$(el).hasClass('fixedsticky-deactivated')) {
            return fn.call(_this, el);
          }
        };
      })(this));
    }
    FixedSticky._tickingUpdate = true;
  });
  animationEvents = ["animationstart", "webkitAnimationStart", "oAnimationStart", "MSAnimationStart", "animationiteration", "webkitAnimationIteration", "MSAnimationIteration"].join(' ');
  return $(document).on(animationEvents, function(e) {
    var $el, animationName, animationNameMatch, onResize;
    animationName = e.originalEvent.animationName.trim();
    animationNameMatch = 'sass-fixed-sticky-animation';
    if ((animationName === animationNameMatch) && !$(e.target).hasClass('fixedsticky')) {
      $el = $(e.target);
      $el.addClass('sass-fixed-sticky-animation-stopped');
      window.requestAnimationFrame(function() {
        var reactivate;
        reactivate = false;
        if ($el.hasClass('fixedsticky-deactivated')) {
          reactivate = true;
        } else {
          $el.fixedsticky();
        }
        $el.removeClass('fixedsticky-deactivated').addClass('fixedsticky');
        if (reactivate) {
          return FixedSticky.update($el);
        }
      });
      $(window).on('resize scroll', onResize = function() {
        if (!FixedSticky._tickingDeactivate) {
          window.requestAnimationFrame(function() {
            FixedSticky._tickingDeactivate = false;
            if (!$el.hasClass('fixedsticky-deactivated') && $el.css('animation-name') !== animationNameMatch) {
              $el.addClass('fixedsticky-deactivated');
              $(document).off('resize scroll', onResize);
              $el.each(function() {
                return $(this).removeData([S.keys.offset, S.keys.position]).removeClass(S.classes.active || '').removeClass(S.classes.inactive || '');
              });
              return $el.removeClass('fixedsticky');
            }
          });
          FixedSticky._tickingDeactivate = true;
        }
      });
    }
  });
});


},{"./../bower_components/filament-sticky/fixedsticky.js":1,"./requestanimationframe":2}]},{},[3])
(3)
});