situationSCN = "";

//Transport Links
// transport_links = []; //All the links fetched from api will be stored in key value pairs with SCN being the key (To reduce db calls)

// randomColor=['red']; //To avoid same color to another polyline
// selectedLinks =[]; // All the selected links will be stored in this array
// tlayers = [];   //All the layers will be stored in this array to make changes on the go (optional)
//Transport Links

$(document).ready(function () {
	var default_osm = L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> Contributors',
        maxZoom: 18,
    });

    var lscl_basemap = new L.tileLayer.wms(
        'http://20.40.8.21:3121/igistile/lscl_ws/ows', {
        layers: 'LSCL_Basemap',
        maxZoom: 19,
        format: 'image/png',
        crs: L.CRS.EPSG4326,
        transparent: true
    });

    var lscl_satellite = new L.tileLayer.wms(
        'http://20.40.8.21:3121/igistile/lscl_ws/ows', {
        layers: 'LSCL_Satellite', //LSCL_Satellite
        maxZoom: 19,
        format: 'image/png',
        crs: L.CRS.EPSG4326,
        transparent: true
    });

    var hospital_department = new L.tileLayer.wms(
        'http://20.40.8.21:3121/cgi-bin/IGiS_Ent_service.exe?IEG_PROJECT=lscl_ws', {
        layers: 'hospital_department',
        maxZoom: 19,
        format: 'image/png',
        crs: L.CRS.EPSG4326,
        transparent: true
    });

    var fire_station = new L.tileLayer.wms(
        'http://20.40.8.21:3121/cgi-bin/IGiS_Ent_service.exe?IEG_PROJECT=lscl_ws', {
        layers: 'fire_station',
        maxZoom: 19,
        format: 'image/png',
        crs: L.CRS.EPSG4326,
        transparent: true
    });

    var police_station_bldg = new L.tileLayer.wms(
        'http://20.40.8.21:3121/cgi-bin/IGiS_Ent_service.exe?IEG_PROJECT=lscl_ws', {
        layers: 'police_station_bldg',
        maxZoom: 19,
        format: 'image/png',
        crs: L.CRS.EPSG4326,
        transparent: true
    });

    map = new L.map('accident_map', {
        center: new L.LatLng(GLOBAL.COORD.LATITUDE, GLOBAL.COORD.LONGITUDE),
        zoom: 11,
        layers: [default_osm],
        projectionKey: 'EPSG:4326',
        zoomControl: false
    });

    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    var baseMaps = {
        "<span class='fontOpenSansRegular'>LSCL satellite</span>": lscl_satellite,
        "<span class='fontOpenSansRegular'>LSCL base map</span>": lscl_basemap,
        "<span class='fontOpenSansRegular'>Default OSM</span>": default_osm
    };

    var overlayMaps = {
        "<span class='fontOpenSansRegular'>Hospitals</span>": hospital_department,
        "<span class='fontOpenSansRegular'>Fire stations</span>": fire_station,
        "<span class='fontOpenSansRegular'>Police stations</span>": police_station_bldg
    };

    L.control.layers(baseMaps, overlayMaps, { position: 'topright' }).addTo(map);
    
    
    map.on('click', function (e) {
        onRouteClick(e)
    })

    route_marker = "not-created";

	
	$('.optional').css('display', 'none')



    function use_routing_machine (latlng, route_marker) {
        distance = 191600; // Taking MET as standard 206 km // Distance between berhampore and MET is 14.4km 
        $('#northing').val(latlng.lat.toString());
        $('#easting').val(latlng.lng.toString());
        // $('#chainage')[0].innerHTML = (distance/1000).toString().substring(0,6);
        route_marker.setLatLng(latlng);
        // route_marker.bindPopup("Your chainage is "+(distance/1000).toString().substring(0,6)+". Drag to Reposition. Double click to set accident &nbsp; &nbsp; &nbsp; &nbsp; <a href='#' class='close_route'>Close Marker</a>");
        route_marker.bindPopup("Drag to Reposition. Double click to add situation &nbsp; &nbsp; &nbsp; &nbsp; <a href='#' class='close_route'>Remove Marker</a>");
        route_marker.openPopup();
    }

    function onRouteClick (e) {
        if (route_marker == "not-created") {
            //dist = e.target.get_distance();
            ////console.log(dist);
            var myIcon = L.icon({
                iconUrl: '../../images/accident_pin.png',
                iconSize: [40, 40],
                iconAnchor: [20, 43],
                popupAnchor: [0, -45]
            })
            options = {
                icon: myIcon,
                draggable: true,
                title: "Accident Location"
            };
            route_marker = L.marker(e.latlng, options);

            route_marker.on('add', function () {
                use_routing_machine(e.latlng, route_marker);
            })
            route_marker.on('drag', function (ein) {
                var inmarker = ein.target;
                var latlng = inmarker.getLatLng();
                $('#northing').val(latlng.lat.toString());
                $('#easting').val(latlng.lng.toString());
            })
            route_marker.on('dragend', function (ein) {
                var inmarker = ein.target;
                var latlng = inmarker.getLatLng();
				// fetchLinks();

                // var p = [latlng.lat,latlng.lng]
                // console.log(p)
                // ex(p,coarray)

                //rmv_routing_machine();
                use_routing_machine(latlng, route_marker);
            })
            map.addLayer(route_marker);

            $(route_marker).dblclick(function (ein) {
                console.log('asd')
                var date = new Date;
                date = (date.toISOString().substring(0, 10)).concat(" ", date.toTimeString().substring(0, 8));
                ////console.log(date);
                $(".acc_datetime").val(date);
                // $('.content').removeClass('col-sm-9').addClass('col-sm-6')
                // $('.add_situation_container').css('display','block')
                //$("#add_modal").modal();
            })
            // route_marker ="not-created";
        } else {
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Marker already exists. Drag to Reposition</div>'
            });
        }
		// setTimeout(fetchLinks(),1000)
    };

    function rmv_routing_machine () {
        map.removeControl(routingControl);
    }

    $(document).on('click', ".close_route", function () {
        //rmv_routing_machine();
        map.removeLayer(route_marker);
        route_marker = "not-created";
        $('#northing,#easting').val("0")
        $('#severity').val("0")
        // $('.content').removeClass('col-sm-6').addClass('col-sm-9')
        // $('.add_situation_container').css('display','none')
    })

	var dates = getCurrentStartNEndDate();
	$('#from').val(getFormattedDate(dates[0], 'Y-m-d H:m:s', 'd-m-y H:m:s'));
	$('#to').val(getFormattedDate(dates[1], 'Y-m-d H:m:s', 'd-m-y H:m:s'));

	active_mode = function () {
		$('.situationConfigure').addClass('active')
		$("#situationCrime").addClass("nav-active")
		$("#accidents").addClass('active')
	}
	setTimeout(function () {
		active_mode();
	}, 100);

	var logic = function (currentDateTime) {
		if (currentDateTime && currentDateTime.getDay() == 6) {
			this.setOptions({
				minTime: '11:00'
			});
		}
		else
			this.setOptions({
				minTime: '8:00'
			});
	};

	$('.datepicker').datetimepicker({
		format: 'Y-m-d H:i',
		onChangeDateTime: logic,
		onShow: logic
	});
	$('.datetimepicker').datetimepicker({
		format: 'd-m-Y H:i:s',
		onChangeDateTime: logic,
		onShow: logic
	});
	$.ajax({
		url: '../../../models/utils/get_username.hh',
		type: 'POST',
		success: function (result) {
			result = JSON.parse(result);
			/*if(result.length > 30){
					window.location = "../index.html"
			}*/
			uname = result.user.trim();

			$('.modified').val(uname)
			$('.modified').parent().parent().css('display', 'none')
		}

	});

	var selector = '[data-rangeslider]';
	var $element = $(selector);
	var textContent = ('textContent' in document) ? 'textContent' : 'innerText';

	function valueOutput (element) {
		var value = element.value;
		var output = element.parentNode.getElementsByTagName('output')[0] || element.parentNode.parentNode.getElementsByTagName('output')[0];
		output[textContent] = value;
	}

	$(document).on('input', 'input[type="range"], ' + selector, function (e) {
		valueOutput(e.target);
	});

	$element.rangeslider();

	$.ajax({
		url: '../../../models/situation/get_utmc_types.hh',
		method: 'POST',
		// data: {
		//     type: $('#select_type_id').val().toLowerCase()
		// },
		data: {
			type: "crime"
		},
		success: function (res) {
			res = jQuery.parseJSON(res);
			$('#accident_type_id').empty();
			for (var i = 0; i < res.length; i++) {
				$('#accident_type_id').append('<option value=' + res[i].accident_type_id + '>' + res[i].accident_type.toUpperCase() + '</option>');
				//$('.up_type_id').append('<option value='+res[i].TypeID+'>'+res[i].name+'</option>');
			}
		}
	});

	// $('#select_type_id').change(function() {
	//        var selected_option = $('#select_type_id').val();
	//        selected_option = selected_option.toLowerCase();
	//        $('.scn').val(selected_option.substring(0, 1).toUpperCase())
	//        ////console.log(selected_option);
	//        if (selected_option != "") {
	// $.ajax({
	//     url: '../../utils/get_utmc_types.hh',
	//     method: 'POST',
	//     data: {
	//         type: "crime"
	//     },
	//     success: function(res) {
	//         res = jQuery.parseJSON(res);
	//         $('#accident_type_id').empty();
	//         for (var i = 0; i < res.length; i++) {
	//             $('#accident_type_id').append('<option value=' + res[i].accident_type_id + '>' + res[i].accident_type.toUpperCase() + '</option>');
	//             //$('.up_type_id').append('<option value='+res[i].TypeID+'>'+res[i].name+'</option>');
	//         }
	//     }
	// });
	//     } else {
	//         $('#accident_type_id').empty();
	//     };
	// })


	$.ajax({
		url:'../../../models/situation/get_accident_actions.hh',
		method:'POST',
		success:function(res){
			res=$.parseJSON(res);
			for(var i=0;i<res.length;i++){
				//$('.type_id').append('<option value='+res[i].TypeID+'>'+res[i].name+'</option>');
				$('#accident_action').append('<option value='+res[i].name+' list="'+res[i].list+'">'+res[i].name+'</option>');
				//$('.up_type_id').append('<option value='+res[i].TypeID+' list="'+res[i].list+'">'+res[i].name+'</option>');
			}
		}
	});


	// $.ajax({
	// 	url:'../../utils/get_accident_actions.hh',
	// 	method:'POST',
	// 	success:function(res){
	// 		res=$.parseJSON(res);
	// 		for(var i=0;i<res.length;i++){
	// 			//$('.type_id').append('<option value='+res[i].TypeID+'>'+res[i].name+'</option>');
	// 			$('#accident_action').append('<option value='+res[i].name+' list="'+res[i].list+'">'+res[i].name+'</option>');
	// 			$('.up_type_id').append('<option value='+res[i].TypeID+' list="'+res[i].list+'">'+res[i].name+'</option>');
	// 		}
	// 	}
	// });


	var signallist = {}, signalscns = ''
	var aff_junc_select = '<select class="form-control selectpicker" multiple data-live-search="true" id="aff_junc_select">'
	$.ajax({
		url: '../../../models/traffic_signal/get_all_transport_links.hh',
		method: 'POST',
		success: function (res) {
			res = JSON.parse(res)

			for (var i = 0; i < Object.keys(res).length; i++) {
				if (!signallist.hasOwnProperty(res[i].SignalSCN)) {
					aff_junc_select += '<option value="' + res[i].SignalSCN + '">' + res[i].SignalName + '</option>'
					signallist[res[i].SignalSCN] = res[i].SignalName + '&&'
				}

				signallist[res[i].SignalSCN] = signallist[res[i].SignalSCN] + '<option value="' + res[i].SystemCodeNumber + '">' + res[i].LinkName + '</option>'
			}
			aff_junc_select += '</select>'
		}
	})


	bind_click = function () {
		$('#aff_junc_select').change(function () {
			console.log($(this).val())

			var selVal = $(this).val()
			var selEle = ''
			for (var i = 0; i < selVal.length; i++) {
				// var cur_selected_junc = $(this).val()[0]
				var curele = signallist[selVal[i]].split('&&')

				selEle += '<div class="aff_app_container"><h5>' + curele[0] + '</h5><select class="form-control selectpicker aff_app_select" multiple data-live-search="true">' + curele[1] + '</select></div>'
			}

			$('#aff_app').html(selEle)
			$('.aff_app_select').selectpicker()

			// bind_click()
		});
	}

	$('.situationmodelbtn').click(function () {
		var situation_scn = $('#sitinfo_table tbody tr td:nth-child(1)').html().trim(),
			latitude = $('#sitinfo_table tbody tr td:nth-child(3)').html().trim().split(',')[0],
			longitude = $('#sitinfo_table tbody tr td:nth-child(3)').html().trim().split(',')[1],
			timestamp = $('#sitinfo_table tbody tr td:nth-child(4)').html().trim()

		var linkscns = ''
		$('#aff_app .aff_app_select').each(function (i, obj) {
			console.log($(obj).val())
			if ($(obj).val() != '')
				linkscns += $(obj).val().join() + ','
		})
		linkscns = linkscns.substring(0, linkscns.length - 1)

		$.ajax({
			url: '../../../models/create_incident_model.hh',
			method: 'POST',
			data: {
				situation_scn: situation_scn,
				latitude: latitude,
				longitude: longitude,
				linkscns: linkscns,
				timestamp: timestamp,
			},
			success: function (res) {

			}
		})
	})



	// $.ajax({
	// 	url:'../../utils/get_crimes.php',
	// 	method:'POST',
	// 	success:function(res){
	// 		res=jQuery.parseJSON(res);

	// 		for (var i = 0; i < res.length; i++) {

	// 			$('.acc_table tbody').append('<tr><td colspan="1"><input type="radio" name="acc_record"></td><td class="a_scn">'+res[i].SystemCodeNumber+'</td><td class="a_sdesc">'+res[i].ShortDescription+'</td><td class="a_ldesc">'+res[i].LongDescription+'</td><td class="a_nor" style="display:none">'+res[i].Northing+'</td><td class="a_eas" style="display:none">'+res[i].Easting+'</td><td class="a_tid">'+res[i].AccidentType+'</td><td class="a_ctime" style="display:none">'+res[i].CreationDate+'</td><td class="a_sev">'+res[i].Severity+'</td><td class="a_atime">'+res[i].AccidentTime+'</td><td class="a_etime">'+(res[i].EndDate == null ? "" : res[i].EndDate)+'</td><td class="a_rby" style="display:none">'+res[i].ReportedBy+'</td><td class="a_cby" style="display:none">'+res[i].CreatedBy+'</td><td class="a_mby" style="display:none;">'+res[i].ModifiedBy+'</td><td><span class="viewdetails">View Details</span></td></tr>')
	// 		}

	// 		$('.viewdetails').click(function(){
	// 			$('#view_modal').modal()
	// 			var ele = $(this).parent().parent()
	// 			$('.v_scn').html($('.a_scn',ele).html())
	// 			$('.v_sdesc').html($('.a_sdesc',ele).html())
	// 			$('.v_ldesc').html($('.a_ldesc',ele).html())
	// 			$('.v_lat').html($('.a_nor',ele).html())
	// 			$('.v_lon').html($('.a_eas',ele).html())
	// 			$('.v_stype').html($('.a_tid',ele).html())
	// 			$('.v_stime').html($('.a_atime',ele).html())
	// 			$('.v_etime').html($('.a_etime',ele).html())
	// 			$('.v_sev').html($('.a_sev',ele).html())
	// 			$('.v_rby').html($('.a_rby',ele).html())
	// 			$('.v_mby').html($('.a_mby',ele).html())
	// 		})

	// 	}
	// })

	$('#add_acc_btn').click(function () {
		$('.loader').show();
		var myFormData = new FormData();
		// var scn=$('.scn').val(),
		var sdesc = sanitize($('.sdesc').val()),
			ldesc = sanitize($('.ldesc').val()),
			nor = sanitize($('.northing').val()),
			eas = sanitize($('.easting').val()),
			tid = sanitize($('#accident_type_id').val()),
			accDT = sanitize($('.acc_datetime').val()),
			edate = sanitize($('.end_datetime').val()),
			sev = sanitize($('#severity').val()),
			rep = sanitize($('#usernameGet').html()),
			mod = sanitize($('.modified').val()),
			chainage = sanitize($('#chainage').val()),
			direction = sanitize($('#direction').val());
			// trnsprt_links = $('#tlink').val()
			// LanesAffected = sanitize($('#lanesAffected').val());
			// ZoneAffected = sanitize($('#zoneAffected').val());

		// type=$('#select_type_id').val().toLowerCase();
		type = "crime"
		action = null;
		var ComplianceTime = sanitize($('.compliance_time').val());
		RemedialTime = sanitize($('.remedial_datetime').val())
		Status = $('#accident_status').val()
		DetailedReason = sanitize($('.detailed_reason').val())
		OtherInformation = sanitize($('.other_information').val())
		Question1 = sanitize($('input[name=q1]:checked').val())
		Question2 = sanitize($('input[name=q2]:checked').val())
		Question3 = sanitize($('input[name=q3]:checked').val())
		Remarks = sanitize($('.remarks').val())
		AmountDue = sanitize($('.amount_due').val()) == '' ? 0 : sanitize($('.amount_due').val())
		AmountPaid = sanitize($('.amount_paid').val()) == '' ? 0 : sanitize($('.amount_paid').val())
		AmountUnpaid = sanitize($('.amount_unpaid').val()) == '' ? 0 : sanitize($('.amount_unpaid').val())
		DamageRemarks = sanitize($('.damageremarks').val())

		human_impact = sanitize($('.human_impact').val())
		human_factors = sanitize($('.human_factors').val())
		injury_nature = sanitize($('.injury_nature').val())
		property_damage = sanitize($('.property_damage').val())
		socio_economic = sanitize($('.socio_economic').val())
		causes = sanitize($('.causes').val())

		if (sdesc == "") {
			$('.loader').hide();
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please Enter the Short Description</div>'
			});
			return;
		}
		if (nor == "" || eas == ""||nor == '0' || eas == '0' ) {
			$('.loader').hide();
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please Enter the Location Coordinates or Place Marker on Map</div>'
			});
			return;
		}
		if (accDT == "") {
			$('.loader').hide();
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please Enter the Start Time</div>'
			});
			return;
		}
		if (sev == "0") {
			$('.loader').hide();
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please Enter Severity</div>'
			});
			return;
		}
		var currentdate = new Date();
		//var datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-"+ currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
		var datetime = getCurrentStartNEndDate()[1];
		// var datetimen = getFormattedDate(datetime,'Y-m-d H:m:s','d-m-y H:m:s');
		accDT = sanitize(getFormattedDate($('.acc_datetime').val(), 'd-m-y H:m:s', 'Y-m-d H:m:s'));

		if (edate){
		edate = sanitize(getFormattedDate($('.end_datetime').val(), 'd-m-y H:m:s', 'Y-m-d H:m:s'));
		}

		

		if (accDT > datetime) {
			$('.loader').hide();
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Start Time cannot be a future time for crime situation. Please enter correct time.</div>'
			});
			return;
		}
		if (edate != "" && accDT > edate) {
			$('.loader').hide();
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">End Time Should be Greater Than Start Time</div>'
			});
			return;
		}
		if (rep == "") {
			$('.loader').hide();
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please enter the \"Reported By\" field</div>'
			});
			return;
		}
		
		if(RemedialTime != ''){
			RemedialTime =getFormattedDate(RemedialTime,'d-m-y H:m:s','Y-m-d H:m:s');
		}
		
		// if(edate != ''){
		// 	edate =getFormattedDate(edate,'d-m-y H:m:s','Y-m-d H:m:s');
		// }
		data_entry_list = []
		// for (var i = list_types.length - 1; i >= 0; i--) {
		var data_objects = {};
		////console.log($("#td_list"+i)[0].innerHTML.toString()+$("#check_list"+i).is(":checked"));
		data_objects['item'] = $("#accident_action option:selected").attr('list');
		data_objects['value'] = "true" //$("#check_list_id"+i).is(":checked");
		data_entry_list.push(data_objects);
		//}

		// for (var i = 0; i < $('#images').prop('files').length; i++) {
		// 	myFormData.append('imageFiles[]', $('#images').prop('files')[i]);
		// }
		myFormData.append('SystemCodeNumber', "acc")
		myFormData.append('ShortDescription', sdesc)
		myFormData.append('LongDescription', ldesc)
		myFormData.append('MainID', type)
		myFormData.append('Northing', nor)
		myFormData.append('Easting', eas)
		myFormData.append('Action', null)
		myFormData.append('TypeID', tid)
		myFormData.append('AccidentTime', accDT)
		myFormData.append('CreatedBy', uname)
		myFormData.append('EndDate', edate)
		myFormData.append('Severity', sev)
		myFormData.append('ReportedBy', rep)
		myFormData.append('isedit', 0)
		myFormData.append('ModifiedBy', mod)
		myFormData.append('CreationDate', datetime)

		// myFormData.append('transport_links', trnsprt_links)
		// myFormData.append('LanesAffected', LanesAffected)
		// myFormData.append('ZoneAffected', ZoneAffected)

		myFormData.append('ComplianceTime', ComplianceTime)
		myFormData.append('RemedialTime', RemedialTime)
		myFormData.append('Status', Status)
		myFormData.append('DetailedReason', DetailedReason)
		myFormData.append('OtherInformation', OtherInformation)
		myFormData.append('Question1', Question1)
		myFormData.append('Question2', Question2)
		myFormData.append('Question3', Question3)
		myFormData.append('Remarks', Remarks)
		myFormData.append('AmountDue', AmountDue)
		myFormData.append('AmountPaid', AmountPaid)
		myFormData.append('AmountUnpaid', AmountUnpaid)
		myFormData.append('DamageRemarks', DamageRemarks)

		myFormData.append('human_impact', human_impact)
		myFormData.append('human_factors', human_factors)
		myFormData.append('injury_nature', injury_nature)
		myFormData.append('property_damage', property_damage)
		myFormData.append('socio_economic', socio_economic)
		myFormData.append('causes', causes)
		myFormData.append('direction', direction)
		myFormData.append('Chainage', chainage)

		$.ajax({
			url: '../../../models/situation/add_accident.hh',
			type: 'POST',
			processData: false,
			contentType: false,
			data: myFormData,
			success: function (res) {
				if(res != 'F'){
					$.ajax({
						url: '../../../models/situation/add_accident_relation.hh',
						method: 'POST',
						data: { SystemCodeNumber: res.trim(), MainID: type, TypeId: tid, Action: action, Checklist: data_entry_list },
						success: function (res) {
							if(res == 'duplicate'){
								$.alert({
									type: 'red',
									title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
									content: '<div class="fw-bold">Duplicate record</div>'
								});
								return;
							}else if(res == 'success'){
								$.alert({
									type: 'green',
									title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
									content: '<div class="fw-bold">Situation recorded successfully</div>',
									buttons: {
										OK: function () {
											window.location.href='crime_setup.html';
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
				}else{
					$.alert({
						type: 'red',
						title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
						content: '<div class="fw-bold">Sorry, there has been a technical problem. Please report this error by sending an email to support@itspe.co.in with a screen shot</div>'
					});
					return;
				}

			}
			//traditional: true
		});
	})

	$('.update_group_modal').click(function(){
		if($('input[name=acc_record]:checked').length == 0){	
				alert('Select a record to edit');
				return;
			}
		$("#update_modal").modal()
		var currEle=$('input[name=acc_record]:checked').closest('tr');
		$('.up_acc_datetime').prop('disabled',false)

		$('.up_scn').val($('.a_scn',currEle).html());
		$('.up_sdesc').val($('.a_sdesc',currEle).html());
		$('.up_ldesc').val($('.a_ldesc',currEle).html());
		$('.up_northing').val($('.a_nor',currEle).html());
		$('.up_easting').val($('.a_eas',currEle).html());
		$('.up_type_id').html('<option>'+$('.a_tid',currEle).html()+'</option>');
		$('.up_acc_datetime').val($('.a_atime',currEle).html());
		$('.up_end_datetime').val($('.a_etime',currEle).html());
		$('#up_severity').val($('.a_sev',currEle).html());
		$('#up_sev_out').val($('.a_sev',currEle).html())
		$('.up_reported').val($('.a_rby',currEle).html());
		$('.up_modified').val($('.a_mby',currEle).html());

		$('.up_compliance_time').val($('.a_comptime',currEle).html());
		$('.up_remedial_datetime').val($('.a_remtime',currEle).html());
		$('.up_accident_status').val($('.a_status',currEle).html());
		$('.up_detailed_reason').val($('.a_dreason',currEle).html());
		$('.up_other_information').val($('.a_other',currEle).html());
		$('.up_remarks').val($('.a_remark',currEle).html());
		$('.up_damageremarks').val($('.a_damageremark',currEle).html());
		$('.up_amount_due').val($('.a_adue',currEle).html());
		$('.up_amount_paid').val($('.a_apaid',currEle).html());
		$('.up_amount_unpaid').val($('.a_aunpaid',currEle).html());
		$('input[name=up_q1][value='+$('.a_q1',currEle).html()+']').prop('checked',true)
		$('input[name=up_q2][value='+$('.a_q2',currEle).html()+']').prop('checked',true)
		$('input[name=up_q3][value='+$('.a_q3',currEle).html()+']').prop('checked',true)

	});

	$('.update_acc_btn').click(function () {
		$('.loader').show();

		var scn = sanitize($('.up_scn').val()),
			sdesc = sanitize($('.up_sdesc').val()),
			ldesc = sanitize($('.up_ldesc').val()),
			nor = sanitize($('.up_northing').val()),
			eas = sanitize($('.up_easting').val()),
			tid = sanitize($('.type_id option:contains("' + $('.up_type_id').text() + '")').val());
		accDT = sanitize($('.up_acc_datetime').val()),
			edate = sanitize($('.up_end_datetime').val()),
			sev = sanitize($('#up_severity').val()),
			rep = sanitize($('.up_reported').val()),
			mod = sanitize($('.up_modified').val());
		// type=$('#select_type_id').val().toLowerCase();
		type = "crime"

		var ComplianceTime = sanitize($('.up_compliance_time').val());
		RemedialTime = sanitize($('.up_remedial_datetime').val())
		Status = sanitize($('.up_accident_status').val())
		DetailedReason = sanitize($('.up_detailed_reason').val())
		OtherInformation = sanitize($('.up_other_information').val())
		Question1 = sanitize($('input[name=up_q1]:checked').val())
		Question2 = sanitize($('input[name=up_q2]:checked').val())
		Question3 = sanitize($('input[name=up_q3]:checked').val())
		Remarks = sanitize($('.up_remarks').val())
		AmountDue = sanitize($('.up_amount_due').val())
		AmountPaid = sanitize($('.up_amount_paid').val())
		AmountUnpaid = sanitize($('.up_amount_unpaid').val())
		DamageRemarks = sanitize($('.up_damageremarks').val())

		human_impact = sanitize($('.up_human_impact').val())
		human_factors = sanitize($('.up_human_factors').val())
		injury_nature = sanitize($('.up_injury_nature').val())
		property_damage = sanitize($('.up_property_damage').val())
		socio_economic = sanitize($('.up_socio_economic').val())
		causes = sanitize($('.up_causes').val())

		if (rep == "") {
			$('.loader').hide();
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Enter the Reported By field</div>'
			});
			return;
		}
		if (mod == "") {
			$('.loader').hide();
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Enter the Modified By field</div>'
			});
			return;
		}
		if (sev == "0") {
			$('.loader').hide();
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please select Severity</div>'
			});
			return;
		}

		if (edate != "" && accDT > edate) {
			$('.loader').hide();
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">End Time should be greater than Start Time</div>'
			});
			return;
		}

		if ($('.up_accident_status').val() == "--Select--") {
			$('.loader').hide();
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please select Status</div>'
			});
			return;
		}

		$.ajax({
			url: '../../../models/situation/update_accident.hh',
			method: 'POST',
			data: { SystemCodeNumber: scn, ShortDescription: sdesc, LongDescription: ldesc, Northing: nor, Easting: eas, TypeID: tid, AccidentTime: accDT, CreatedBy: uname, EndDate: edate, Severity: sev, ReportedBy: rep, ModifiedBy: mod, isedit: 1, MainID: type, ComplianceTime: ComplianceTime,RemedialTime: RemedialTime, Status: Status, DetailedReason: DetailedReason, OtherInformation: OtherInformation, Question1: Question1, Question2: Question2, Question3: Question3, Remarks: Remarks, AmountDue: AmountDue, AmountPaid: AmountPaid, AmountUnpaid: AmountUnpaid, DamageRemarks: DamageRemarks, human_impact: human_impact, human_factors: human_factors, injury_nature: injury_nature, property_damage: property_damage, socio_economic: socio_economic, causes: causes },
			success: function (res) {
				location.reload();
			}
		});
	});

	$('.delete_group').click(function () {
		if ($('input[name=acc_record]:checked').length == 0) {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Select a record to delete</div>'
			});
			return;
		}
		var delRecord = $('.a_scn', $('input[name=acc_record]:checked').closest('tr')).html()
		//console.log(delRecord);	
		if (confirm("Are you sure you want to delete this Situation?")) {
			$.ajax({
				url: '../../../models/situation/delete_accident.hh',
				method: 'POST',
				data: { SystemCodeNumber: delRecord, type: "crime" },
				success: function (res) {
					if (res)
						location.reload();

				}
			})
		}
		else
			return


	})

