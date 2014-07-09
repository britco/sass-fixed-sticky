((root, factory) ->
	if typeof exports is "object"
		# Node. Does not work with strict CommonJS, but only CommonJS-like
		# environments that support module.exports, like Node.
		module.exports = factory(global.FixedSticky)
	else
    # Browser globals (root is window)
    factory(root.FixedSticky)

	return
) this, (FixedSticky) ->
	### RAF polyfill ###
	unless Date.now
	  Date.now = ->
	    new Date().getTime()
	(->
	  "use strict"
	  vendors = [
	    "webkit"
	    "moz"
	  ]
	  i = 0

	  while i < vendors.length and not window.requestAnimationFrame
	    vp = vendors[i]
	    window.requestAnimationFrame = window[vp + "RequestAnimationFrame"]
	    window.cancelAnimationFrame = (window[vp + "CancelAnimationFrame"] or window[vp + "CancelRequestAnimationFrame"])
	    ++i
	  # iOS6 is buggy
	  if /iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) or not window.requestAnimationFrame or not window.cancelAnimationFrame
	    lastTime = 0
	    window.requestAnimationFrame = (callback) ->
	      now = Date.now()
	      nextTime = Math.max(lastTime + 16, now)
	      setTimeout (->
	        callback lastTime = nextTime
	        return
	      ), nextTime - now

	    window.cancelAnimationFrame = clearTimeout
	  return
	)()

	### Module ###

	# Same alias as library
	S = FixedSticky

	# Use polyfill until native support isn't buggy
	FixedSticky.tests.sticky = false

	_slice = Array.prototype.slice
	wrap = (fn, wrap_fn) ->
	  return ->
	    return wrap_fn.apply(this,[fn].concat(_slice.call(arguments)))

	FixedSticky.update = wrap FixedSticky.update, (fn,el) ->
		# Use RAF for scroll event for performance if available
		if(!FixedSticky._tickingUpdate)
			window.requestAnimationFrame =>
				FixedSticky._tickingUpdate = false

				# Activate.. only if there is a fixedsticky-deactivated class
				# TODO: Remove this once there is a fully working `destroy`
				# method in library
				if(!$(el).hasClass('fixedsticky-deactivated'))
					fn.call(this,el)

		FixedSticky._tickingUpdate = true

		return

	# Activate fixed-sticky when the element is animated in
	$(document).on "animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", (e) ->
		animationName = e.originalEvent.animationName.trim()
		animationNameMatch = 'sass-fixed-sticky-animation'

		if(animationName == animationNameMatch) and !$(e.target).hasClass('fixedsticky')
			$el = $(e.target)

			# Activate..
			if $el.hasClass('fixedsticky-deactivated')
				# Pass.. don't need to re-init if it was initialized before but then
				# deactivated
			else
				$el.fixedsticky()

			$el.removeClass('fixedsticky-deactivated').addClass('fixedsticky')

			$(window).on 'resize scroll', onResize = ->
				# De-activate
				if(!FixedSticky._tickingDeactivate)
					window.requestAnimationFrame ->
						FixedSticky._tickingDeactivate = false
						if !$el.hasClass('fixedsticky-deactivated') and $el.css('animation-name') != animationNameMatch
							$el.addClass('fixedsticky-deactivated')
							$(document).off('resize scroll', onResize)

							# Taken from https://github.com/filamentgroup/fixed-sticky/blob/master/fixedsticky.js#L135
							# TODO: Remove this once there is a fully working `destroy` method in library
							$el.each ->
								$(this).removeData([
									S.keys.offset
									S.keys.position
								]).removeClass(S.classes.active || '').removeClass(S.classes.inactive || '')

							$el.removeClass('fixedsticky')

					FixedSticky._tickingDeactivate = true

				return

		return