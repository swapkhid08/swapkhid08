jQuery(document).ready(function () {
	//Adding accident
	$.ajax({
		url: '../../../models/detector/get_atcc_users.hh',
		type: 'POST',
		success: function (result) {
			result = jQuery.parseJSON(result);
			for (var i = result.length - 1; i >= 0; i--) {
				append = "<option email='" + result[i]["email"] + "' value='" + result[i]["user"] + "'>" + result[i]["user"] + "</option>";
				$("#users_list").append(append);
			}
		}
	})
	var getUrlParameter = function getUrlParameter (sParam) {
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;
	
		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');
	
			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	};
	var id = getUrlParameter('id');
	$.ajax({
		url: '../../../models/detector/get_atcc_auto_users.hh',
		type: 'POST',
		data: {id:id},
		success: function (result) {
			if(result == 'F'){
				$.alert({
					type: 'red',
					title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
					content: '<div class="fw-bold">Sorry, there has been a technical problem. Please report this error by sending an email to support@itspe.co.in with a screen shot</div>',
					buttons: {
						Ok: function () {
							window.location.href='detector_automatic_report.html';
						}
					}
				});
				return;
			}
			var devices_set = jQuery.parseJSON(result);
			$('#name_modal').html(devices_set[0].user);
			var opt = '';
			if(devices_set[0].frequency == "Monthly"){
				opt += '<option value="Monthly" selected>Monthly</option>';
				opt += '<option value="Weekly">Weekly</option>';
				opt += '<option value="Daily">Daily</option>';
				opt += '<option value="Hourly">Hourly</option>';
			}else if(devices_set[0].frequency == "Weekly"){
				opt += '<option value="Monthly">Monthly</option>';
				opt += '<option value="Weekly" selected>Weekly</option>';
				opt += '<option value="Daily">Daily</option>';
				opt += '<option value="Hourly">Hourly</option>';
			}else if(devices_set[0].frequency == "Daily"){
				opt += '<option value="Monthly">Monthly</option>';
				opt += '<option value="Weekly">Weekly</option>';
				opt += '<option value="Daily" selected>Daily</option>';
				opt += '<option value="Hourly">Hourly</option>';
			}else{
				opt += '<option value="Monthly">Monthly</option>';
				opt += '<option value="Weekly">Weekly</option>';
				opt += '<option value="Daily">Daily</option>';
				opt += '<option value="Hourly" selected>Hourly</option>';
			}
			$('#timerange_edit').html(opt);
		}
	});
	

	

});

function editRow () {
	var name = $('#name_modal')[0].innerHTML;
	var frequency = $("#timerange_edit").val();
	////console.log(name);
	////console.log(data_entry_list);
	$.ajax({
		url: '../../../models/detector/edit_atcc_auto_users.hh',
		data: { user: name, frequency: frequency },
		type: 'POST',
		success: function (result) {
			if(result == 'success'){
				$.alert({
					type: 'green',
					title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
					content: '<div class="fw-bold">Selected action is edited successfully</div>',
					buttons: {
						Ok: function () {
							window.location.href='detector_automatic_report.html';
						}
					}
				});
			}else{
				$.alert({
					type: 'red',
					title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
					content: '<div class="fw-bold">Sorry, there has been a technical problem. Please report this error by sending an email to support@itspe.co.in with a screen shot</div>'
				});
				return;
			}
			// $("#cancelModal_edit").click();
			// $.alert({
			// 	type: 'green',
			// 	title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
			// 	content: '<div class="fw-bold">Selected action is edited successfully</div>',
			// 	buttons: {
			// 		Ok: function () {
			// 			window.location.href='detector_automatic_report.html';
			// 		}
			// 	}
			// });
		}
	});
}

function deleteRow () {
	try {
		var name = $("input[type='radio'][name='mds']:checked").parent().parent().children()[2].innerHTML
		$.ajax({
			url: '../../../models/detector/del_atcc_auto_users.hh',
			data: { user: name },
			type: 'POST',
			success: function (result) {
				if (result.length == 2) {
					$.alert({
						type: 'red',
						title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
						content: '<div class="fw-bold">Sorry, there has been a technical problem. Please report this error by sending an email to support@itspe.co.in with a screen shot</div>'
					});
				}
				else {
					$.alert({
						type: 'green',
						title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
						content: '<div class="fw-bold">Action is deleted successfully</div>',
						buttons: {
							Ok: function () {
								window.location.href='detector_automatic_report.html';
							}
						}
					});
				}
			}
		});
	}
	catch (e) {
		$.alert({
			type: 'red',
			title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
			content: '<div class="fw-bold">Please select devide to delete</div>'
		});
	}
}