// 	polyLines = L.layerGroup(); 
// function fetchLinks(){
	
// 	let northing = $("#northing").val()
// 	let easting = $("#easting").val()
// 	$.ajax({
// 		'url':'../../../models/situation/get_transport_links.hh',
// 		'data':{easting:easting,northing:northing},
// 		success:function(res){
// 		$('#tlink').html(''); 
// 		$('#tlink').append('<option value="">Select a Link</option>');
// 		res = JSON.parse(res);
// 		let links = [];
// 		let bounds = []; 
// 		bounds.push([$("#northing").val(),$("#easting").val()]) 
		
// 		randomColor=['red'];
// 			for(link of res){  
// 				bounds.push(link.path);
// 				transport_links[link.SystemCodeNumber] = link.path;
				
// 				let line_color = randomColorGenerator(); 
// 				if(!randomColor.includes(line_color)){
// 				randomColor.push(line_color)
// 				}else{
// 					while(!randomColor.includes(line_color)){
// 						line_color = randomColorGenerator();
// 					}
// 					randomColor.push(line_color)
// 				}
// 				let t_layer = L.polyline(link.path, {color:line_color,className:'link_identifier'}).bindPopup(link.SystemCodeNumber).openPopup().on('click', function(){
// 					let lscn = this._popup._content;
// 					if(selectedLinks.includes(lscn)){ 
						
