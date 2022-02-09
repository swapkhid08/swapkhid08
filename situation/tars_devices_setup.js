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
            "order":[[1,"desc"]],
            "ajax": {
                "url": "../../utils/get_tars_devices.php",
				"type": "POST",
                'dataSrc':function(res){
                    var check = res;
                    var return_data = new Array();
                    check = check.data
                    for(var i=0;i< check.length; i++){
                        return_data.push({
                        	"radio":'<input type="radio" name="acc_record"></td>',
                            "SystemCodeNumber":check[i].SystemCodeNumber,
                            "DeviceName":check[i].DeviceName ,
                            "PhoneNumber":check[i].PhoneNumber,
                            "ImeiNumber":check[i].ImeiNumber
                        })
                    }
                    return return_data;
                }
            },
            "columns": [
				{ "data": "radio" },
                { "data": "SystemCodeNumber" , class: "a_scn"},
                { "data": "DeviceName" , class: "a_sdesc"},
                { "data": "PhoneNumber" , class: "a_phno"},
                { "data": "ImeiNumber" , class: "a_imei"}
            ]
        });

    }

    get_dt()

	$('#add_acc_btn').click(function(){

		var scn=$('.scn').val(),
			sdesc=$('.sdesc').val(),
			phno=$('.phno').val(),
			imei=$('.imei').val()

		if(sdesc == ""){
			alert("Please enter Device Name")
			return;
		}
		
		$.ajax({
			url:'../../utils/add_tars_device.php',
			type:'POST',
			data:{SystemCodeNumber:scn,DeviceName:sdesc,PhoneNumber:phno,ImeiNumber:imei},
			success:function(res){
				location.reload()
			}
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
		
		$('.up_scn').html($('.a_scn',currEle).html());
		$('.up_sdesc').val($('.a_sdesc',currEle).html());
		$('.up_phno').val($('.a_phno',currEle).html());
		$('.up_imei').val($('.a_imei',currEle).html());

	});
	
	$('.update_acc_btn').click(function(){	
		

		var scn=$('.up_scn').html(),
			sdesc=$('.up_sdesc').val(),
			phno=$('.up_phno').val(),
			imei=$('.up_imei').val()
		
		$.ajax({
			url:'../../utils/update_tars_device.php',
			method:'POST',
			data:{SystemCodeNumber:scn,DeviceName:sdesc,PhoneNumber:phno,ImeiNumber:imei},
			success:function(res){
				//alert(res);
				location.reload();				
			}
		});
	});

	$('.delete_group').click(function(){
		if($('input[name=acc_record]:checked').length == 0){	
			alert('Select a record to delete');
			return;
		}	
		var delRecord=$('.a_scn',$('input[name=acc_record]:checked').closest('tr')).html()
		//console.log(delRecord);	

		if(confirm("Are you sure you want to delete this Situation?")){
			$.ajax({
				url:'../../utils/delete_tars_device.php',
				method:'POST',
				data:{SystemCodeNumber:delRecord},
				success:function(res){
					if(res)
						location.reload();

				}
			})
		}
		else
			return
	
	})
})