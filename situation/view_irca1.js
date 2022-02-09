situationSCN = "";
vehicle_type = '',
loadcondition='',
trafficviolation='',
drivertype = '',
accidenttype = ''

$(document).ready(function(){

	var edittypeofaccident = new SlimSelect({
        select: '#typeofaccident',
        showContent: 'down',
		allowDeselectOption: false
    })
	var edittypeofcollision = new SlimSelect({
        select: '#typeofcollision',
        showContent: 'down',
		allowDeselectOption: false
    })
	var editroadtype = new SlimSelect({
        select: '#roadtype',
        showContent: 'down',
		allowDeselectOption: false
    }) 
	var edittypeofweather = new SlimSelect({
        select: '#typeofweather',
        showContent: 'down',
		allowDeselectOption: false
    }) 	
	var editaccidentspot = new SlimSelect({
        select: '#accidentspot',
        showContent: 'down',
		allowDeselectOption: false
    }) 


	get_parameter_by_name = function(name,url) {
        if(!url) url = window.location.href;
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

    $('.nav li').each(function(i,obj){
    	var href = $('a',obj).attr('href') + "?module=" + get_parameter_by_name('module') + "&id=" + get_parameter_by_name('id')
    	$('a',obj).attr('href',href)
    })

	// $.ajax({
 //        url: '../../../models/utils/get_username.hh',
 //        success: function(result) {
 //    	    if(result.length > 30){
 //                    window.location = "../index.html"
 //            }
 //    		uname=result.trim();
 //        }  
                
 //    });
    $.ajax({
    	url:'../../../models/situation/get_irca1_types.hh',
    	method:'POST',
    	success:function(res){
    		res = JSON.parse(res)

    		var irc_accident_spot = res.irc_accident_spot,
    			irc_collision_types = res.irc_collision_types,
    			irc_load_condition = res.irc_load_condition,
    			irc_roads_classification = res.irc_roads_classification,
    			irc_traffic_violation = res.irc_traffic_violation,
    			irc_victim_type = res.irc_victim_type,
    			irc_weather_condition = res.irc_weather_condition,
    			tis_vehicle_type = res.tis_vehicle_type
    			irc_accident_types = res.irc_accident_types

    			vehicle_type = '<select class="form-control vehicle_type">',
    			loadcondition='<select class="form-control loadcondition">',
    			trafficviolation='<select class="form-control trafficviolation">',
    			drivertype = '<select class="form-control drivertype">'

    		for(var i=0;i<irc_accident_types.length;i++){
    			$('#typeofaccident').append('<option value="'+irc_accident_types[i].id+'" '+(i == 0 ? 'selected' : '')+'>'+irc_accident_types[i].name+'</option>')
    			$('.typeofinjury').append('<option value="'+irc_accident_types[i].id+'" '+(i == 0 ? 'selected' : '')+'>'+irc_accident_types[i].name+'</option>')
    			accidenttype+='<option value="'+irc_accident_types[i].id+'" '+(i == 0 ? 'selected' : '')+'>'+irc_accident_types[i].name+'</option>';
    		}

    		for(var i=0;i<irc_accident_spot.length;i++){
    			$('#accidentspot').append('<option value="'+irc_accident_spot[i].id+'" '+(i == 0 ? 'selected' : '')+'>'+irc_accident_spot[i].name+'</option>')
    		}
			var typeofcollisionopt = '';
    		for(var i=0;i<irc_collision_types.length;i++){
				if(i == 0){
					typeofcollisionopt += '<option value="'+irc_collision_types[i].id+'" selected>'+irc_collision_types[i].name+'</option>';
				}else{
					typeofcollisionopt += '<option value="'+irc_collision_types[i].id+'">'+irc_collision_types[i].name+'</option>';
				}
				
    			
    		}
			$('#typeofcollision').html(typeofcollisionopt);
    		for(var i=0;i<irc_load_condition.length;i++){
    			$('.loadcondition').append('<option value="'+irc_load_condition[i].id+'" '+(i == 0 ? 'selected' : '')+'>'+irc_load_condition[i].name+'</option>')
    			loadcondition += '<option value="'+irc_load_condition[i].id+'" '+(i == 0 ? 'selected' : '')+'>'+irc_load_condition[i].name+'</option>'
    		}

    		for(var i=0;i<irc_roads_classification.length;i++){
    			$('#roadtype').append('<option value="'+irc_roads_classification[i].id+'" '+(i == 0 ? 'selected' : '')+'>'+irc_roads_classification[i].name+'</option>')
    		}

    		for(var i=0;i<irc_traffic_violation.length;i++){
    			$('.trafficviolation').append('<option value="'+irc_traffic_violation[i].id+'" '+(i == 0 ? 'selected' : '')+'>'+irc_traffic_violation[i].name+'</option>')
    			trafficviolation += '<option value="'+irc_traffic_violation[i].id+'" '+(i == 0 ? 'selected' : '')+'>'+irc_traffic_violation[i].name+'</option>'
    		}

    		for(var i=0;i<irc_victim_type.length;i++){
    			$('.drivertype').append('<option value="'+irc_victim_type[i].id+'" '+(i == 0 ? 'selected' : '')+'>'+irc_victim_type[i].name+'</option>')
    			drivertype += '<option value="'+irc_victim_type[i].id+'" '+(i == 0 ? 'selected' : '')+'>'+irc_victim_type[i].name+'</option>'
    		}

    		for(var i=0;i<irc_weather_condition.length;i++){
    			$('#typeofweather').append('<option value="'+irc_weather_condition[i].id+'" '+(i == 0 ? 'selected' : '')+'>'+irc_weather_condition[i].name+'</option>')
    		}

    		for(var i=0;i<tis_vehicle_type.length;i++){
    			$('.vehicle_type').append('<option value="'+tis_vehicle_type[i].id+'" '+(i == 0 ? 'selected' : '')+'>'+tis_vehicle_type[i].vehicle_type+'</option>')
    			vehicle_type += '<option value="'+tis_vehicle_type[i].id+'" '+(i == 0 ? 'selected' : '')+'>'+tis_vehicle_type[i].vehicle_type+'</option>'
    		}

    		vehicle_type += '</select>',
			loadcondition +='</select>',
			trafficviolation +='</select>',
			drivertype += '</select>';
			getIrcData();
    	}
    })

	bind_click = function(){
		$('.delete_row').unbind('click').click(function(){
			$(this).parent().parent().remove()
		})
	}

	bind_click()
    $('.add_row').click(function(){
    	var val = $(this).attr('val')
    	var ele = ''

    	if(val == 't1'){
    		var id = parseInt($('.t1 tr:last-child td:nth-child(1)').html()) + 1
	    	ele += '<tr><td>' + id + '</td>'
	    	// ele +='<td><select class="form-control vehicle_type"><option value="Motorised Two Wheeler">Motorised Two Wheeler</option><option value="Auto Rickshaw">Auto Rickshaw</option><option value="Car/Jeep/Van/Taxi">Car/Jeep/Van/Taxi</option><option value="Bus">Bus</option><option value="Light Truck">Light Truck</option><option value="Heavy Articulated Truck">Heavy Articulated Truck</option><option value="Tempo/Tractor">Tempo/Tractor</option><option value="Bicycle">Bicycle</option><option value="Cycle/Rickshaw">Cycle/Rickshaw</option></select></td>'
	    	ele += '<td>'+vehicle_type+'</td>'
	    	ele += '<td><input type="text" class="form-control registrationplate" placeholder="Enter Registration Plate"></td>'
	    	ele += '<td><select class="form-control disposition"><option value="Not Roadworthy, needs to be driven away">Not Roadworthy, needs to be driven away</option><option value="Roadworthy, can be driven away">Roadworthy, can be driven away</option></select></td>'
	    	// ele += '<td><select class="form-control loadcondition"><option value="Normally Loaded">Normally Loaded</option><option value="Overloaded/Hanging">Overloaded/Hanging</option><option value="Empty">Empty</option><option value="Unknown">Unknown</option></select></td>'
	    	ele += '<td>'+loadcondition+'</td>'
	    	ele += '<td>'+trafficviolation+'</td>'
	    	// ele += '<td><select class="form-control trafficviolation"><option value="Over Speeding">Over Speeding</option><option value="Jumping Red Light">Jumping Red Light</option><option value="Driving on Wrong Side">Driving on Wrong Side</option><option value="Unknown">Unknown</option><option value="Not Applicable">Not Applicable</option></select></td>'
	    	ele +='<td><input type="radio" name="mechanical'+id+'" value="yes" id="yes'+id+'m" checked><label for="yes'+id+'m"> Yes</label><input type="radio" name="mechanical'+id+'" value="no" id="no'+id+'m"><label for="no'+id+'m"> No</label></td>'
	    	ele +='<td><button class="btn btn-danger delete_row">Delete Row</button></td></tr>'
	    	$('.t1 tbody').append(ele)
    	}
    	else{
    		var id = parseInt($('.t2 tr:last-child td:nth-child(1)').html()) + 1
	    	ele += '<tr><td>' + id + '</td>'
	    	ele += '<td>'+drivertype+'</td>'
	    	// ele +='<td><select class="form-control drivertype"><option value="Driver">Driver</option><option value="Passenger">Passenger</option><option value="Pedestrian">Pedestrian</option><option value="Cyclist">Cyclist</option></select></td>'
	    	ele += '<td><input type="radio" name="sex'+id+'" value="Male" id="male'+id+'s" checked><label for="male'+id+'s"> Male</label><input type="radio" name="sex'+id+'" value="Female" id="female'+id+'s"><label for="female'+id+'s"> Female</label></td>'
	    	ele += '<td><input type="text" class="form-control age" placeholder="Enter Age"></td>'
	    	ele += '<td><input type="text" class="form-control occupant" placeholder="Enter Occupant"></td>'
	    	ele += '<td><input type="text" class="form-control dlno" placeholder="Enter DL Number"></td>'
	    	ele +='<td><input type="text" class="form-control impacted" placeholder="Enter Impacted by which vehicle"></td>'
	    	ele +='<td><select class="form-control typeofinjury">'+accidenttype+'</select></td>'
	    	ele +='<td><input type="radio" name="requisite'+id+'" value="yes" id="yes'+id+'r" checked><label for="yes'+id+'r"> Yes</label><input type="radio" name="requisite'+id+'" value="no" id="no'+id+'r"><label for="no'+id+'r"> No</label><input type="radio" name="requisite'+id+'" value="unknown" id="unknown'+id+'r"><label for="unknown'+id+'r"> Unknown</label></td>'
	    	ele +='<td><input type="radio" name="alcohol'+id+'" value="yes" id="yes'+id+'a" checked><label for="yes'+id+'a"> Yes</label><input type="radio" name="alcohol'+id+'" value="no" id="no'+id+'a"><label for="no'+id+'a"> No</label><input type="radio" name="alcohol'+id+'" value="unknown" id="unknown'+id+'a"><label for="unknown'+id+'a"> Unknown</label></td>'
	    	ele +='<td><button class="btn btn-danger delete_row">Delete Row</button></td></tr>'
	    	$('.t2 tbody').append(ele)
    	}
    	bind_click()
    	
    })
		function getIrcData()
		{
			$.ajax({
				url:'../../../models/situation/get_situation_details_irca1.hh',
				method:'POST',
				data:{
					module:get_parameter_by_name('module'),
					id:get_parameter_by_name('id')
				},
				success:function(res){
					res = JSON.parse(res)
					insertData(res)
				}
			})
		}
	
	
	insertData = function(data){
		var maindata = data.data[0]
		var vehicledata = data.vehicles
		var victimdata = data.victims
		// let sel = document.getElementById('State');
		$('.scn').val(get_parameter_by_name('id'));
		// $(sel).val(maindata.State);
		$('#state option').attr('selected',false);
		$('#state option[value="'+maindata.State+'"]').attr('selected',true)
		$('.district').val(maindata.District);
		$('.up_northing').val(maindata.Northing);
		$('.up_easting').val(maindata.Easting);
		$('.fir').val(maindata.FIRNumber);
		$('.acc_datetime').val(maindata.AccidentTime);
		$('.policestation').val(maindata.PoliceStation);
		$('input[name=typeofarea][value="'+maindata.TypeOfArea+'"]').prop('checked',true);
		//$('#typeofaccident').val(maindata.TypeOfAccident)
		if(maindata.TypeOfAccident != '' && maindata.TypeOfAccident != null){
			edittypeofaccident.set(maindata.TypeOfAccident);
		}
		
		if(maindata.TypeOfCollision != '' && maindata.TypeOfCollision != null){
			edittypeofcollision.set(maindata.TypeOfCollision);
		}
		//$('#typeofcollision').val(maindata.TypeOfCollision);
		
		$('.vehicles').val(maindata.NoOfVehiclesInvolved);

		$('.fatalities').val(maindata.NoOfFatalities);
		$('.injneed').val(maindata.NoOfInjuredNeedingHospitalisation);
		$('.noinjneed').val(maindata.NoOfInjuredNotNeedingHospitalisation);
		$('input[name=hitandrun][value="'+maindata.HitAndRun+'"]').prop('checked',true);
		$('input[name=ongoing][value="'+maindata.OngoingRoadWorks+'"]').prop('checked',true);
		//$('.typeofweather').val(maindata.TypeOfWeather);
		if(maindata.TypeOfWeather != '' && maindata.TypeOfWeather != null){
			edittypeofweather.set(maindata.TypeOfWeather)
		}
		
		$('.city').val(maindata.City);
		$('.roadname').val(maindata.RoadName);
		//$('#roadtype').val(maindata.RoadType);
		if(maindata.RoadType != '' && maindata.RoadType!=null){		
			editroadtype.set(maindata.RoadType)
		}
		
		$('.roadnumber').val(maindata.RoadNumber);
		$('.nooflanes').val(maindata.NoOfLanes);
		//$('.accidentspot').val(maindata.AccidentSpot);
		if(maindata.AccidentSpot != '' && maindata.AccidentSpot != null){
			editaccidentspot.set(maindata.AccidentSpot)
		}
		
		$('input[name=divider][value="'+maindata.PhysicalDividerPresent+'"]').prop('checked',true)
		$('input[name=roadsurface][value="'+maindata.TypeOfRoadSurface+'"]').prop('checked',true)
		// $('input[name=accidentspot][value="'+maindata.AccidentSpot+'"]').prop('checked',true)
		if(maindata.RoadChainage != null){
			$('.roadchainagekm').val(maindata.RoadChainage.split(',')[0]);
			$('.roadchainagem').val(maindata.RoadChainage.split(',')[1]);
		}		
		$('.typeofpropertydamage').val(maindata.TypeofPropertyDamage)

		if(vehicledata.length>0)
			$('.t1 tbody').html('')

		for(var i=0;i<vehicledata.length;i++){
			var ele = ''
			ele += '<tr id="vehicle'+i+'"><td>' + (i + 1) + '</td>'
	    	// ele +='<td><select class="form-control vehicle_type"><option value="Motorised Two Wheeler">Motorised Two Wheeler</option><option value="Auto Rickshaw">Auto Rickshaw</option><option value="Car/Jeep/Van/Taxi">Car/Jeep/Van/Taxi</option><option value="Bus">Bus</option><option value="Light Truck">Light Truck</option><option value="Heavy Articulated Truck">Heavy Articulated Truck</option><option value="Tempo/Tractor">Tempo/Tractor</option><option value="Bicycle">Bicycle</option><option value="Cycle/Rickshaw">Cycle/Rickshaw</option></select></td>'
	    	ele += '<td>'+vehicle_type+'</td>'
	    	ele += '<td><input type="text" class="form-control registrationplate" placeholder="Enter Registration Plate"></td>'
	    	ele += '<td><select class="form-control disposition"><option value="Not Roadworthy, needs to be driven away">Not Roadworthy, needs to be driven away</option><option value="Roadworthy, can be driven away">Roadworthy, can be driven away</option></select></td>'
	    	ele += '<td>'+loadcondition+'</td>'
	    	ele += '<td>'+trafficviolation+'</td>'
	    	// ele += '<td><select class="form-control loadcondition"><option value="Normally Loaded">Normally Loaded</option><option value="Overloaded/Hanging">Overloaded/Hanging</option><option value="Empty">Empty</option><option value="Unknown">Unknown</option></select></td>'
	    	// ele += '<td><select class="form-control trafficviolation"><option value="Over Speeding">Over Speeding</option><option value="Jumping Red Light">Jumping Red Light</option><option value="Driving on Wrong Side">Driving on Wrong Side</option><option value="Unknown">Unknown</option><option value="Not Applicable">Not Applicable</option></select></td>'
	    	ele +='<td><input type="radio" name="mechanical'+i+'" value="yes" id="yes'+i+'m" checked><label for="yes'+i+'m"> Yes</label><input type="radio" name="mechanical'+i+'" value="no" id="no'+i+'m"><label for="no'+i+'m"> No</label></td>'
	    	ele +='<td><button class="btn btn-danger delete_row">Delete Row</button></td></tr>'
			$('.t1 tbody').append(ele)

			$('.vehicle_type','#vehicle'+i).val(vehicledata[i].vehicle_type_id)
			$('.disposition','#vehicle'+i).val(vehicledata[i].Disposition)
			$('.loadcondition','#vehicle'+i).val(vehicledata[i].LoadCondition)
			$('.trafficviolation','#vehicle'+i).val(vehicledata[i].TrafficViolation)
			$('.registrationplate','#vehicle'+i).val(vehicledata[i].vehicle_number)
			$('input[name=mechanical'+i+'][value="'+vehicledata[i].MechanicalFailure+'"]','#vehicle'+i).prop('checked',true)
		}

		if(victimdata.length>0)
			$('.t2 tbody').html('')

		for(var i=0;i<victimdata.length;i++){
			var ele = ''
			ele += '<tr id="victim'+i+'"><td>' + (i + 1) + '</td>'
	    	// ele +='<td><select class="form-control drivertype"><option value="Driver">Driver</option><option value="Passenger">Passenger</option><option value="Pedestrian">Pedestrian</option><option value="Cyclist">Cyclist</option></select></td>'
	    	ele += '<td>'+drivertype+'</td>'
	    	ele += '<td><input type="radio" name="sex'+i+'" value="Male" id="male'+i+'s" checked><label for="male'+i+'s"> Male</label><input type="radio" name="sex'+i+'" value="Female" id="female'+i+'s"><label for="female'+i+'s"> Female</label></td>'
	    	ele += '<td><input type="text" class="form-control age" placeholder="Enter Age"></td>'
	    	ele += '<td><input type="text" class="form-control occupant" placeholder="Enter Occupant"></td>'
	    	ele += '<td><input type="text" class="form-control dlno" placeholder="Enter DL Number"></td>'
	    	ele +='<td><input type="text" class="form-control impacted" placeholder="Enter Impacted by which vehicle"></td>'
	    	ele +='<td><select class="form-control typeofinjury">'+accidenttype+'</select></td>'
	    	ele +='<td><input type="radio" name="requisite'+i+'" value="yes" id="yes'+i+'r" checked><label for="yes'+i+'r"> Yes</label><input type="radio" name="requisite'+i+'" value="no" id="no'+i+'r"><label for="no'+i+'r"> No</label><input type="radio" name="requisite'+i+'" value="unknown" id="unknown'+i+'r"><label for="unknown'+i+'r"> Unknown</label></td>'
	    	ele +='<td><input type="radio" name="alcohol'+i+'" value="yes" id="yes'+i+'a" checked><label for="yes'+i+'a"> Yes</label><input type="radio" name="alcohol'+i+'" value="no" id="no'+i+'a"><label for="no'+i+'a"> No</label><input type="radio" name="alcohol'+i+'" value="unknown" id="unknown'+i+'a"><label for="unknown'+i+'a"> Unknown</label></td>'
	    	ele +='<td><button class="btn btn-danger delete_row">Delete Row</button></td></tr>'
			$('.t2 tbody').append(ele)

			$('.drivertype','#victim'+i).val(victimdata[i].Type)
			$('.typeofinjury','#victim'+i).val(victimdata[i].TypeOfInjury)
			$('.age','#victim'+i).val(victimdata[i].Age)
			$('.occupant','#victim'+i).val(victimdata[i].Occupation)
			$('.dlno','#victim'+i).val(victimdata[i].DLNumber)
			$('.impacted','#victim'+i).val(victimdata[i].ImpactedByWhichVehicle)
			$('input[name=requisite'+i+'][value="'+victimdata[i].RequisiteSafetyDevice+'"]','#victim'+i).prop('checked',true)
			$('input[name=alcohol'+i+'][value="'+victimdata[i].PresenceOfAlcohol+'"]','#victim'+i).prop('checked',true)
			$('input[name=sex'+i+'][value="'+victimdata[i].Sex+'"]','#victim'+i).prop('checked',true)
		}
		bind_click()
	}
	
	$('.update_acc_btn').click(function(){	

		var scn = $('.scn').val();
			state = $('.state').val();
			district = $('.district').val();
			northing = $('.up_northing').val();
			easting = $('.up_easting').val();
			firno = $('.fir').val();
			AccidentTime = $('.acc_datetime').val();
			policestation = $('.policestation').val();
			typeofarea = $('input[name=typeofarea]:checked').val();
			typeofaccident = 	$('#typeofaccident').val()
			typeofcollision = 	$('#typeofcollision').val();
			novehicles =	$('.vehicles').val();
			fatalities = $('.fatalities').val();
			injneed =	$('.injneed').val();
			noinjneed =	$('.noinjneed').val();
			hitandrun =	$('input[name=hitandrun]:checked').val();
			ongoing = $('input[name=ongoing]:checked').val();
			typeofweather =	$('#typeofweather').val();
			city = $('.city').val();
			roadname = $('.roadname').val();
			roadtype = $('#roadtype').val();
			roadnumber = $('.roadnumber').val();
			nooflanes = $('.nooflanes').val();
			divider = $('input[name=divider]:checked').val()
			roadsurface = $('input[name=roadsurface]:checked').val()
			accidentspot = $('#accidentspot').val()
			roadchainage = $('.roadchainagekm').val() + "," + $('.roadchainagem').val();
			typeofpropertydamage = $('.typeofpropertydamage').val()

		var vehicles = [],victims = []

		$('.t1 tbody tr').each(function(i,obj){
			var vehicle_type= $('.vehicle_type',obj).val();
			var disposition= $('.disposition',obj).val();
			var loadcondition= $('.loadcondition',obj).val();
			var trafficviolation= $('.trafficviolation',obj).val();
			var registrationplate= $('.registrationplate',obj).val();
			var mechanical= $('input[type=radio]:checked',obj).val();
			vehicles.push({
				vehicle_type: vehicle_type,
				disposition: disposition,
				loadcondition: loadcondition,
				trafficviolation: trafficviolation,
				registrationplate: registrationplate,
				mechanical: mechanical
			})
		});
		$('.t2 tbody tr').each(function(i,obj){
			let drivertype= $('.drivertype',obj).val(),
			typeofinjury= $('.typeofinjury',obj).val(),
			age= $('.age',obj).val(),
			occupant= $('.occupant',obj).val(),
			dlno= $('.dlno',obj).val(),
			impacted= $('.impacted',obj).val(),
			sex= $('td:nth-child(3) input[type=radio]:checked',obj).val(),
			requisite= $('td:nth-child(9) input[type=radio]:checked',obj).val(),
			alcohol= $('td:nth-child(10) input[type=radio]:checked',obj).val();
			if(age != '' && occupant != '' && impacted != '' && typeofinjury != ''){
				victims.push({
					drivertype: drivertype,
					typeofinjury: typeofinjury,
					age: age,
					occupant: occupant,
					dlno: dlno,
					impacted: impacted,
					sex: sex,
					requisite: requisite,
					alcohol: alcohol
				})
			}
			
		})

		console.log(victims,vehicles)
		if (district.length >2) {
			
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">District Number cannot be greater than 2!</div>'
			});
			return;
		}
		// return
		$.ajax({
			url:'../../../models/situation/update_accident_irca1.hh',
			method:'POST',
			data:{SystemCodeNumber:scn,State:state,District:district,Northing:northing,Easting:easting,AccidentSpot:accidentspot,AccidentTime:AccidentTime,City:city,FIRNumber:firno,HitAndRun:hitandrun,NoOfFatalities:fatalities,NoOfInjuredNeedingHospitalisation:injneed,NoOfInjuredNotNeedingHospitalisation:noinjneed,NoOfLanes:nooflanes,NoOfVehiclesInvolved:novehicles,OngoingRoadWorks:ongoing, PhysicalDividerPresent:divider, PoliceStation:policestation, RoadChainage:roadchainage, RoadName:roadname, RoadNumber:roadnumber, RoadType:roadtype, TypeOfAccident:typeofaccident, TypeOfArea:typeofarea, TypeOfCollision:typeofcollision, TypeOfRoadSurface:roadsurface,TypeOfWeather:typeofweather,TypeofPropertyDamage:typeofpropertydamage,victims:victims,vehicles:vehicles},
			success:function(res){
				if(res == 'success'){
					$.alert({
						type: 'green',
						title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
						content: '<div class="fw-bold">Details Recorded Successfully</div>',
						buttons: {
							OK: function () {
								location.reload();
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
				//location.reload();

				
			}
		});
	});
	setTimeout(function(){
		var state_select = new SlimSelect({
			select: '#state',
			showContent: 'down',
			allowDeselectOption: false
		})
	},600)


})