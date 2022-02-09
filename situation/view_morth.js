var scnNO;
var selectedSubTypes = [];
$(document).ready(function () {

	
	// classSelect = new SlimSelect({
	// 	select: '#type_of_collision_a',
	// 	// placeholder: 'Select Collision Type (A)',
		
	//   })
	get_parameter_by_name = function (name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}


	if (get_parameter_by_name('module') == 'accident') {

		$.ajax({
			url: '../../../models/autoload/get_accident_config.hh',
			type: 'GET',
			success: function (res) {
				res = JSON.parse(res);
				let format = res.formats;
				format = format.split(',')
				// $('#view_nhai').removeClass('hideme');
				if (format.includes('NHAI')) {
					$('#view_nhai').removeClass('hideme');
				}
				if (format.includes('IRC')) {
					$('#view_irca1').removeClass('hideme');
				}
				if (format.includes('MORTH')) {
					$('#view_morth').removeClass('hideme');
				}
				$('#details_tabs').show();
				$('#heading').hide();
			}
		})


	} else {
		$('#heading').show();
		$('#details_tabs').hide();
	}
	
	$('.nav li').each(function (i, obj) {
		var href = $('a', obj).attr('href') + "?module=" + get_parameter_by_name('module') + "&id=" + get_parameter_by_name('id')
		$('a', obj).attr('href', href)
		scnNO = get_parameter_by_name('id')
	})
	var vehicle_type = '<select class="form-control vehicle_type">'
	var disposition = '<select class="form-control disposition">'
	var loadconditionpassenger = '<select class="form-control loadconditionpassenger">'
	var loadconditiongoods = '<select class="form-control loadconditiongoods">'
	var driver_gender = '<select class="form-control driver_gender">'
	var driverVehicleType = '<select class="form-control driverVehicleType">'
	var impactVehicletype = '<select class="form-control impactVehicletype">'
	var involvementOfAlcohol = '<select class="form-control involvementOfAlcohol">'
	var typeOfTrafficViolation = '<select class="form-control typeOfTrafficViolation">'
	var typeOfInjury = '<select class="form-control typeOfInjury">'
	var usingRequisiteSafetyDevice = '<select class="form-control usingRequisiteSafetyDevice">'
	var persontype = '<select class="form-control persontype">'
	var occupantVehicleType = '<select class="form-control occupantVehicleType">'
	var impactingVehicleTypeOthers = '<select class="form-control impactingVehicleTypeOthers">'
	var othersGender = '<select class="form-control othersGender">'
	var typeOfInjuryOthers = '<select class="form-control typeOfInjuryOthers">'
	var usingRequisiteSafetyDeviceOthers = '<select class="form-control usingRequisiteSafetyDeviceOthers">'

	$.ajax({
		url: '../../../models/situation/get_morth_types.hh',
		method: 'POST',
		success: function (res) {
			res = JSON.parse(res)
			var morth_state = res.morth_state,
				morth_accident_type = res.morth_accident_type,
				morth_weather_condition = res.morth_weather_condition,
				morth_collision_types_A = res.morth_collision_types_A,
				morth_collision_types_B = res.morth_collision_types_B,
				morth_road_type_A = res.morth_road_type_A,
				morth_road_type_B = res.morth_road_type_B,
				morth_accident_spot = res.morth_accident_spot,
				morth_road_features_A = res.morth_road_features_A,
				morth_road_features_B = res.morth_road_features_B,
				morth_roads_junction = res.morth_roads_junction,
				morth_traffic_control = res.morth_traffic_control,
				morth_vehicle_type = res.morth_vehicle_type,
				morth_load_condition = res.morth_load_condition,
				morth_disposition_type = res.morth_disposition_type

			///////Accident Identification Details////////////////
			$('.scn').val(scnNO);
			for (var i = 0; i < morth_state.length; i++) {
				$('#state').append('<option id="' + morth_state[i].id + '" value="' + morth_state[i].id + '">' + morth_state[i].name + '</option>');
			}
			for (var i = 0; i < morth_accident_type.length; i++) {
				$('#typeofaccident').append('<option id="' + morth_accident_type[i].id + '" value="' + morth_accident_type[i].id + '">' + morth_accident_type[i].accident_type + '</option>')
			}

			for (var i = 0; i < morth_weather_condition.length; i++) {
				$('#type_of_weather').append('<option id="' + morth_weather_condition[i].id + '"value="' + morth_weather_condition[i].id + '" >' + morth_weather_condition[i].weather_condition + '</option>')
			}
			// for (var i = 0; i < morth_collision_types_A.length; i++) {
			// 	$('#type_of_collision_a').append('<option id="' + morth_collision_types_A[i].id + '" value="' + morth_collision_types_A[i].id + '">' + morth_collision_types_A[i].collision_type + '</option>')
			// }
			for (var i = 0; i < morth_collision_types_A.length; i++) {
				$('#type_of_collision_a').append('<option id="' + morth_collision_types_A[i].id + '" value="' + morth_collision_types_A[i].id + '"' + '>' + morth_collision_types_A[i].collision_type + '</option>')
			}
			// for (var i = 0; i < morth_collision_types_A.length; i++) {
			// 	var selectedSubTypes = [];
			// 	if (selectedSubTypes.includes(morth_collision_types_A[i].id)) {
			// 		// for (var j = 0; j <= selectedSubTypes.length; j++){
			// 		$('#type_of_collision_a').append('<option id=' + morth_collision_types_A[i].id + '" value="' + morth_collision_types_A[i].id +' selected>' + morth_collision_types_A[i].collision_type + '</option>')
			// 		// }
			// 		//$('#supporttype').append('<option value="' + res[i].TypeID + '" selected>' + res[i].TypeDescription + '</option>')
			// 	} else {
			// 	$('#type_of_collision_a').append('<option id="' + morth_collision_types_A[i].id + '" value="' + morth_collision_types_A[i].id + '"' + (i == 0 ? 'selected' : '') + '>' + morth_collision_types_A[i].collision_type + '</option>')
			// 	}

			// 	//  $('#features').append('<option value=' + res[i].TypeID + '>' + res[i].TypeName + '</option>')

			// }


			for (var i = 0; i < morth_collision_types_B.length; i++) {
				$('#type_of_collision_b').append('<option id="' + morth_collision_types_B[i].id + '" value="' + morth_collision_types_B[i].id + '">' + morth_collision_types_B[i].collision_type + '</option>')
			}
			////////Road Related Details////////////
			for (var i = 0; i < morth_road_type_A.length; i++) {
				$('#roadtypeA').append('<option id="' + morth_road_type_A[i].id + '" value="' + morth_road_type_A[i].id + '" >' + morth_road_type_A[i].road_type + '</option>')
			}
			for (var i = 0; i < morth_road_type_B.length; i++) {
				$('#roadtypeB').append('<option id="' + morth_road_type_B[i].id + '" value="' + morth_road_type_B[i].id + '">' + morth_road_type_B[i].road_type + '</option>')
			}
			for (var i = 0; i < morth_accident_spot.length; i++) {
				$('#accident_spot').append('<option id="' + morth_accident_spot[i].id + '" value="' + morth_accident_spot[i].id + '" >' + morth_accident_spot[i].accident_spot + '</option>')
			}
			for (var i = 0; i < res.morth_speed_limit.length; i++) {
				$('#speed_limit').append('<option id="' + res.morth_speed_limit[i].id + '" value="' + res.morth_speed_limit[i].id + '">' + res.morth_speed_limit[i].speed_limit + '</option>')
			}
			for (var i = 0; i < morth_road_features_A.length; i++) {
				$('#roadFeaturesA').append('<option id="' + morth_road_features_A[i].id + '" value="' + morth_road_features_A[i].id + '">' + morth_road_features_A[i].road_features + '</option>')
			}
			for (var i = 0; i < morth_road_features_B.length; i++) {
				$('#roadFeaturesB').append('<option id="' + morth_road_features_B[i].id + '" value="' + morth_road_features_B[i].id + '">' + morth_road_features_B[i].road_features + '</option>')
			}
			for (var i = 0; i < morth_roads_junction.length; i++) {
				$('#Road_Junction').append('<option id="' + morth_roads_junction[i].id + '" value="' + morth_roads_junction[i].id + '">' + morth_roads_junction[i].junction + '</option>')
			}
			for (var i = 0; i < morth_traffic_control.length; i++) {
				$('#Type_of_Traffic_Control').append('<option id="' + morth_traffic_control[i].id + '" value="' + morth_traffic_control[i].id + '">' + morth_traffic_control[i].traffic_control + '</option>')
			}
			for (var i = 0; i < morth_traffic_control.length; i++) {
				$('.registrationnumber').append('<option id="' + morth_traffic_control[i].id + '" value="' + morth_traffic_control[i].id + '">' + morth_traffic_control[i].traffic_control + '</option>')
			}
			////////////////Details of Vehicles involved in Accident////////////////////
			for (var i = 0; i < morth_vehicle_type.length; i++) {
				$('.vehicle_type').append('<option value="' + morth_vehicle_type[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + morth_vehicle_type[i].vehicle_type + '</option>')
				vehicle_type += '<option value="' + morth_vehicle_type[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + morth_vehicle_type[i].vehicle_type + '</option>'
			}
			for (var i = 0; i < morth_disposition_type.length; i++) {
				$('.disposition').append('<option value="' + morth_disposition_type[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + morth_disposition_type[i].disposition_type + '</option>')
				disposition += '<option value="' + morth_disposition_type[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + morth_disposition_type[i].disposition_type + '</option>'
			}
			for (var i = 0; i < morth_load_condition.length; i++) {
				$('.loadconditionpassenger').append('<option value="' + morth_load_condition[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + morth_load_condition[i].condition + '</option>')
				loadconditionpassenger += '<option value="' + morth_load_condition[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + morth_load_condition[i].condition + '</option>'
			}
			for (var i = 0; i < morth_load_condition.length; i++) {
				$('.loadconditiongoods').append('<option value="' + morth_load_condition[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + morth_load_condition[i].condition + '</option>')
				loadconditiongoods += '<option value="' + morth_load_condition[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + morth_load_condition[i].condition + '</option>'
			}
			disposition += '</select>',
				vehicle_type += '</select>',
				loadconditionpassenger += '</select>',
				loadconditiongoods += '</select>'
			//////////////Drivers Details/////////////////////
			for (var i = 0; i < morth_vehicle_type.length; i++) {
				$('.driverVehicleType').append('<option value="' + morth_vehicle_type[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + morth_vehicle_type[i].vehicle_type + '</option>')
				driverVehicleType += '<option value="' + morth_vehicle_type[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + morth_vehicle_type[i].vehicle_type + '</option>'
			}
			for (var i = 0; i < res.morth_gender.length; i++) {
				$('.driver_gender').append('<option value="' + res.morth_gender[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + res.morth_gender[i].gender + '</option>')
				driver_gender += '<option value="' + res.morth_gender[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + res.morth_gender[i].gender + '</option>'
			}
			for (var i = 0; i < morth_vehicle_type.length; i++) {
				$('.impactVehicletype').append('<option value="' + morth_vehicle_type[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + morth_vehicle_type[i].vehicle_type + '</option>')
				impactVehicletype += '<option value="' + morth_vehicle_type[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + morth_vehicle_type[i].vehicle_type + '</option>'
			}
			for (var i = 0; i < res.morth_licence_type.length; i++) {
				$('#type_of_licence').append('<option value="' + res.morth_licence_type[i].id  + '" ' + (i == 0 ? 'selected' : '') + '>' + res.morth_licence_type[i].licence_type + '</option>')
			}
			for (var i = 0; i < res.morth_alcohol_involvement.length; i++) {
				$('.involvementOfAlcohol').append('<option value="' + res.morth_alcohol_involvement[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + res.morth_alcohol_involvement[i].alcohol_involvement + '</option>')
				involvementOfAlcohol += '<option value="' + res.morth_alcohol_involvement[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + res.morth_alcohol_involvement[i].alcohol_involvement + '</option>'
			}
			for (var i = 0; i < res.morth_traffic_violation.length; i++) {
				$('.typeOfTrafficViolation').append('<option value="' + res.morth_traffic_violation[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + res.morth_traffic_violation[i].traffic_violation + '</option>')
				typeOfTrafficViolation += '<option value="' + res.morth_traffic_violation[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + res.morth_traffic_violation[i].traffic_violation + '</option>'
			}
			for (var i = 0; i < res.morth_injury_type.length; i++) {
				$('.typeOfInjury').append('<option value="' + res.morth_injury_type[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + res.morth_injury_type[i].injury_type + '</option>')
				typeOfInjury += '<option value="' + res.morth_injury_type[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + res.morth_injury_type[i].injury_type + '</option>'
			}
			for (var i = 0; i < res.morth_safety_device.length; i++) {
				$('.usingRequisiteSafetyDevice').append('<option value="' + res.morth_safety_device[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + res.morth_safety_device[i].safety_device + '</option>')
				usingRequisiteSafetyDevice += '<option value="' + res.morth_safety_device[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + res.morth_safety_device[i].safety_device + '</option>'
			}
			driverVehicleType += '</select>',
				driver_gender += '</select>',
				impactVehicletype += '</select>',
				involvementOfAlcohol += '</select>',
				typeOfTrafficViolation += '</select>',
				typeOfInjury += '</select>',
				usingRequisiteSafetyDevice += '</select>'

			////////////////////////////Persons Other than Drivers Involved in Accident///////////////////			
			for (var i = 0; i < res.morth_person_type.length; i++) {
				$('.persontype').append('<option value="' + res.morth_person_type[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + res.morth_person_type[i].person_type + '</option>')
				persontype += '<option value="' + res.morth_person_type[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + res.morth_person_type[i].person_type + '</option>'
			}
			for (var i = 0; i < morth_vehicle_type.length; i++) {
				$('.occupantVehicleType').append('<option value="' + morth_vehicle_type[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + morth_vehicle_type[i].vehicle_type + '</option>')
				occupantVehicleType += '<option value="' + morth_vehicle_type[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + morth_vehicle_type[i].vehicle_type + '</option>'
			}
			for (var i = 0; i < res.morth_gender.length; i++) {
				$('.othersGender').append('<option value="' + res.morth_gender[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + res.morth_gender[i].gender + '</option>')
				othersGender += '<option value="' + res.morth_gender[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + res.morth_gender[i].gender + '</option>'
			}
			for (var i = 0; i < res.morth_injury_type.length; i++) {
				$('.typeOfInjuryOthers').append('<option value="' + res.morth_injury_type[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + res.morth_injury_type[i].injury_type + '</option>')
				typeOfInjuryOthers += '<option value="' + res.morth_injury_type[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + res.morth_injury_type[i].injury_type + '</option>'
			}
			for (var i = 0; i < morth_vehicle_type.length; i++) {
				$('.impactingVehicleTypeOthers').append('<option value="' + morth_vehicle_type[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + morth_vehicle_type[i].vehicle_type + '</option>')
				impactingVehicleTypeOthers += '<option value="' + morth_vehicle_type[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + morth_vehicle_type[i].vehicle_type + '</option>'
			}
			for (var i = 0; i < res.morth_safety_device.length; i++) {
				$('.usingRequisiteSafetyDeviceOthers').append('<option value="' + res.morth_safety_device[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + res.morth_safety_device[i].safety_device + '</option>')
				usingRequisiteSafetyDeviceOthers += '<option value="' + res.morth_safety_device[i].id + '" ' + (i == 0 ? 'selected' : '') + '>' + res.morth_safety_device[i].safety_device + '</option>'
			}
			persontype += '</select>'
			occupantVehicleType += '</select>'
			othersGender += '</select>'
			impactingVehicleTypeOthers += '</select>'
			typeOfInjuryOthers += '</select>'
			usingRequisiteSafetyDeviceOthers += '</select>'
		}
	})
	bind_click = function () {
		$('.delete_row').unbind('click').click(function () {
			$(this).parent().parent().remove()
		})
	}
	bind_click()
	$('.add_row').click(function () {
		var val = $(this).attr('val')
		var ele = ''
		if (val == 't1') {
			id= ($('.t1 tr:last-child td:nth-child(1)').length <1)?id=1:parseInt($('.t1 tr:last-child td:nth-child(1)').html()) + 1
			// else(
			// 	console.log("hiiii")
			// )
			// console.log(id);
			// var tabloneID = id;
			ele += '<tr><td width=4% id = srno'+(id+1)+'>' + id + '</td>'
			ele += '<td>' + vehicle_type + '</td>'
			ele += '<td><input type="text" class="form-control registrationnumber" placeholder="Enter Registration Plate"></td>'
			ele += '<td>' + disposition + '</td>'
			ele += '<td>' + loadconditionpassenger + '</td>'
			ele += '<td>' + loadconditiongoods + '</td>'
			// ele += '<td>' + loadcondition + '</td>'
			ele += '<td><input type="radio" name="mechanical' + id + '" value="1" id="yes' + id + 'm" ><label for="yes' + id + 'm"> Yes</label><input type="radio" name="mechanical' + id + '" value="0" id="no' + id + 'm" checked><label for="no' + id + 'm"> No</label></td>'
			ele += '<td width="6%"><input type="number" class="form-control ageOfVehicle" placeholder="Enter Age of Vehicle" min="0"></td>'
			ele += '<td><button class="btn btn-danger delete_row">Delete Row</button></td></tr>'
			$('.t1 tbody').append(ele)
		}
		else if (val == 't2') {
			// var id = parseInt($('.t2 tr:last-child td:nth-child(1)').html()) + 1
			id= ($('.t2 tr:last-child td:nth-child(1)').length <1)?id=1:parseInt($('.t2 tr:last-child td:nth-child(1)').html()) + 1
				
				// id=1;
				// console.log(id)
			// }
			// else(
			// 	console.log("hiiii")
			// )
			ele += '<tr><td width=4%>' + id + '</td>'
			ele += '<td>' + driverVehicleType + '</td>'
			ele += '<td width="6%">' + driver_gender + '</td>'
			ele += '<td width="4%"><input type="number" class="form-control driverAge" placeholder="Enter Age." min="0"></td>'
			ele += '<td width=4%><input type = "text" class="form-control impactVehicleNo" id="impact_vehicle_number" placeholder="Enter Impacting Vehicle No."></td>'
			ele += '<td>' + impactVehicletype + '</td>'
			ele += '<td> <select class="form-control typeOfLicence" id="type_of_licence" placeholder="Select Type of Licence"><option value="1">Valid Permanent License</option><option value="2">Learner License</option><option value="3">Without License</option><option value="4">Not known</option></select></td>'
			ele += '<td><input type="text" class="form-control licenceNumber" id="licence_number" placeholder="Enter Licence Number"></td>'
			ele += '<td>' + involvementOfAlcohol + '</td>'
			ele += '<td>' + typeOfTrafficViolation + '</td>'
			ele += '<td>' + typeOfInjury + '</td>'
			ele += '<td>' + usingRequisiteSafetyDevice + '</td>'
			ele += '<td><button class="btn btn-danger delete_row">Delete Row</button></td></tr>'
			$('.t2 tbody').append(ele)
		}
		else if ((val == 't3')) {
			id= ($('.t3 tr:last-child td:nth-child(1)').length <1)?id=1:parseInt($('.t3 tr:last-child td:nth-child(1)').html()) + 1
			// else(
			// 	console.log("hiiii")
			// )
			ele += '<tr><td width=4%>' + id + '</td>'
			ele += '<td>' + persontype + '</td>'
			ele += '<td><input type="text" class=" form-control occupantVeicleNo" id="occupant_vehicle_no" placeholder="Enter Occupant Vehicle Number"></td>'
			ele += '<td>' + occupantVehicleType + '</td>'
			ele += '<td>' + othersGender + '</td>'
			ele += '<td><input type="number" class="form-control ageOtherPerson" placeholder="Enter Age" min="0"></td>'
			ele += '<td><input type="text" class="form-control impactingVehicleNumberOthers" placeholder="Enter Impacting vehicle Number"></td>'
			ele += '<td>' + impactingVehicleTypeOthers + '</td>'
			ele += '<td>' + typeOfInjuryOthers + '</td>'
			ele += '<td>' + usingRequisiteSafetyDeviceOthers + '</td>'
			ele += '<td><button class="btn btn-danger delete_row">Delete Row</button></td></tr>'
			$('.t3 tbody').append(ele)
		}
		bind_click()
	})
	$.ajax({
		url: '../../../models/situation/get_morth_details.hh',
		method: 'POST',
		data: {
			module: get_parameter_by_name('module'),
			id: get_parameter_by_name('id')
		},
		success: function (res) {
			res = JSON.parse(res)
			insertData(res)
			$('.loader').hide();
			$('.loading-overlay').hide();
		}
	})
	insertData = function (data) {
		var maindata = data.data[0]
		var vehicledata = data.vehicles
		var victimdata = data.victims
		var driverdata = data.drivers
		$('.up_northing').val(maindata.Northing)
		$('.up_easting').val(maindata.Easting)
		$('.acc_datetime').val(maindata.AccidentTime);
		$('.fir').val(maindata.FIRNumber);
		$('.placeName').val(maindata.NameOfPlace);
		$('.policestation').val(maindata.PoliceStation);
		$('.district').val(maindata.District);	
		$('#state option[value="' + maindata.State + '"]').attr('selected', true)
		$('input[name=typeofarea][value="' + maindata.TypeOfArea + '"]').prop('checked', true);
		$('#typeofaccident option[value="' + maindata.TypeOfAccident + '"]').attr('selected', true);
		$('.personKilled').val(maindata.NoOfFatalities);
		$('.personGrievouslyInjured').val(maindata.NoOfInjuredNeedingHospitalisation);
		$('.personMinorInjured').val(maindata.NoOfInjuredNotNeedingHospitalisation);
		$('.motorizedVehicle').val(maindata.NoOfMotorizedVehiclesInvolved);
		$('.nonMotorizedVehicle').val(maindata.NoOfNonMotorizedVehiclesInvolved);
		$('.pedestrianInvolved').val(maindata.NoOfPedestriansInvolved);
		$('#type_of_weather option[value="' + maindata.TypeOfWeather + '"]').attr('selected', true);
		$('input[name=hitandrun][value="' + maindata.HitAndRun + '"]').prop('checked', true);
		// selectedSubTypes = [];
		// if (selectedSubTypes.includes(morth_collision_types_A[i].id)) {}
		// console.log(morth_collision_types_A)
                if (maindata.TypeOfCollisionA) {
                    selectedSubTypes = maindata.TypeOfCollisionA.split(",");
                }
				// console.log(selectedSubTypes)
		for (var i = 0; i < selectedSubTypes.length; i++) {
			// $('#type_of_collision_a')
			// $('#type_of_collision_a').html('');
		$('#type_of_collision_a option[value="' + selectedSubTypes[i] + '"]').attr('selected', true);
		}
		classSelect = new SlimSelect({
			select: '#type_of_collision_a',
			// placeholder: 'Select Collision Type (A)',
			
		  })
		$('#type_of_collision_b option[value="' + maindata.TypeOfCollisionB + '"]').attr('selected', true);
		$('.roadname').val(maindata.RoadName);
		$('.roadnumber').val(maindata.RoadNumber);
		$('.landmark').val(maindata.Landmark);
		$('.chainage').val(maindata.Chainage);
		$('.nooflanes').val(maindata.NoOfLanes);
		$('input[name=roadsurface][value="' + maindata.TypeOfRoadSurface + '"]').prop('checked', true);
		$('#roadtypeA option[value="' + maindata.RoadTypeA + '"]').attr('selected', true);
		$('#roadtypeB option[value="' + maindata.RoadTypeB + '"]').attr('selected', true);
		$('input[name=divider][value="' + maindata.PhysicalDividerPresent + '"]').prop('checked', true);
		$('input[name=OngoingRoadWorks][value="' + maindata.OngoingRoadWorks + '"]').prop('checked', true);
		$('#speed_limit option[value="' + maindata.SpeedLimit + '"]').attr('selected', true);
		$('#accident_spot option[value="' + maindata.AccidentSpot + '"]').attr('selected', true);
		$('#roadFeaturesA option[value="' + maindata.RoadFeaturesA + '"]').attr('selected', true);
		$('#roadFeaturesB option[value="' + maindata.RoadFeaturesB + '"]').attr('selected', true);
		$('input[name=PotHoles][value="' + maindata.Potholes + '"]').prop('checked', true);
		$('input[name=SteepGradient][value="' + maindata.SteepGradient + '"]').prop('checked', true);
		$('#Road_Junction option[value="' + maindata.RoadJunction + '"]').attr('selected', true);
		$('#Type_of_Traffic_Control option[value="' + maindata.TypeOfTrafficControl + '"]').attr('selected', true);
		var pedinf = maindata.PedestrianInfrastructure
		if(pedinf == 1 ){
		$('#pedestrianInfrastructure').prop('checked', true);
		}
		else{
			$('#pedestrianInfrastructure').prop('checked', false);
		}
		$('input[name=Footpath][value="' + maindata.Footpath + '"]').prop('checked', true);
		$('input[name=FootBridgeSubway][value="' + maindata.Footbridge + '"]').prop('checked', true);
		$('input[name=ZebraCrossing][value="' + maindata.ZebraCrossing + '"]').prop('checked', true);
		new SlimSelect({ select: '#state' })
		new SlimSelect({ select: '#typeofaccident' })
		validateOptions('type_of_collision_a',classSelect);
		new SlimSelect({ select: '#type_of_weather' })
		new SlimSelect({ select: '#type_of_collision_b' })
		new SlimSelect({ select: '#roadtypeA' })
		new SlimSelect({ select: '#roadtypeB' })
		new SlimSelect({ select: '#speed_limit' })
		new SlimSelect({ select: '#accident_spot' })
		new SlimSelect({ select: '#roadFeaturesA' })
		new SlimSelect({ select: '#roadFeaturesB' })
		new SlimSelect({ select: '#Road_Junction' })
		new SlimSelect({ select: '#Type_of_Traffic_Control' })
		if (vehicledata.length > 0) {
			$('.t1 tbody').html('')
			for (var i = 0; i < vehicledata.length; i++) {
				var ele = ''
			
				ele += '<tr id="vehicle' + i + '"><td width=4% id="srno'+(i + 1)+'">' + (i + 1) + '</td>'
				ele += '<td>' + vehicle_type + '</td>'
				ele += '<td><input type="text" class="form-control registrationnumber" placeholder="Enter Registration Plate"></td>'
				ele += '<td>' + disposition + '</td>'
				ele += '<td>' + loadconditionpassenger + '</td>'
				ele += '<td>' + loadconditiongoods + '</td>'///////////////////////remove this and uncomment bleow line
				// ele += '<td>' + loadconditionGoods + '</td>'
				ele += '<td><input type="radio" name="mechanical' + i + '" value="1" id="yes' + i + 'm" checked><label for="yes' + i + 'm"> Yes</label><input type="radio" name="mechanical' + i + '" value="0" id="no' + i + '"><label for="no' + i + 'm"> No</label></td>'
				ele += '<td width="6%"><input type="number" class="form-control ageOfVehicle" placeholder="Enter Age of Vehicle"></td>'
				ele += '<td><button class="btn btn-danger delete_row">Delete Row</button></td></tr>'
				$('.t1 tbody').append(ele)
				$('.vehicle_type', '#vehicle' + i).val(vehicledata[i].VehicleType)
				$('.registrationnumber', '#vehicle' + i).val(vehicledata[i].RegNo)
				$('.disposition', '#vehicle' + i).val(vehicledata[i].Disposition)
				$('.loadconditionpassenger', '#vehicle' + i).val(vehicledata[i].LoadConditionPassenger)
				$('.loadconditiongoods', '#vehicle' + i).val(vehicledata[i].LoadConditionGoods)
				$('input[name=mechanical' + i + '][value="' + vehicledata[i].MechanicalFailure + '"]', '#vehicle' + i).prop('checked', true)
				$('.ageOfVehicle', '#vehicle' + i).val(vehicledata[i].AgeOfVehicle)
			}
		}
		if (driverdata.length > 0) {
			$('.t2 tbody').html('')
			for (var i = 0; i < driverdata.length; i++) {
				var id = i;
				var ele = ''
				ele += '<tr id="driver' + i + '"><td width=4%>' + (i + 1) + '</td>'
				ele += '<td>' + driverVehicleType + '</td>'
				ele += '<td width=6%>' + driver_gender + '</td>'
				ele += '<td width=4%><input type="number" class="form-control driverAge" placeholder="Enter Age"></td>'
				ele += '<td width=4%><input type = "text" class="form-control impactVehicleNo" id="impact_vehicle_number" placeholder="Enter Impacting Vehicle No."></td>'
				ele += '<td>' + impactVehicletype + '</td>'
				ele += '<td> <select class="form-control typeOfLicence" id="type_of_licence" placeholder="Select Type of Licence"><option value="1">Valid Permanent License</option><option value="2">Learner License</option><option value="3">Without License</option><option value="4">Not known</option></select></td>'
				ele += '<td><input type="text" class="form-control licenceNumber" id="licence_number" placeholder="Enter Licence Number"></td>'
				ele += '<td>' + involvementOfAlcohol + '</td>'
				ele += '<td>' + typeOfTrafficViolation + '</td>'
				ele += '<td>' + typeOfInjury + '</td>'
				ele += '<td>' + usingRequisiteSafetyDevice + '</td>'
				ele += '<td><button class="btn btn-danger delete_row">Delete Row</button></td></tr>'
				$('.t2 tbody').append(ele)
				$('.driverVehicleType', '#driver' + i).val(driverdata[i].DriverOfVehicleType)
				$('.driver_gender', '#driver' + i).val(driverdata[i].Gender)
				$('.driverAge', '#driver' + i).val(driverdata[i].Age)
				$('.impactVehicleNo', '#driver' + i).val(driverdata[i].ImpactingVehicleNo)
				$('.impactVehicletype', '#driver' + i).val(driverdata[i].ImpactingVehicleType)
				$('.typeOfLicence', '#driver' + i).val(driverdata[i].LicenceType)
				$('.licenceNumber', '#driver' + i).val(driverdata[i].LicenceNo)
				$('.involvementOfAlcohol', '#driver' + i).val(driverdata[i].AlcoholInvolvement)
				$('.typeOfTrafficViolation', '#driver' + i).val(driverdata[i].TrafficViolation)
				$('.typeOfInjury', '#driver' + i).val(driverdata[i].TypeOfInjury)
				$('.usingRequisiteSafetyDevice', '#driver' + i).val(driverdata[i].RequisiteSafetyDevice)
			}
		}
		if (victimdata.length > 0) {
			$('.t3 tbody').html('')
			for (var i = 0; i < victimdata.length; i++) {
				var ele = ''
				ele += '<tr id="victims' + i + '"><td width=4%>' + (i + 1) + '</td>'
				// ele += '<tr><td>' + id + '</td>'
				ele += '<td>' + persontype + '</td>'
				ele += '<td><input type="text" class=" form-control occupantVeicleNo" id="occupant_vehicle_no" placeholder="Enter Occupant Vehicle Number"></td>'
				ele += '<td>' + occupantVehicleType + '</td>'
				ele += '<td>' + othersGender + '</td>'
				ele += '<td><input type="number" class="form-control ageOtherPerson" placeholder="Enter Age"></td>'
				ele += '<td><input type="text" class="form-control impactingVehicleNumberOthers" placeholder="Enter Impacting vehicle Number"></td>'
				ele += '<td>' + impactingVehicleTypeOthers + '</td>'
				ele += '<td>' + typeOfInjuryOthers + '</td>'
				ele += '<td>' + usingRequisiteSafetyDeviceOthers + '</td>'
				ele += '<td><button class="btn btn-danger delete_row">Delete Row</button></td></tr>'
				$('.t3 tbody').append(ele)
				$('.persontype', '#victims' + i).val(victimdata[i].PersonType)
				$('.occupantVeicleNo', '#victims' + i).val(victimdata[i].OccupantOfVehicleNo)
				$('.occupantVehicleType', '#victims' + i).val(victimdata[i].OccupantOfVehicleType)
				$('.othersGender', '#victims' + i).val(victimdata[i].Gender)
				$('.ageOtherPerson', '#victims' + i).val(victimdata[i].Age)
				$('.impactingVehicleNumberOthers', '#victims' + i).val(victimdata[i].ImpactingVehicleNo)
				$('.impactingVehicleTypeOthers', '#victims' + i).val(victimdata[i].ImpactingVehicleType)
				$('.typeOfInjuryOthers', '#victims' + i).val(victimdata[i].TypeOfInjury)
				$('.usingRequisiteSafetyDeviceOthers', '#victims' + i).val(victimdata[i].RequisiteSafetyDevice)
			}
		}
		bind_click()
	}
	$('.update_acc_btn').click(function () {
		scn = $('.scn').val();
		fir = $('.fir').val();
		accidentDateTime = $('.acc_datetime').val();
		// accidentDate = $('.acc_date').val();
		placeName = $('.placeName').val();
		policeStation = $('.policestation').val();
		district = $('.district').val();
		state = $('.state').val();
		typeOfArea = $('input[name=typeofarea]:checked').val();
		typeOfAccident = $('#typeofaccident').val();
		personKilled = $('.personKilled').val();
		personGrievouslyInjured = $('.personGrievouslyInjured').val();
		personMinorInjured = $('.personMinorInjured').val();
		motorizedVehicle = $('.motorizedVehicle').val();
		nonMotorizedVehicle = $('.nonMotorizedVehicle').val();
		pedestrianInvolved = $('.pedestrianInvolved').val();
		typeOfWeather = $('#type_of_weather').val();
		hitAndRun = $('input[name=hitandrun]:checked').val();
		typeOfCollisionA = $('#type_of_collision_a').val();
		typeOfCollisionB = $('#type_of_collision_b').val();
		roadName = $('.roadname').val();
		roadNumber = $('.roadnumber').val();
		landmark = $('.landmark').val();
		chainage = $('.chainage').val();
		northing = $('.up_northing').val();
		easting = $('.up_easting').val();
		noOfLanes = $('.nooflanes').val();
		roadSurface = $('input[name=roadsurface]:checked').val();
		roadTypeA = $('#roadtypeA').val();
		roadTypeB = $('#roadtypeB').val();
		divider = $('input[name=divider]:checked').val();
		onGoingWorks = $('input[name=OngoingRoadWorks]:checked').val();
		speedLimit = $('#speed_limit').val();
		accidentSpot = $('#accident_spot').val();
		roadFeaturesA = $('#roadFeaturesA').val();
		roadFeaturesB = $('#roadFeaturesB').val();
		potHoles = $('input[name=PotHoles]:checked').val();
		steepGradient = $('input[name=SteepGradient]:checked').val();
		roadJunction = $('#Road_Junction').val();
		typeOfTrafficControl = $('#Type_of_Traffic_Control').val();
		pedestrianInfrastructure = $("#pedestrianInfrastructure").prop("checked") ? 1 : 0;
		footpath = $('input[name=Footpath]:checked').val();
		footBridgeSubway = $('input[name=FootBridgeSubway]:checked').val();
		zebraCrossing = $('input[name=ZebraCrossing]:checked').val();

		
			var a =	parseFloat(personKilled)
			var b =	parseFloat(personGrievouslyInjured)
			var c =	parseFloat(personMinorInjured)
			var totalPersonsInvolvedCount = a+b+c
			


		var vehicles = [], driverDetails = [], otherpersonDetails = []
		$('.t1 tbody tr').each(function (i, obj) {
			var srno = $('#srno1', obj).val();
			var vehicle_type = $('.vehicle_type', obj).val();
			var registrationnumber = $('.registrationnumber', obj).val();
			var disposition = $('.disposition', obj).val();
			var loadconditionpassenger = $('.loadconditionpassenger', obj).val();
			var loadconditiongoods = $('.loadconditiongoods', obj).val();
			var mechanical = $('input[type=radio]:checked', obj).val();
			var ageofvehicle = $('.ageOfVehicle', obj).val();

			vehicles.push({
				srno: srno,
				vehicle_type: vehicle_type,
				registrationnumber: registrationnumber,
				disposition: disposition,
				loadconditionpassenger: loadconditionpassenger,
				loadconditiongoods:loadconditiongoods,
				mechanical: mechanical,
				ageofvehicle: ageofvehicle
			})
		});
		$('.t2 tbody tr').each(function (i, obj) {
			var srno = $('.srno', obj).val();
			var driverVehicleType = $('.driverVehicleType', obj).val();
			var driver_gender = $('.driver_gender', obj).val();
			var driverAge = $('.driverAge', obj).val();
			var impactVehicleNo = $('.impactVehicleNo', obj).val();
			var impactVehicletype = $('.impactVehicletype', obj).val();
			var typeOfLicence = $('.typeOfLicence', obj).val();
			var licenceNumber = $('.licenceNumber', obj).val();
			var involvementOfAlcohol = $('.involvementOfAlcohol', obj).val();
			var typeOfTrafficViolation = $('.typeOfTrafficViolation', obj).val();
			var typeOfInjury = $('.typeOfInjury', obj).val();
			var usingRequisiteSafetyDevice = $('.usingRequisiteSafetyDevice', obj).val();

			driverDetails.push({
				srno: srno,
				driverVehicleType: driverVehicleType,
				driverGender: driver_gender,
				driverAge: driverAge,
				impactVehicleNo: impactVehicleNo,
				impactVehicletype: impactVehicletype,
				typeOfLicence: typeOfLicence,
				licenceNumber: licenceNumber,
				involvementOfAlcohol: involvementOfAlcohol,
				typeOfTrafficViolation: typeOfTrafficViolation,
				typeOfInjury: typeOfInjury,
				usingRequisiteSafetyDevice: usingRequisiteSafetyDevice
			})
		});
		$('.t3 tbody tr').each(function (i, obj) {

			var srno = $('.srno', obj).val();
			var persontype = $('.persontype', obj).val();
			var occupant_vehicle_no = $('.occupantVeicleNo', obj).val();
			var occupantVehicleType = $('.occupantVehicleType', obj).val();
			var othersGender = $('.othersGender', obj).val();
			var ageOtherPerson = $('.ageOtherPerson', obj).val();
			var impactingVehicleNumberOthers = $('.impactingVehicleNumberOthers', obj).val();
			var impactingVehicleTypeOthers = $('.impactingVehicleTypeOthers', obj).val();
			var typeOfInjuryOthers = $('.typeOfInjuryOthers', obj).val();
			var usingRequisiteSafetyDeviceOthers = $('.usingRequisiteSafetyDeviceOthers', obj).val();

			otherpersonDetails.push({
				srno: srno,
				persontype: persontype,
				occupant_vehicle_no: occupant_vehicle_no,
				occupantVehicleType: occupantVehicleType,
				othersGender: othersGender,
				ageOtherPerson: ageOtherPerson,
				impactingVehicleNumberOthers: impactingVehicleNumberOthers,
				impactingVehicleTypeOthers: impactingVehicleTypeOthers,
				typeOfInjuryOthers: typeOfInjuryOthers,
				usingRequisiteSafetyDeviceOthers: usingRequisiteSafetyDeviceOthers
			})
			
		});

	
////// Person and rows validation//////////////
		var rowCountDriver = $('.t2 tbody tr').length;
		var rowCountOtherPersons = $('.t3 tbody tr').length;
		var totalRowCount = rowCountDriver + rowCountOtherPersons
		console.log(totalRowCount)

		if(totalRowCount < totalPersonsInvolvedCount){
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please provide details for each person involved in the accident!</div>'
			});
			return;
		}

		
		$.ajax({
			url: '../../../models/situation/update_morth.hh',
			method: 'POST',
			data: { SystemCodeNumber: scn, FIRNumber: fir, AccidentDateTime: accidentDateTime, Place: placeName, PoliceStation: policeStation, District: district, State: state, TypeOfArea: typeOfArea, TypeOfAccident: typeOfAccident, NoOfFatalities: personKilled, NoOfPersonsGrievouslyInjured: personGrievouslyInjured, NoOfPersonsMinorInjury: personMinorInjured, NoOfMotorizedVehiclesInvolved: motorizedVehicle, NoOfNonMotorizedVehiclesInvolved: nonMotorizedVehicle, NoOfPedestrianInvolved: pedestrianInvolved, TypeOfWeather: typeOfWeather, HitAndRun: hitAndRun, TypeOfCollisionA: typeOfCollisionA, TypeOfCollisionB: typeOfCollisionB, RoadName: roadName, RoadNumber: roadNumber, Landmark: landmark, RoadChainage: chainage, NoOfLanes: noOfLanes, TypeOfRoadSurface: roadSurface, RoadTypeA: roadTypeA, RoadTypeB: roadTypeB, PhysicalDividerPresent: divider, OngoingRoadWorks: onGoingWorks, SpeedLimit: speedLimit, AccidentSpot: accidentSpot, RoadFeaturesA: roadFeaturesA, RoadFeaturesB: roadFeaturesB, Potholes: potHoles, SteepGradient: steepGradient, RoadJunction: roadJunction, TrafficControl: typeOfTrafficControl, PedestrianInfrastructure: pedestrianInfrastructure, Footpath: footpath, FootBridge: footBridgeSubway, ZebraCrossing: zebraCrossing, Vehicles: vehicles, Drivers: driverDetails, Victims: otherpersonDetails },
			success: function (res) {
				console.log(res)
				if (res == 'success') {
					$.alert({
						type: 'green',
						title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
						content: '<div class="fw-bold">Details has been Submitted Successfully</div>',
						buttons: {
							OK: function () {
								window.location.href = 'accident_setup.html';
							}
						}
					});
				}
				else {
					$.alert({
						type: 'red',
						title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
						content: '<div class="fw-bold">Sorry, there has been a technical problem. Please report this error by sending an email to support@itspe.co.in with a screen shot</div>'
					});
					return;
				}
			}
		});
	});
	// setTimeout(function(){
	// 	var state_select = new SlimSelect({
	// 		select: '#state',
	// 		showContent: 'down',
	// 		allowDeselectOption: false
	// 	})
	// },600)

})

