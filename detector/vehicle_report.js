function json_to_csv(json_data, title, label, fromDate, toDate, json_data_devices) {
    //Json  Parser
    console.log(json_data,json_data_devices)
    var arr_data = json_data;
    var arr_data_devices = json_data_devices;
    var csv = '';    
    
    if (label) {
        var row = "";
        for (var index in arr_data_devices[0]) {
            row += index + ',';
        }
        row = row.slice(0, -1);
        //new line
        csv += row + '\r\n';
    }

    //Traffic data extraction
    if($('input[name=orderDir]').attr('value') == 'asc'){
        for (var i = arr_data_devices.length-1; i >= 0; i--) {
            var row = "";        
            for (var index in arr_data_devices[i]) {
                row += '"' + arr_data_devices[i][index] + '",';
            }
            row.slice(0, row.length - 1);
            //add a line break after each row
            csv += row + '\r\n';            
        }
    }
    else{
        for (var i = 0; i < arr_data_devices.length; i++) {
            var row = "";        
            for (var index in arr_data_devices[i]) {
                row += '"' + arr_data_devices[i][index] + '",';
            }
            row.slice(0, row.length - 1);
            //add a line break after each row
            csv += row + '\r\n';
        }
    }

    //Title of the csv file, utilize it if needed 
    csv += '\r\n\n'+title + '\r\n\n';

    // column labels extraction
    if (label) {
        var row = "";
        for (var index in arr_data[0]) {
            row += index + ',';
        }
        row = row.slice(0, -1);
        //new line
        csv += row + '\r\n';
    }

    //Traffic data extraction
    if($('input[name=orderDir]').attr('value') == 'asc'){
        for (var i = arr_data.length-1; i >= 0; i--) {
            var row = "";        
            for (var index in arr_data[i]) {
                row += '"' + arr_data[i][index] + '",';
            }
            row.slice(0, row.length - 1);
            //add a line break after each row
            csv += row + '\r\n';
        }
    }
    else{
        for (var i = 0; i < arr_data.length; i++) {
            var row = "";        
            for (var index in arr_data[i]) {
                row += '"' + arr_data[i][index] + '",';
            }
            row.slice(0, row.length - 1);
            //add a line break after each row
            csv += row + '\r\n';
        }
    }

    if (csv == '') {        
        alert("No data found");
        return;
    }   
    
    // file name declaration change accordingly
    var file_name = "vehicleCount_report_"+fromDate+"_"+toDate;
    var uri = 'data:text/csv;charset=utf-8,' + escape(csv);    
    var link = document.createElement("a");    
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = file_name + ".csv";    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

$(document).ready(function(){
    detector_devices = [];
    $.ajax({
        url:'../../utils/cctv_raw.php',
        type:'POST',
        data:{
            type:'vehicle'
        },
        success:function(res){
            res = JSON.parse(res)
            $('#camera_scn').append('<optgroup label="CCTV Detectors">')
            for(var i=0;i<res.length;i++){
                if(res[i].type == "detector")
                    $('#camera_scn').append('<option value="'+res[i].SystemCodeNumber+'">'+res[i].SystemCodeNumber+'</option>')
            }
            $('#camera_scn').append('</optgroup>')
            detector_devices = detector_devices.concat(res)
        }
    })

    $.ajax({
        url:'../../utils/atcc_devices.php',
        type:'POST',
        success:function(res){
            res = JSON.parse(res)
            $('#camera_scn').append('<optgroup label="ATCC Detectors">')
            for(var i=0;i<res.length;i++){
                $('#camera_scn').append('<option value="'+res[i].SystemCodeNumber+'">'+res[i].SystemCodeNumber+'</option>')
            }
            $('#camera_scn').append('</optgroup>')
            detector_devices = detector_devices.concat(res)
        }
    })

    $.ajax({
        url:'../../utils/travel_time/get_link_detectors.php',
        type:'POST',
        success:function(res){
            res = JSON.parse(res)
            $('#camera_scn').append('<optgroup label="Link Detectors">')
            for(var i=0;i<res.length;i++){
                $('#camera_scn').append('<option value="'+res[i].SystemCodeNumber+'">'+res[i].SystemCodeNumber+'</option>')
            }
            $('#camera_scn').append('</optgroup>')
            detector_devices = detector_devices.concat(res)
        }
    })

    var _scn='', _fromDate='', _toDate='',allLinks=''
    get_dt = function(){
        $('#vehicle_count').DataTable({
            "processing": true,
            "serverSide": true,
            "searching": false,
            "order":[[1,"desc"]],
            "ajax": {
                "url": "../../utils/get_vehicle_data.php",
                "type": "POST",
                "data": function ( d ) {
                    if($('#camera_scn').val() == 'all')
                        d.scn = null
                    else
                        d.scn = $('#camera_scn').val();
                    _scn = d.scn

                    if($('#from').val() == "")
                        d.fromDate = '1111-11-11 00:00:00'
                    else
                        d.fromDate = $('#from').val()
                    _fromDate = d.fromDate

                    if($('#to').val() == "")
                        d.toDate = '2099-12-30 23:59:59'
                    else
                        d.toDate = $('#to').val()
                    _toDate = d.toDate

                    $('input[name=orderCol]').attr('value',d.order[0].column)
                    $('input[name=orderDir]').attr('value',d.order[0].dir)

                },
                // dataFilter:function(res){
                //     var check = JSON.parse(res);
                //     // $('.new_ttime').html(check.latestVal)
                //     // $('.new_lupdated').html(check.latestTime)
                //     $('.graph_container svg').remove();
                //     // $('.graph_container').append('<svg width="1000" height="700"></svg>')
                //     // creategraph();
                //     // draw(check.data);
                //     // v12(check.data)
                //     allLinks = check.links.Links.split(",")
                //     getGraphData(_scn,_fromDate,_toDate,allLinks)
                //     $('input[name=totalValues]').attr('value',(JSON.parse(res)).recordsTotal)
                //     return res;
                // }
                dataFilter:function(res){
                    console.log((JSON.parse(res)).recordsTotal)
                    $('input[name=totalValues]').attr('value',(JSON.parse(res)).recordsTotal)
                    return res
                },
            },
            "columns": [
                { "data": "camera_scn" },
                { "data": "count" }
            ]
        });
    }

    get_dt()

    $('#createReport').on('click',function(){
        $('#vehicle_count').DataTable().destroy()
        get_dt()
    })

    download_report = function(){

        var downloadPermission = false;

        $.ajax({
            url: '../../utils/get_roles.hh',
            type: 'POST',
            success: function(result) {
                var id_set = jQuery.parseJSON(result);
                downloadPermission = true;

                if(downloadPermission){

                    var scnval = $('#camera_scn').val();
                    var fromDate=$('#from').val();
                    var toDate=$('#to').val();
                                    
                    if($('#from').val() == "")
                        fromDate = '1111-11-11 00:00:00'

                    if($('#to').val() == "")
                        toDate = '2099-12-30 23:59:59'

                    if(scnval == 'all')
                        scnval = null

                    // formatted_fromDate = fromDate.substr(fromDate.lastIndexOf("-")+1,fromDate.length) + "-" + fromDate.substr(fromDate.indexOf("-")+1,fromDate.lastIndexOf("-")-3)+ "-" + fromDate.substr(0,fromDate.indexOf("-")) + " " + fromTime
                    // formatted_toDate = toDate.substr(toDate.lastIndexOf("-")+1,toDate.length) + "-" + toDate.substr(toDate.indexOf("-")+1,toDate.lastIndexOf("-")-3)+ "-" + toDate.substr(0,toDate.indexOf("-")) + " " + toTime
                                        
                    scn = scnval
                    start_time = fromDate
                    end_time = toDate

                    var q = new Date();
                    var m = q.getMonth();
                    var d = q.getDate();
                    var y = q.getFullYear();
                    var date = new Date(y,m,d);
                    mydate=new Date(fromDate);
                    
                    ////console.log((date-mydate)/86400000);

                    // if((date-mydate)/86400000 > 60){
                    //     alert("Please use Archival Report Screen for searches before 60 days.")
                    //     return;
                    // }

                    if(fromDate > toDate){
                        alert("From Date should be less than To Date");
                        return;
                    }
                    else{
                        $.ajax({
                            url: '../../utils/vehiclecount_report.php',
                            type: 'POST',
                            data:{
                                scn:scnval,fromDate:fromDate,toDate:toDate,download:'1',draw:1,length:$('input[name=totalValues]').attr('value'),order:[{column:$('input[name=orderCol]').attr('value'),dir:$('input[name=orderDir]').attr('value')}]
                            },
                            success: function(result) {
                                result = JSON.parse(result)
                                if(result.length == 2){
                                    alert("Connection Error please try again");
                                }
                                else{
                                    // $.ajax({
                                    //     url: '../../utils/cctv_raw.php',
                                    //     type:'POST',
                                    //     data:{
                                    //         type:'vehicle'
                                    //     },
                                    //     success: function(result_devices) {
                                            
                                            $.ajax({
                                                url: '../../utils/get_username.hh',
                                                type: 'POST',
                                                success: function(result_username) {
                                                    var username = result_username;
                                                    var currentdate = new Date(); 
                                                    var ts = "Downloaded at: " + currentdate.getDate() + "/"
                                                                    + (currentdate.getMonth()+1)  + "/" 
                                                                    + currentdate.getFullYear() + " @ "  
                                                                    + currentdate.getHours() + ":"  
                                                                    + currentdate.getMinutes() + ":" 
                                                                    + currentdate.getSeconds();

                                                    console.log(detector_devices)
                                                    json_to_csv(result.data,"Vehicle Count Report",true,fromDate,toDate,detector_devices,username,ts);

                                                }
                                            });
                                    //     }
                                    // });

                                }
                            }
                        });
                    }

                } else{

                    alert("Permission denied. Please contact your administrator");
                }

            }

        });

    }
    $("#downloadReport").click(function() {
            download_report();
    });

})