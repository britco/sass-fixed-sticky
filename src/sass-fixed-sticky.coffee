$(document).bind "animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", (e) ->
	animationName = e.originalEvent.animationName.trim()

	if(animationName == 'sass-fixed-sticky-animation')
		$(e.target).addClass('fixedsticky')
		$(e.target).fixedsticky()
