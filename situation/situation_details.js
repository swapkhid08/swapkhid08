list_types = "";
situationSCN = ""; //defined globally

coarray = []

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
    var scn = getUrlParameter("scn");

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
    // var selected_option = sanitize($('#main_type').val());
    // selected_option = selected_option.toLowerCase();
    mapMarker();
  
    
    markers = L.featureGroup();

    var accidentIcon = L.icon({ iconUrl: '../../images/accident-marker.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] });
    var eventIcon = L.icon({ iconUrl: '../../images/event-marker.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] });
    var incidentIcon = L.icon({ iconUrl: '../../images/incident-marker.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] });
    var crimeIcon = L.icon({ iconUrl: '../../images/crime-marker.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] });
    var roadworkIcon = L.icon({ iconUrl: '../../images/roadwork-marker.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] });

    function mapMarker () {
        var currentdate = new Date();
        var date = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-"
            + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
        ////console.log(date);
        var scn = getUrlParameter("scn");
        var type = getUrlParameter("type");
        $.ajax({
            url: '../../../models/situation/accidents_details.hh',
            type: 'POST',
            data: { scn: scn,type:type },
            success: function (res) {
                var res = jQuery.parseJSON(res);
                console.log(res);
                var markers_array = [];
                for (i = 0; i < res.length; i++) {
                    // if (res[i].isold == '1')
                    //     continue;
                    var isold = res[i].isold;
                    var scn = res[i].SystemCodeNumber;
                    var mid = res[i].Type;
                    var nor = res[i].Northing;
                    var eas = res[i].Easting;
                    $('#scn_id').html(res[i].SystemCodeNumber)
                     var table = '<table class="map_table" id="' + res[i].SystemCodeNumber + '">';
                    table += '<tr><th>Key</th><th>Value</th></tr>';
                    //$('#dtablebody').append('<tr><td>SCN</td><td>'+res[i].SystemCodeNumber+'</td></tr>');
                    $('#dtablebody').append('<tr><th class="text-left w-25">Short Description</th><td class="text-left">'+res[i].ShortDescription+'</td></tr>');
                    $('#dtablebody').append('<tr><th class="text-left w-25">Latitude</th><td class="text-left">'+res[i].Northing+'</td></tr>');
                    $('#dtablebody').append('<tr><th class="text-left w-25">Longitude</th><td class="text-left">'+res[i].Easting+'</td></tr>');
                    $('#dtablebody').append('<tr><th class="text-left w-25">AccidentTime</th><td class="text-left">'+getFormattedDate(res[i].AccidentTime, 'Y-m-d H:m:s', 'd-m-y H:m:s')+'</td></tr>');
                    $('#dtablebody').append('<tr><th class="text-left w-25">Severity</th><td class="text-left">'+res[i].Severity+'</td></tr>');
                    $('#dtablebody').append('<tr><th class="text-left w-25">ReportedBy</th><td class="text-left">'+res[i].ReportedBy+'</td></tr>');
                    $('#dtablebody').append('<tr><th class="text-left w-25">Type</th><td class="text-left">'+res[i].Type+'</td></tr>');
                    
                    $('#dtablebody').append('<tr><th class="text-left w-25">Long Description</th><td class="text-left">'+res[i].LongDescription+'</td></tr>');
                    //ShortDescription
                    if(res[i].ImagePath != null && res[i].ImagePath != 'null' && res[i].ImagePath != ''){
                        var img =res[i].ImagePath.split(";");
                        for(var m=0;m<img.length;m++){
                            $('.bxslider').append('<div><img src="'+img[m]+'" title="'+res[i].ShortDescription+'" height="300" width="100%" ></div>')
                        }
                        $('.bxslider').bxSlider();
                    }
                    else{
                        $('#sliderdiv').hide()
                    }
                    
                    $.each(res[i], function (k, v) {

                        if (k == 'CreationDate' || k == 'EndDate' || k == 'ShortDescription' || k == 'LongDescription' || k == ' EndDate' || k == 'CreatedBy' || k == 'isold' || k == 'id' || k == 'Checklist' || k == 'Checklist_type' || k == 'Checklist_extra' || k == 'Informed' || k == 'Informed_time' || k == 'Arrived' || k == 'Arrived_time' || k == 'Resolved_time' || k == 'Resolved')
                            return true;
                        if (k == 'Northing')
                            table += "<tr><td>Latitude</td><td>" + v + "</td></tr>"
                        else if (k == 'Easting')
                            table += "<tr><td>Longitude</td><td>" + v + "</td></tr>"
                        else if (k == 'AccidentTime')
                            table += "<tr><td>AccidentTime</td><td>" + getFormattedDate(v, 'Y-m-d H:m:s', 'd/m/y H:m:s') + "</td></tr>"
                        else if (k != 'Action' && k != 'ImagePath')
                            table += "<tr><td>" + k + "</td><td>" + v + "</td></tr>"
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
                            table += "<tr><td>" + name + "</td>";
                            table += "<td><button mid='" + mid + "' scn='" + scn + "' nor='" + nor + "' eas='" + eas + "' chk_type='" + name + "' class='do_action btn btn-primary' style='background:#253654'>View</button> &nbsp; &nbsp;";
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
                        //table += "<tr><td>Report</td><td mid='" + mid + "' scn='" + scn + "' style='color:blue;'' class='view_report' >View Report</td></tr>";
                        table += '</table>';
                    }

                    var typeIcon = accidentIcon;
                    if (mid == "accident"){
                        $('#situation_head').html('Accident details')
                        typeIcon = accidentIcon
                    }
                        
                    else if (mid == "event"){
                        $('#situation_head').html('Event details')
                        typeIcon = eventIcon
                    }
                    else if (mid == "crime"){
                        $('#situation_head').html('Crime details')
                        typeIcon = crimeIcon
                    }
                    else if (mid == "incident"){
                        $('#situation_head').html('Incident details')
                        typeIcon = incidentIcon
                    }
                    else if (mid == "roadwork"){
                        $('#situation_head').html('Roadwork details')
                        typeIcon = roadworkIcon
                    }
                    markers_array.push(new L.marker([res[i].Northing, res[i].Easting]))
                    marker = new L.marker([res[i].Northing, res[i].Easting], { icon: typeIcon }).bindPopup(table);
                    markers.addLayer(marker);
                }
                map.addLayer(markers);
                var markers_group = new L.featureGroup(markers_array);
                map.fitBounds(markers_group.getBounds().pad(0.05));
                $('#accident_map').css("height",$('#dataTable').css("height"));
                console.log($('#dataTable').css("height"));
                $('#name_modal').html(scn)
                if(isold == 1){
                    $('#performance_div').show();
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
                                    if(res[i].Checklist_type != '' && res[i].Checklist_type != null && res[i].Checklist_type != 'null'){
                                        table += res[i].Checklist_type;
                                    }else{
                                        table += 'N/A';
                                    }                         
                                    table += "</td><td>"; 
                                    if(res[i].Informed != '' && res[i].Informed != null && res[i].Informed != 'null'){
                                        table += res[i].Informed;
                                    }else{
                                        table += 'N/A';
                                    }
                                    table += "</td><td>"; 
                                    if(res[i].Informed_time != '' && res[i].Informed_time != null && res[i].Informed_time != 'null'){
                                        table += getFormattedDate(res[i].Informed_time,'Y-m-d H:m:s','d-m-y H:m:s');
                                    }else{
                                        table += 'N/A';
                                    }
                                    table += "</td><td>"; 
                                    if(res[i].Arrived != '' && res[i].Arrived != null && res[i].Arrived != 'null'){
                                        table += res[i].Arrived;
                                    }else{
                                        table += 'N/A';
                                    }
                                    table += "</td><td>"; 
                                    if(res[i].Arrived_time != '' && res[i].Arrived_time != null && res[i].Arrived_time != 'null'){
                                        table += getFormattedDate(res[i].Arrived_time,'Y-m-d H:m:s','d-m-y H:m:s');
                                    }else{
                                        table += 'N/A';
                                    }
                                    table += "</td><td>"; 
                                    if(res[i].Resolved != '' && res[i].Resolved != null && res[i].Resolved != 'null'){
                                        table += res[i].Resolved;
                                    }else{
                                        table += 'N/A';
                                    }
                                    table += "</td><td>"; 
                                    if(res[i].Resolved_time != '' && res[i].Resolved_time != null && res[i].Resolved_time != 'null'){
                                        table += getFormattedDate(res[i].Resolved_time,'Y-m-d H:m:s','d-m-y H:m:s');
                                    }else{
                                        table += 'N/A';
                                    }
                                    table += "</td></tr>";
                                }
                                else {
                                    table += "<tr><td>" + res[i].Checklist_type + "</td><td>N/A</td><td>N/A</td><td>N/A</td><td>N/A</td><td>N/A</td><td>N/A</td></tr>";
                                }
                            }
                            $("#edit_modal_content tbody").append(table);
                        }
                    })
                }
                
            }
        });
    }


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
                $.alert({
                    type: 'green',
                    title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
                    content: '<div class="fw-bold">Recorded Successfully</div>',
                    buttons: {
                        Ok: function () {
                            window.location.href='situation_home.html';
                        }
                    }
                });
                //location.reload();
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
                        if(res[i].Checklist_type != '' && res[i].Checklist_type != null && res[i].Checklist_type != 'null'){
                            table += res[i].Checklist_type;
                        }else{
                            table += 'N/A';
                        }                         
                        table += "</td><td>"; 
                        if(res[i].Informed != '' && res[i].Informed != null && res[i].Informed != 'null'){
                            table += res[i].Informed;
                        }else{
                            table += 'N/A';
                        }
                        table += "</td><td>"; 
                        if(res[i].Informed_time != '' && res[i].Informed_time != null && res[i].Informed_time != 'null'){
                            table += getFormattedDate(res[i].Informed_time,'Y-m-d H:m:s','d-m-y H:m:s');
                        }else{
                            table += 'N/A';
                        }
                        table += "</td><td>"; 
                        if(res[i].Arrived != '' && res[i].Arrived != null && res[i].Arrived != 'null'){
                            table += res[i].Arrived;
                        }else{
                            table += 'N/A';
                        }
                        table += "</td><td>"; 
                        if(res[i].Arrived_time != '' && res[i].Arrived_time != null && res[i].Arrived_time != 'null'){
                            table += getFormattedDate(res[i].Arrived_time,'Y-m-d H:m:s','d-m-y H:m:s');
                        }else{
                            table += 'N/A';
                        }
                        table += "</td><td>"; 
                        if(res[i].Resolved != '' && res[i].Resolved != null && res[i].Resolved != 'null'){
                            table += res[i].Resolved;
                        }else{
                            table += 'N/A';
                        }
                        table += "</td><td>"; 
                        if(res[i].Resolved_time != '' && res[i].Resolved_time != null && res[i].Resolved_time != 'null'){
                            table += getFormattedDate(res[i].Resolved_time,'Y-m-d H:m:s','d-m-y H:m:s');
                        }else{
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
                                    url = "../html/cctvWindow.html?ip=" + nvr_ip + "&channel=" + channel;
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
                                content: '<div class="fw-bold">Call ' + res[i].action+'</div>'
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
    function valueOutput (element) {
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
        format: 'Y-m-d H:i',
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
        }
    });

    //Capitalize
    String.prototype.capitalize = function () {
        return this.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
    };
    //
    //Haversine Distance
    function getHaversineDist (lat1, lon1, lat2, lon2) {
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
    function deg2rad (deg) {
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
            "columnDefs": [ { orderable: false, targets: [1,2]}],
            
            "order": [[3, "desc"]],
            "ajax": {
                "url": '../../../models/situation/current_accidents_list.hh',
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
                }
            },
            "columns": [
                { "data": "SystemCodeNumber", render: renderScn},
                { "data": "Type" },
                { "data": "ShortDescription" },
                { "data": "AccidentTime", render: renderDate }
            ]
        });
        function renderDate (data, type, full, meta) {
            return getFormattedDate(data, 'Y-m-d H:m:s', 'd-m-y H:m:s');
        }
        function renderScn (data, type, full, meta) {
            return '<a href="situation_details.html?scn='+data+'">'+data+'</a>';
        }
    }
    

})
function situationAwareness (scn, mid) {
    window.open('situation_awareness.html?scn=' + scn + '&type=' + mid, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width=" + $(window).width() + ",height=" + $(window).height());
}

function viewClick (nmodule, nsid) {
    //window.open('view_details.html?module=accident&id=' + nsid);
    window.location.href='view_details.html?module=accident&id=' + nsid;
}

function sopClick (nmodule, nsid) {
    window.open('sop.html?faultid=' + nsid);
}

