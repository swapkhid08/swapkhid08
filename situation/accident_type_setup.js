function openEditModal() {
	try{
		var name = $("input[type='radio'][name='mds']:checked").parent().parent().children()[2].innerHTML
		var num = $("input[type='radio'][name='mds']:checked").parent().parent().children()[3].innerHTML.toString();
		//console.log("Number"+num);
		$(".modal-body #name_modal")[0].innerHTML = name;
		$(".modal-body #num_modal").val(num) ;
		$("#editModal").modal();
	}
	catch(e){
		//console.log("I was here for"+e);
		alert("Please select a type to edit");
	}
}
function editRow(){
	var name = $('#name_modal')[0].innerHTML;
	var num=$('#num_modal').val();
	//console.log("I am called");
	$.ajax({
		url: '../../utils/edit_accident_type.php',
		data :{name:name,num:num},
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
		//console.log("I was here for"+e);
		alert("Please select a type to edit");
	}
}
$(document).ready(function(){
	fetch_devices = function(){
				$('#accident_types').empty();
                $.ajax({
                	url: '../../situation/get_accident_types.hh',
					type: 'POST',
                	success: function(result) {
						var devices_set = jQuery.parseJSON(result);
						for(i=devices_set.length-1; i>=0;i--){
							append = '<tr>'
							if (devices_set[i].name != "VMS" && devices_set[i].name != "Camera") {
								append += '<td><input type="radio" name="mds"></td>'
							}
							else{
								append += '<td>Cannot Be Edited</td>'
							}
							append += '<td>'+(devices_set.length - i)+'</td>'
							append += '<td>'+devices_set[i].name+'</td>'
							append += '<td>'+devices_set[i].action+'</td>'
							append += '<td>'+devices_set[i].updated_time+'</td>'
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
			var type_num=$('#type_num').val();
			$.ajax({
				url: '../../utils/add_accident_type.php',
				data :{name:type_name,num:type_num},
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
				url: '../../utils/del_accident_type.php',
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
