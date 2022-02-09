situationSCN = "";
$(document).ready(function(){

	$.ajax({
        url: '../../../models/utils/get_username.hh',
        type: 'POST',
        success: function(result) {
        	    if(result.length > 30){
                        window.location = "../index.html"
                }
        uname=result.trim();
        $('.modified').val(uname)
        $('.modified').parent().parent().css('display','none')
        }  
                
    });
	
	
	get_dt = function(){
        $('#dataTable').DataTable({
            "processing": true,
            "serverSide": true,
            "searching": false,
            "columnDefs": [ { orderable: false, targets: [0,1,3,4]}],
            "order":[[5,"desc"]],
            "ajax": {
                "url": "../../utils/get_tars_fault.php",
                "type": "POST",
                'dataSrc':function(res){
                    var check = res;
                    var return_data = new Array();
                    check = check.data
                    for(var i=0;i< check.length; i++){
                        return_data.push({
                        	// "radio":'<input type="radio" name="acc_record"></td>',
                            "SystemCodeNumber":check[i].SystemCodeNumber,
                            "DeviceName":check[i].DeviceName ,
                            "Online":(check[i].online == '1' ? "Online" : "Offline"),
                            "CaptureFailure":(check[i].capture_failure == '1' ? '--' : "Device Failure") ,
                            "Overheat":parseFloat(check[i].overheat) > 40.0 ? "Battery overheated at "+check[i].overheat+" Celcius" : "Battery at nominal temperature of "+check[i].overheat+" Celcius",
                            "LastUpdated": check[i].LastUpdated

                        })
                    }
                    return return_data;
                }
            },
            "columns": [
				// { "data": "radio" },
                { "data": "SystemCodeNumber" , class: "a_scn"},
                { "data": "DeviceName" , class: "a_sdesc"},
                { "data": "Online" , class: "a_online"},
                { "data": "CaptureFailure" , class: "a_cfail"},
                { "data": "Overheat" , class: "a_overheat"},
                { "data": "LastUpdated" , class: "a_lupt"}
            ]
        });

    }

    get_dt()

})