// 						this.setStyle({
// 							color: line_color,
// 							opacity: 1,
// 							weight: 3
// 						});
// 						$('#'+lscn).attr('selected',false)
// 						$(this.getElement()).removeAttr('up');
// 						remove_array_element(selectedLinks,lscn)
// 					}else{
// 						selectedLinks.push(lscn);
						
// 						this.setStyle({
// 							color: 'red',
// 							opacity: 0.8,
// 							weight: 4.5
	
// 						});
// 						$('#'+lscn).attr('selected',true)
// 					}
// 					$('#tlink').html(''); 
// 					for(const ll of selectedLinks){ 
// 						$('#tlink').append('<option id="'+ll+'" selected value="'+ll+'">'+ll+'</option>') 
// 					}
							
// 				});
// 				tlayers[link.SystemCodeNumber]=t_layer; 
// 				polyLines.addLayer(t_layer);
// 			}    
// 		polyLines.addTo(map);
// 		if(selectedLinks.length>0){
// 			for(const ll of selectedLinks){ 
// 				tlayers[ll].setStyle({
// 					color: 'red',
// 					opacity: 0.8,
// 					weight: 4.5
// 				});
// 				$('#tlink').append('<option id="'+ll+'" selected value="'+ll+'">'+ll+'</option>') 
// 			}
// 		}
// 		map.fitBounds(bounds);
// 		}
// 	})
// 	}



// function randomColorGenerator(){ 
// return '#'+Math.floor(Math.random()*16777215).toString(16);
// }

// function remove_array_element(array, n) 
//  {
//    var index = array.indexOf(n);
//    if (index > -1) {
// 	array.splice(index, 1);
// }
//    return array;
//  }


})
