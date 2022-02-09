function openEditModal() {
	try{
		var name = $("input[type='radio'][name='mds']:checked").parent().parent().children()[2].innerHTML
		var nor = $("input[type='radio'][name='mds']:checked").parent().parent().children()[4].innerHTML
		var eas = $("input[type='radio'][name='mds']:checked").parent().parent().children()[5].innerHTML
		$(".modal-body #name_modal")[0].innerHTML = name;
		$("#nor_modal").val(nor);
		$("#eas_modal").val(eas);
		$("#editModal").modal();
	}
	catch(e){
		////console.log("I was here for"+e);
		alert("Please select a vehicle to edit");
	}
}
function editRow(){
	var name = $('#name_modal')[0].innerHTML;
	var nor=$('#nor_modal').val();
	var eas=$('#eas_modal').val();
	var type = $('#type_modal').val();
	////console.log("I am called");
	$.ajax({
		url: '../../utils/edit_vehicle.php',
		data :{name:name,nor:nor,eas:eas,type:type},
		type: 'POST',
		success: function(result) {
			$("#cancelModal_edit").click();
			alert("Selected type has been edited")
			fetch_devices();
		}
	});
}
function addTypemodal() {
	try{
		$("#add_modal").modal();
	}
	catch(e){
		////console.log("I was here for"+e);
		alert("Please select a type to edit");
	}
}
$(document).ready(function(){
	fetch_devices = function(){
				$('#accident_types').empty();
                $.ajax({
                	url: '../../utils/get_vehicles.php',
					type: 'POST',
                	success: function(result) {
						var devices_set = jQuery.parseJSON(result);
						for(i=devices_set.length-1; i>=0;i--){
							append = '<tr>'
							append += '<td><input type="radio" name="mds"></td>'
							append += '<td>'+(devices_set.length - i)+'</td>'
							append += '<td>'+devices_set[i].name+'</td>'
							append += '<td>'+devices_set[i].VehicleType+'</td>'
							append += '<td>'+devices_set[i].Northing+'</td>'
							append += '<td>'+devices_set[i].Easting+'</td>'
							append += '<td>'+devices_set[i].Updated_time+'</td>'
							append += '</tr>'
							$('#accident_types').append(append);
						}
                	}
                });
        }
    fetch_devices();
});


$(document).ready(function(){
        fetchdata = function(){
            var type_name=$('#type_name').val();
			var type_nor=$('#type_nor').val();
			var type_eas=$('#type_eas').val();
			var type_type = $('#main_type').val();
			$.ajax({
				url: '../../utils/add_vehicle.php',
				data :{name:type_name,nor:type_nor,eas:type_eas,type:type_type},
				type: 'POST',
				success: function(result) {
					$("#cancelModal").click();
					alert(result);
					fetch_devices();
				}
            });
        }
        $("#add_type_submit").click(function() {
                fetchdata();
        });
        $("#edit").click(function() {
                fetchdata();
        });

});

function deleteRow() {
	try{
		var name = $("input[type='radio'][name='mds']:checked").parent().parent().children()[2].innerHTML
		$.ajax({
				url: '../../utils/del_vehicle.php',
				data :{name:name},
				type: 'POST',
				success: function(result) {
					if(result.length == 2){
						alert("Connection Error please try again");
					}
					else{
						alert("Deleted the Type Succesfully");
						fetch_devices();
					}
				}
            });
	}
	catch(e){
		alert("Please select a type to delete")
	}
}
