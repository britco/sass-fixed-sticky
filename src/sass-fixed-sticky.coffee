FixedSticky.tests.sticky = false

$(document).bind "animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", (e) ->
	animationName = e.originalEvent.animationName.trim()

	if(animationName == 'sass-fixed-sticky-animation') and !$(e.target).hasClass('fixedsticky')
		$(e.target).addClass('fixedsticky')
		$(e.target).fixedsticky()
