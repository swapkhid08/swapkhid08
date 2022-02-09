
function openModal () {
	//$("#addDeviceModal").modal();
	window.location.href="add_detector_setup.html";
}

function openEditModal () {
	try {
		var scn = sanitize($("input[type='radio'][name='mds']:checked").parent().parent().children()[1].innerHTML)
		window.location.href='edit_detector_setup.html?scn='+scn;
		return;
		var sh_des = sanitize($("input[type='radio'][name='mds']:checked").parent().parent().children()[2].innerHTML)
		var lat = sanitize($("input[type='radio'][name='mds']:checked").parent().parent().children()[3].innerHTML)
		var lng = sanitize($("input[type='radio'][name='mds']:checked").parent().parent().children()[4].innerHTML)
		var place = sanitize($("input[type='radio'][name='mds']:checked").parent().parent().children()[5].innerHTML)
		var ip = sanitize($("input[type='radio'][name='mds']:checked").parent().parent().children()[6].innerHTML)
		var port = sanitize($("input[type='radio'][name='mds']:checked").parent().parent().children()[7].innerHTML)
		var typeid = sanitize($("input[type='radio'][name='mds']:checked").parent().parent().children()[11].innerHTML)
		$("#editDeviceModal").modal();
		$(".modal-body #scn_modal")[0].innerHTML = scn
		$(".modal-body #shortDescription_modal").val(sh_des)
		$(".modal-body #latitude_modal").val(lat)
		$(".modal-body #longitude_modal").val(lng)
		$(".modal-body #place_modal").val(place)
		$(".modal-body #ipAddress_modal").val(ip)
		$(".modal-body #port_modal").val(port)
		$(".modal-body #supporttype_modal").val(typeid)
	}
	catch (e) {
		$.alert({
			type:'red',
			title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
			content: '<div class="fw-bold">Please select a device to edit device details</div>',
		});
	}
}

function editRow () {
	var scn = sanitize($('#scn_modal')[0].innerHTML);
	var shortDescription = sanitize($('#shortDescription_modal').val());
	var latitude = sanitize($('#latitude_modal').val());
	var longitude = sanitize($('#longitude_modal').val());
	var place = sanitize($('#place_modal').val());
	var ipAddress = sanitize($('#ipAddress_modal').val());
	var port = sanitize($('#port_modal').val());
	var typeId = sanitize($('#supporttype_modal').val());
	$.ajax({
		url: '../../../models/detector/edit_detector.hh',
		data: { scn: scn, shortDescription: shortDescription, latitude: latitude, longitude: longitude, place: place, ipAddress: ipAddress, port: port, typeId: typeId },
		type: 'POST',
		success: function (result) {
			$.confirm({
				title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Device entry is modified succesfully</div>',
				buttons: {
					Ok: function () {
						$("#cancelModal_edit").click();
						location.reload()
					}
				}
			});
		}
	});
}

function deleteRow () {
	try {
		var scn = $("input[type='radio'][name='mds']:checked").parent().parent().children()[1].innerHTML
		$.confirm({
			type: 'dark',
			title: '<h3 class="text-primary fw-bold mb-0">Confirmation </h3>',
			content: '<div class="fw-bold">Are you sure, you want to delete this information ?</div>',
			buttons: {
				yes: function () {
					$.ajax({
						url: '../../../models/detector/delete_detector.hh',
						data: { scn: scn },
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
								$.confirm({
									title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
									content: '<div class="fw-bold">Device entry deleted succesfully</div>',
									buttons: {
										Ok: function () {
											location.reload();
										}
									}
								});
							}
						}
					});
				},
				no: function () {
					$.alert({
						type: 'red',
						title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
						content: '<div class="fw-bold">Selected operation is cancelled</div>',
					});
				}
			}
		});

		
	}
	catch (e) {
		$.alert({
			type:'red',
			title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
			content: '<div class="fw-bold">Please select a device to delete device details</div>',
		});
	}
}


