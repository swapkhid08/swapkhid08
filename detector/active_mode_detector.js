$(document).ready(function(){
        active_mode = function(){
		$("#detector").addClass("active")
		$("#detector.active span img").attr("src","../../images/glyphicon-detector-active.png")	
		// $('#htms .tab-name').html('HTMS - DETECTOR')
		// $('#htms').addClass('active')
        }
	setTimeout( function(){
		active_mode();
	}, 800);
});

