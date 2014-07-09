((root, factory) ->
	if typeof exports is "object"
    # Node. Does not work with strict CommonJS, but only CommonJS-like
    # environments that support module.exports, like Node.
    module.exports = factory()
  else
    # Browser globals (root is window)
    factory()

  return
) this, ->
	### Module ###

	# Use polyfill until native support isn't buggy
	FixedSticky.tests.sticky = false

	# Use RAF for scroll event for performance
	if window.requestAnimationFrame?
		_slice = Array.prototype.slice
		wrap = (fn, wrap_fn) ->
		  return ->
		    return wrap_fn.apply(this,[fn].concat(_slice.call(arguments)))

		FixedSticky.update = wrap FixedSticky.update, (fn,el) ->
			if(!FixedSticky._ticking)
				window.requestAnimationFrame(=>
					FixedSticky._ticking = false
					fn.call(this,el)
				)

			FixedSticky._ticking = true

			return

	$(document).bind "animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", (e) ->
		animationName = e.originalEvent.animationName.trim()

		if(animationName == 'sass-fixed-sticky-animation') and !$(e.target).hasClass('fixedsticky')
			$(e.target).addClass('fixedsticky')
			$(e.target).fixedsticky()

	return