$(document).ready(function () {

	$.ajax({
		url: '../../../models/detector/get_types.hh',
		method: 'POST',
		data: { type: 'Signal' },
		success: function (res) {
			res = JSON.parse(res)
			$('#supporttype,#supporttype_modal,.filtertype').append('<option value="">Select Device Type</option>')
			for (var i = 0; i < res.length; i++) {
				$('#supporttype,#supporttype_modal,.filtertype').append('<option value="' + res[i].TypeID + '">' + res[i].TypeDescription + '</option>')
			}

		}
	})

	fetch_devices = function () {
		$('#dataTable').DataTable({
			"processing": true,
			"serverSide": true,
			"searching": false,
			"scrollY": "500px",
			"scrollCollapse": true, 
			"columnDefs": [
				{ orderable: false, targets: [0] },
				{
					targets: [2, 5],
					className: 'text-left'
				}
			],
			"order": [[1, "desc"]],
			"ajax": {
				"url": "../../../models/detector/get_detector_static.hh",
				"type": 'POST',
				'dataSrc': function (res) {
					var check = res;
					var return_data = new Array();
					check = check.data
					for (var i = 0; i < check.length; i++) {
						return_data.push({
							"radio": '<input type="radio" name="mds"></td>',
							"id": check.length - i,
							"SystemCodeNumber": check[i].SystemCodeNumber,
							"ShortDescription": check[i].ShortDescription,
							"Northing": check[i].Northing,
							"Easting": check[i].Easting,
							"Place": (check[i].Place == null || check[i].Place == "" ? '--' : check[i].Place),
							"IPAddress": (check[i].IPAddress == null || check[i].IPAddress == "" ? '--' : check[i].IPAddress),
							"Port": (check[i].Port == null || check[i].Port == "" ? '--' : check[i].Port),
							"CreationDate": check[i].CreationDate,
							"LastUpdated": check[i].LastUpdated,
							"Chainage": check[i].Chainage,
							"Direction": check[i].Direction,
							"Type": check[i].TypeDescription,
							"TypeId": check[i].TypeId
						})
					}
					return return_data;
				}
			},
			"columns": [
				{ "data": "radio" },
				{ "data": "SystemCodeNumber" },
				{ "data": "ShortDescription" },
				{ "data": "Northing", render: renderDecimal },
				{ "data": "Easting", render: renderDecimal },
				{ "data": "Place" },
				{ "data": "IPAddress" },
				{ "data": "Port" },
				{ "data": "Type" },
				{ "data": "Chainage" },
				{ "data": "Direction" },
				{ "data": "CreationDate", render: renderDate },
				{ "data": "LastUpdated", render: renderDate },
				{ "data": "TypeId" }
			],
			"fnDrawCallback": function (oSettings) {
				$('#dataTable tbody tr').each(function () {
					$('td:nth-child(14)', this).css('display', 'none')
				})
			}

		});
		function renderDate (data, type, full, meta) {
			if (data == null || data == '') {
				return '--';
			} else {
				return getFormattedDate(data, 'Y-m-d H:m:s', 'd-m-y H:m:s');
			}
		}
		function renderDecimal (data, type, full, meta) {
			return parseFloat(data).toFixed(4);
		}
	}
	fetch_devices();

	$("#addDevice").click(function () {
		var scn = sanitize($('#scn').val());
		var shortDescription = sanitize($('#shortDescription').val());
		var latitude = sanitize($('#latitude').val());
		var longitude = sanitize($('#longitude').val());
		var place = sanitize($('#place').val());
		var ipAddress = sanitize($('#ipAddress').val());
		var port = sanitize($('#port').val());
		var typeId = sanitize($('#supporttype').val());

		console.log('TypeID Value: ', typeId);
		$.confirm({
			title: '<h3 class="text-success fw-bold mb-0">Confirmation </h3>',
			content: '<div class="fw-bold">Are you sure, you want to add this device ?</div>',
			buttons: {
				yes: function () {
					$.ajax({
						url: '../../../models/detector/add_detector.hh',
						data: {
							scn: scn,
							shortDescription: shortDescription,
							latitude: latitude,
							longitude: longitude,
							place: place,
							ipAddress: ipAddress,
							port: port,
							typeId: typeId
						},
						type: 'POST',
						success: function (result) {
							$.confirm({
								title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
								content: '<div class="fw-bold">Device entry added succesfully</div>',
								buttons: {
									Ok: function () {
										$("#cancelModal").click();
										location.reload()
									}
								}
							});
						}
					});
				},
				no: function () {
					$.alert({
						title: '<h3 class="text-primary fw-bold mb-0">Message</h3>',
						content: '<div class="fw-bold">Selected operation is cancelled</div>',
					});
				}
			}
		});

	});
})
