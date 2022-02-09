var polygon;
var latlongPoly;
var Features = [];
var type;
var path = [];
var pathArr = [];
var flag = false;
var id = $("input[name='id']:checked").val();
// console.log("id = ".id);
$(document).ready(function () {
    var getUrlParameter = function getUrlParameter(sParam) {
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
    var vid = getUrlParameter('id');
    var placeData = {};
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




    // type = sanitize($("#type").val());
    // if(type){
    // 	$.ajax({
    // 		url: '../../../models/situation/get_place_subtypes.hh',
    // 		method: 'POST',
    // 		data: {
    // 			place : type
    // 		},
    // 		success: function (res) {
    // 			$('#features').html('');
    // 			res = JSON.parse(res)
    // 			// $('#type').append('<option value="all">All</option>');
    // 			for (var i = 0; i < Object.keys(res).length; i++) {

    // 				$('#features').append('<option value= ' + res[i].SubTypeID + '>' + res[i].TypeName + '</option>')

    // 			}
    // 		}
    // 	})
    // }



    function getTypes() {
        $.ajax({
            url: '../../../models/situation/get_places_types.hh',
            method: 'POST',
            success: function (res) {
                $('#type').html('');
                res = JSON.parse(res);
                for (var i = 0; i < Object.keys(res).length; i++) {

                    if (placeData.TypeID == res[i].TypeID) {
                        $('#type').append('<option value=' + res[i].TypeID + ' selected>' + res[i].TypeName + '</option>')
                        //$('#supporttype').append('<option value="' + res[i].TypeID + '" selected>' + res[i].TypeDescription + '</option>')
                    } else {
                        $('#type').append('<option value=' + res[i].TypeID + '>' + res[i].TypeName + '</option>')
                    }
                    // $('#type').append('<option value=' + res[i].TypeID + '>' + res[i].TypeName + '</option>')

                }
                getSubTypes(typeid);
            }
        })
    }

    function getSubTypes(typeId) {
        $.ajax({
            url: '../../../models/situation/get_place_subtypes.hh',
            method: 'POST',
            data: {
                place: typeId
            },
            success: function (res) {
                $('#features').html('');
                res = JSON.parse(res);
                var selectedSubTypes = [];
                if (placeData.SubTypeRef) {
                    selectedSubTypes = placeData.SubTypeRef.split(",");
                }
                for (var i = 0; i < Object.keys(res).length; i++) {
                    if (selectedSubTypes.includes(res[i].SubTypeID)) {
                        // for (var j = 0; j <= selectedSubTypes.length; j++){
                        $('#features').append('<option value=' + res[i].SubTypeID + ' selected>' + res[i].TypeName + '</option>')
                        // }
                        //$('#supporttype').append('<option value="' + res[i].TypeID + '" selected>' + res[i].TypeDescription + '</option>')
                    } else {
                        $('#features').append('<option value=' + res[i].SubTypeID + '>' + res[i].TypeName + '</option>')
                    }

                    //  $('#features').append('<option value=' + res[i].TypeID + '>' + res[i].TypeName + '</option>')

                }
                setData();
            }
        })
    }

    function getPlaceDetails() {
        $.ajax({
            url: '../../../models/situation/get_place_details.hh',
            method: 'POST',
            data: {
                id: vid
            },

            success: function (res) {
                res = JSON.parse(res)
                // console.log("get_place_details response = ", res);
                placeData = res[0];
                typeid = placeData.TypeID;
                subtypeid = placeData.SubTypeRef;
                getTypes();
            }


        });
    }


    function setData() {
        
        if (placeData.Northing && placeData.Easting) {
           

            
            route_marker =  L.marker([placeData.Northing, placeData.Easting],{
                draggable: true
            }).addTo(map);

			// route_marker.on('drag', function (ein) {
			// 	var inmarker = ein.target;
			// 	var latlng = inmarker.getLatLng();
			// 	$('#northing').val(latlng.lat.toString());
			// 	$('#easting').val(latlng.lng.toString());
			// })
			route_marker.on('dragend', function (ein) {
				var inmarker = ein.target;
				var latlng = inmarker.getLatLng();
                $('#northing').val(latlng.lat.toString());
				$('#easting').val(latlng.lng.toString());
				

				
				
			})
			map.addLayer(route_marker);

            
            Path = placeData.Path;
            polygon = L.polygon(Path, { color: 'red' });
            polygon.addTo(map);
            pathArr = polygon._latlngs;
            map.fitBounds(polygon.getBounds());
            // polygon.editing.enable();
            // console.log(placeData.TypeID)
        }
        $("#shortDescription").val(placeData.ShortDescription);
        $("#ldesc").val(placeData.LongDescription);
        $("#northing").val(placeData.Northing);
        $("#easting").val(placeData.Easting);
        $("#id").val(vid);
    }

    $("#editPolygon").on('click', function () {
        flag = true;
        polygon.editing.enable();
        // var layer = e.layer;
        // latlongPoly = layer._latlngs[0];
        // drawnItems.addLayer(layer);
    });
    $("#savePolygon").on('click', function () {
        // alert("hello");

        polygon.editing.disable();
        // console.log(polygon._latlngs);
        path = polygon._latlngs[0];
        flag = false;
    });

    // map.on('draw:created', function (e) {
    // 	var layer = e.layer;
    // 	latlongPoly = layer._latlngs[0];
    // 	drawnItems.addLayer(layer);
    // });

    //getTypes().done(handleData);
    getPlaceDetails();


    $('.update_btn').click(function () {
        if (flag == false) {
            path = pathArr[0];
            // console.log(path)
        }
        if (flag == true) {
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message </h3>',
                content: '<div class="fw-bold">Please save the polygon </div>'
            });
            return
        }

        var myFormData = new FormData();
        type = $("#type").val(),
            // scn = $("#scn").val(),
            shortdescription = $("#shortDescription").val(),
            longDescription = $("#ldesc").val(),
            latitude = $("#northing").val(),
            longitude = $("#easting").val(),
            Features = $("#features").val(),

        myFormData.append('place', type)
        myFormData.append('short_desc', shortdescription)
        myFormData.append('long_desc', longDescription)
        myFormData.append('northing', latitude)
        myFormData.append('easting', longitude)
        myFormData.append('PlacesRoute', path)
        myFormData.append('facilities', Features)
        myFormData.append('id', vid)

        if (shortdescription == '') {
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message </h3>',
                content: '<div class="fw-bold">Please enter short description</div>'
            });
        }
        else {
            $.confirm({
                type: 'dark',
                title: '<h3 class="text-primary fw-bold mb-0">Confirmation </h3>',
                content: '<div class="fw-bold">Are you sure, you want to Update this Record ?</div>',
                buttons: {
                    Yes: function () {
                        $.ajax({
                            url: '../../../models/situation/update_place.hh',
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
                                else if (res == 'Fail') {
                                    $.alert({
                                        type: 'red',
                                        title: '<h3 class="text-danger fw-bold mb-0">Message </h3>',
                                        content: '<div class="fw-bold">You haven\'t made any changes </div>'
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

    // $.ajax({
    //     url: '../../../models/situation/get_places_types.hh',
    //     method: 'POST',
    //     data: {
    //         // type: sanitize($(this).val())
    //         // scn:scn

    //     },
    //     success: function (res) {
    //         $('#type').html('');
    //         res = JSON.parse(res)

    //         // $('#type').append('<option value="all">All</option>');
    //         for (var i = 0; i < Object.keys(res).length; i++) {

    //             $('#type').append('<option value=' + res[i].TypeID + '>' + res[i].TypeName + '</option>')

    //         }

    //         type = $("#type").val();
    //         $.ajax({
    //             url: '../../../models/situation/get_place_subtypes.hh',
    //             method: 'POST',
    //             data: {
    //                 place: type

    //                 // type: sanitize($(this).val())
    //                 // scn:scn
    //             },
    //             success: function (res) {
    //                 $('#features').html('');
    //                 res = JSON.parse(res)
    //                 // $('#type').append('<option value="all">All</option>');
    //                 for (var i = 0; i < Object.keys(res).length; i++) {

    //                     $('#features').append('<option value=' + res[i].TypeID + '>' + res[i].TypeName + '</option>')

    //                 }
    //                 var id = localStorage.getItem("id");
    //                 console.log(id);



    //                 if (id == '' || id == undefined) {
    //                     $.alert({
    //                         title: '<h3 class="text-primary fw-bold mb-0">Message</h3>',
    //                         content: '<div class="fw-bold">Please select a Data to perform this action</div>',
    //                     });
    //                 } else {
    //                     // window.location.href = "edit_setup_places.html?id="+id; //Multiple reloads, will hang server!
    //                     $.ajax({
    //                         url: '../../../models/situation/get_place_details.hh',
    //                         method: 'POST',
    //                         data: {
    //                             id: id
    //                         },

    //                         success: function (res) {
    //                             res = JSON.parse(res)
    //                             console.log("get_place_details response = ", res)
    //                             response = res[0];

    //                             if (response.Northing && response.Easting) {
    //                                 var Path = response.Path;
    //                                 var polygon = L.polygon(Path, { color: 'red' });
    //                                 polygon.addTo(map);
    //                                 map.fitBounds(polygon.getBounds());
    //                                 // polygon.editing.enable();
    //                                 console.log(response.TypeID)
    //                             }

    //                             insertData(response)

    //                         }


    //                     });

    //                     insertData = function (data) {

    //                         typeid = data.TypeID;
    //                         subtypeid = data.SubTypeRef;
    //                         $("#type").val(data.TypeID);
    //                         $("#features").val(data.SubTypeRef);
    //                         $("#shortDescription").val(data.ShortDescription);
    //                         $("#ldesc").val(data.LongDescription);
    //                         $("#northing").val(data.Northing);
    //                         $("#easting").val(data.Easting);

    //                     }


    //                 }
    //             }


    //         })
    //     }
    // })












});


// }