var list_types=""; //defined globally
function openEditModal() {
	try{
		var name = $("input[type='radio'][name='mds']:checked").parent().parent().children()[2].innerHTML
		var list = $("input[type='radio'][name='mds']:checked").parent().parent().children()[3].innerHTML
		//console.log(name+"***"+list);
		var list_array = list.split(",");
		$('#edit_list_modal').empty();
        $.ajax({
        	url: '../../situation/get_accident_types.hh',
			type: 'POST',
        	success: function(result) {
				list_types = jQuery.parseJSON(result);
				//console.log("Main :"+list_types.length);
				$('#edit_list_modal').empty();
				for(i=list_types.length-1; i>=0;i--){
					append = '<tr>'
					var count =0; 
					for (var j = list_array.length - 1; j >= 0; j--) {
						if (list_array[j] == list_types[i].name) {
							count += 1;
						}
					}
					if (count > 0) {
						//console.log('1');
						append += '<td id="td_list_edit'+i+'">'+list_types[i].name+'</td><td><input type="checkbox" id="check_list_edit'+i+'" name="vehicle" checked></td>'
						append += '</tr>'
					} 
					else{		
						//console.log('2');
						append += '<td id="td_list_edit'+i+'">'+list_types[i].name+'</td><td><input type="checkbox" id="check_list_edit'+i+'" name="vehicle"></td>'
						append += '</tr>'
					}
					$('#edit_list_modal').append(append);
				}
        	}
        });
		$("#editModal").modal();
		$(".modal-body #name_modal")[0].innerHTML = name;
		//$(".modal-body #list_modal").val(sh_des);
	}
	catch(e){
		////console.log("I was here for"+e);
		alert("Please select a action to edit");
	}
}
function editRow(){
	var name = $('#name_modal')[0].innerHTML;
	//var action_list=$('#action_list').val();
	var data_entry_list = [];
	for (var i = list_types.length - 1; i >= 0; i--) {
		var data_objects = {};
		////console.log($("#td_list"+i)[0].innerHTML.toString()+$("#check_list"+i).is(":checked"));
		data_objects['item'] = $("#td_list_edit"+i)[0].innerHTML.toString();
		data_objects['value'] = $("#check_list_edit"+i).is(":checked");
		data_entry_list.push(data_objects);
	}
	////console.log(name);
	////console.log(data_entry_list);
	$.ajax({
		url: '../../utils/edit_accident_action.php',
		data :{name:name,list:data_entry_list},
		type: 'POST',
		success: function(result) {
			$("#cancelModal_edit").click();
			alert("Selected action has been edited")
			fetch_devices();
		}
	});
}

$(document).ready(function(){
	fetch_devices = function(){
				$('#accident_actions').empty();
                $.ajax({
                	url: '../../situation/get_accident_actions.hh',
					type: 'POST',
                	success: function(result) {
						var devices_set = jQuery.parseJSON(result);
						for(i=devices_set.length-1; i>=0;i--){
							append = '<tr>'
							append += '<td><input type="radio" name="mds"></td>'
							append += '<td>'+(devices_set.length - i)+'</td>'
							append += '<td>'+devices_set[i].name+'</td>'
							append += '<td>'+devices_set[i].list+'</td>'
							append += '<td>'+devices_set[i].updated_time+'</td>'
							append += '</tr>'
							$('#accident_actions').append(append);
						}
                	}
                });
                 $.ajax({
                	url: '../../situation/get_accident_types.hh',
					type: 'POST',
                	success: function(result) {
						list_types = jQuery.parseJSON(result);
						////console.log("Main :"+list_types.length);
						$('#checkboxes').empty();
						for(i=list_types.length-1; i>=0;i--){
							append = '<tr>'
							append += '<td id="td_list'+i+'">'+list_types[i].name+'</td><td><input type="checkbox" id="check_list'+i+'" name="vehicle"></td>'
							append += '</tr>'
							$('#checkboxes').append(append);
						}
                	}
                });
        }
    fetch_devices();
});


$(document).ready(function(){
        fetchdata = function(){
            var action_name=$('#action_name').val();
			var action_list=$('#action_list').val();
			var data_entry_list = [];
			for (var i = list_types.length - 1; i >= 0; i--) {
				var data_objects = {};
				////console.log($("#td_list"+i)[0].innerHTML.toString()+$("#check_list"+i).is(":checked"));
				data_objects['item'] = $("#td_list"+i)[0].innerHTML.toString();
				data_objects['value'] = $("#check_list"+i).is(":checked");
				data_entry_list.push(data_objects);
			}
			//console.log(data_entry_list.toString());
			$.ajax({
				url: '../../utils/add_accident_actions.php',
				data :{name:action_name,list:data_entry_list},
				type: 'POST',
				success: function(result) {
					$("#cancelModal").click();
					alert(result)
					fetch_devices();
				}
            });
        }
        $("#add_action_submit").click(function() {
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
				url: '../../utils/del_accident_action.php',
				data :{name:name},
				type: 'POST',
				success: function(result) {
					if(result.length == 2){
						alert("Connection Error please try again");
					}
					else{
						alert("Deleted the Action Succesfully");
						fetch_devices();
					}
				}
            });
	}
	catch(e){
		alert("Please select a action to delete")
	}
}
