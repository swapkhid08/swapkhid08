$(document).ready(function(){
	var path = window.location.pathname;
	var page = (path.split("/").pop()).split('.')[0];
	$('.detector_header').load('../../html/detector/header.html');
	$('.detector_header li').removeClass('active');
	pagehtml = page+'_html';
	pagehead = page+'_header';
	setTimeout(function(){
		$('.'+pagehead).addClass('active');
		$('#'+pagehtml).addClass('nav-active');		
    },3000);
	
});
