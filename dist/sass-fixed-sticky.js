(function() {
  (function(root, factory) {
    if (typeof exports === "object") {
      module.exports = factory();
    } else {
      factory();
    }
  })(this, function() {

    /* Module */
    var wrap, _slice;
    FixedSticky.tests.sticky = false;
    if (window.requestAnimationFrame != null) {
      _slice = Array.prototype.slice;
      wrap = function(fn, wrap_fn) {
        return function() {
          return wrap_fn.apply(this, [fn].concat(_slice.call(arguments)));
        };
      };
      FixedSticky.update = wrap(FixedSticky.update, function(fn, el) {
        if (!FixedSticky._ticking) {
          window.requestAnimationFrame((function(_this) {
            return function() {
              FixedSticky._ticking = false;
              return fn.call(_this, el);
            };
          })(this));
        }
        FixedSticky._ticking = true;
      });
    }
    $(document).bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(e) {
      var animationName;
      animationName = e.originalEvent.animationName.trim();
      if ((animationName === 'sass-fixed-sticky-animation') && !$(e.target).hasClass('fixedsticky')) {
        $(e.target).addClass('fixedsticky');
        return $(e.target).fixedsticky();
      }
    });
  });

}).call(this);
