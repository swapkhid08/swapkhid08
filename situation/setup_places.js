var latlong;
var latlongEdited;
var latlongPoly;
var Features = [];
var type;

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

	map = new L.map('places_map', {
		editable: true,
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

	$('#addModal').on('shown.bs.modal', function () {
		setTimeout(function () {
			map.invalidateSize();
		}, 1);
	})

	// var polygonPoints = [
	// 	// [37.786617, -122.404654],
	// 	// [37.797843, -122.407057],
	// 	// [37.798962, -122.398260],
	// 	// [37.794299, -122.395234]
	// 	[-122.404654, 37.786617],
	// 	[-122.407057, 37.797843],
	// 	[-122.398260, 37.798962],
	// 	[-122.395234, 37.794299]
	// ];
	// var poly = L.polygon(polygonPoints).addTo(map);

	map.on('click', function (e) {
		onRouteClick(e)
	})

	route_marker = "not-created";

	// if (getParam('module') != 'accident') {
	// 	$('.optional_fields').css('display', 'none')
	// 	if (getParam('module') == 'event' || getParam('module') == 'roadwork') $('.optional_fields_sev').css('display', 'none')
	// }


	function use_routing_machine(latlng, route_marker) {
		distance = 191600; // Taking MET as standard 206 km // Distance between berhampore and MET is 14.4km 
		$('#northing').val(latlng.lat.toString());
		$('#easting').val(latlng.lng.toString());
		// $('#chainage')[0].innerHTML = (distance/1000).toString().substring(0,6);
		route_marker.setLatLng(latlng);
		// route_marker.bindPopup("Your chainage is "+(distance/1000).toString().substring(0,6)+". Drag to Reposition. Double click to set accident &nbsp; &nbsp; &nbsp; &nbsp; <a href='#' class='close_route'>Close Marker</a>");
		route_marker.bindPopup("Drag to Reposition.");
		route_marker.openPopup();
	}

	function onRouteClick(e) {
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
			// $.alert({
			// 	type: 'red',
			// 	title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
			// 	content: '<div class="fw-bold">Marker already exists. Drag to reposition</div>'
			// });
		}
	};

	$('#type').change(function(){
		type = sanitize($("#type").val());
		if(type){
			$.ajax({
				url: '../../../models/situation/get_place_subtypes.hh',
				method: 'POST',
				data: {
					place : type
				},
				success: function (res) {
					$('#features').html('');
					res = JSON.parse(res)
					// $('#type').append('<option value="all">All</option>');
					for (var i = 0; i < Object.keys(res).length; i++) {
		
						$('#features').append('<option value= ' + res[i].SubTypeID + '>' + res[i].TypeName + '</option>')
					  
					}
				}
			})
		}
		
	});


	$.ajax({
		url: '../../../models/situation/get_places_types.hh',
		method: 'POST',
		data: {
			// type: sanitize($(this).val())
			// scn:scn

		},
		success: function (res) {
			$('#type').html('');
			res = JSON.parse(res)

			// $('#type').append('<option value="all">All</option>');
			for (var i = 0; i < Object.keys(res).length; i++) {

				$('#type').append('<option value=' + res[i].TypeID + '>' + res[i].TypeName + '</option>')
			  
			}

			type = $("#type").val();
			$.ajax({
				url: '../../../models/situation/get_place_subtypes.hh',
				method: 'POST',
				data: {place : type
						
					// type: sanitize($(this).val())
					// scn:scn
				},
				success: function (res) {
					$('#features').html('');
					res = JSON.parse(res)
					// $('#type').append('<option value="all">All</option>');
					for (var i = 0; i < Object.keys(res).length; i++) {
		
						$('#features').append('<option value=' + res[i].TypeID + '>' + res[i].TypeName + '</option>')
					  
					}
				}
			})
		}
	})

	

	

	

	// $.ajax({
	// 	url: '../../../models/situation/add_place.hh',
	// 	method: 'POST',
	// 	data: {
	// 		// type: sanitize($(this).val())
	// 		// scn:scn
	// 	},
	// 	success: function (res) {
	// 		$('#type').html('');
	// 		res = JSON.parse(res)

	// 		// $('#type').append('<option value="all">All</option>');
	// 		for (var i = 0; i < Object.keys(res).length; i++) {

	// 			$('#type').append('<option ' + res[i].TypeID + '">' + res[i].TypeName.toUpperCase() + '</option>')
			  
	// 		}
	// 	}
	// })




	var drawnItems = new L.FeatureGroup();
	map.addLayer(drawnItems);

	var polyLayers = [];

	// var polygon1 = L.polygon([
	// 	[51.509, -0.08],
	// 	[51.503, -0.06],
	// 	[51.51, -0.047]
	// ]);
	// polyLayers.push(polygon1)

	// var polygon2 = L.polygon([
	// 	[51.512642, -0.099993],
	// 	[51.520387, -0.087633],
	// 	[51.509116, -0.082483]
	// ]);

	// polyLayers.push(polygon2)

	// Add the layers to the drawnItems feature group 
	for (layer of polyLayers) {
		drawnItems.addLayer(layer);
	}


	// Set the title to show on the polygon button
	// L.drawLocal.draw.toolbar.buttons.polygon = 'Draw a polygon!';
	map.panTo(new L.LatLng(12.858017324759706, 75.10241434908426));
	var drawControl = new L.Control.Draw({
		position: 'topleft',
		draw: {
			polygon: {
				allowIntersection: false,
				showArea: true,
				drawError: {
					color: '#000000',
					timeout: 1000
				},
				shapeOptions: {
					color: '#253654',
					opacity: 1,
				},
				showArea: true,
				metric: false
			},
			polyline: false,
			circle: false,
			marker: false,
			circlemarker: false,
			rectangle: false,
		},
		edit: {
			featureGroup: drawnItems,
			remove: false
		}
	});
	map.addControl(drawControl);




	map.on('draw:created', function (e) {
		var layer = e.layer;
		latlongPoly = layer._latlngs[0];
		drawnItems.addLayer(layer);
	});

	// map.on('draw:edited', function (e) {
	// 	var layers = e.layers;
	// 	console.log('CreateFunction is Called', '\nType:', e, '\nCordinates: ', layer._latlngs[0]);
	// 	if (localStorage.getItem("createZoneData") == null) {
	// 		console.log('Data is NUll');
	// 		localStorage.setItem("createZoneData", JSON.stringify(layer._latlngs[0]));
	// 	} else {
	// 		console.log('Data is Not NUll');
	// 		localStorage.removeItem("createZoneData");
	// 		localStorage.setItem("createZoneData", JSON.stringify(layer._latlngs[0]));
	//         latlongPolyEdited = layer._latlngs[0];
	// 	}
	// 	var countOfEditedLayers = 0;
	// 	layers.eachLayer(function (layer) {
	// 		countOfEditedLayers++;
	// 	});
	// 	console.log("Edited " + countOfEditedLayers + " layers");
	// });


	type = $("#type").val()
	// $(".fclt").hide();

	// $("#type").change(function () {
	// 	type = $("#type").val();

	// 	if (type == "Hospital") {

	// 		$(".fclt").show();
	// 	}
	// 	else {
	// 		$(".fclt").hide();
	// 	}
	// });





	$('.submit_btn').click(function () {

		// var facilityArray = [];
		// $("input[name='facilities[]']:checked").each(function () {
		// 	facilityArray.push($(this).val());
		// });


		var myFormData = new FormData();

		type = $("#type").val(),
		// scn = $("#scn").val(),
		// selected_zones = JSON.parse(localStorage.getItem("createZoneData"));
		shortdescription = $("#shortDescription").val(),
		longDescription = $("#ldesc").val(),
		latitude = $("#northing").val(),
		longitude = $("#easting").val(),
		// createdBy = "admin";
		// direction = sanitize($('#direction').val())
		Features = $("#features").val(),


		myFormData.append('place', type)
		// myFormData.append('scn', scn)
		myFormData.append('short_desc', shortdescription)
		myFormData.append('long_desc', longDescription)

		// myFormData.append('created_by', createdBy)

		// myFormData.append('created_by', createdBy)

		myFormData.append('northing', latitude)
		myFormData.append('easting', longitude)
		myFormData.append('PlacesRoute', latlongPoly)
		myFormData.append('facilities', Features)
		// myFormData.append('direction', direction)



		if(latlongPoly == "" || latlongPoly == undefined){
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message </h3>',
				content: '<div class="fw-bold">Please select the area using Polygon</div>'
			});
			return;
		}

		// console.log('API Results', 'type='+type, 'lat='+latitude,'long='+ longitude,'short='+ shortdescription,'long='+longDescription,'features='+Features, 'route='+latlongPoly);
		if (shortdescription == '') {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message </h3>',
				content: '<div class="fw-bold">Please enter short description  </div>'
			});
		}
		
		else {
			$.confirm({
				type:'dark',
				title: '<h3 class="text-primary fw-bold mb-0">Confirmation </h3>',
				content: '<div class="fw-bold">Are you sure, you want to add this Record ?</div>',
				buttons: {
					Yes: function () {
						$.ajax({
							url: '../../../models/situation/add_place.hh',
							type: 'POST',
							processData: false,
							contentType: false,
							data: myFormData,

							success: function (res) {
								// console.log(res);

								if (res == 'S') {
									$.confirm({
										type: 'green',
										title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
										content: '<div class="fw-bold">Record added Successfully </div> ',
										buttons: {
											Ok: function () {
												localStorage.removeItem("createZoneData");
												// location.reload();
												window.location.href = "setup_places_home.html";
											}
										}
									});
								}
								else if (res == 'F') {
									$.alert({
										type: 'red',	
										title: '<h3 class="text-danger fw-bold mb-0">Message </h3>',
										content: '<div class="fw-bold">Sorry, there has been a technical problem. Please report this error by sending an email to support@itspe.co.in with a screen shot </div>'
									});
								}
								else {
									$.alert({
										type: 'red',
										title: '<h3 class="text-danger fw-bold mb-0">Message </h3>',
										content: '<div class="fw-bold">Sorry, there has been a technical problem. Please report this error by sending an email to support@itspe.co.in with a screen shot </div>'
									});
								}
							}
						});
					},
					No: function () {
						$.alert({
							type: 'red',
							title: '<h3 class="text-primary fw-bold mb-0">Message </h3>',
							content: '<div class="fw-bold">The Operation is cancelled </div>'
						});
					}
				}
			});

		}

	});



	// $('.update_acc_btn').click(function () {

	// 	var latitude = sanitize("#northing").val();
	// 	var longitude = sanitize("#easting").val();
	// 	var shortdescription = sanitize("#shortDescription").val();








	// 	myFormData.append('shortDescription', shortdescription)
	// 	myFormData.append('northing', latitude)
	// 	myFormData.append('easting', longitude)
	// 	myFormData.append('latlongPoly', latlongPoly)









	// 	$.ajax({
	// 		url: '../../../models/situation/add_place.hh',
	// 		method: 'POST',
	// 		processData: false,
	// 		contentType: false,
	// 		data: myFormData,
	// 		success: function (res) {
	// 			if (res == 'success') {
	// 				$.alert({
	// 					type: 'green',
	// 					title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
	// 					content: '<div class="fw-bold">Situation recorded successfully</div>',
	// 					buttons: {
	// 						OK: function () {
	// 							window.location.href = redurl;
	// 						}
	// 					}
	// 				});
	// 			} else {
	// 				$.alert({
	// 					type: 'red',
	// 					title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
	// 					content: '<div class="fw-bold">Sorry, there has been a technical problem. Please report this error by sending an email to support@itspe.co.in with a screen shot</div>'
	// 				});
	// 				return;
	// 			}


	// 		}
	// 	});

	// });





});