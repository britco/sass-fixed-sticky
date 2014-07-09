(function(root, factory) {
  if (typeof exports === "object") {
    module.exports = factory(global.FixedSticky);
  } else {
    factory(root.FixedSticky);
  }
})(this, function(FixedSticky) {

  /* Module */
  var S, wrap, _slice;
  S = FixedSticky;
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
            if (!$(el).hasClass('fixedsticky-deactivated')) {
              return fn.call(_this, el);
            }
          };
        })(this));
      }
      FixedSticky._ticking = true;
    });
  }
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
        if (!$el.hasClass('fixedsticky-deactivated') && $el.css('animation-name') !== animationNameMatch) {
          $el.addClass('fixedsticky-deactivated');
          $(document).off('resize scroll', onResize);
          $el.each(function() {
            return $(this).removeData([S.keys.offset, S.keys.position]).removeClass(S.classes.active || '').removeClass(S.classes.inactive || '');
          });
          $el.removeClass('fixedsticky');
        }
      });
    }
  });
});
