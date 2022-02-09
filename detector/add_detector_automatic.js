jQuery(document).ready(function () {
	//Adding accident
	$.ajax({
		url: '../../../models/detector/get_atcc_users.hh',
		type: 'POST',
		success: function (result) {
			result = jQuery.parseJSON(result);
			console.log(result)
			for (var i = result.length - 1; i >= 0; i--) {
				append = "<option email='" + result[i]["email"] + "' value='" + result[i]["user"] + "'>" + result[i]["user"] + "</option>";
				console.log(append)
				$("#users_list").append(append);
			}
		}
	})
	// fetch_users = function () {
	// 	$('#auto_users').empty();
	// 	$.ajax({
	// 		url: '../../../models/detector/get_atcc_auto_users.hh',
	// 		type: 'POST',
	// 		success: function (result) {
	// 			var devices_set = jQuery.parseJSON(result);
	// 			for (i = devices_set.length - 1; i >= 0; i--) {
	// 				append = '<tr>'
	// 				append += '<td><input type="radio" name="mds"></td>'
	// 				append += '<td>' + (devices_set.length - i) + '</td>'
	// 				append += '<td>' + devices_set[i].user + '</td>'
	// 				append += '<td>' + devices_set[i].frequency + '</td>'
	// 				append += '<td>' + (devices_set[i].updated_time == null ? '--' : getFormattedDate(devices_set[i].updated_time, 'Y-m-d H:m:s', 'd-m-y H:m:s')) + '</td>'
	// 				append += '</tr>'
	// 				$('#auto_users').append(append);
	// 				// $("#users_list option[value = '" + devices_set[i].user + "'").remove();
	// 			}
	// 		}
	// 	});
	// }
	// fetch_users();
	$("#users_list").on("change", function (e) {
		$("#selected_users_list").empty();
		var user = $("#users_list option:selected").val();
		var email = $("#users_list option:selected").attr("email");
		////console.log("User"+user+"Email"+email);
		if (user == "" || email == "undefined") {
			return;
		}
		else {
			append = "<tr><td>Username: </td><td>&nbsp;" + user + " </td></tr>"
			append += "<tr><td>&nbsp;Email: </td><td>&nbsp;" + email + " </td></tr>"
			$("#selected_users_list").append(append);
		}
	})

	$("#add_action_submit").click(function () {
		var frequency = $("#timerange").val(),
			user = $("#users_list option:selected").val();
			if(user == null || user == 'null' || user == '' || user == undefined){
				$.alert({
					type: 'red',
					title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
					content: '<div class="fw-bold">Please select user</div>'
				});
				return;
			}
		$.ajax({
			url: '../../../models/detector/add_atcc_auto_users.hh',
			data: { user: user, frequency: frequency },
			type: 'POST',
			success: function (result) {
				if(result == 'E'){
					$.alert({
						type: 'red',
						title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
						content: '<div class="fw-bold">User already existing</div>'
					});
					return;
				}
				else if(result == 'success'){
					$.alert({
						type: 'green',
						title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
						content: '<div class="fw-bold">User added successfully</div>',
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
				
			}
		});
	})

});