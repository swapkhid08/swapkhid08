$(document).ready(function(){
    var detectorSCN = '';
    var vbvshow = '';
    var zoneid = '';
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
    detectorSCN = getUrlParameter('scn');
    vbvshow = getUrlParameter('show');
    zoneid = (getUrlParameter('zoneid')==undefined)?0:getUrlParameter('zoneid');
    zonename = getUrlParameter('zonename');
    if(detectorSCN=='')
    {
        $.alert({
            type: 'red',
            title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
            content: '<div class="fw-bold">Sorry, there has been a technical problem. Please report this error by sending an email to support@itspe.co.in with a screen shot</div>'
        });
    }
    detClass = {}

    client = new Paho.MQTT.Client($(location).attr('hostname'), Number(8083), "/mqtt",'client-' + Math.floor(Math.random() * 11231247).toString(16));

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

    // called when the client connects
    function onConnect() {
        // Once a connection has been made, make a subscription and send a message.
        console.log("onConnect");
        // console.log(`tis/detector/vbv/${zoneid}`)

        //Subscribing to the topics in detector_realtime response since need to show all lanes in realtime table
        //  client.subscribe(`tis/detector/vbv/${zoneid}`);
         //message = new Paho.MQTT.Message("Hello");
         //message.destinationName = "/World";
         //client.send(message);
        //console.log('connected')

        routes()
     

    }

    // called when the client loses its connection
    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:"+responseObject.errorMessage);
            // client.connect({onSuccess:onConnect});
        }
        if (responseObject.reconnect) {
            // $.alert({
			// 	type: 'blue',
			// 	title: '<h3 class="text-primary fw-bold mb-0">Message</h3>',
			// 	content: '<div class="fw-bold">Automatic reconnect is currently active.</div>'
			// });
        } else {
            $.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Lost connection to host.</div>'
			});
        }
    }

    // called when a message arrives
    function onMessageArrived(message) {
        // console.log(message)
        messageHandler(message.payloadString,message.destinationName)
    }
    var id = '';
    function messageHandler(body,topic){
        var payload = JSON.parse(body),
            payloadDeviceSCN = topic.split('/')[topic.split('/').length -1]
        // {class(number), speed(kmph), timestamp(y-m-d h:m:s) , lane(number)}
        //{"class_by_axle":2,"speed":10,"timestamp":"2021-02-02 00:00:00","lane":2}
        // {"system_code_number": "ATCC0004_01", "speed": null, "class_by_axle": 4, "lane_number": 1, "timestamp": "2021-12-23 17:26:33"}
        // console.log(payload)
        // console.log(detClass[payload['class_by_axle']], detClass)
        var class_by_axle = payload['class_by_axle'] == undefined ? '--' : (detClass[payload['class_by_axle']] == undefined ? '--' : detClass[payload['class_by_axle']]),
            speed = payload['speed'] == undefined || payload['speed'] == null ? '--' : payload['speed'],
            lane = payload['lane_number'] == undefined ? '--' : payload['lane_number'],
            timestamp = payload['timestamp'] == undefined ? '--' : payload['timestamp']
        console.log(zoneid, payloadDeviceSCN)
        if (zoneid == undefined || zoneid == 0 || payloadDeviceSCN == zoneid){
            var row = $('#dataTable2').DataTable().row.add( {
                "SCN": payloadDeviceSCN,
                "ShortDescription": zonename,
                "Speed": Math.round(speed),
                "Class": class_by_axle,
                "TimeStamp": timestamp,
            } ).draw( false );
    
            var rowidx = row.index()
    
            setTimeout(function(){
            $(`#dataTable2 tr[idx=${rowidx}]`).css('transition', '.25s ease-in all')
            $(`#dataTable2 tr[idx=${rowidx}]`).css('transform', 'scale(1.1)')
    
            setTimeout(function(){
                $(`#dataTable2 tr[idx=${rowidx}]`).css('transition', '.25s ease-out all')
                $(`#dataTable2 tr[idx=${rowidx}]`).css('transform', 'scale(1)')
            },1000)
            }, 200)

            var eleid = `${detectorSCN}_0${lane}`

            var template = '<img src="../../images/'+class_by_axle.toUpperCase()+'.png" style="width:100px;height:auto;padding:5px;"  onerror="this.onerror=null;this.src=\'../../images/imagenotfound.png\'"><span style="display: block;color: #253654;letter-spacing: 1px;">'+class_by_axle.toUpperCase()+'</span>';
            $('#'+eleid).empty();
            $('#'+eleid).append(template);
            setTimeout(function(){
                removeImage(eleid)
            }, 1000);
        }

        

            // notification(site,body,values[2]);   
            //asound.play();         
    }

    function removeImage(id){
        // console.log(id)
        $('#'+id).empty();
    }
    function notification(subject, body,image){
        var notification = new Notification("test", { icon: "../../images/"+image+".png", body: body})
        notification.onshow = function() { setTimeout(function(){notification.close()}, 15000) }
    }

    document.addEventListener('DOMContentLoaded', function() {
    if (Notification.permission !== "granted")
            Notification.requestPermission();
    });

	routes = function(){
        var devise_names = [];
        $.ajax({
            url: '../../../models/detector/detector_devices.hh',
            type: 'POST',
            success: function(deviceresult) {
                deviceresult = jQuery.parseJSON(deviceresult);
                for(var d=0;d<deviceresult.length;d++){
                    devise_names[deviceresult[d].SystemCodeNumber]=deviceresult[d].ShortDescription;
                }
                $('#scn_desc').html(devise_names[detectorSCN]);
                $.ajax({
                    url: '../../../models/detector/detector_real.hh',
                    type: 'POST',
                    data: {scn:detectorSCN},
                    success: function(result) {
                        if(result == 'F'){
                            $.alert({
                                type: 'red',
                                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                                content: '<div class="fw-bold">Sorry, there has been a technical problem. Please report this error by sending an email to support@itspe.co.in with a screen shot</div>'
                            });
                        }
                        else{
        
                            var result = jQuery.parseJSON(result);
                            //console.log(result.lanes['ATCC-001'][0][1]);
                            //console.log(result.scn[1]);
                            //console.log(result);
                            var template = '';
                            var max_lanes = result.max;
                            var data = result.data
                            var detclass = result.class;
                            var devicedata = result.device;
        
                            for(var i=0; i<detclass.length;i++){
                                if(detclass[i].binName == 'Car/Jeep')
                                    detclass[i].binName = 'Car'
                                else if(detclass[i].binName == 'Truck/Bus')
                                    detclass[i].binName = 'Bus'
                                detClass[detclass[i].binNumber] = detclass[i].binName
                            }
        
                            /*var ele = '<tr style="height: 10vh;" bgcolor="#253654"><th class="head"><font color="white">Real Time Data</font></th>'
                            for(var i=1; i<=max_lanes;i++){
                                ele += '<th><font color="white">Lane '+i+'</font></th>'
                            }
                            ele += '</tr>'
                            $('#dataTable thead').append(ele);
        
                            ele = ''
                            for(var i=0; i<data.length;i++){ 
                                ele += '<tr id="'+data[i].SCN+'"><td>'+devise_names[data[i].SCN]+'</td>'
                                lanes = data[i].Lane.split(',')
                                for(var j=1; j<=max_lanes;j++){
                                    if(lanes.indexOf(j.toString()) != -1)
                                        ele += '<td id="'+data[i].SCN+'_'+(j)+'" col="e"></td>'
                                    else
                                        ele += '<td col="d"></td>'
                                }
                                ele += '</tr>'
                            }
        
                            $('#dataTable tbody').append(ele);*/
                            var ele = '<tr style="height: 10vh;" bgcolor="#253654"><th class="head"><font color="white">Real Time Data</font></th>'
                            var zonelivelink = ''
                            for(var i=0; i<max_lanes;i++){
                                ele += '<th><font color="white">'+data[i].ZoneName+'</font></th>'
                                zonelivelink = getUrlParameter('zoneid') == data[i].ZoneSCN ? data[i].LiveLink : zonelivelink
                                client.subscribe(`tis/detector/vbv/${data[i].ZoneSCN}`);
                            }
                            ele += '</tr>'
                            $('#dataTable thead').append(ele);
                            ele = '<tr id="'+devicedata.SystemCodeNumber+'"><td>'+devicedata.ShortDescription+'</td>'
                            for(var j=0; j<max_lanes;j++){
                                    ele += '<td id="'+data[j].ZoneSCN+'" col="e"></td>';
                            }
                            ele += '</tr>'
                            $('#dataTable tbody').append(ele);
                            if(devicedata.Active == '0' || devicedata.Active == 0){
                                $('#dataTable').hide();
                            }
                            if(devicedata.LiveLink == '' || devicedata.LiveLink == null){
                                $('#dataTable').removeClass('w-70-p').addClass('w-100-p')
                                $('.livelink').remove()
                            }
                            else{
                                var camera_image1 = zonelivelink == '' ? devicedata.LiveLink : zonelivelink;
                                var camera_image2 = devicedata.PublicLiveLink;
                                setTimeout(()=>{
                                    if(!IsImageOk('.livelink img')){
                                            camera_image1 = camera_image2;
                                            $('.livelink').html('')
                                            $('.livelink').html(`<img src="${camera_image1}" onerror="this.onerror=null;this.src='${camera_image2}'">`)
                                    }
                                  
                                    },GLOBAL.ALT_URL_SEC)
                                $('.livelink').html('')
                                $('.livelink').html(`<img src="${camera_image1}" onerror="this.onerror=null;this.src='${camera_image2}'">`)
                            }
                        }
                    }
                });
            }
        });
		
	}
	// routes();
	//timeOutId = setInterval(routes, 1000);

    function fetch_detectorraw(report_type,scn){
        if(zoneid == undefined || zoneid == null || zoneid == ''){
            zoneid = 0;
        }
        $('#dataTable2').dataTable().fnDestroy();
        $('#dataTable2').DataTable({
            "processing": true,
            "serverSide": false,
            "searching": false,
            "destroy": true,
            "deferRender":    true,
            // "columnDefs": [ { orderable: false, targets: [0,2,3,14]}],
            "order": [[4, "desc"]],
            "ajax": {
                "url": "../../../models/detector/detector_raw.hh",
                "type": 'POST',
                "data": function (d) {
                    d.scn = scn
                    _scn = d.scn

                    d.report_type = 'clientside' // report_type
                    _report_type = d.report_type

                    d.zoneid = zoneid
                    _zoneid = d.zoneid
                }
            },
            "columns": [
                { "data": "SCN" },
                { "data": "ShortDescription" },
                //{ "data": "TowardsToll", render: renderDirection },
                //{ "data": "Lane" },
                //{ "data": "ErrorLoop" },
                { "data": "Speed",render:roundNumber},
                //{ "data": "VehicleLength"},
                { "data": "Class"},
                //{ "data": "NumberOfAxle"},
                { "data": "TimeStamp", render: renderDate }
            ],
            "createdRow": function( row, data, dataIndex ) {
                $(row).attr('idx', dataIndex)
            }
        });
        function renderDate (data, type, full, meta) {
            return data == null ? '--' : getFormattedDate(data, 'Y-m-d H:m:s', 'd/m/y H:m:s');
        }

        function renderDirection (data, type, full, meta) {
            return data == 1 ? 'TowardsToll' : 'FromToll';
        }

        function roundNumber (data, type, full, meta) {
            return Math.round(data);
        }

    }
    if(vbvshow =='vbv')
    {
        $('#vbvdata_div').show();
        fetch_detectorraw(1,detectorSCN);
    }
});