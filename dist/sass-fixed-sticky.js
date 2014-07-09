(function(root, factory) {
  if (typeof exports === "object") {
    module.exports = factory(global.FixedSticky);
  } else {
    factory(root.FixedSticky);
  }
})(this, function(FixedSticky) {

  /* RAF polyfill */
  var S, wrap, _slice;
  if (!Date.now) {
    Date.now = function() {
      return new Date().getTime();
    };
  }
  (function() {
    "use strict";
    var i, lastTime, vendors, vp;
    vendors = ["webkit", "moz"];
    i = 0;
    while (i < vendors.length && !window.requestAnimationFrame) {
      vp = vendors[i];
      window.requestAnimationFrame = window[vp + "RequestAnimationFrame"];
      window.cancelAnimationFrame = window[vp + "CancelAnimationFrame"] || window[vp + "CancelRequestAnimationFrame"];
      ++i;
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
      lastTime = 0;
      window.requestAnimationFrame = function(callback) {
        var nextTime, now;
        now = Date.now();
        nextTime = Math.max(lastTime + 16, now);
        return setTimeout((function() {
          callback(lastTime = nextTime);
        }), nextTime - now);
      };
      window.cancelAnimationFrame = clearTimeout;
    }
  })();

  /* Module */
  S = FixedSticky;
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
  return $(document).on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(e) {
    var $el, animationName, animationNameMatch, onResize;
    animationName = e.originalEvent.animationName.trim();
    animationNameMatch = 'sass-fixed-sticky-animation';
    if ((animationName === animationNameMatch) && !$(e.target).hasClass('fixedsticky')) {
      $el = $(e.target);
      if ($el.hasClass('fixedsticky-deactivated')) {

      } else {
        $el.fixedsticky();
      }
      $el.removeClass('fixedsticky-deactivated').addClass('fixedsticky');
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
