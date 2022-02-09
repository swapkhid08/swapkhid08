var is_vbv = 1;
var marker_scn = 'all';
var devicesSelect;
$(document).ready(function () {
    client = new Paho.MQTT.Client($(location).attr('hostname'), Number(8083), "/mqtt", 'client-' + Math.floor(Math.random() * 11231247).toString(16));

    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // connect the client
    client.connect({
        cleanSession : false, 
        onSuccess:onConnect,
        reconnect: true
        // reconnectInterval: 5
    });
    function onConnect() {
         client.subscribe("tis/detector/agg/#");
        console.log('connected')

    }
    // called when the client loses its connection
    function onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
        // client.connect({onSuccess:onConnect});
      }
      if (responseObject.reconnect) {
            console.log("Automatic reconnect is currently active.");
        } else {
            alert("Lost connection to host.");
        }
    }

    // called when a message arrives
    function onMessageArrived(message) {
        update_row(message.payloadString)
    }
    function update_row(data)
    {
        data = JSON.parse(data);
        if($('#'+data.system_code_number+'_row').length==0)
            return;
        var scn = data.system_code_number;
        var elem = $('#'+scn+'_row');
        var newElem = elem.clone();
        $.each(data, function (key, val) {
            if(key=='system_code_number')
                return;
            if(key=='flow')
                newElem.find("."+key).html(formatTotalFlow(val,data.Profile))
            else if(key=='headway')
                newElem.find("."+key).html(parseFloat(val).toFixed(0))
            else
                newElem.find("."+key).html(val)
        });
        elem.closest('tbody').prepend('<tr id="'+scn+'_row">'+newElem.html()+'</tr>');
        elem.remove();
        $('#'+scn+'_row').addClass('updated_row');
        setTimeout(function(){$('#'+scn+'_row').removeClass('updated_row');},1000);
    }
        var elem = $('#_row123').length;
        console.log(elem)
    function formatTotalFlow(data,Profile   )
    {
        if(Profile==null)
            return data;
        else if(parseInt(data)>Profile)
            return data+'<span class="text-danger flow_arrow">&uarr;</span>';
        else if(parseInt(data)>Profile)
            return data+'<span class="text-success flow_arrow">&darr;</span>';
    }

    devicesSelect = new SlimSelect({
        select: '#devices',
        showContent: 'down'
    })
    var default_osm = L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> Contributors',
        maxZoom: 18,
    });
    var map = new L.map('detector_map', {
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
        "<span class='fontOpenSansRegular'>Default OSM</span>": default_osm
    };
    

    L.control.layers(baseMaps).addTo(map);
    var oms = new OverlappingMarkerSpiderfier(map);
    $.ajax({
        url: '../../../models/detector/detector_map.hh',
        method: 'POST',
        success: function (result_detector) {
            var devices_set_detector = jQuery.parseJSON(result_detector);
            markers_array = []
            var popup_content ='';
            var devices = '<option value="all" selected>All</option>';
            for (i = 0; i < devices_set_detector.length; i++) {
                devices += '<option value="'+devices_set_detector[i].SystemCodeNumber+'" data-makeid="'+devices_set_detector[i].MakeId+'">'+devices_set_detector[i].ShortDescription+'</option>';
                var fault = devices_set_detector[i].online;
                if (fault === "1") {
                    var myIcon_detector = L.icon({ iconUrl: '../../images/detectorcameraOn.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] });
                } else if (fault === "0") {
                    var myIcon_detector = L.icon({ iconUrl: '../../images/detectorcameraOff.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] });
                }
                

                
                markers_array.push(new L.marker([devices_set_detector[i].Northing, devices_set_detector[i].Easting]))
                if (fault === "1") {                    
                    marker = new L.marker([devices_set_detector[i].Northing, devices_set_detector[i].Easting], { icon: myIcon_detector }).bindPopup('<div class="fontOpenSansRegular"><span><b>SCN</b>: <span class="marker_scn">' + devices_set_detector[i].SystemCodeNumber + '</span></span><br><span><b>Location</b>: <span class="marker_name">' + devices_set_detector[i].ShortDescription + '</span></span><br><span><b>Last Updated : </b>' + (devices_set_detector[i].LastStatusChange == null ? '--' : getFormattedDate(devices_set_detector[i].LastStatusChange, 'Y-m-d H:m:s', 'd-m-y H:m:s')) + '</span><center><br><a href="javascript:void(0)" class="view_device_live_data">View Live Data</a>'+(devices_set_detector[i].has_vbv=='1'?' | <a href="detector_realtimedata.html?scn='+devices_set_detector[i].SystemCodeNumber+'&zonename='+devices_set_detector[i].ShortDescription+'&show=vbv">View Real-time VBV Data</a>':'')+'</center><center></center></div>');
                    popup_content = '<div class="fontOpenSansRegular"><span><b>SCN</b>: <span class="marker_scn">' + devices_set_detector[i].SystemCodeNumber + '</span></span><br><span><b>Location</b>: <span class="marker_name">' + devices_set_detector[i].ShortDescription + '</span></span><br><span><b>Last Updated : </b>' + (devices_set_detector[i].LastStatusChange == null ? '--' : getFormattedDate(devices_set_detector[i].LastStatusChange, 'Y-m-d H:m:s', 'd-m-y H:m:s')) + '</span><center><br><a href="javascript:void(0)" class="view_device_live_data">View Live Data</a>'+(devices_set_detector[i].has_vbv=='1'?' | <a href="detector_realtimedata.html?scn='+devices_set_detector[i].SystemCodeNumber+'&zonename='+devices_set_detector[i].ShortDescription+'&show=vbv">View Real-time VBV Data</a>':'')+'</center><center></center></div>';
                }else{
                    marker = new L.marker([devices_set_detector[i].Northing, devices_set_detector[i].Easting], { icon: myIcon_detector }).bindPopup('<div class="fontOpenSansRegular"><span><b>SCN</b>: <span class="marker_scn">' + devices_set_detector[i].SystemCodeNumber + '</span></span><br><span><b>Location</b>: <span class="marker_name">' + devices_set_detector[i].ShortDescription + '</span></span><br><span><b>Last Updated : </b>' + (devices_set_detector[i].LastStatusChange == null ? '--' : getFormattedDate(devices_set_detector[i].LastStatusChange, 'Y-m-d H:m:s', 'd-m-y H:m:s')) + '</span><center><br><a href="javascript:void(0)" class="view_device_live_data">View Last Recorded Data</a></center><center></center></div>');
                    popup_content = '<div class="fontOpenSansRegular"><span><b>SCN</b>: <span class="marker_scn">' + devices_set_detector[i].SystemCodeNumber + '</span></span><br><span><b>Location</b>: <span class="marker_name">' + devices_set_detector[i].ShortDescription + '</span></span><br><span><b>Last Updated : </b>' + (devices_set_detector[i].LastStatusChange == null ? '--' : getFormattedDate(devices_set_detector[i].LastStatusChange, 'Y-m-d H:m:s', 'd-m-y H:m:s')) + '</span><center><br><a href="javascript:void(0)" class="view_device_live_data">View Last Recorded Data</a></center><center></center></div>';
                }

                oms.addListener('spiderfy', function(markers) {
                    map.openPopup();
                });
                
                map.addLayer(marker);
                oms.addMarker(marker);
                
                marker.on('dblclick', function (evt) {
                    $.alert({
                        type: 'red',
                        title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                        content: '<div class="fw-bold">Don\'t double click on the map</div>'
                    });
                });
                //if you want you can edit the bindPopup() to show what ever data you want on popup.
            }
            $('#devices').html(devices);
            var markers_group_detector = new L.featureGroup(markers_array);
            map.fitBounds(markers_group_detector.getBounds().pad(0.05));
            // for (let i = 0; i < markers_array.length; i ++) {
            //     let datum = markers_array[i];
            //     console.log()
            //     let loc = new L.LatLng(datum._latlng.lat, datum._latlng.lat);
            //     let marker = new L.Marker(loc);
            //     marker.desc = datum.d;
            //     map.addLayer(marker);
            //     oms.addMarker(marker);
            //   }
        }
        
    });
    
    $(document).on('click','.view_device_live_data',function(){
        displaydata();
    })
    $('.viewAllDevicesData').click(function(){
        marker_scn = 'all';
        fetch_detectorraw(0,marker_scn);
        devicesSelect.set(marker_scn);
    })
    
    function displaydata()
    {
        marker_scn = $('.marker_scn').html().trim(); 
        marker_name = $('.marker_name').html().trim(); 
        $('#detector_scn_name').html(marker_scn+' - '+marker_name);
        $('#detector_scn_name').show();
        $('#devices').val(marker_scn);
        devicesSelect.set(marker_scn);
    }
     $('.log_header').click(function(){
        $('.log_header').removeClass('active');
        $(this).addClass('active');
        is_vbv = $(this).attr('is_vbv');
        if(is_vbv==0)
        {
            $('#dataTable2').dataTable().fnDestroy();
            $('#dataTable').show();
            $('#dataTable2').hide();
        }else{
            $('#dataTable').dataTable().fnDestroy();
            $('#dataTable2').show();
            $('#dataTable').hide();
        }
        fetch_detectorraw(is_vbv,marker_scn);
    });
    $('#devices').on('change',function(){
        marker_scn = $('#devices').val().trim(); 
        makeid = $('#devices').find('option:selected').data('makeid');
        marker_name = $("#devices option:selected").text().trim();
        $('#detector_scn_name').html(marker_scn+' - '+marker_name);        
        if($('#group_messages').prop('checked') == true){
            $('#detector_scn_name').show();
            $('.closeAssetTable').click();
            fetch_detectorraw(0,marker_scn);
            $('#devicetable').show();
            $('#zoneable').hide();
            
        }
        else if($('#group_messages').prop('checked') != true){
            $('#devicetable').hide();
            $('#zoneable').show();
            fetch_detectorraw(0,marker_scn);
            $('.viewAllDevicesData').hide();
        }
    })
    $('#group_messages').click(function(){
        marker_scn = $('#devices').val().trim(); 
        makeid = $('#devices').find('option:selected').data('makeid');
        marker_name = $("#devices option:selected").text().trim();
        if($(this).is(":checked")){
            $('#detector_scn_name').show();
            $('.closeAssetTable').click();
            fetch_detectorraw(0,marker_scn);
            $('#devicetable').show();
            $('#zoneable').hide();   
        }
        else if($(this).is(":not(:checked)")){         
            $('#devicetable').hide();
            $('#zoneable').show();
            fetch_detectorraw(0,marker_scn);
            $('.viewAllDevicesData').hide();
        }
    });
    function fetch_detectorraw(report_type,scn){
        $('.loader').show();
        if(scn=='all')
        {
            $('#detector_scn_name').hide();
            $('.viewAllDevicesData').hide();

        }else{
            $('.viewAllDevicesData').show();

        }
        // devicesSelect.set(['DET-003'])
        if(report_type==1)
        {
            $('#dataTable').dataTable().fnDestroy();
            $('#dataTable2').show();
            $('#dataTable').hide();
            $('#dataTable2').DataTable({
                "processing": true,
                "serverSide": true,
                "searching": false,
                "destroy": true,
                "bPaginate": false,
                "ordering":false,
                "bInfo" : false,
                "fnCreatedRow": function( nRow, aData, iDataIndex ) {
                    $(nRow).attr('id', aData['SystemCodeNumber']+'_row');
                },
                "ajax": {
                    "url": "../../../models/detector/detector_raw.hh",
                    "type": "POST",
                    "data": function (d) {
                        d.scn = scn
                        _scn = d.scn

                        d.report_type = report_type
                        _report_type = d.report_type
                    }
                },
                "columns": [
                    { "data": "SCN", render: renderTdClass ,className:'SCN'},
                    { "data": "ShortDescription",className:'ShortDescription' },
                    { "data": "TowardsToll", render: renderDirection,className:'TowardsToll' },
                    { "data": "Lane",className:'Lane' },
                    { "data": "ErrorLoop",className:'ErrorLoop' },
                    { "data": "Speed",className:'Speed' ,render:roundNumber},
                    { "data": "VehicleLength",className:'VehicleLength'},
                    { "data": "Class",className:'Class'},
                    { "data": "NumberOfAxle",className:'NumberOfAxle'},
                    { "data": "TimeStamp", render: renderDate,className:'TimeStamp' }
                ]
            });
        }else
        {
            $('#dataTable2').dataTable().fnDestroy();
            $('#dataTable2').hide();
            $('#dataTable').show();
            
            $('#dataTable').DataTable({
                "processing": true,
                "serverSide": true,
                "searching": false,
                "destroy": true,
                "bPaginate": false,
                "ordering":false,
                "bInfo" : false,
                "fnCreatedRow": function( nRow, aData, iDataIndex ) {
                    $(nRow).attr('id', aData['ZoneSCN']+'_row');
                },
                "ajax": {
                    "url": "../../../models/detector/detector_raw.hh",
                    "type": "POST",
                    "data": function (d) {
                        d.scn = scn
                        _scn = d.scn

                        d.report_type = report_type
                        _report_type = d.report_type
                    }
                },
                "columns": [
                    { "data": "SystemCodeNumber", render: renderTdClass,className:'SystemCodeNumber' },
                    { "data": "ShortDescription", render: renderTdClass,className:'ShortDescription' },
                    { "data": "TotalFlow",render: renderTotalFlow,className:'TotalFlow' ,render:roundNumber},
                    { "data": "FlowInterval",className:'FlowInterval' ,render:roundNumber},
                    { "data": "Speed",className:'Speed' ,render:roundNumber},
                    { "data": "Headway",className:'Headway' ,render:roundNumber},
                    // { "data": "Direction"},
                    { "data": "LastUpdated", render: renderDate,className:'LastUpdated' },
                    { "data": "has_vbv", render: renderClassified },
                    { "data": "has_vbv", render: renderVbv }
                ]
            });

            $('#dataTable3').DataTable({
                "processing": true,
                "serverSide": true,
                "searching": false,
                "destroy": true,
                "paging": false,
                "ordering":false,
                "info":false,
                "fnCreatedRow": function( nRow, aData, iDataIndex ) {
                    $(nRow).attr('id', aData['ZoneSCN']+'_row');
                },
                "ajax": {
                    "url": "../../../models/detector/detector_raw_zones.hh",
                    "type": "POST",
                    "data": function (d) {
                        d.scn = scn
                        _scn = d.scn

                        d.report_type = report_type
                        _report_type = d.report_type
                    }
                },
                "columns": [
                    { "data": "ZoneSCN", render: renderTdClasszone,className:'systemm_code_number' },
                    { "data": "ShortDescription", render: renderTdClasszone,className:'ShortDescription' },
                    { "data": "TotalFlow",className:'flow',render:roundNumber},
                    { "data": "FlowInterval",className:'FlowInterval',render:roundNumber},
                    { "data": "Speed",className:'speed' ,render:roundNumber},
                    { "data": "Headway",className:'headway',render:roundNumber },
                    // { "data": "Direction"},
                    { "data": "LastUpdated", render: renderDate,className:'timestamp' },
                    { "data": "has_vbv", render: renderClassifiedzone },
                    { "data": "has_vbv", render: renderVbvzone }
                ]
            });
        }


        
        function renderTdClass (data, type, full, meta) {
            if(full.Active == '0' || full.Active == 0){
                var ret = '<label class="offline">';
            }else{
                var ret = '<label class="onnline">';
            }
            return ret += data +'</label>';
        }
        
        function renderTdClasszone (data, type, full, meta) {
            if(full.Active == '0' || full.Active == 0){
                var ret = '<label class="offline">';
            }else{
                var ret = '<label class="onnline">';
            }
            return ret += data +'</label>';
        }

        function renderTotalFlow (data, type, full, meta) {
            if(full.Profile==null)
                return data;
            else if(parseInt(data)>full.Profile)
                return data+'<span class="text-danger flow_arrow">&uarr;</span>';
            else if(parseInt(data)>full.Profile)
                return data+'<span class="text-success flow_arrow">&darr;</span>';
        }

        
        function renderDate (data, type, full, meta) {
            $('#deviceclassdata').hide();
            return data == null ? '--' : getFormattedDate(data, 'Y-m-d H:m:s', 'd-m-y H:m:s');
        }

        function renderDirection (data, type, full, meta) {
            return data == 1 ? 'TowardsToll' : 'FromToll';
        }

        function renderSCN (data, type, full, meta) {
            return data == '1' ? '<a href="detector_realtimedata.html?scn='+full.SystemCodeNumber+'">'+full.SystemCodeNumber+'</a>' : full.SystemCodeNumber;
        }
        function renderClassified (data, type, full, meta) {
            var myscn = "'"+full.SystemCodeNumber+"','"+full.ShortDescription+"','"+full.MakeId+"'";
            return '<a style="cursor:pointer;" class="viewclasslink" onclick="viewClassified('+myscn+')">View</a>';
        }
        function renderClassifiedzone (data, type, full, meta) {
            var myscn = "'"+full.SystemCodeNumber+"','"+full.ShortDescription+"','"+full.MakeId+"'";
            return '<a style="cursor:pointer;" class="viewclasslinkzone" onclick="viewClassifiedzone('+myscn+')">View</a>';
        }
        
        function renderVbv (data, type, full, meta) {
            return data == '1' ? '<a href="detector_realtimedata.html?scn='+full.SystemCodeNumber+'&show=vbv&zonename='+full.ShortDescription+'">View</a>':'--'; 
        }
        function renderVbvzone (data, type, full, meta) {
            return data == '1' ? '<a href="detector_realtimedata.html?scn='+full.devicescn+'&show=vbv&zoneid='+full.ZoneSCN+'&zonename='+full.ShortDescription+'">View</a>':'--';
        }
        function roundNumber (data, type, full, meta) {
            return Math.round(data);
        }

        setTimeout(function(){$('.loader').hide()},1000);

    }
    fetch_detectorraw(0,marker_scn);
    //var timeout = setTimeout("location.reload(true);", 300000);
    $(document).on('click','.closeAssetTable',function(){
        
        $('#deviceclassdata').css('height', '0');
        //$('#deviceclassdata').css('overflow', 'hidden');
        $('#deviceclassdata').hide();
        $("#dataTable tr").each(function() {
            $(this).removeClass('viewclassactive');
        })
        $("#dataTable3 tr").each(function() {
            $(this).removeClass('viewclasszoneactive');
        })
    })
    $(document).on('click','.viewclasslinkzone',function(){
        var parenttr = $(this).closest('tr');
        $("#dataTable3 tr").each(function() {
            $(this).removeClass('viewclasszoneactive');
        })
        parenttr.addClass('viewclasszoneactive');
    })
    $(document).on('click','.viewclasslink',function(){
        var parenttr = $(this).closest('tr');
        $("#dataTable tr").each(function() {
            $(this).removeClass('viewclassactive');
        })
        parenttr.addClass('viewclassactive');
    })
});
function viewClassified(scn,name,MakeId){
    //$('#dataTable2').dataTable().fnDestroy();
    
    $.ajax({
        url: '../../../models/detector/get_detector_class_head.hh',
        type: 'POST',
        data:{makeid:MakeId},
        success: function (class_heads) {
            var class_heads = jQuery.parseJSON(class_heads);
            var dt2_head = '';
            if(class_heads.length > 0){
                $('#dataTable2').DataTable();
                $('#dataTable2').DataTable().clear();
                $('#dataTable2').dataTable().fnDestroy();
                $('#dt2_head').html('');
                $('#table2_body').html('');
                
                $.ajax({
                    url: '../../../models/detector/detector_class_data.hh',
                    type: 'POST',
                    data:{scn:scn},
                    success: function (result) {
                        var table2_body = '';
                        result = jQuery.parseJSON(result);
                        console.log(result);
                        dt2_head += '<th>SCN</th>';
                            dt2_head += '<th>Name</th>';
                            for(var c=0;c<class_heads.length;c++){
                                dt2_head += '<th>'+class_heads[c].binName+'</th>';
                            }
                            $('#dt2_head').html(dt2_head);
                        if(result.zone_count == 0 || result.zone_count == '0'){
                            var data = result.data;
                            for(var i=0;i<data.length;i++){
                                var s=0;
                                var tabres = [];
                                $.each( data[i], function( key, value ) {
                                    tabres[s]=value;
                                    s++;
                                  });
                                var tbdy = '<tr>'
                                tbdy += '<td>'+scn+'</td>';
                                tbdy += '<td>'+name+'</td>';
                                for(var c=0;c<class_heads.length;c++){
                                    tbdy += '<td>'+tabres[c]+'</td>';
                                }
                                tbdy += '</tr>'
                                table2_body += tbdy;
                            }
                            $('#table2_body').html(table2_body);
                        }else{
                            
                            var zones = result.zones;
                            var zone_data = result.zone_data;
                            
                            for(var z=0;z<zones.length;z++){
                                var tbdy = '';
                                ZoneSCN=zones[z].ZoneSCN;
                                //var data = zone_data.zones[z].ZoneSCN;
                                console.log(zone_data[ZoneSCN])
                                var s=0;
                                var tabres = [];
                                $.each( zone_data[ZoneSCN], function( key, value ) {
                                    tabres[s]=value;
                                    s++;
                                });
                                tbdy += '<tr>';
                                tbdy += '<td>'+zones[z].ZoneSCN+'</td>';
                                tbdy += '<td>'+zones[z].ZoneName+'</td>';
                                for(var c=0;c<class_heads.length;c++){
                                    tbdy += '<td>'+tabres[c]+'</td>';
                                }
                                tbdy += '</tr>'
                                table2_body += tbdy;
                            }
                            $('#table2_body').html(table2_body);
                        }
                        
                        $('#dataTable2').DataTable({
                            "processing": true,
                            "serverSide": false,
                            "searching": false,
                            "destroy": true,
                            "ordering": false
                        });
                        $('#table_scn').html('Classified Count - '+name);
                        $('#dataTable2').show();
                        $('#deviceclassdata').css('height', 'auto');
                        $('#deviceclassdata').css('overflow-y', 'auto');
                        $('#deviceclassdata').show();
                        $("#classicmodal").modal();
                    }
    
                });
            }else{
                $('#deviceclassdata').hide();
                $("#dataTable tr").each(function() {
                    $(this).removeClass('viewclassactive');
                })
                $.alert({
                    type: 'red',
                    title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                    content: '<div class="fw-bold">Classified Count not available for '+name+'</div>'
                });
                return;
            }
            
        }
    });
  
}



function viewClassifiedzone(scn,name,MakeId){
    //$('#dataTable2').dataTable().fnDestroy();
    
    $.ajax({
        url: '../../../models/detector/get_detector_class_head.hh',
        type: 'POST',
        data:{makeid:MakeId},
        success: function (class_heads) {
            var class_heads = jQuery.parseJSON(class_heads);
            var dt2_head = '';
            if(class_heads.length > 0){
                $('#dataTable2').DataTable();
                $('#dataTable2').DataTable().clear();
                $('#dataTable2').dataTable().fnDestroy();
                $('#dt2_head').html('');
                $('#table2_body').html('');
                
                $.ajax({
                    url: '../../../models/detector/detector_class_data.hh',
                    type: 'POST',
                    data:{scn:scn},
                    success: function (result) {
                        var table2_body = '';
                        result = jQuery.parseJSON(result);
                        console.log(result);
                        dt2_head += '<th>SCN</th>';
                            dt2_head += '<th>Name</th>';
                            for(var c=0;c<class_heads.length;c++){
                                dt2_head += '<th>'+class_heads[c].binName+'</th>';
                            }
                            $('#dt2_head').html(dt2_head);
                        if(result.zone_count == 0 || result.zone_count == '0'){
                            var data = result.data;
                            for(var i=0;i<data.length;i++){
                                var s=0;
                                var tabres = [];
                                $.each( data[i], function( key, value ) {
                                    tabres[s]=value;
                                    s++;
                                  });
                                var tbdy = '<tr>'
                                tbdy += '<td>'+scn+'</td>';
                                tbdy += '<td>'+name+'</td>';
                                for(var c=0;c<class_heads.length;c++){
                                    tbdy += '<td>'+tabres[c]+'</td>';
                                }
                                tbdy += '</tr>'
                                table2_body += tbdy;
                            }
                            $('#table2_body').html(table2_body);
                        }else{
                            
                            var zones = result.zones;
                            var zone_data = result.zone_data;
                            
                            for(var z=0;z<zones.length;z++){
                                var tbdy = '';
                                ZoneSCN=zones[z].ZoneSCN;
                                //var data = zone_data.zones[z].ZoneSCN;
                                console.log(zone_data[ZoneSCN])
                                var s=0;
                                var tabres = [];
                                $.each( zone_data[ZoneSCN], function( key, value ) {
                                    tabres[s]=value;
                                    s++;
                                });
                                tbdy += '<tr>';
                                tbdy += '<td>'+zones[z].ZoneSCN+'</td>';
                                tbdy += '<td>'+zones[z].ZoneName+'</td>';
                                for(var c=0;c<class_heads.length;c++){
                                    tbdy += '<td>'+tabres[c]+'</td>';
                                }
                                tbdy += '</tr>'
                                table2_body += tbdy;
                            }
                            $('#table2_body').html(table2_body);
                        }
                        
                        $('#dataTable2').DataTable({
                            "processing": true,
                            "serverSide": false,
                            "searching": false,
                            "destroy": true,
                            "ordering": false
                        });
                        $('#table_scn').html('Classified Count - '+name);
                        $('#dataTable2').show();
                        $('#deviceclassdata').css('height', 'auto');
                        $('#deviceclassdata').css('overflow-y', 'auto');
                        $('#deviceclassdata').show();
                        $("#classicmodal").modal();
                    }
    
                });
            }else{
                $('#deviceclassdata').hide();
                $("#dataTable tr").each(function() {
                    $(this).removeClass('viewclasszoneactive');
                })
                $.alert({
                    type: 'red',
                    title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                    content: '<div class="fw-bold">Classified Count not available for '+name+'</div>'
                });
                return;
            }
            
        }
    });
  
}
