(function() {
  $(document).bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(e) {
    var animationName;
    animationName = e.originalEvent.animationName.trim();
    if (animationName === 'sass-fixed-sticky-animation') {
      $(e.target).addClass('fixedsticky');
      return $(e.target).fixedsticky();
    }
  });

}).call(this);
