$(document).ready(function(){
	var path = window.location.pathname;
	var page = (path.split("/").pop()).split('.')[0];
	$('.situation_header').load('../../html/situation/header.html');
	$('.situation_header li').removeClass('active');
	pagehtml = page+'_html';
	pagehead = page+'_header';
	setTimeout(function(){
		$('.'+pagehead).addClass('active');
		$('#'+pagehtml).addClass('nav-active');		
    },3000);
	/*$('.situation_list_header').load('../../html/situation/list_header.html');
	$('.situation_list_header li').removeClass('active');

	$('.situation_report_header').load('../../html/situation/report_header.html');
	$('.situation_report_header li').removeClass('active');*/
});
