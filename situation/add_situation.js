var transportLinkSelect=null;
list_types = "";
situationSCN = ""; //defined globally
linkSCN ='';
coarray = [];
layerFlag=1; //0 = hide layers
//Transport Links
transport_links = []; //All the links fetched from api will be stored in key value pairs with SCN being the key (To reduce db calls)
polyLines = L.layerGroup(); //All the links will be added as a layer to this polyLines group
randomColor=['red']; //To avoid same color to another polyline
selectedLinks =[]; // All the selected links will be stored in this array
tlayers = [];   //All the layers will be stored in this array to make changes on the go (optional)
//Transport Links

list_types = "";
situationSCN = ""; //defined globally
var source_link = getQueryString('source');
var ecb_lat = getQueryString('lat');
var ecb_long = getQueryString('long');
var source_type = getQueryString('src_type');
if(source_type == undefined){
    source_type='';
}
var current_location=[ecb_lat,ecb_long];
coarray = []
$(document).ready(function () {


    // map = L.map('accident_map').setView([26.8467, 80.9462],11);

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
        // center: new L.LatLng(GLOBAL.COORD.LATITUDE, GLOBAL.COORD.LONGITUDE),
        center: GLOBAL.COORD.LAT_LON,//Transport Links
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



    var searchControl = new L.esri.Controls.Geosearch().addTo(map);
    var results = new L.LayerGroup().addTo(map);

    var searchlat;
    var searchlng;

    searchControl.on('results', function (e) {
        results.clearLayers();
        searchlat = e.latlng.lat;
        searchlng = e.latlng.lng;
        // change_mapmarker();
        // fetch_accdata();
    });






    L.control.layers(baseMaps, overlayMaps, { position: 'topright' }).addTo(map);






    // var selected_option = sanitize($('#main_type').val());
    // selected_option = selected_option.toLowerCase();
    // mapMarker();
    /*$.ajax({
       url:'../../../models/situation/get_all_situations.hh',
       method:'GET',      
       data:{type:selected_option},        
       success:function(res){
           markers=L.featureGroup();
           console.log(res);
           var res = jQuery.parseJSON(res);
           var markers_array = [];
           for (var i = res.accident_data.length - 1; i >= 0; i--) {
               if(selected_option == 'accident'){var myIcon_cctv = L.icon({iconUrl: '../../images/accident.png',iconSize:[30,28],iconAnchor:[30,14]});}
               if(selected_option == 'event'){var myIcon_cctv = L.icon({iconUrl: '../../images/event.png',iconSize:[30,28],iconAnchor:[30,14]});}
               if(selected_option == 'incident'){var myIcon_cctv = L.icon({iconUrl: '../../images/incident.png',iconSize:[30,28],iconAnchor:[30,14]});}
               if(selected_option == 'roadwork'){var myIcon_cctv = L.icon({iconUrl: '../../images/roadwork.png',iconSize:[30,28],iconAnchor:[30,14]});}
               if(selected_option == 'crime'){var myIcon_cctv = L.icon({iconUrl: '../../images/crime.png',iconSize:[30,28],iconAnchor:[30,14]});}
               var table = '<table class="map_table" id="' + res.accident_data[i].SystemCodeNumber + '">';
               table += '<tr><th>System Code Number</th><th>' + res.accident_data[i].SystemCodeNumber + '</th></tr>';
               var module = "'"+selected_option+"'";
               var SystemCodeNumber = "'"+res.accident_data[i].SystemCodeNumber+"'";
               var fault_scn = "'"+res.accident_data[i].fault_scn+"'";
               table += '<tr><th><button onclick="viewClick('+module+',' + SystemCodeNumber + ')">View details</button></th><th><button onclick="sopClick('+module+',' + fault_scn + ')">View sop</button></th></tr>';
               table += '</table>';
               markers_array.push(new L.marker([res.accident_data[i].Northing,res.accident_data[i].Easting]));
               marker = new L.marker([res.accident_data[i].Northing,res.accident_data[i].Easting],{icon: myIcon_cctv}).bindPopup(table);
               markers.addLayer(marker);
           }
           map.addLayer(markers);
           var markers_group = new L.featureGroup(markers_array);
           map.fitBounds(markers_group.getBounds().pad(0.05));
       }
   })*/
    //gpx routing system
    // var gpx = 'route.gpx'; // URL to your GPX file or the GPX itself
    // new L.GPX(gpx, {async: true}).on('loaded', function(e) {
    //   map.fitBounds(e.target.getBounds());
    // }).addTo(map).on('click',onRouteClick);

    // $.ajax({
    //     type: 'GET',
    //     url: '../../utils/get_zones.php',
    //     dataType: 'json', 
    //     success: function (data) {
    //         for(var i=0;i<data.length;i++) {
    //             var siteId = data[i].SiteId;
    //             var SiteName = data[i].SiteName;
    //             var centroid_lat = data[i].centroid.split(",")[0];
    //             var centroid_lng = data[i].centroid.split(",")[1];
    //             var boundaries = JSON.parse(data[i].collection).features[0];
    //             var outColor = "#000";
    //             var inColor = "rgba(0, 0, 0, 0.1)";
    //             boundaries.lat = data[i].centroid.split(",")[0];
    //             boundaries.lng = data[i].centroid.split(",")[1];


    //             var req = JSON.parse(data[i].collection) 
    //             req = req.features[0].geometry.coordinates[0]
    //             coarray = coarray.concat(req)
    //             map.setView([10.512289, 76.220281], 11);
    //             L.geoJson(boundaries, {
    //                 style: function(feature) {
    //                     for(var j=0;j<data.length;j++) {
    //                         switch (feature.properties.party) {
    //                             case data[j].SiteId: return {color: outColor,weight: 2};break;
    //                         }
    //                     }
    //                 },onEachFeature: function(feature,layer) {
    //                 var label = L.marker(layer.getBounds().getCenter(), {
    //                     icon: L.divIcon({
    //                     className: '',
    //                     html: "<font size='5px'>"+SiteName+"</font>",
    //                     iconSize: [100, 40]
    //                   })
    //                 });
    //                 var boldLabel = L.marker(layer.getBounds().getCenter(), {
    //                     icon: L.divIcon({
    //                     className: '',
    //                     html: "<font size='5px'><b>"+SiteName+"</b></font>",
    //                     iconSize: [100, 40]
    //                   })
    //                 });
    //                 var zoomFlag = document.getElementsByName('zoom_view')[0].value;
    //                 if(zoomFlag=="false"){
    //                     label.addTo(map);
    //                 }
    //                 layer.on("click",function (e) {
    //                     onRouteClick(e)
    //                     // var zoomFlag = document.getElementsByName('zoom_view')[0].value;
    //                     // // Toggle zoom
    //                     // if(zoomFlag=="false") document.getElementsByName('zoom_view')[0].setAttribute("value", "true");
    //                     // else document.getElementsByName('zoom_view')[0].setAttribute("value", "false");

    //                     // zoomFlag = document.getElementsByName('zoom_view')[0].value;
    //                     // if(zoomFlag=="true"){
    //                     //     map.removeLayer(boldLabel);
    //                     //     map.removeLayer(label);
    //                     //     map.setView([feature.lat,feature.lng], 12);
    //                     //     for(var j=0;j<data.length;j++) {
    //                     //         switch (feature.properties.party) {
    //                     //             case data[j].SiteId: 
    //                     //             showCCTV(data[j].SiteId);
    //                     //             break;
    //                     //         }
    //                     //     }
    //                     // }
    //                     // else {
    //                     //     map.setView([10.512289,76.220281], 11);
    //                     //     label.addTo(map);
    //                     //     removeAllMarkers();
    //                     // }


    //                 });
    //                 layer.on("mouseover",function(e){
    //                     // var zoomFlag = document.getElementsByName('zoom_view')[0].value;
    //                     // if(zoomFlag=="false"){
    //                     //     map.removeLayer(label);
    //                     //     boldLabel.addTo(map);
    //                     // }else {
    //                     //     map.removeLayer(label);
    //                     //     map.removeLayer(boldLabel);
    //                     // }
    //                     // for(var j=0;j<data.length;j++) {
    //                     //     switch (feature.properties.party) {
    //                     //         case data[j].SiteId:
    //                     //         this.setStyle({
    //                     //             color: outColor,   //or whatever style you wish to use;
    //                     //             weight: 5

    //                     //         });
    //                     //         break;
    //                     //     }
    //                     // }

    //                 });
    //                 layer.on("mouseout",function(e){
    //                     // var zoomFlag = document.getElementsByName('zoom_view')[0].value;
    //                     // if(zoomFlag=="false"){
    //                     //     map.removeLayer(boldLabel);
    //                     //     label.addTo(map);
    //                     // }else {
    //                     //     map.removeLayer(label);
    //                     //     map.removeLayer(boldLabel);
    //                     // }
    //                     // for(var j=0;j<data.length;j++) {
    //                     //     switch (feature.properties.party) {
    //                     //         case data[j].SiteId:
    //                     //         this.setStyle({
    //                     //             color: outColor,   //or whatever style you wish to use;
    //                     //             weight: 2
    //                     //         });
    //                     //         break;
    //                     //     } 
    //                     // }
    //                 });
    //                 }
    //             }).addTo(map);
    //             //map.fitBounds(group.getBounds().pad(0.1));
    //         }
    //     }
    // });
    var latlngroutes ='';
    route_marker = "not-created";
    route_path = "not-created";
    var map_point_count = 0;
    var marker = null;
    var marker1 = null;
    var routingLayer;

    map.on('click', function (e) {
        
        // map.removeLayer();
        removeMarkers();
        mainType = sanitize($('#main_type').val()).toLowerCase();

        $('#situation_detail_table').hide();
        $('#add_situation_container').show();

        // var map_point_count = $('#map_point_count').val();
        // var a_group = $('#a_group').text().trim();
        if (route_marker == 'not-created') {
            if (map_point_count == 0) {
                if (marker) {
                    map.removeLayer(marker);

                }
                if (marker1) {
                    map.removeLayer(marker1);
                }
                options = {
                    draggable: true
                };
                marker = L.marker([ecb_lat,ecb_long], options);
                $("#add_northing").val(ecb_lat);
                $("#add_easting").val(ecb_long);
                // map.addLayer(markers);

                marker.on('drag', function (ein) {

                    var inmarker = ein.target;
                    var latlng = inmarker.getLatLng();
                    $("#add_northing").val(latlng.lat.toString());
                    $("#add_easting").val(latlng.lng.toString());
                })
                marker.on('dragend', function (ein) {
                    var inmarker = ein.target;
                    var latlng = inmarker.getLatLng();
                    //Transport Links
                    fetchLinks(); //To update the links after changing the markers
                    //Transport Links
                })
                marker.bindPopup("Start point, Drag to reposition.").addTo(map);
                map_point_count = parseInt(map_point_count) + 1;
                $('#map_point_count').val(map_point_count);



            } else if (map_point_count == 1 && mainType != 'accident' && mainType != 'crime') {
                if (marker1) {
                    map.removeLayer(marker1);
                }
                options = {
                    draggable: true
                };
                marker1 = L.marker(e.latlng, options);
                $("#northingEnd").val(e.latlng.lat);
                $("#eastingEnd").val(e.latlng.lng);




                // map.removeLayer(marker1);

                // marker1.on('drag', function (ein) {
                // 	map.removeLayer(marker1);
                //     var inmarker = ein.target;
                //     var latlng = inmarker.getLatLng();
                //     $("#northingEnd").val(latlng.lat.toString());
                //     $("#eastingEnd").val(latlng.lng.toString());
                // })
                // marker1.on('dragend', function (ein) {

                //     var inmarker = ein.target;
                //     var latlng = inmarker.getLatLng();
                // 	$("#northingEnd").val(latlng.lat.toString());
                //     $("#eastingEnd").val(latlng.lng.toString());
                // 	routing();
                // })
                marker1.bindPopup("End point, Drag to reposition.").addTo(map);
                map_point_count = parseInt(map_point_count) + 1;
                $('#map_point_count').val(map_point_count);
                routing();

                // $('main_type').attr('disabled', 'disabled');
            } else {
                $.alert({
                    type: 'red',
                    title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                    content: '<div class="fw-bold">Marker already exists. Drag to reposition</div>'
                });
                return;
            }
        } else {
            if (marker) {
                map.removeLayer(marker);
            }
            marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
            $("#latitude").val(e.latlng.lat);
            $("#longitude").val(e.latlng.lng);
        }

        // polyLines.on('click', function(e) { console.log(e.layer) });
        setTimeout(fetchLinks(),1000)
    })



    function routing() {
        // console.log(($("#add_northing").val()));
        // console.log($("#add_easting").val());
        // console.log($("#northingEnd").val());
        // console.log($("#eastingEnd").val());

        let lat = Number($("#add_northing").val());
        let long = Number($("#add_easting").val());
        let endlat = Number($("#northingEnd").val());
        let endlong = Number($("#eastingEnd").val());
        // console.log(lat);
        map.removeLayer(marker);
        map.removeLayer(marker1);
        routingLayer = L.Routing.control({
            waypoints: [
                L.latLng(lat, long),
                L.latLng(endlat, endlong)
            ],
            draggable: true,
            routeWhileDragging: true,
            draggableWaypoints: true,
            useZoomParameter: false,
            // fitSelectedRoutes: true,
            showAlternatives: false,
            // show: false,
            // createMarker: function() { return null; } ,
            lineOptions: {
                addWaypoints: false
            }
        });
        routingLayer.addTo(map);


        // console.log(routingLayer.getWaypoints());

        routingLayer.on("routesfound", function (e) {
            getlat = e;
            var wayPoints = e.waypoints;
            $("#add_northing").val(wayPoints[0].latLng.lat);
            $("#add_easting").val(wayPoints[0].latLng.lng);
            $("#northingEnd").val(wayPoints[1].latLng.lat);
            $("#eastingEnd").val(wayPoints[1].latLng.lng);

            var routes = e.routes;

            latlngroutes = routes[0].coordinates;
            // var latlngroutesJson = JSON.stringify(latlngroutes);

            $('#main_type').change(function () {
                var type = sanitize($('#main_type').val()).toLowerCase();

                if (type == "accident" || type == "crime") {
                    options = {
                        draggable: true
                    };
                    marker = L.marker([lat, long], options);
                    marker.addTo(map);
                    map_point_count = 1;

                    routingLayer.spliceWaypoints(0, 2);
                    // $('#add_northing').val('');
                    // $('#add_easting').val('');
                    $('#northingEnd').val('');
                    $('#eastingEnd').val('');
                }
            });

        });
    }


    function rmv_routing_machine() {
        map.removeControl(routingControl);
    }

    $(document).on('click', ".close_route", function () {
        //rmv_routing_machine();
        map.removeLayer(route_marker);
        route_marker = "not-created";

        $(".sdesc,.ldesc,.acc_datetime,.reported").val("")
        $('#add_northing,#add_easting,output').html("0")
        $('#severity').val("0")
        // $('.content').removeClass('col-sm-6').addClass('col-sm-9')
        // $('.add_situation_container').css('display','none')
    })
    /*
    function get_vehicles(){
        vehicles=L.featureGroup();
        $.ajax({
            url:'../../utils/get_vehicles.php',
            method:'POST',              
            success:function(res){
                var res = jQuery.parseJSON(res);
                var markers_array = [];
                for (var i = res.length - 1; i >= 0; i--) {
                    if (res[i].VehicleType == "Ambulance") {var myIcon_cctv = L.icon({iconUrl: '../../images/ambulance.png',iconSize:[60,28],iconAnchor:[30,14]});}
                    if (res[i].VehicleType == "Patrol Unit") {var myIcon_cctv = L.icon({iconUrl: '../../images/patrolunit.png',iconSize:[60,28],iconAnchor:[30,14]});}
                    
                    var table = res[i].name;
                    markers_array.push(new L.marker([res[i].Northing,res[i].Easting]));
                    marker = new L.marker([res[i].Northing,res[i].Easting],{icon: myIcon_cctv}).bindPopup(table);
                    vehicles.addLayer(marker);
                }
            }
        });
        map.addLayer(vehicles);
    }*/
    // get_vehicles();

    //Define markers globally

    markers = L.featureGroup();

    var accidentIcon = L.icon({ iconUrl: '../../images/accident-marker.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] });
    var eventIcon = L.icon({ iconUrl: '../../images/event-marker.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] });
    var incidentIcon = L.icon({ iconUrl: '../../images/incident-marker.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] });
    var crimeIcon = L.icon({ iconUrl: '../../images/crime-marker.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] });
    var roadworkIcon = L.icon({ iconUrl: '../../images/roadwork-marker.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] });

    function mapMarker() {
        var currentdate = new Date();
        var date = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-"
            + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
        ////console.log(date);
        var isAccident = $('#check_acc').prop('checked') == false ? "0" : "1",
            isEvent = $('#check_event').prop('checked') == false ? "0" : "1",
            isIncident = $('#check_inc').prop('checked') == false ? "0" : "1",
            isRoadwork = $('#check_road').prop('checked') == false ? "0" : "1",
            isCrime = $('#check_crime').prop('checked') == false ? "0" : "1"

        $.ajax({
            url: '../../../models/situation/current_accidents.hh',
            type: 'POST',
            data: { current_time: date, isAccident: isAccident, isEvent: isEvent, isIncident: isIncident, isCrime: isCrime, isRoadwork: isRoadwork },
            success: function (res) {
                var res = jQuery.parseJSON(res);
                var markers_array = [];
                for (i = 0; i < res.length; i++) {
                    // if (res[i].isold == '1')
                    //     continue;
                    var scn = res[i].SystemCodeNumber;
                    var mid = res[i].Type;
                    var nor = res[i].Northing;
                    var eas = res[i].Easting;
                    var table = '<table class="map_table" id="' + res[i].SystemCodeNumber + '">';
                    table += '<tr><th>Key</th><th>Value</th></tr>';
                    $.each(res[i], function (k, v) {
                        if (res[i].Type == "accident" || res[i].Type == "incident" || res[i].Type == "crime") {
                            if (k == 'CreationDate' || k == 'EndDate' || k == 'ShortDescription' || k == 'LongDescription' || k == ' EndDate' || k == 'CreatedBy' || k == 'isold' || k == 'id' || k == 'Checklist' || k == 'Checklist_type' || k == 'Checklist_extra' || k == 'Informed' || k == 'Informed_time' || k == 'Arrived' || k == 'Arrived_time' || k == 'Resolved_time' || k == 'Resolved')
                                return true;
                            if (k == 'Northing')
                                table += "<tr><td>Latitude</td><td>" + v + "</td></tr>"
                            else if (k == 'Easting')
                                table += "<tr><td>Longitude</td><td>" + v + "</td></tr>"
                            else if (k == 'AccidentTime')
                                table += "<tr><td>AccidentTime</td><td>" + getFormattedDate(v, 'Y-m-d H:m:s', 'd/m/y H:m:s') + "</td></tr>"
                            else if (k != 'Action')
                                table += "<tr><td>" + k + "</td><td>" + v + "</td></tr>"
                        }

                        else {
                            if (k == 'CreationDate' || k == 'EndDate' || k == 'ShortDescription' || k == 'LongDescription' || k == ' EndDate' || k == 'CreatedBy' || k == 'isold' || k == 'id' || k == 'Checklist' || k == 'Checklist_type' || k == 'Checklist_extra' || k == 'Informed' || k == 'Informed_time' || k == 'Arrived' || k == 'Arrived_time' || k == 'Resolved_time' || k == 'Resolved')
                                return true;
                            if (k == 'Northing')
                                table += "<tr><td>Latitude</td><td>" + v + "</td></tr>"
                            else if (k == 'Easting')
                                table += "<tr><td>Longitude</td><td>" + v + "</td></tr>"
                            else if (k == 'PlannedStart') {
                                var planStartDate = v ? getFormattedDate(v, 'Y-m-d H:m:s', 'd/m/y H:m:s') : '--';
                                table += "<tr><td>Planned Start</td><td>" + planStartDate + "</td></tr>"
                            }
                            else if (k == 'PlannedEnd') {
                                var planEndDate = v ? getFormattedDate(v, 'Y-m-d H:m:s', 'd/m/y H:m:s') : '--';
                                table += "<tr><td>Planned End</td><td>" + planEndDate + "</td></tr>"
                            }
                            else if (k == 'ActualStart') {
                                var actualStartDate = v ? getFormattedDate(v, 'Y-m-d H:m:s', 'd/m/y H:m:s') : '--';
                                table += "<tr><td>Actual Start</td><td>" + actualStartDate + "</td></tr>"
                            }
                            else if (k == 'ActualEnd') {
                                var actualEndDate = v ? getFormattedDate(v, 'Y-m-d H:m:s', 'd/m/y H:m:s') : '--';
                                table += "<tr><td>Actual End</td><td>" + actualEndDate + "</td></tr>"
                            }
                            else if (k != 'Action' && k != 'AccidentTime')
                                table += "<tr><td>" + k + "</td><td>" + v + "</td></tr>"
                        }
                    });

                    if (res[i].isold == '0') {
                        // for (var i = 0; i < res_rel.length; i++) {
                        var name = res[i].Checklist_type,
                            informed = res[i].Informed,
                            arrived = res[i].Arrived,
                            resolved = res[i].Resolved;
                        ////console.log(name);
                        if (informed == "true" && name != "Nearest Camera" && name != "Nearest VMS") {
                            table += "<tr><td>" + name + "</td>";
                            if (arrived == "false") {
                                table += "<td><button mid='" + mid + "' scn='" + scn + "' chk_type='" + name + "' class='set_time btn btn-primary' style='background:#253654'>Arrived</button> &nbsp; &nbsp;";
                            }
                            else {
                                table += "<td><button class='btn btn-success' disabled>Arrived</button> &nbsp; &nbsp;";
                            }
                            if (resolved == "false") {
                                table += "<button mid='" + mid + "' scn='" + scn + "' chk_type='" + name + "' class='set_time btn btn-primary' style='background:#253654'>Resolved</button></td>";
                            }
                            else {
                                table += "<button class='btn btn-success' disabled>Resolved</button></td>";
                            }
                        }
                        else if (name == "Nearest Camera" || name == "Nearest VMS") {
                            // table += "<tr><td>" + name + "</td>";
                            // table += "<td><button mid='" + mid + "' scn='" + scn + "' nor='" + nor + "' eas='" + eas + "' chk_type='" + name + "' class='do_action btn btn-primary' style='background:#253654'>View</button> &nbsp; &nbsp;";
                        }
                        // else{
                        //     table += "<tr><td>" + name+"</td>";
                        //     table += "<td><button mid='"+mid+"' scn='"+scn+"' nor='"+nor+"' eas='"+eas+"' chk_type='"+name+"' class='do_action btn btn-primary' style='background:#253654'>View</button> &nbsp; &nbsp;";
                        // }
                        // }
                        table += '</table>';

                        table += '<br><div style="text-align:center"><a onclick="situationAwareness(\'' + scn + '\',\'' + mid + '\')" href="javascript:void(0)" class="btn btn-primary" style="margin:0 auto; color:#fff">Situational Awareness</a></div><br>';
                        table += "<button mid='" + mid + "' scn='" + scn + "' chk_type='" + name + "' stime='" + res[i].AccidentTime + "' ldesc='" + escape(res[i].LongDescription) + "' class='resolve_sit btn btn-primary' style='background:#253654;margin: 0 auto;display: block;margin-top: 5px;'>Resolve Situation</button>";
                    }
                    else {
                        table += "<tr><td>Report</td><td mid='" + mid + "' scn='" + scn + "' style='color:blue;'' class='view_report' >View Report</td></tr>";
                        table += '</table>';
                    }

                    var typeIcon = accidentIcon;
                    if (mid == "accident")
                        typeIcon = accidentIcon
                    else if (mid == "event")
                        typeIcon = eventIcon
                    else if (mid == "crime")
                        typeIcon = crimeIcon
                    else if (mid == "incident")
                        typeIcon = incidentIcon
                    else if (mid == "roadwork")
                        typeIcon = roadworkIcon
                    markers_array.push(new L.marker([res[i].Northing, res[i].Easting]))
                    marker = new L.marker([res[i].Northing, res[i].Easting], { icon: typeIcon }).bindPopup(table);
                    markers.addLayer(marker);
                }
                map.addLayer(markers);
                var markers_group = new L.featureGroup(markers_array);
                map.fitBounds(markers_group.getBounds().pad(0.05));
            }
        });
    }






    //mapMarker();

    $('input[name=checkgrp]').change(function () {
        if ($('input[name=checkgrp]').filter(':checked').length < 1) {
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Atleast one Situation Type should be Checked</div>'
            });
            // alert("Atleast one Situation Type should be Checked");
            $("#" + this.id).prop('checked', true);
            //  return true;
        }
        // change_mapmarker();
    });

    function onChangeSituationType(situationType) {
        if (situationType == "accident" || situationType == "incident" || situationType == "crime") {
            $('#planned_time_start').hide();
            $('#actual_time_start').hide();
            $('#planned_time_end').hide();
            $('#actual_time_end').hide();
            $('#situation_time').show();

        }
        if (situationType == "event" || situationType == "roadwork") {
            $('#situation_time').hide();
            $('#planned_time_start').show();
            $('#actual_time_start').show();
            $('#planned_time_end').show();
            $('#actual_time_end').show();
        }
        if (situationType == "event" || situationType == "incident" || situationType == "roadwork") {
            $('.north_end').show();
            $('.east_end').show();
        }
        if (situationType == "accident" || situationType == "crime") {
            $('.north_end').css("display", "none")
            $('.east_end').css("display", "none")
        }
    }




    function change_mapmarker() {
        var currentdate = new Date();
        var date = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-"
            + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

        map.removeLayer(markers);

        if (!$('input[name=checkgrp]:checked').length > 0) {
            // mapMarker();
            return;
        }
        markers = L.featureGroup();

        var isAccident = $('#check_acc').prop('checked') == false ? "0" : "1",
            isEvent = $('#check_event').prop('checked') == false ? "0" : "1",
            isIncident = $('#check_inc').prop('checked') == false ? "0" : "1",
            isRoadwork = $('#check_road').prop('checked') == false ? "0" : "1",
            isCrime = $('#check_crime').prop('checked') == false ? "0" : "1"

        $.ajax({
            url: '../../../models/situation/current_accidents.hh',
            type: 'POST',
            data: { current_time: date, isAccident: isAccident, isEvent: isEvent, isIncident: isIncident, isCrime: isCrime, isRoadwork: isRoadwork, searchlat: searchlat, searchlng: searchlng },
            success: function (res) {

                var res = jQuery.parseJSON(res);
                var markers_array = [];
                for (i = 0; i < res.length; i++) {
                    // if (res[i].isold == '1')
                    //     continue;

                    var scn = res[i].SystemCodeNumber;
                    var mid = res[i].Type;
                    var nor = res[i].Northing;
                    var eas = res[i].Easting;
                    var table = '<table class="map_table" id="' + res[i].SystemCodeNumber + '">';
                    table += '<tr><th>Key</th><th>Value</th></tr>';

                    $.each(res[i], function (k, v) {

                        if (res[i].Type == "accident" || res[i].Type == "incident" || res[i].Type == "crime") {
                            if (k == 'CreationDate' || k == 'EndDate' || k == 'ShortDescription' || k == 'LongDescription' || k == ' EndDate' || k == 'CreatedBy' || k == 'isold' || k == 'id' || k == 'Checklist' || k == 'Checklist_type' || k == 'Checklist_extra' || k == 'Informed' || k == 'Informed_time' || k == 'Arrived' || k == 'Arrived_time' || k == 'Resolved_time' || k == 'Resolved')
                                return true;
                            if (k == 'Northing')
                                table += "<tr><td>Latitude</td><td>" + v + "</td></tr>"
                            else if (k == 'Easting')
                                table += "<tr><td>Longitude</td><td>" + v + "</td></tr>"
                            else if (k == 'AccidentTime')
                                table += "<tr><td>AccidentTime</td><td>" + getFormattedDate(v, 'Y-m-d H:m:s', 'd/m/y H:m:s') + "</td></tr>"
                            else if (k != 'Action')
                                table += "<tr><td>" + k + "</td><td>" + v + "</td></tr>"
                        }

                        else {
                            if (k == 'CreationDate' || k == 'EndDate' || k == 'ShortDescription' || k == 'LongDescription' || k == ' EndDate' || k == 'CreatedBy' || k == 'isold' || k == 'id' || k == 'Checklist' || k == 'Checklist_type' || k == 'Checklist_extra' || k == 'Informed' || k == 'Informed_time' || k == 'Arrived' || k == 'Arrived_time' || k == 'Resolved_time' || k == 'Resolved')
                                return true;
                            if (k == 'Northing')
                                table += "<tr><td>Latitude</td><td>" + v + "</td></tr>"
                            else if (k == 'Easting')
                                table += "<tr><td>Longitude</td><td>" + v + "</td></tr>"
                            else if (k == 'PlannedStart') {
                                var planStartDate = v ? getFormattedDate(v, 'Y-m-d H:m:s', 'd/m/y H:m:s') : '--';
                                table += "<tr><td>Planned Start</td><td>" + planStartDate + "</td></tr>"
                            }
                            else if (k == 'PlannedEnd') {
                                var planEndDate = v ? getFormattedDate(v, 'Y-m-d H:m:s', 'd/m/y H:m:s') : '--';
                                table += "<tr><td>Planned End</td><td>" + planEndDate + "</td></tr>"
                            }
                            else if (k == 'ActualStart') {
                                var actualStartDate = v ? getFormattedDate(v, 'Y-m-d H:m:s', 'd/m/y H:m:s') : '--';
                                table += "<tr><td>Actual Start</td><td>" + actualStartDate + "</td></tr>"
                            }
                            else if (k == 'ActualEnd') {
                                var actualEndDate = v ? getFormattedDate(v, 'Y-m-d H:m:s', 'd/m/y H:m:s') : '--';
                                table += "<tr><td>Actual End</td><td>" + actualEndDate + "</td></tr>"
                            }
                            else if (k != 'Action' && k != 'AccidentTime')
                                table += "<tr><td>" + k + "</td><td>" + v + "</td></tr>"
                        }
                    });

                    if (res[i].isold == '0') {
                        // for (var i = 0; i < res_rel.length; i++) {
                        var name = res[i].Checklist_type,
                            informed = res[i].Informed,
                            arrived = res[i].Arrived,
                            resolved = res[i].Resolved;
                        ////console.log(name);
                        if (informed == "true" && name != "Nearest Camera" && name != "Nearest VMS") {
                            table += "<tr><td>" + name + "</td>";
                            if (arrived == "false") {
                                table += "<td><button mid='" + mid + "' scn='" + scn + "' chk_type='" + name + "' class='set_time btn btn-primary' style='background:#253654'>Arrived</button> &nbsp; &nbsp;";
                            }
                            else {
                                table += "<td><button class='btn btn-success' disabled>Arrived</button> &nbsp; &nbsp;";
                            }
                            if (resolved == "false") {
                                table += "<button mid='" + mid + "' scn='" + scn + "' chk_type='" + name + "' class='set_time btn btn-primary' style='background:#253654'>Resolved</button></td>";
                            }
                            else {
                                table += "<button class='btn btn-success' disabled>Resolved</button></td>";
                            }
                        }
                        else if (name == "Nearest Camera" || name == "Nearest VMS") {
                            // table += "<tr><td>" + name + "</td>";
                            // table += "<td><button mid='" + mid + "' scn='" + scn + "' nor='" + nor + "' eas='" + eas + "' chk_type='" + name + "' class='do_action btn btn-primary' style='background:#253654'>View</button> &nbsp; &nbsp;";
                        }
                        // else{
                        //     table += "<tr><td>" + name+"</td>";
                        //     table += "<td><button mid='"+mid+"' scn='"+scn+"' nor='"+nor+"' eas='"+eas+"' chk_type='"+name+"' class='do_action btn btn-primary' style='background:#253654'>View</button> &nbsp; &nbsp;";
                        // }
                        // }
                        table += '</table>';
                        table += '<br><div style="text-align:center"><a onclick="situationAwareness(\'' + scn + '\',\'' + mid + '\')" href="javascript:void(0)" class="btn btn-primary" style="margin:0 auto; color:#fff">Situational Awareness</a></div><br>';
                        table += "<button mid='" + mid + "' scn='" + scn + "' chk_type='" + name + "' stime='" + res[i].AccidentTime + "' ldesc='" + escape(res[i].LongDescription) + "' class='resolve_sit btn btn-primary' style='background:#253654;margin: 0 auto;display: block;margin-top: 5px;'>Resolve Situation</button>";
                    }
                    else {
                        table += "<tr><td>Report</td><td mid='" + mid + "' scn='" + scn + "' style='color:blue;'' class='view_report' >View Report</td></tr>";
                        table += '</table>';
                    }

                    var typeIcon = accidentIcon;
                    if (mid == "accident")
                        typeIcon = accidentIcon
                    else if (mid == "event")
                        typeIcon = eventIcon
                    else if (mid == "crime")
                        typeIcon = crimeIcon
                    else if (mid == "incident")
                        typeIcon = incidentIcon
                    else if (mid == "roadwork")
                        typeIcon = roadworkIcon
                    markers_array.push(new L.marker([res[i].Northing, res[i].Easting]))
                    marker = new L.marker([res[i].Northing, res[i].Easting], { icon: typeIcon }).bindPopup(table);
                    markers.addLayer(marker);
                }
                // fetch_accdata();
                map.addLayer(markers);
                var markers_group = new L.featureGroup(markers_array);
                ////console.log(markers_group);
                map.fitBounds(markers_group.getBounds().pad(0.05));


            }
        });
    }

    // change_mapmarker()

    $(document).on('click', ".set_time", function () {
        var val = $(this)[0].innerHTML;
        var chk = $(this).attr("chk_type");
        var scn = $(this).attr("scn");
        var mid = $(this).attr("mid");
        ////console.log("CHK"+chk+"Val"+val+"SCN"+scn+"Mid"+mid);
        $.ajax({
            url: '../../../models/situation/update_accident_relation.hh',
            method: 'POST',
            data: { SystemCodeNumber: scn, MainID: mid, Checklist: chk, Value: val },
            success: function (res) {
                // return;
                $.alert({
                    type: 'green',
                    title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
                    content: '<div class="fw-bold">Recorded Successfully</div>'
                });
                location.reload();
            }
        });
    })
    $(document).on('click', ".resolve_sit", function () {
        var scn = $(this).attr("scn");
        var mid = $(this).attr("mid");
        var AccidentTime = $(this).attr("stime");
        var ldesc = $(this).attr("ldesc")
        ////console.log("CHK"+chk+"Val"+val+"SCN"+scn+"Mid"+mid);
        $.ajax({
            url: '../../../models/situation/resolve_accident.hh',
            method: 'POST',
            data: { SystemCodeNumber: scn, MainID: mid, AccidentTime: AccidentTime, LongDescription: ldesc },
            success: function (res) {
                if (res == 'S') {
                    $.alert({
                        type: 'green',
                        title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
                        content: '<div class="fw-bold">Recorded Successfully</div>'
                    });
                    location.reload();
                } else {
                    $.alert({
                        type: 'red',
                        title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                        content: '<div class="fw-bold">Failed to update,please try again later</div>'
                    });
                }
            }
        });
    })

    $(document).on('click', ".view_report", function () {
        var scn = $(this).attr("scn");
        var mid = $(this).attr("mid");
        $("#viewReportModal #name_modal")[0].innerHTML = scn;
        $("#chk_modal tbody").empty();
        $.ajax({
            url: '../../../models/situation/performance_reports.hh',
            method: 'POST',
            data: { SystemCodeNumber: scn, MainID: mid },
            success: function (res) {
                res = jQuery.parseJSON(res);
                var table = "";
                for (var i = 0; i < res.length; i++) {
                    $("#action_modal")[0].innerHTML = res[i].Action;
                    if (res[i].Checklist_type != "Nearest Camera" || res[i].Checklist_type != "Nearest VMS") {
                        table += "<tr><td>";
                        if (res[i].Checklist_type != '' && res[i].Checklist_type != null && res[i].Checklist_type != 'null') {
                            table += res[i].Checklist_type;
                        } else {
                            table += 'N/A';
                        }
                        table += "</td><td>";
                        if (res[i].Informed != '' && res[i].Informed != null && res[i].Informed != 'null') {
                            table += res[i].Informed;
                        } else {
                            table += 'N/A';
                        }
                        table += "</td><td>";
                        if (res[i].Informed_time != '' && res[i].Informed_time != null && res[i].Informed_time != 'null') {
                            table += getFormattedDate(res[i].Informed_time, 'Y-m-d H:m:s', 'd-m-y H:m:s');
                        } else {
                            table += 'N/A';
                        }
                        table += "</td><td>";
                        if (res[i].Arrived != '' && res[i].Arrived != null && res[i].Arrived != 'null') {
                            table += res[i].Arrived;
                        } else {
                            table += 'N/A';
                        }
                        table += "</td><td>";
                        if (res[i].Arrived_time != '' && res[i].Arrived_time != null && res[i].Arrived_time != 'null') {
                            table += getFormattedDate(res[i].Arrived_time, 'Y-m-d H:m:s', 'd-m-y H:m:s');
                        } else {
                            table += 'N/A';
                        }
                        table += "</td><td>";
                        if (res[i].Resolved != '' && res[i].Resolved != null && res[i].Resolved != 'null') {
                            table += res[i].Resolved;
                        } else {
                            table += 'N/A';
                        }
                        table += "</td><td>";
                        if (res[i].Resolved_time != '' && res[i].Resolved_time != null && res[i].Resolved_time != 'null') {
                            table += getFormattedDate(res[i].Resolved_time, 'Y-m-d H:m:s', 'd-m-y H:m:s');
                        } else {
                            table += 'N/A';
                        }
                        table += "</td></tr>";
                    }
                    else {
                        table += "<tr><td>" + res[i].Checklist_type + "</td><td>N/A</td><td>N/A</td><td>N/A</td><td>N/A</td><td>N/A</td><td>N/A</td></tr>";
                    }
                }
                $("#chk_modal tbody").append(table);
                $("#viewReportModal").modal();
            }
        })
    })

    $(document).on('click', ".do_action", function () {
        var val = $(this)[0].innerHTML,
            chk = $(this).attr("chk_type"),
            scn = $(this).attr("scn"),
            mid = $(this).attr("mid"),
            nor = $(this).attr("nor"),
            eas = $(this).attr("eas");
        ////console.log("CHK"+chk+"Val"+val+"SCN"+scn+"Mid"+mid);
        console.log('do')
        $.ajax({
            url: '../../../models/situation/get_accident_types.hh',
            method: 'POST',
            success: function (res) {
                res = jQuery.parseJSON(res);
                for (var i = 0; i < res.length; i++) {
                    if (res[i].name == chk) {
                        if (chk == "Nearest Camera" && res[i].action == "cctvWindow.html") {
                            var distance_vms = 0, distance_cctv = 0, vms_ip = "", cctv_ip = "", nvr_ip = "", channel = "", vms_scn = "", cctv_scn = "";
                            $.ajax({
                                url: '../../../models/cctv/cctv_devices.hh',
                                type: 'POST',
                                success: function (result) {
                                    var devices_set = jQuery.parseJSON(result);
                                    for (i = devices_set.length - 1; i >= 0; i--) {
                                        lat = devices_set[i].Northing
                                        lng = devices_set[i].Easting
                                        ////console.log(getHaversineDist(lat,lng,nor,eas));
                                        if (distance_cctv == 0 || distance_cctv > getHaversineDist(lat, lng, nor, eas)) {
                                            distance_cctv = getHaversineDist(lat, lng, nor, eas);
                                            cctv_ip = devices_set[i].IPAddress;
                                            nvr_ip = devices_set[i].NVRIPAddress;
                                            channel = devices_set[i].Channel;
                                            cctv_scn = devices_set[i].SystemCodeNumber;
                                        }
                                    }
                                    ////console.log(distance_cctv+":::"+cctv_ip+":::"+cctv_scn+":::"+port);
                                    url = "../cctv/cctvWindow.html?ip=" + nvr_ip + "&channel=" + channel;
                                    window.open(url, '_blank');
                                }
                            });

                        }
                        else if (chk == "Nearest VMS" && res[i].action == "vms_display_msg.html") {
                            var distance_vms = 0, distance_cctv = 0, vms_ip = "", cctv_ip = "", nvr_ip = "", channel = "", vms_scn = "", cctv_scn = "";
                            nor = $('#add_northing')[0].innerHTML;
                            eas = $('#add_easting')[0].innerHTML;
                            $.ajax({
                                url: '../../../models/vms/vms_devices.hh',
                                type: 'POST',
                                success: function (result) {
                                    var devices_set = jQuery.parseJSON(result);
                                    for (i = devices_set.length - 1; i >= 0; i--) {
                                        lat = devices_set[i].Northing;
                                        lng = devices_set[i].Easting;
                                        ////console.log(getHaversineDist(lat,lng,nor,eas));
                                        if (distance_vms == 0 || distance_vms > getHaversineDist(lat, lng, nor, eas)) {
                                            distance_vms = getHaversineDist(lat, lng, nor, eas);
                                            vms_ip = devices_set[i].IPAddress;
                                            vms_scn = devices_set[i].SystemCodeNumber;
                                        }
                                    }
                                    ////console.log(distance_vms+":::"+vms_ip+":::"+vms_scn);
                                    url = "../html/vms_display_msg.html?vms_scn=" + vms_scn;
                                    window.open(url, '_blank');
                                }
                            });

                        }
                        else {
                            $.alert({
                                type: 'red',
                                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                                content: '<div class="fw-bold">Call ' + res[i].action + '</div>'
                            });
                            val = "Informed";
                            $.ajax({
                                url: '../../../models/situation/update_accident_relation.hh',
                                method: 'POST',
                                data: { SystemCodeNumber: scn, MainID: mid, Checklist: chk, Value: val },
                                success: function (res) {
                                    $.alert({
                                        type: 'green',
                                        title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
                                        content: '<div class="fw-bold">Recorded Successfully</div>'
                                    });
                                    location.reload();
                                }
                            });
                        }
                    }
                }
            }
        });

    })
    //
    $("#action_complete").click(function () {
        var scn = situationSCN,
            tid = sanitize($('#typeOrder').val()),
            // aid=$('.action_id').val(),
            mid = sanitize($('#main_type').val()).toLowerCase(),
            data_entry_list = [];
        for (var i = list_types.length - 1; i >= 0; i--) {
            var data_objects = {};
            ////console.log($("#td_list"+i)[0].innerHTML.toString()+$("#check_list"+i).is(":checked"));
            data_objects['item'] = $("#td_list" + i)[0].innerHTML.toString();
            data_objects['value'] = $("#check_list_id" + i).is(":checked");
            data_entry_list.push(data_objects);
        }
        $.ajax({
            url: '../../../models/situation/add_accident_relation.hh',
            method: 'POST',
            data: { SystemCodeNumber: scn, MainID: mid, TypeId: tid, Action: aid, Checklist: data_entry_list },
            success: function (res) {
                $.alert({
                    type: 'green',
                    title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
                    content: '<div class="fw-bold">Situation recorded successfully</div>'
                });
                // location.reload();
                $('#chklistModal').modal('toggle');
            }
        });
    })
    //range slider
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


    //Date picker
    var logic = function (currentDateTime) {
        if (currentDateTime && currentDateTime.getDay() == 6) {
            this.setOptions({
                minTime: '11:00'
            });
        } else
            this.setOptions({
                minTime: '8:00'
            });
    };
    $('.datepicker').datetimepicker({
        format: 'd-m-Y H:i:s',
        onChangeDateTime: logic,
        onShow: logic
    });

    //Adding accident
    $.ajax({
        url: '../../../models/utils/get_username.hh',
        type: 'POST',
        success: function (result) {
            result = JSON.parse(result);
            /*if(result.length > 30){
                    window.location = "../index.html"
            }*/
            uname = result.user.trim();
        }

    })

    $('#add_acc_btn').click(function () {

        var plannedEnd = sanitize($('.planned_end').val());
        var plannedStart = sanitize($('#planned_start').val());
        var situationType = sanitize($('#main_type').val());
        situationType = situationType ? situationType.toLowerCase() : situationType;

        if ((situationType == "event" || situationType == "roadwork") && !plannedStart) {
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Planned Start Date is Required</div>'
            });
            return;
        }


        // formdata.preventDefault();
        var myFormData = new FormData();


        var form_add = $('#add-form');
        nor = $('#add_northing')[0].innerHTML;
        eas = $('#add_easting')[0].innerHTML;
        //if (form_add.parsley().isValid()){
        //console.log ('valid');
        if ($('.scn').val() != undefined && $('.scn').val() != null && $('.scn').val() != '') {
            var mscn = sanitize($('.scn').val());
        } else {
            var mscn = '';
        }
        var scn = mscn,
            // var scn = $('#main_type').val().toUpperCase(),
            sdesc = sanitize($('.sdesc').val()),
            ldesc = sanitize($('.ldesc').val()),
            nor = sanitize($('#add_northing').val()),
            eas = sanitize($('#add_easting').val()),
            norend = sanitize($('#northingEnd').val()),
            easend = sanitize($('#eastingEnd').val()),

            mid = sanitize($('#main_type').val()).toLowerCase(),
            tid = sanitize($('#typeOrder').val()),
            // aid=$('.action_id').val(),
            accDT = sanitize($('.acc_datetime').val()),
            PlannedStart = sanitize($('#planned_start').val()),
            PlannedEnd = sanitize($('#planned_end').val()),
            ActualStart = sanitize($('#actual_start').val()),
            ActualEnd = sanitize($('#actual_end').val()),
            edate = $('.end_datetime').val(),
            edate = "",
            sev = sanitize($('#severity').val()),
            trnsprt_links = $('#tlink').val()
            //uname='Admin';
            rep = uname;
        ////console.log($('#typeOrder'));
        //alert("TID"+$('#typeOrder'));
        if (nor == "0" || eas == "0"|| nor == ''||eas=='') {
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Coordinates not entered. Please add a marker at the situation location</div>'
            });
            return;
        }
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
        if (accDT) {
            accDT = sanitize(getFormattedDate($('.acc_datetime').val(), 'd-m-y H:m:s', 'Y-m-d H:m:s'));
        }
        if (PlannedEnd != "" && PlannedStart > PlannedEnd) {
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Planned End Time should be greater than Planned Start Time</div>'
            });
            return;
        }
        if (ActualStart != "" && ActualEnd != "" && ActualStart > ActualEnd) {
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Actual End Time should be greater than Acual Start Time</div>'
            });
            return;
        }

        var currentdate = new Date();
        var datetime = currentdate.getFullYear() + "-" + ((currentdate.getMonth() + 1) < 10 ? '0' : '') + (currentdate.getMonth() + 1) + "-"+ ((currentdate.getDate() + 1) < 10 ? '0' : '') +
            + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
        if ((mid == "accident" || mid == "incident" || mid == "crime") && (accDT > datetime)) {
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Start time cannot be a future time for this Situation. Please enter correct time.</div>'
            });
            return;
        }

        if (sev == "0") {
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">please enter severity</div>'
            });
        }
        else {
            for (var i = 0; i < $('#images').prop('files').length; i++) {
                myFormData.append('imageFiles[]', $('#images').prop('files')[i]);
            }
            myFormData.append('SystemCodeNumber', scn)
            myFormData.append('ShortDescription', sdesc)
            myFormData.append('LongDescription', ldesc)
            myFormData.append('MainID', mid)
            myFormData.append('Northing', nor)
            myFormData.append('Easting', eas)
            myFormData.append('NorthingEnd', norend)
            myFormData.append('EastingEnd', easend)

            // myFormData.append('Action',aid)
            myFormData.append('TypeID', tid)
            myFormData.append('AccidentTime', accDT)
            myFormData.append('PlannedStart', PlannedStart)
            myFormData.append('PlannedEnd', PlannedEnd)
            myFormData.append('ActualStart', ActualStart)
            myFormData.append('ActualEnd', ActualEnd)
            myFormData.append('CreatedBy', uname)
            myFormData.append('EndDate', edate)
            myFormData.append('Severity', sev)
            myFormData.append('ReportedBy', rep)
            myFormData.append('isedit', 0)
            myFormData.append('ModifiedBy', uname)
            myFormData.append('CreationDate', datetime)
            myFormData.append('LatLngRouteJson', latlngroutes)
            myFormData.append('transport_links', trnsprt_links) //Passing the transport links scn as comma seperated values
            myFormData.append('LatLngRouteJson', latlngroutes)
            myFormData.append('call_id',getQueryString('call_id'))
            myFormData.append('src_type',source_type)

            // console.log(myFormData)
            $.ajax({
                url: '../../../models/situation/add_accident_scn.hh',
                method: 'POST',
                processData: false,
                contentType: false,
                data: myFormData,
                success: function (res) {
                    if (res.trim().indexOf("ACCIDENT") == -1 && res.trim().indexOf("CRIME") == -1 && res.trim().indexOf("EVENT") == -1 && res.trim().indexOf("INCIDENT") == -1 && res.trim().indexOf("ROADWORK") == -1) {
                        $.alert({
                            type: 'red',
                            title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                            content: '<div class="fw-bold">Sorry, there has been a technical problem. Please report this error by sending an email to support@itspe.co.in with a screen shot</div>'
                        });
                        return;
                    }
                    $('#add_modal').modal('toggle');
                    // checklist_popup(res.trim(),tid,aid)
                    situationSCN = res.trim()
                    //location.reload();
                    myFormData = new FormData()
                    $('.close_route').click();
                    // change_mapmarker();
                    $.alert({
                        
                        type: 'green',
                        title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
                      
						content: '<a href="situation_details.html?scn='+situationSCN+'&type=accident">'+situationSCN+'</a>  has been created. Please click on the link to view the accident details..',
						// <a href="situation_details.html?scn='+scn+'">'+sc,
						
                        buttons: {
                            OK: function () {
                                if(source_type=='alert_vids')
                                    window.location.href='../../html/home/'+source_link;
                                else if(source_type=='vids')
                                    window.location.href='../../html/vids/'+source_link;
                                else if(source_type=='ecb')
                                    window.location.href='../../html/ecb/'+source_link;
                                else
                                    window.close()
                            }
                        }
                    });
                }
            });
        }
        //
        //console.log ('invalid');
        //}
    })

    // $.ajax({
    //     url:'../get_all_situtations.php',
    //     method:'POST',
    //     success:function(res){
    //         res = JSON.parse(res)

    //     }
    // })

    $.ajax({
        url: '../../../models/situation/get_utmc_types.hh',
        method: 'POST',
        data: { type: "accident" },
        success: function (res) {
            res = jQuery.parseJSON(res);
            $('#typeOrder').empty();
            for (var i = 0; i < res.length; i++) {
                $('#typeOrder').append('<option value=' + res[i].accident_type_id + '>' + res[i].accident_type.toLowerCase().capitalize() + '</option>');
                //$('.up_type_id').append('<option value='+res[i].TypeID+'>'+res[i].name+'</option>');
            }
            onChangeSituationType("accident");
        }
    });
    $('#main_type').change(function () {

        var selected_option = sanitize($('#main_type').val());
        selected_option = selected_option.toLowerCase();

        /*$.ajax({
            url:'../../../models/situation/get_all_situations.hh',
            method:'GET',      
            data:{type:selected_option},        
            success:function(res){
                map.removeLayer(markers);
                markers=L.featureGroup();
                var res = jQuery.parseJSON(res);
                var markers_array = [];
                for (var i = res.accident_data.length - 1; i >= 0; i--) {
                    if(selected_option == 'accident'){var myIcon_cctv = L.icon({iconUrl: '../../images/accident.png',iconSize:[30,28],iconAnchor:[30,14]});}
                    if(selected_option == 'event'){var myIcon_cctv = L.icon({iconUrl: '../../images/event.png',iconSize:[30,28],iconAnchor:[30,14]});}
                    if(selected_option == 'incident'){var myIcon_cctv = L.icon({iconUrl: '../../images/incident.png',iconSize:[30,28],iconAnchor:[30,14]});}
                    if(selected_option == 'roadwork'){var myIcon_cctv = L.icon({iconUrl: '../../images/roadwork.png',iconSize:[30,28],iconAnchor:[30,14]});}
                    if(selected_option == 'crime'){var myIcon_cctv = L.icon({iconUrl: '../../images/crime.png',iconSize:[30,28],iconAnchor:[30,14]});}
                    var table = '<table class="map_table" id="' + res.accident_data[i].SystemCodeNumber + '">';
                    table += '<tr><th>System Code Number</th><th>' + res.accident_data[i].SystemCodeNumber + '</th></tr>';
                    var module = "'"+selected_option+"'";
                    var SystemCodeNumber = "'"+res.accident_data[i].SystemCodeNumber+"'";
                    var fault_scn = "'"+res.accident_data[i].fault_scn+"'";
                    table += '<tr><th><button onclick="viewClick('+module+',' + SystemCodeNumber + ')">View details</button></th><th><button onclick="sopClick('+module+',' + fault_scn + ')">View sop</button></th></tr>';
                    table += '</table>';
                    markers_array.push(new L.marker([res.accident_data[i].Northing,res.accident_data[i].Easting]));
                    marker = new L.marker([res.accident_data[i].Northing,res.accident_data[i].Easting],{icon: myIcon_cctv}).bindPopup(table);
                    markers.addLayer(marker);
                }
                map.addLayer(markers);
                var markers_group = new L.featureGroup(markers_array);
                map.fitBounds(markers_group.getBounds().pad(0.05));
            }
        })*/
        $('.scn').val(selected_option.substring(0, 1).toUpperCase())
        ////console.log(selected_option);
        if (selected_option != "") {

            $.ajax({
                url: '../../../models/situation/get_utmc_types.hh',
                method: 'POST',
                data: { type: selected_option },
                success: function (res) {
                    res = jQuery.parseJSON(res);
                    $('#typeOrder').empty();
                    for (var i = 0; i < res.length; i++) {
                        $('#typeOrder').append('<option value=' + res[i].accident_type_id + '>' + res[i].accident_type.toLowerCase().capitalize() + '</option>');
                        //$('.up_type_id').append('<option value='+res[i].TypeID+'>'+res[i].name+'</option>');
                    }
                    onChangeSituationType(selected_option);
                }
            });
        }
        else {
            $('#typeOrder').empty();
        };
    })

    //Capitalize
    String.prototype.capitalize = function () {
        return this.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
    };
    //
    //Haversine Distance
    function getHaversineDist(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }
    //Degree to Radian Conversion // Haversine
    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }
    fetch_accdata = function () {
        var isAccident = $('#check_acc').prop('checked') == false ? "0" : "1",
            isEvent = $('#check_event').prop('checked') == false ? "0" : "1",
            isIncident = $('#check_inc').prop('checked') == false ? "0" : "1",
            isRoadwork = $('#check_road').prop('checked') == false ? "0" : "1",
            isCrime = $('#check_crime').prop('checked') == false ? "0" : "1";
        $('#dataTable').dataTable().fnDestroy();
        $('#dataTable').DataTable({
            "processing": true,
            "serverSide": true,
            "searching": false,
            "columnDefs": [{ orderable: false, targets: [1, 2, 4] }],
            "language": {
                "emptyTable": "No data"
            },
            "order": [[3, "desc"]],
            "ajax": {
                "url": "../../../models/situation/current_accidents_list.hh",
                "type": "POST",
                "data": function (d) {
                    d.isAccident = isAccident
                    _isAccident = d.isAccident

                    d.isEvent = isEvent
                    _isEvent = d.isEvent

                    d.isIncident = isIncident
                    _isIncident = d.isIncident

                    d.isRoadwork = isRoadwork
                    _isRoadwork = d.isRoadwork

                    d.isCrime = isCrime
                    _isCrime = d.isCrime

                    d.searchlat = searchlat
                    _searchlat = d.searchlat

                    d.searchlng = searchlng
                    _searchlng = d.searchlng
                }
            },
            "columns": [
                { "data": "SystemCodeNumber", render: renderScn },
                { "data": "Type", render: renderCase },
                { "data": "ShortDescription" },
                { "data": "AccidentTime", render: renderDate },
                { "data": "SystemCodeNumber", render: renderAction }
            ]
        });
        function renderDate(data, type, full, meta) {
            return getFormattedDate(data, 'Y-m-d H:m:s', 'd-m-y H:m:s');
        }
        function renderCase(data, type, full, meta) {
            return toTitleCase(data);
        }
        function renderScn(data, type, full, meta) {
            return '<a href="situation_details.html?scn=' + data + '&type=' + full.Type + '">' + data + '</a>';
        }
        function renderAction(data, type, full, meta) {
            return '<a href="view_details.html?id=' + data + '&module=' + full.Type + '&source=situation_home">Edit Details</a>';
        }
    }
    $('#cancel_acc_btn').click(function () {
        $('#add_situation_container').hide();
        $('#situation_detail_table').show();
        $('.close_route').click();
        showMarkers();
    })
    $('#add_situations').click(function () {
        $('#add_situation_container').show();
        $('#situation_detail_table').hide();
        removeMarkers();

    })
    // $('#direction').change(function(){
    // fetchLinks(); 
    // })
    // onChange event
    // $('#tlink').change(()=>{
    // let links = [];
    // let bounds = [];
    // bounds.push([$("#add_northing").val(),$("#add_easting").val()])
    // links = $('#tlink').val();
    // polyLines.clearLayers();
    // randomColor=[];
    // for(link of links){
    // bounds.push(transport_links[link]);
    // let line_color = randomColorGenerator();
    // if(!randomColor.includes(line_color)){
    // randomColor.push(line_color)
    // }else{
    //     while(!randomColor.includes(line_color)){
    //         line_color = randomColorGenerator();
    //     }
    //     randomColor.push(line_color)
    // }
    // polyLines.addLayer(L.polyline(transport_links[link], {color: line_color,className:'link_identifier'}).bindPopup(link).openPopup().on('click', function(){
    //     if($(this.getElement()).attr('up')==1){
    //         $(this.getElement()).attr('up',0);
    //         this.setStyle({
    //             color: line_color
    //         });
    //         console.log($('#tlink option[value="'+link+'"]'),'false')
    //     }else{
    //         $(this.getElement()).attr('up',1);
    //         this.setStyle({
    //             color: 'red',
    //             opacity: 1,
    //             weight: 5
    //         });
    //         // $('#tlink option[value="'+link+'"]').attr('selected',true)
    //         console.log($('#tlink option[value="'+link+'"]'),'true')
    //     }
    //     $(this.getElement()).attr('SCN',link);
        
        
    // }));
    // }
    // polyLines.addTo(map);
    // map.fitBounds(bounds);
    // $('#tlink option:selected').each(function(k,v){
        
    // })
    // })
