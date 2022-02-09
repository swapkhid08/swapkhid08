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
	fetch_users = function () {
		$('#dataTable').DataTable({
			"processing": true,
			"serverSide": true,
			"searching": false,
			"destroy": true,
			// "scrollY": "500px",
			// "scrollCollapse": true, 
			"columnDefs": [{ orderable: false, targets: [0] }],
			"order": [[1, "desc"]],
			"ajax": {
				"url": "../../../models/detector/get_atcc_auto_users.hh",
				"type": "POST",
			},
			"columns": [
				{ "data": "id", "title": "#", render: renderCheck },
				{ "data": "id" },
				{ "data": "user" },
				{ "data": "frequency" },
				{ "data": "updated_time", render: renderDate }
			]
		});
		function renderCheck (data, type, full, meta) {
			$("#users_list option[value = '" + full.user + "'").remove();
			return '<input type="radio" name="mds" value="' + data + '">';
		}
		function renderDate (data, type, full, meta) {
			return data == null ? '--' : getFormattedDate(data, 'Y-m-d H:m:s', 'd-m-y H:m:s');
		}
		
	}
	fetch_users();
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
		$.ajax({
			url: '../../../models/detector/add_atcc_auto_users.hh',
			data: { user: user, frequency: frequency },
			type: 'POST',
			success: function (result) {
				$.alert({
					type: 'green',
					title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
					content: '<div class="fw-bold">User added successfully</div>'
				});
				$("#cancelModal").click();
				fetch_users();
			}
		});
	})

});
function openAddmodal () {
	window.location.href="add_detector_automatic_report.html";
	//$("#selected_users_list").empty();
	//$("#add_modal").modal();
}
function openEditModal () {
	try {
		//var partr = $("input[type='radio'][name='mds']:checked").closest('tr');
		var id = $("input[type='radio'][name='mds']:checked").val();
		if(id != undefined && id != ''){
			window.location.href="edit_detector_automatic_report.html?id="+id;
		}else{
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please select an action to edit</div>'
			});
		}
		
		return;
		var name = $("input[type='radio'][name='mds']:checked").parent().parent().children()[2].innerHTML
		$('#edit_list_modal').empty();
		$("#editModal").modal();
		$(".modal-body #name_modal")[0].innerHTML = name;
	}
	catch (e) {
		////console.log("I was here for"+e);
		$.alert({
			type: 'red',
			title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
			content: '<div class="fw-bold">Please select action to edit</div>'
		});
	}
}
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
			$("#cancelModal_edit").click();
			$.alert({
				type: 'green',
				title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Selected action is edited successfully</div>'
			});
			fetch_users();
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
						content: '<div class="fw-bold">Action is deleted successfully</div>'
					});
					fetch_users();
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