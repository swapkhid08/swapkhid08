situationSCN = "";
var point;
var polyline;
var latlngroutes = "s";

//Transport Links
transport_links = []; //All the links fetched from api will be stored in key value pairs with SCN being the key (To reduce db calls)

randomColor = ['#FF0000']; //To avoid same color to another polyline
selectedLinks = []; // All the selected links will be stored in this array
tlayers = [];   //All the layers will be stored in this array to make changes on the go (optional)
//Transport Links

$(document).ready(function () {
	fetchusername();
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
		editable: true,
		center: new L.LatLng(GLOBAL.COORD.LATITUDE, GLOBAL.COORD.LONGITUDE),
		zoom: 8,
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

	// fetchLinks();

	var latlngroutes = "";
	// var polyline;


	window.onload = function () {

		var north = sanitize($('#up_northing').val());
		var east = sanitize($('#up_easting').val());
		

		// if(north && east && northend && eastend){





		// 	routing();
		// }

		// function routing() {


		// 	let lat = Number($("#up_northing").val());
		// 	let long = Number($("#up_easting").val());
		// 	let endlat = Number($("#northingEnd").val());
		// 	let endlong = Number($("#eastingEnd").val());
		// 	// console.log(lat);
		// 	map.removeLayer(route_marker);

		// 	routingLayer = L.Routing.control({
		// 		waypoints: [
		// 			L.latLng(lat, long),
		// 			L.latLng(endlat, endlong)
		// 		],
		// 		draggable: true,
		// 		routeWhileDragging: true,
		// 		draggableWaypoints: true,
		// 		useZoomParameter: true,
		// 		// fitSelectedRoutes: true,
		// 		showAlternatives: false,
		// 		fitSelectedRoutes: false,
		// 		// show: false,
		// 		// createMarker: function() { return null; } ,
		// 		lineOptions: {
		// 			addWaypoints: false
		// 		}
		// 	});
		// 	routingLayer.addTo(map);
		// 	// console.log(routingLayer.getWaypoints());

		// 	routingLayer.on("routesfound", function (e) {

		// 		getlat = e;
		// 		var wayPoints = e.waypoints;
		// 		$("#up_northing").val(wayPoints[0].latLng.lat);
		// 		$("#up_easting").val(wayPoints[0].latLng.lng);
		// 		$("#northingEnd").val(wayPoints[1].latLng.lat);
		// 		$("#eastingEnd").val(wayPoints[1].latLng.lng);
		// 		var routes = e.routes;
		// 		latlngroutes = routes[0].coordinates;
		// 	});
		// }
	};



	

	map.on('click', function (e) {

		onRouteClick(e)
	})

	route_marker = "not-created";
	route_marker_two = "not-created";
	if (getParam('module') != 'accident') {
		$('.optional_fields').css('display', 'none')
		if (getParam('module') == 'event' || getParam('module') == 'roadwork') $('.optional_fields_sev').css('display', 'none')
	}


	function use_routing_machine(latlng, route_marker) {
		distance = 191600; // Taking MET as standard 206 km // Distance between berhampore and MET is 14.4km 
		$('#up_northing').val(latlng.lat.toString());
		$('#up_easting').val(latlng.lng.toString());
		// $('#chainage')[0].innerHTML = (distance/1000).toString().substring(0,6);
		route_marker.setLatLng(latlng);
		// route_marker.bindPopup("Your chainage is "+(distance/1000).toString().substring(0,6)+". Drag to Reposition. Double click to set accident &nbsp; &nbsp; &nbsp; &nbsp; <a href='#' class='close_route'>Close Marker</a>");
		route_marker.bindPopup("Drag to Reposition.");
		route_marker.openPopup();
	}

	function use_routing_machine_two(latlng, route_marker_two) {
		distance = 191600; // Taking MET as standard 206 km // Distance between berhampore and MET is 14.4km 
		$('#northingEnd').val(latlng.lat.toString());
		$('#eastingEnd').val(latlng.lng.toString());
		// $('#chainage')[0].innerHTML = (distance/1000).toString().substring(0,6);
		route_marker_two.setLatLng(latlng);
		// route_marker.bindPopup("Your chainage is "+(distance/1000).toString().substring(0,6)+". Drag to Reposition. Double click to set accident &nbsp; &nbsp; &nbsp; &nbsp; <a href='#' class='close_route'>Close Marker</a>");
		route_marker_two.bindPopup("Drag to Reposition.");
		route_marker_two.openPopup();
	}

	

	function onRouteClick(e) {
		var northend = $('#northingEnd').val();
		var eastend = $('#eastingEnd').val();

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
				$('#up_northing').val(latlng.lat.toString());
				$('#up_easting').val(latlng.lng.toString());
			})
			route_marker.on('dragend', function (ein) {
				var inmarker = ein.target;
				var latlng = inmarker.getLatLng();


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
			route_marker ="created";
		}
		 else {
			// $.alert({
			// 	type: 'red',
			// 	title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
			// 	content: '<div class="fw-bold">Marker already exists. Drag to reposition</div>'
			// });
		}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		if(northend && eastend && route_marker_two == "not-created"){
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
			route_marker_two = L.marker(e.latlng, options);

			route_marker_two.on('add', function () {
				use_routing_machine_two(e.latlng, route_marker_two);
			})
			route_marker_two.on('drag', function (ein) {
				var inmarker = ein.target;
				var latlng = inmarker.getLatLng();
				$('#northingEnd').val(latlng.lat.toString());
				$('#eastingEnd').val(latlng.lng.toString());
			})
			route_marker_two.on('dragend', function (ein) {
				var inmarker = ein.target;
				var latlng = inmarker.getLatLng();


				// var p = [latlng.lat,latlng.lng]
				// console.log(p)
				// ex(p,coarray)

				//rmv_routing_machine();
				use_routing_machine_two(latlng, route_marker_two);
			})
			map.addLayer(route_marker_two);

			$(route_marker_two).dblclick(function (ein) {
				// console.log('asd')
				var date = new Date;
				date = (date.toISOString().substring(0, 10)).concat(" ", date.toTimeString().substring(0, 8));
				////console.log(date);
				$(".acc_datetime").val(date);
				// $('.content').removeClass('col-sm-9').addClass('col-sm-6')
				// $('.add_situation_container').css('display','block')
				//$("#add_modal").modal();
			})
			route_marker_two ="created";
		}
	};


	function rmv_routing_machine() {
		map.removeControl(routingControl);
	}

	$("#editPolyline").on('click', function () {
		// alert("hello");
		polyline.enableEdit();

	});
	$("#disablePolyline").on('click', function () {
		// alert("hello");
		polyline.disableEdit();


	});

	$("#deletePolyline").on('click', function () {

		var lat1 = $('.up_northing').val()
		var long1 = $('.up_easting').val()
		var latend2 = sanitize($('#northingEnd').val());
		var longend2 = sanitize($('#eastingEnd').val());

		var latlngCoordinates = [{lat1,long1},{latend2,longend2}]


		var routingControlpoly = L.Routing.control({
			waypointMode: 'snap'
		  });
		  
		  routingControlpoly._router.route(latlngCoordinates, function(err, waypoints) {
			var a = waypoints;
		  });



		polyline.remove(map)

		polyline = new L.polyline(point, {
			color: 'red',
			weight: 3,
			opacity: 0.5,
			smoothFactor: 1
		}).addTo(map);

	});


	$(document).on('click', ".close_route", function () {
		//rmv_routing_machine();
		map.removeLayer(route_marker);
		route_marker = "not-created";
		$('#up_northing,#up_easting').val("0")
		$('#severity').val("0")
		// $('.content').removeClass('col-sm-6').addClass('col-sm-9')
		// $('.add_situation_container').css('display','none')
	})

	get_parameter_by_name = function (name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);

		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}
	var urlsource = get_parameter_by_name('source');
	$('.nav li').each(function (i, obj) {
		var href = $('a', obj).attr('href') + "?module=" + get_parameter_by_name('module') + "&id=" + get_parameter_by_name('id')
		$('a', obj).attr('href', href)
	})

	$.ajax({
		url: '../../../models/utils/get_username.hh',
		type: 'POST',
		success: function (result) {
			result = JSON.parse(result);
			uname = result.user.trim();
			// if(result.length > 30){
			//         window.location = "../index.html"
			// }
			// uname=result.trim();
		}

	});
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
	var selector = '[data-rangeslider]';
	var $element = $(selector);
	var textContent = ('textContent' in document) ? 'textContent' : 'innerText';

	function valueOutput(element) {
		var value = element.value;
		var output = element.parentNode.getElementsByTagName('output')[0] || element.parentNode.parentNode.getElementsByTagName('output')[0];
		output[textContent] = value;
	}

	$(document).on('input', 'input[type="range"], ' + selector, function (e) {
		valueOutput(e.target);
	});

	$element.rangeslider();
	$("#editPolyline").show();
	$("#disablePolyline").show();

	$.ajax({
		url: '../../../models/situation/get_utmc_types.hh',
		method: 'POST',
		data: {
			type: get_parameter_by_name('module')
		},
		success: function (res) {
			res = jQuery.parseJSON(res);
			$('#accident_type_id').empty();
			for (var i = 0; i < res.length; i++) {
				$('#accident_type_id').append('<option value=' + res[i].accident_type_id + '>' + res[i].accident_type.toUpperCase() + '</option>');
				//$('.up_type_id').append('<option value='+res[i].TypeID+'>'+res[i].name+'</option>');

			}
			var type = get_parameter_by_name('module');

			if (type == "event" || type == "roadwork") {
				$("#start_time").hide();
			}
			if (type == "accident" || type == "crime" || type == "incident") {
				$("#actual_tr").hide();
				$("#planned_tr").hide();
			}


			if (type == "accident" || type == "crime") {
				$("#columnAddition").hide();
				$("#norend_field").hide();
				$("#easend_field").hide();
				$("#editPolyline").hide();
				$("#disablePolyline").hide();


			}
			else {
				$("#columnAddition").show();
				$("#norend_field").show();
				$("#easend_field").show();
				$("#editPolyline").show();
				$("#disablePolyline").show();
			}

			if (type == "event") {
				$(".eventFields").show();
			}
			else {
				$(".eventFields").hide();
			}

			if (type == "roadwork") {
				$(".roadworkFields").show();
			}
			else {
				$(".roadworkFields").hide();
			}


			// if(res.AccidentTime !== null){
			// 	$("#start_time").show();
			// }
			// else{
			// 	$("#start_time").hide();
			// }

		}
	});


	$.ajax({
		url: '../../../models/situation/get_accident_actions.hh',
		method: 'POST',
		success: function (res) {
			res = $.parseJSON(res);
			for (var i = 0; i < res.length; i++) {
				//$('.type_id').append('<option value='+res[i].TypeID+'>'+res[i].name+'</option>');
				// $('#accident_action').append('<option value='+res[i].name+' list="'+res[i].list+'">'+res[i].name+'</option>');
				// $('.up_type_id').append('<option value='+res[i].TypeID+' list="'+res[i].list+'">'+res[i].name+'</option>');
			}
		}
	});


	var pointGet = [];
	var point = [];
	$.ajax({
		url: '../../../models/situation/get_situation_details.hh',
		method: 'POST',
		data: {
			module: get_parameter_by_name('module'),
			id: get_parameter_by_name('id')
		},
		success: function (res) {
			res = JSON.parse(res)

			console.log(res[0].AccidentType);
			// console.log(res[0].Chainage);
			if (res[0].NorthingEnd && res[0].EastingEnd) {

				for (i = 0; i < res[0].Path.length; i++) {
					pointGet = [res[0].Path[i][0], res[0].Path[i][1]];
					// console.log(pointGet);
					point.push(pointGet);
					pointGet = "";
				}
				polyline = new L.polyline(point, {
					color: 'red',
					weight: 3,
					opacity: 0.5,
					smoothFactor: 1
				}).addTo(map);
				latlngroutes = polyline.getLatLngs();
				//  polyline.enableEdit();
				// map.setView(position, 17);
				// map.fitBounds(polyline.getBounds());
				// var plcoordinates =  Math.round(point.length/2);
				// var pLat = point[plcoordinates][0]
				// var pLong = point[plcoordinates][1]
				
				
				// const position = [lats / res[0].Path.length, longs / res[0].Path.length];
				// map.setView([pLat,pLong], 13);


			}


			insertData(res[0])

		}

	})

	insertData = function (data) {
		// if (data.PlannedStart != '') {
		// 	data.PlannedStart = getFormattedDate(data.PlannedStart, 'd-m-y H:m:s', 'Y-m-d H:m:s');
		// }

		var PlannedStart = data.PlannedStart;
		if (PlannedStart != '' && PlannedStart != null && PlannedStart != 'null') {
			PlannedStart = getFormattedDate(data.PlannedStart, 'Y-m-d H:m:s', 'd-m-y H:m:s',);
		}
		var PlannedEnd = data.PlannedEnd;
		if (PlannedEnd != '' && PlannedEnd != null && PlannedEnd != 'null') {
			PlannedEnd = getFormattedDate(data.PlannedEnd, 'Y-m-d H:m:s', 'd-m-y H:m:s',);
		}
		var ActualStart = data.ActualStart;
		if (ActualStart != '' && ActualStart != null && ActualStart != 'null') {
			ActualStart = getFormattedDate(data.ActualStart, 'Y-m-d H:m:s', 'd-m-y H:m:s',);
		}
		var ActualEnd = data.ActualEnd;
		if (ActualEnd != '' && ActualEnd != null && ActualEnd != 'null') {
			ActualEnd = getFormattedDate(data.ActualEnd, 'Y-m-d H:m:s', 'd-m-y H:m:s',);
		}


		var TransportLinkReference = data.TransportLinkReference
		if (TransportLinkReference && TransportLinkReference != 'null') {
			var res = TransportLinkReference.split(",");
			selectedLinks = res;
		} else {
			selectedLinks = [];
		}




		$('.up_scn').val(data.SystemCodeNumber);
		$('.up_sdesc').val(data.ShortDescription);
		$('.up_ldesc').val(data.LongDescription);
		$('.up_northing').val(data.Northing);
		$('.up_easting').val(data.Easting);
		$('#planned_start').val(PlannedStart);
		$('#planned_end').val(PlannedEnd);
		$('#actual_start').val(ActualStart);
		$('#actual_end').val(ActualEnd);


		$('#northingEnd').val(data.NorthingEnd);
		$('#eastingEnd').val(data.EastingEnd);
		// $('#tlink').val(res);


		$('#lanesAffected').val(data.LanesAffected);
		$('#zoneAffected').val(data.ZoneAffected);
		$('#chainage').val(data.Chainage);
		$('input[name=up_q4][value=' + data.DiversionInForce + ']').prop('checked', true)
		$('#diversionRoute').val(data.DiversionRoute);
		$('#phase').val(data.Phase);
		$('#locationDesc').val(data.LocationDesc);

		$('#organiser').val(data.Organiser);
		$('#venueName').val(data.VenueName);
		$('#contractor').val(data.Contractor);
		$('input[name=up_q5][value=' + data.TrafficSignals + ']').prop('checked', true)
		// $('#trafficSignals').val(data.TrafficSignals);
		$('input[name=up_q6][value=' + data.Contraflow + ']').prop('checked', true)






		// $('.northingEnd').val(NorthingEnd);
		// $('.EastingEnd').val(EastingEnd);

		// var plannedStart = data.PlannedStart;
		// var plannedEnd = data.PlannedEnd
		// var actualStart = data.ActualStart
		// var actualEnd = data.ActualEnd

		// if(plannedStart !== null || plannedEnd !== null){
		// 	$("#actual_tr").show();
		// 	$("#planned_tr").show();
		// 	// $("#actual_tr").prop("disabled", true);

		// 	$("#actual_tr").on("click", function(){
		// 		$.alert({
		// 			type: 'red',
		// 			title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
		// 			content: '<div class="fw-bold">You cannot change the Actual fields</div>'
		// 		});
		// 		return;


		// 	});
		// }
		// if(actualStart !== null || actualEnd !== null) {
		// 	$("#planned_tr").show();
		// 	$("#actual_tr").show();
		// 	// $("#planned_tr").prop("disabled", true);

		// }


		var modul = get_parameter_by_name('module');
		if (modul == 'accident') {
			var mpicon = '../../images/accident-marker.png';
			$('#accident_setup_html').addClass('active nav-active');
		} else if (modul == 'crime') {
			var mpicon = '../../images/crime-marker.png';
			$('#crime_setup_html').addClass('active nav-active');
		} else if (modul == 'event') {
			var mpicon = '../../images/event-marker.png';
			$('#event_setup_html').addClass('active nav-active');
		} else if (modul == 'incident') {
			var mpicon = '../../images/incident-marker.png';
			$('#incident_setup_html').addClass('active nav-active');
		} else if (modul == 'roadwork') {
			var mpicon = '../../images/roadwork-marker.png';
			$('#road_work_setup_html').addClass('active nav-active');
		}

		var myIcon = L.icon({
			iconUrl: mpicon,
			iconSize: [40, 40],
			iconAnchor: [20, 43],
			popupAnchor: [0, -45]
		})
		options = {
			icon: myIcon,
			draggable: true,
			title: "Accident Location"
		};

	
		if (modul == 'roadwork' || modul == 'event' || modul == 'incident') {
			route_marker = L.marker([data.Northing, data.Easting], options).addTo(map);
			map.setView([data.Northing, data.Easting], 7);
			// map.fitBounds(route_marker.getBounds());
			if($('#northingEnd').val()){
			route_marker_two = L.marker([$('#northingEnd').val(), $('#eastingEnd').val()], options).addTo(map);
			// map.fitBounds([data.Northing, data.Easting], 18);
			map.setView([data.Northing, data.Easting], 11);
			}
		} else {
			route_marker = L.marker([data.Northing, data.Easting], options).addTo(map);
			// map.fitBounds([data.Northing, data.Easting], 1);
			map.setView([data.Northing, data.Easting], 1);
		}


		route_marker.on('drag', function (ein) {
			var inmarker = ein.target;
			var latlng = inmarker.getLatLng();
			$('#up_northing').val(latlng.lat.toString());
			$('#up_easting').val(latlng.lng.toString());
		})
		route_marker.on('dragend', function (ein) {
			var inmarker = ein.target;
			var latlng = inmarker.getLatLng();

			// var p = [latlng.lat,latlng.lng]
			// console.log(p)
			// ex(p,coarray)

			//rmv_routing_machine();
			use_routing_machine(latlng, route_marker);
		})
		map.addLayer(route_marker);


		if($('#northingEnd').val()){
		route_marker_two.on('drag', function (ein) {
			var inmarker = ein.target;
			var latlng = inmarker.getLatLng();
			$('#northingEnd').val(latlng.lat.toString());
			$('#eastingEnd').val(latlng.lng.toString());
		})
		route_marker_two.on('dragend', function (ein) {
			var inmarker = ein.target;
			var latlng = inmarker.getLatLng();

			
			use_routing_machine(latlng, route_marker_two);
		})
		map.addLayer(route_marker_two);
	}

		$('.up_type_id').html('<option>' + data.AccidentType + '</option>');
		$('.up_acc_datetime').val(getFormattedDate(data.AccidentTime, 'Y-m-d H:m:s', 'd-m-y H:m:s'));
		var EndDate = data.EndDate;
		if (EndDate != '' && EndDate != null && EndDate != 'null') {
			EndDate = getFormattedDate(data.EndDate, 'Y-m-d H:m:s', 'd-m-y H:m:s')
		} else {
			EndDate = '';
		}

		$('.up_end_datetime').val(EndDate);
		$('#up_severity').val(data.Severity);
		$('#up_sev_out').val(data.Severity)
		$('.up_reported').val(data.ReportedBy);
		$('.up_modified').val(data.ModifiedBy);

		$('.up_compliance_time').val(data.ComplianceTime);
		var RemedialTime = data.RemedialTime;
		if (RemedialTime != '' && RemedialTime != null && RemedialTime != 'null') {
			RemedialTime = getFormattedDate(data.RemedialTime, 'Y-m-d H:m:s', 'd-m-y H:m:s')
		} else {
			RemedialTime = '';
		}
		$('.up_remedial_datetime').val(RemedialTime);
		var opt = '';
		if (data.Status == "Rectification Done") {
			opt += '<option value="Rectification Done" selected>Rectification Done</option>'
			opt += '<option value="Rectification Partially Done">Rectification Patrially Done</option>'
			opt += '<option value="Rectification Not Done">Rectification Not Done</option>'
		} else if (data.Status == "Rectification Partially Done") {
			opt += '<option value="Rectification Done">Rectification Done</option>'
			opt += '<option value="Rectification Partially Done" selected>Rectification Patrially Done</option>'
			opt += '<option value="Rectification Not Done">Rectification Not Done</option>'
		} else if (data.Status == "Rectification Not Done") {
			opt += '<option value="Rectification Done">Rectification Done</option>'
			opt += '<option value="Rectification Partially Done">Rectification Patrially Done</option>'
			opt += '<option value="Rectification Not Done" selected>Rectification Not Done</option>'
		} else {
			opt += '<option value="Rectification Done">Rectification Done</option>'
			opt += '<option value="Rectification Partially Done">Rectification Patrially Done</option>'
			opt += '<option value="Rectification Not Done">Rectification Not Done</option>'
		}

		$('#up_accident_status').append(opt);
		//$('.up_accident_status').val(data.Status);
		$('.up_detailed_reason').val(data.DetailedReason);
		$('.up_other_information').val(data.OtherInformation);
		$('.up_remarks').val(data.Remarks);
		$('.up_damageremarks').val(data.DamageRemarks);
		$('.up_amount_due').val(data.AmountDue);
		$('.up_amount_paid').val(data.AmountPaid);
		$('.up_amount_unpaid').val(data.AmountUnpaid);
		$('input[name=up_q1][value=' + data.Question1 + ']').prop('checked', true)
		$('input[name=up_q2][value=' + data.Question2 + ']').prop('checked', true)
		$('input[name=up_q3][value=' + data.Question3 + ']').prop('checked', true)




		$('.up_human_impact').val(data.HumanImpact);
		$('.up_human_factors').val(data.HumanFactors);
		$('.up_injury_nature').val(data.InjuryNature);
		$('.up_property_damage').val(data.PropertyDamage);
		$('.up_socio_economic').val(data.SocioEconomic);
		$('.up_causes').val(data.Causes);
		var Direction = data.Direction;
		var diropt = '';
		if (Direction == "LHS") {
			diropt += '<option value="LHS" selected>LHS</option>'
			diropt += '<option value="RHS">RHS</option>'
			diropt += '<option value="Median">Median</option>'
		} else if (Direction == "RHS") {
			diropt += '<option value="LHS">LHS</option>'
			diropt += '<option value="RHS" selected>RHS</option>'
			diropt += '<option value="Median">Median</option>'
		} else if (Direction == "Median") {
			diropt += '<option value="LHS">LHS</option>'
			diropt += '<option value="RHS">RHS</option>'
			diropt += '<option value="Median" selected>Median</option>'
		} else {
			diropt += '<option value="LHS">LHS</option>'
			diropt += '<option value="RHS">RHS</option>'
			diropt += '<option value="Median">Median</option>'
		}
		$('#direction').html(diropt)

		if (data.ImagePath != "") {
			var images = data.ImagePath.split(';')
			if (images.length != 0) {
				for (var i = 0; i < images.length; i++) {
					$('.up_imagepath').append('<a href="' + images[i] + '" class="imagelink" target="_blank" title="Click to open this Image in a new tab"><span>X</span><img src="' + images[i] + '"/></a>')
				}
			}

			$('.imagelink span').click(function (e) {
				e.preventDefault()
				$(this).parent().remove()
			})
		}
		fetchLinks();
	}


	var module = get_parameter_by_name('module');
	var id = get_parameter_by_name('id');

	setTimeout(function(){
		if(checkqueryString('tab')==true){
			let tab = get_parameter_by_name('tab').split('#');
			if(tab[0]=='NHAI'){
				$('#view_nhai').trigger('click');		
			}
		}
	},500)


	$('#view_nhai').click(function () {
		
		// $('#view_nhai_format').css("display", "block");
		$('#view_details_format').removeClass("active_format .format_tab");
		$('#view_nhai_format').addClass("active_format .active");

	});

	$("li").click(function() {
		$(this).toggleClass("active");
		$('#view_details').removeClass("active");
	});





	$('.update_acc_btn').click(function () {


		var PlannedStart = sanitize($('.planned_start').val());
		var PlannedEnd = sanitize($('.planned_end').val());
		var ActualStart = sanitize($('.actual_start').val());
		var ActualEnd = sanitize($('.actual_end').val());

		var edate = sanitize($('.up_end_datetime').val());


		if (PlannedStart) {
			PlannedStart = sanitize(getFormattedDate($('#planned_start').val(), 'd-m-y H:m:s', 'Y-m-d H:m:s'));
		}
		if (PlannedEnd) {
			PlannedEnd = sanitize(getFormattedDate($('#planned_end').val(), 'd-m-y H:m:s', 'Y-m-d H:m:s'));
		}
		if (ActualStart) {
			ActualStart = sanitize(getFormattedDate($('#actual_start').val(), 'd-m-y H:m:s', 'Y-m-d H:m:s'));
		}
		if (ActualEnd) {
			ActualEnd = sanitize(getFormattedDate($('#actual_end').val(), 'd-m-y H:m:s', 'Y-m-d H:m:s'));
		}
		if (edate) {
			edate = sanitize(getFormattedDate($('.up_end_datetime').val(), 'd-m-y H:m:s', 'Y-m-d H:m:s'));
		}

		var type = get_parameter_by_name('module');
		if (type == "roadwork" || type == "event") {
			if (!PlannedStart) {
				$.alert({
					type: 'red',
					title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
					content: '<div class="fw-bold">Planned Start Date Cannot be Empty</div>'
				});
				return;
			}

			if (edate != "" && PlannedStart > edate) {
				$.alert({
					type: 'red',
					title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
					content: '<div class="fw-bold">End Time should be greater than Planned Start Time</div>'
				});
				return;
			}


		}


		var myFormData = new FormData();

		var scn = $('.up_scn').val(),
			sdesc = $('.up_sdesc').val(),
			ldesc = $('.up_ldesc').val(),
			nor = $('.up_northing').val(),
			eas = $('.up_easting').val(),
			tid = $('.type_id option:contains("' + $('.up_type_id').text() + '")').val();
		// tid = $('.up_type_id').val('<option>' +  + '</option>');
		accDT = $('.up_acc_datetime').val(),
			edate = $('.up_end_datetime').val(),
			sev = $('#up_severity').val(),
			rep = $('.up_reported').val(),
			mod = $('.up_modified').val();
		// type=$('#select_type_id').val().toLowerCase();
		type = get_parameter_by_name('module')

		var ComplianceTime = $('.up_compliance_time').val();

		PlannedStart = sanitize($('#planned_start').val());
		PlannedEnd = sanitize($('#planned_end').val());
		ActualStart = sanitize($('#actual_start').val());
		ActualEnd = sanitize($('#actual_end').val());
		// NorthingEnd = sanitize($('#up_northing').val());
		// EastingEnd = sanitize($('#up_easting').val());

		NorthingEnd = sanitize($('#northingEnd').val());
		EastingEnd = sanitize($('#eastingEnd').val());
		LanesAffected = sanitize($('#lanesAffected').val());
		ZoneAffected = sanitize($('#zoneAffected').val());
		Chainage = sanitize($('#chainage').val());
		DiversionInForce = $('input[name=up_q4]:checked').val()
		// DiversionInForce = sanitize($('#diversionInForce').val());
		DiversionRoute = sanitize($('#diversionRoute').val());
		// DiversionRoute = $('input[name=q4]:checked').val()
		Phase = sanitize($('#phase').val());
		LocationDesc = sanitize($('#locationDesc').val());
		Organiser = sanitize($('#organiser').val());
		VenueName = sanitize($('#venueName').val());
		Contractor = sanitize($('#contractor').val());
		TrafficSignals = $('input[name=up_q5]:checked').val()
		Contraflow = $('input[name=up_q6]:checked').val()

		RemedialTime = $('.up_remedial_datetime').val()
		Status = $('.up_accident_status').val()
		DetailedReason = $('.up_detailed_reason').val()
		OtherInformation = $('.up_other_information').val()
		Question1 = $('input[name=up_q1]:checked').val()
		Question2 = $('input[name=up_q2]:checked').val()
		Question3 = $('input[name=up_q3]:checked').val()
		Remarks = $('.up_remarks').val()
		AmountDue = $('.up_amount_due').val()
		AmountPaid = $('.up_amount_paid').val()
		AmountUnpaid = $('.up_amount_unpaid').val()
		DamageRemarks = $('.up_damageremarks').val()
		direction = sanitize($('#direction').val())
		human_impact = $('.up_human_impact').val()
		human_factors = $('.up_human_factors').val()
		injury_nature = $('.up_injury_nature').val()
		property_damage = $('.up_property_damage').val()
		socio_economic = $('.up_socio_economic').val()
		causes = $('.up_causes').val()
		trnsprt_links = $('#tlink').val()

		// if(edate == ""){	
		// 	alert('Enter End Date');
		// 	return;
		// }	

		if(!sdesc){
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please enter the Short Description!</div>'
			});
			return;
		}

		if (rep == "") {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please enter the Reported By field!</div>'
			});
			return;
		}
		if (mod == "") {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please enter the Modified By field!</div>'
			});
			return;
		}
		if (sev == "0") {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Select Severity</div>'
			});
			return;
		}
		if (accDT) {
            accDT = sanitize(getFormattedDate($('.up_acc_datetime').val(), 'd-m-y H:m:s', 'Y-m-d H:m:s'));
		}
		if(edate){
			edate = sanitize(getFormattedDate($('.up_end_datetime').val(), 'd-m-y H:m:s', 'Y-m-d H:m:s'));
		}


		if (edate  && accDT > edate) {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">End Time should be greater than Start Time</div>'
			});
			return;
		}

		if ($('.up_accident_status').val() == "--Select--") {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please select Status</div>'
			});
			return;
		}
		// accDT = getFormattedDate(accDT, 'd-m-y H:m:s', 'Y-m-d H:m:s');
		if (RemedialTime != '') {
			RemedialTime = getFormattedDate(RemedialTime, 'd-m-y H:m:s', 'Y-m-d H:m:s');
		}

		// if (edate != '') {
		// 	edate = getFormattedDate(edate, 'd-m-y H:m:s', 'Y-m-d H:m:s');
		// }
		for (var i = 0; i < $('#up_images').prop('files').length; i++) {
			myFormData.append('imageFiles[]', $('#up_images').prop('files')[i]);
		}
		myFormData.append('SystemCodeNumber', scn)
		myFormData.append('ShortDescription', sdesc)
		myFormData.append('LongDescription', ldesc)
		myFormData.append('MainID', type)
		myFormData.append('Northing', nor)
		myFormData.append('Easting', eas)
		// myFormData.append('Action',action)s
		myFormData.append('TypeID', tid)
		myFormData.append('AccidentTime', accDT)
		myFormData.append('CreatedBy', uname)
		myFormData.append('EndDate', edate)
		myFormData.append('Severity', sev)
		myFormData.append('ReportedBy', rep)
		myFormData.append('isedit', 1)
		myFormData.append('ModifiedBy', mod)
		// myFormData.append('CreationDate',datetime)

		myFormData.append('ComplianceTime', ComplianceTime)

		myFormData.append('PlannedStart', PlannedStart)
		myFormData.append('PlannedEnd', PlannedEnd)
		myFormData.append('ActualStart', ActualStart)
		myFormData.append('ActualEnd', ActualEnd)

		myFormData.append('NorthingEnd', NorthingEnd)
		myFormData.append('EastingEnd', EastingEnd)
		myFormData.append('LanesAffected', LanesAffected)
		myFormData.append('ZoneAffected', ZoneAffected)
		myFormData.append('Chainage', Chainage)
		myFormData.append('DiversionInForce', DiversionInForce)
		myFormData.append('DiversionRoute', DiversionRoute)
		myFormData.append('Phase', Phase)
		myFormData.append('Organiser', Organiser)
		myFormData.append('VenueName', VenueName)

		myFormData.append('LocationDesc', LocationDesc)
		myFormData.append('Contractor', Contractor)
		myFormData.append('TrafficSignals', TrafficSignals)
		myFormData.append('Contraflow', Contraflow)

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
		myFormData.append('LatLngRouteJson', latlngroutes)
		myFormData.append('transport_links', trnsprt_links) //Passing the transport links scn as comma seperated values

		var path = ''
		$('.up_imagepath img').each(function (i, obj) {
			path += $(obj).attr('src') + ';'
		})

		path = path.substr(0, path.length - 1)
		myFormData.append('oldpath', path)
		var redurl = '';
		if (urlsource != undefined && urlsource != '') {
			redurl = 'situation_home.html';
		} else {
			if (type == 'accident') {
				redurl = 'accident_setup.html';
			} else if (type == 'crime') {
				redurl = 'crime_setup.html';
			} else if (type == 'event') {
				redurl = 'event_setup.html';
			} else if (type == 'incident') {
				redurl = 'incident_setup.html';
			} else if (type == 'roadwork') {
				redurl = 'road_work_setup.html';
			}
		}


		$.ajax({
			url: '../../../models/situation/update_accident.hh',
			method: 'POST',
			processData: false,
			contentType: false,
			data: myFormData,
			success: function (res) {
				if (res == 'success') {
					$.alert({
						type: 'green',
						title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
						content: '<div class="fw-bold">Situation recorded successfully</div>',
						buttons: {
							OK: function () {
								window.location.href = redurl;
							}
						}
					});
				} else {
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
	polyLines = L.layerGroup(); //All the links will be added as a layer to this polyLines group
	function fetchLinks() {
		// let direction = $('#direction').val();
		let northing = $("#up_northing").val()
		let easting = $("#up_easting").val()
		$.ajax({
			'url': '../../../models/situation/get_transport_links.hh',
			'data': { easting: easting, northing: northing },
			success: function (res) {
				$('#tlink').html(''); //Empty the select when there is a change in marker postion
				$('#tlink').append('<option value="">Select a Link</option>');
				res = JSON.parse(res);
				let links = [];
				let bounds = []; //To store all the bounds for map to set the view after showing the polylines
				bounds.push([$("#up_northing").val(), $("#up_easting").val()])
				// polyLines.clearLayers(); //Clear the current layers from the group
				randomColor = ['#FF0000']; //Will make randomColor variable default by adding red color to it
				if(Object.keys(res).length > 0){
					for (link of res) {
						bounds.push(link.path);
						transport_links[link.SystemCodeNumber] = link.path;
						// $('#tlink').append('<option id="'+link.SystemCodeNumber+'" value="'+link.SystemCodeNumber+'">'+link.SystemCodeNumber+'</option>')
						let line_color = randomColorGenerator(); //Random color hex value
						if (!randomColor.includes(line_color)) {
							randomColor.push(line_color)
						} else {
							while (!randomColor.includes(line_color)) {
								line_color = randomColorGenerator();
							}
							randomColor.push(line_color)
						}
						let t_layer = L.polyline(link.path, { color: line_color, className: 'link_identifier' }).bindPopup(link.SystemCodeNumber).openPopup().on('click', function () {
							let lscn = this._popup._content;
							if (selectedLinks.includes(lscn)) { //Check if the scn exists in selectedLinks
								this.setStyle({
									color: line_color,
									opacity: 1,
									weight: 3
								});
								$('#' + lscn).attr('selected', false)
								$(this.getElement()).removeAttr('up');
								remove_array_element(selectedLinks, lscn)
							} else {
								selectedLinks.push(lscn);
								this.setStyle({
									color: 'red',
									opacity: 0.8,
									weight: 4.5
	
								});
								$('#' + lscn).attr('selected', true)
							}
							$('#tlink').html(''); //Clear the dropdown
							for (const ll of selectedLinks) {
								$('#tlink').append('<option id="' + ll + '" selected value="' + ll + '">' + ll + '</option>') //Populate the link scn which are selected
							}
	
						});
						tlayers[link.SystemCodeNumber] = t_layer; //add to layers holder tLayers
						polyLines.addLayer(t_layer);
					}
					polyLines.addTo(map);
				}
				
				if (selectedLinks.length > 0) {
					for (const ll of selectedLinks) {
						tlayers[ll].setStyle({
							color: 'red',
							opacity: 0.8,
							weight: 4.5
						});
						$('#tlink').append('<option id="' + ll + '" selected value="' + ll + '">' + ll + '</option>') //Populate the link scn which are selected
					}
				}
				map.fitBounds(bounds);
			}
		})
	}



	function randomColorGenerator() { //Create a random color hex value 
		return '#' + Math.floor(Math.random() * 16777215).toString(16);
	}

	function remove_array_element(array, n) //remove item from array
	{
		var index = array.indexOf(n);
		if (index > -1) {
			array.splice(index, 1);
		}
		return array;
	}



})