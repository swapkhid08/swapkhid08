$(document).ready(function () {
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
	var scn = getUrlParameter('scn');
	
	
	

	$('#supporttype').change(function(){
		$('.r').remove();
		$('#make_model').html('');
		var supporttype = $('#supporttype').val();
		var mod = $( "#supporttype option:selected" ).text();
		$.ajax({
			url: '../../../models/detector/get_detector_make_model.hh',
			type: 'POST',
			data: { type: supporttype },
			success: function (res) {
				res = JSON.parse(res)
				$('#make_model').append('<option value="">Select model</option>')
				for (var i = 0; i < res.length; i++) {
					$('#make_model').append('<option value="' + res[i].ID + '">' + res[i].Make +' - '+ res[i].Model + '</option>')
				}
	
			}
		})
		$("#addzones").val('');
	})

	$("#addDevice").click(function () {
		var scn = sanitize($('#scn').val());
		var shortDescription = sanitize($('#shortDescription').val());
		var latitude = sanitize($('#latitude').val());
		var longitude = sanitize($('#longitude').val());
		var place = sanitize($('#place').val());
		var ipAddress = sanitize($('#ipAddress').val());
		var port = sanitize($('#port').val());
		var typeId = sanitize($('#supporttype').val());
		var mod = $( "#supporttype option:selected" ).text();
		var make_model = sanitize($('#make_model').val());
		var public_live_link =$('#public_live_link').val();
		var live_link =$('#live_link').val();
		var direction = sanitize($('#direction').val());
		var chainage = sanitize($('#chainage').val());
		
		var zonesval = 0;
		if(scn == ''){
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please provide System Code Number</div>'
			});
			return;
		}
		if(shortDescription == ''){
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please provide Short Description</div>'
			});
			return;
		}
		if(latitude == ''){
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please provide Latitude</div>'
			});
			return;
		}
		if(longitude == ''){
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please provide Longitude</div>'
			});
			return;
		}
		if(place == ''){
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please provide Place</div>'
			});
			return;
		}
		if(ipAddress == ''){
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please provide IP Address</div>'
			});
			return;
		}
		validate = ValidateIPaddress(ipAddress);
		if(!validate){
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please enter valid IP Address</div>'
			});
			return;
		}
		if(port == ''){
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please provide Port</div>'
			});
			return;
		}
		if(typeId == null || typeId == 'null' || typeId == ''){
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please provide Type</div>'
			});
			return;
		}
		if(make_model == null || make_model == 'null' || make_model == ''){
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please provide Model</div>'
			});
			return;
		}
		var dataset = {
			scn: scn,
			shortDescription: shortDescription,
			latitude: latitude,
			longitude: longitude,
			place: place,
			ipAddress: ipAddress,
			port: port,
			typeId: typeId,
			MakeId:make_model,
			publiclivelink: public_live_link,
			livelink: live_link,
			chainage:chainage,
			direction:direction
		}
		zonesval = $("#countzones").val();
		var sig = 1;
		for (var i = 1; i <= zonesval; i++) {
			var name = "zone_scn_" + i;
			var name2 = "zone_name_"+i;
			var zone_scn = $("input[name=zone_scn_" + i+"]").val();
			var zone_name = $("input[name=zone_name_" + i+"]").val();
			var zone_livelink = $("input[name=zone_livelink_" + i+"]").val();
			var zone_publiclivelink = $("input[name=zone_publiclivelink_" + i+"]").val();
			var zone_latitude = $("input[name=zone_latitude_" + i+"]").val();
			var zone_longitude = $("input[name=zone_longitude_" + i+"]").val();
			
			if(zone_scn != undefined){
				if(zone_scn == ''){
				
					$.alert({
						type: 'red',
						title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
						content: '<div class="fw-bold">Please provide Zone SCN for Zone #'+i+'</div>'
					});
					$("input[name=" + name + "]").focus();
					return;
				}
				if(zone_name == '' ){
					$.alert({
						type: 'red',
						title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
						content: '<div class="fw-bold">Please provide Zone Name for Zone #'+i+'</div>'
					});
					$("input[name=" + name2 + "]").focus();
					return;
				}
				if(zone_latitude == '' ){
					$.alert({
						type: 'red',
						title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
						content: '<div class="fw-bold">Please provide Zone Latitude for Zone #'+i+'</div>'
					});
					$("input[name=" + name2 + "]").focus();
					return;
				}
				if(zone_longitude == '' ){
					$.alert({
						type: 'red',
						title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
						content: '<div class="fw-bold">Please provide Zone Longitude for Zone #'+i+'</div>'
					});
					$("input[name=" + name2 + "]").focus();
					return;
				}
				dataset["zone_scn_" + sig] = zone_scn;
				dataset["zone_name_" + sig] = zone_name;
				dataset["zone_livelink_" + sig] = zone_livelink;
				dataset["zone_publiclivelink_" + sig] = zone_publiclivelink;
				dataset["zone_latitude_" + sig] = zone_latitude;
				dataset["zone_longitude_" + sig] = zone_longitude;
				sig++;
			}
			
		}
		dataset['zone'] = $("#addzones").val();
		$.confirm({
			title: '<h3 class="text-success fw-bold mb-0">Confirmation </h3>',
			content: '<div class="fw-bold">Are you sure, you want to add this device ?</div>',
			buttons: {
				yes: function () {
					$.ajax({
						url: '../../../models/detector/edit_detector.hh',
						data: dataset,
						type: 'POST',
						success: function (result) {
							if(result == 'E'){
								$.alert({
									type: 'red',
									title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
									content: '<div class="fw-bold">Device System Code Number already exists! Please provide a different System Code Number.</div>'
								});
								return;
							}else if(result == 'success'){								
								$.alert({
									type: 'green',
									title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
									content: '<div class="fw-bold">Device details updated succesfully</div>',
									buttons: {
										Ok: function () {
											window.location.href='detector_setup.html';
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