// setTimeout(fetchLinks(),1500)

            
})
function situationAwareness(scn, mid) {
    window.open('situation_awareness.html?scn=' + scn + '&type=' + mid, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width=" + $(window).width() + ",height=" + $(window).height());
}

function viewClick(nmodule, nsid) {
    //window.open('view_details.html?module=accident&id=' + nsid);
    window.location.href = 'view_details.html?module=accident&id=' + nsid;
}

function sopClick(nmodule, nsid) {
    window.open('sop.html?faultid=' + nsid);
}



//To fetch the links and populate on the map
function fetchLinks(){
let direction = $('#direction').val();
let northing = $("#add_northing").val()
let easting = $("#add_easting").val()
$.ajax({
    'url':'../../../models/situation/get_transport_links.hh',
    'data':{direction:direction,easting:easting,northing:northing},
    success:function(res){
    $('#tlink').html(''); //Empty the select when there is a change in marker postion
    $('#tlink').append('<option value="">Select a Link</option>');
    res = JSON.parse(res);
    let links = [];
    let bounds = []; //To store all the bounds for map to set the view after showing the polylines
    bounds.push([$("#add_northing").val(),$("#add_easting").val()]) 
    polyLines.clearLayers(); //Clear the current layers from the group
    randomColor=['red']; //Will make randomColor variable default by adding red color to it
        for(link of res){  
            bounds.push(link.path);
            transport_links[link.SystemCodeNumber] = link.path;
            // $('#tlink').append('<option id="'+link.SystemCodeNumber+'" value="'+link.SystemCodeNumber+'">'+link.SystemCodeNumber+'</option>')
            let line_color = randomColorGenerator(); //Random color hex value
            if(!randomColor.includes(line_color)){
            randomColor.push(line_color)
            }else{
                while(!randomColor.includes(line_color)){
                    line_color = randomColorGenerator();
                }
                randomColor.push(line_color)
            }
            let t_layer = L.polyline(link.path, {color:line_color,className:'link_identifier'}).bindPopup(link.SystemCodeNumber).openPopup().on('click', function(){
                let lscn = this._popup._content;
                if(selectedLinks.includes(lscn)){ //Check if the scn exists in selectedLinks
                    // $(this.getElement()).attr('up',0); 
                    this.setStyle({
                        color: line_color,
                        opacity: 1,
                        weight: 3
                    });
                    $('#'+lscn).attr('selected',false)
                    $(this.getElement()).removeAttr('up');
                    remove_array_element(selectedLinks,lscn)
                }else{
                    selectedLinks.push(lscn);
                    // $(this.getElement()).attr('up',1);
                    this.setStyle({
                        color: 'red',
                        opacity: 0.8,
                        weight: 4.5

                    });
                    $('#'+lscn).attr('selected',true)
                }
                $('#tlink').html(''); //Clear the dropdown
                for(const ll of selectedLinks){ 
                    $('#tlink').append('<option id="'+ll+'" selected value="'+ll+'">'+ll+'</option>') //Populate the link scn which are selected
                }                
            });
            tlayers[link.SystemCodeNumber]=t_layer; //add to layers holder tLayers
            polyLines.addLayer(t_layer);
        }
    polyLines.addTo(map);
    map.fitBounds(bounds);
    }
})
}

function showMarkers(){
map.addLayer(markers)
}

function removeMarkers(){
map.removeLayer(markers)
}

function randomColorGenerator(){ //Create a random color hex value 
return '#'+Math.floor(Math.random()*16777215).toString(16);
}

function remove_array_element(array, n) //remove item from array
 {
   var index = array.indexOf(n);
   if (index > -1) {
    array.splice(index, 1);
}
   return array;
 }

 setTimeout(()=>{
    $('#accident_map').trigger('click');
 },800)