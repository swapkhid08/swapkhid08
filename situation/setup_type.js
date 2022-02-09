
// function openModal () {
// 	$("#myModal").modal();
// }
// function refresh () {
// 	//location.reload();
// }

function deleteRecord () {
	try {
        var mds = $("input[type='radio'][name='mds']:checked").closest('tr');
			// console.log(mds)
            var typeID = mds.children()[1].innerHTML.trim();
          
            $.confirm({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Warning!</h3>',
                content: '<div class="fw-bold">Are you sure you want to delete this place type? Doing so will also delete all subtypes and data associated to the type.</div>',
                buttons: {
                    yes: function () {
                        $.ajax({
                            url: '../../../models/situation/delete_place_types.hh',
                            data: { place: typeID},
                            type: 'POST',
                            success: function (result) {
                                // console.log(result)
                                if (result == 'S') {
                                    $.confirm({
                                        type: 'green',
                                        title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
                                        content: '<div class="fw-bold">Entry is Deleted Succesfully</div>',
                                        buttons: {
                                            Ok: function () {
                                                // fetch_data();
                                                window.location.href='setup_type.html';
                                            }
                                        }
                                    });
                                } else {
                                    $.alert({
                                        type: 'red',
                                        title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                                        content: '<div class="fw-bold">Sorry, there has been a technical problem. Please report this error by sending an email to support@itspe.co.in with a screen shot</div>'
                                    });
                                }
                            }
                        });
                    },
                    no: function () {
                        $.alert({
                            type: 'red',
                            title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                            content: '<div class="fw-bold">Selected Operation is Cancelled</div>',
                        });
                    }
                }
            });
		}
        catch (e) {
            // console.log("oh noooo!")
            // console.log(e);
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please select a record to delete</div>'
            });
        }
        

	}
	
// }

$(document).on('click', ".deleteBtn", function () {
	var partr = $(this).closest('tr');
	var type = partr.children()[0].innerHTML;
	if (confirm("Are you sure you want to delete the selected record?")) {

		$.ajax({
			url: '../../../models/situation/delete_place_types.hh',
			data: { type: type },
			type: 'POST',
			success: function (result) {
				$.alert({
					type: 'green',
					title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
					content: '<div class="fw-bold">Place type is deleted</div>'
				});
				fetch_data();
			}
		});
	}
});
// $(document).on('click', ".editBtn", function () {
// 	var partr = $(this).closest('tr');
	
// 	var id = partr.children()[0].innerHTML;
	
// 	window.location.href='edit_place_type.html?id='+id;
// });
// function openEditModal () {
// 	window.location.href='edit_place_type.html';
	// try {
	// 	var id = $("input[type='radio'][name='mds']:checked").parent().parent().children()[1].innerHTML;
    //     console.log(id)
	// 	window.location.href='edit_place_type.html?id='+id;
	// 	return;

	// }
	// catch (e) {
    //     console.log(e)
	// 	$.alert({
    //         type: 'red',
    //         title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
    //         content: '<div class="fw-bold">Please select a record to edit</div>'
    //     });
	// }
// }

function openAddModal () {
	window.location.href='add_place_type.html';
	//$("#addModal").modal();
}




// Add row on submit
function addRow () {
	// var group = sanitize($('#group').val());


	// var type = sanitize($('#asset_type').val());

	// var year = sanitize($('#year').val());

	// var month = sanitize($('#month').val());
	// var day = sanitize($('#day').val());
	// if((year==''||month==''||day=='')||(year==0&&month==0&&day==0))
	// {
	// 	$.alert({
	// 		type: 'red',
	// 		title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
	// 		content: '<div class="fw-bold">Please enter the valid Frequency of inspection</div>'
	// 	});
	// 	return
	// }
	// $.ajax({
	// 	url: '../../../models/asset_management/add_asset_types.hh',
	// 	data: { type: type, year: year, month: month, day: day, group: group },
	// 	type: 'POST',
	// 	success: function (result) {
	// 		if(result == 'success'){
	// 			$("#cancelModal_add").click();
	// 			$.alert({
	// 				type: 'green',
	// 				title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
	// 				content: '<div class="fw-bold">Asset types are added</div>'
	// 			});
	// 			// setTimeout(function(){ window.location.href='asset_frequency.html'; }, 2000);
	// 		}else if(result == 'E'){
	// 			$.alert({
	// 				type: 'red',
	// 				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
	// 				content: '<div class="fw-bold">Asset type already added. Please add other asset type.</div>'
	// 			});
	// 			return;
	// 		}else{
	// 			$.alert({
	// 				type: 'red',
	// 				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
	// 				content: '<div class="fw-bold">Sorry, there has been a technical problem. Please report this error by sending an email to support@itspe.co.in with a screen shot</div>'
	// 			});
	// 			return;
	// 		}
			
	// 	}
	// });
}

// edit form and on submit
function editRow () {

	// var type = sanitize($('#e_asset_type').val());

	// var year = sanitize($('#e_year').val());

	// var month = sanitize($('#e_month').val());
	// var day = sanitize($('#e_day').val());
	// var id = $("input[type='radio'][name='mds']:checked").parent().parent().children()[1].innerHTML;

	// var group = sanitize($('#e_group').val());
	
	// $.ajax({
	// 	url: '../../../models/asset_management/edit_asset_types.hh',
	// 	data: { type: type, year: year, month: month, day: day, id: id, group: group },
	// 	type: 'POST',
	// 	success: function (result) {
	// 		$("#cancelModal_edit").click();
	// 		$.alert({
	// 			type: 'green',
	// 			title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
	// 			content: '<div class="fw-bold">Selected asset type has been updated</div>'
	// 		});
	// 		fetch_data();

	// 	}
	// });
}


// fetch data method displays on table
$(document).ready(function () {

	fetch_data = function () {
		$('#fetchingData').DataTable({
			"select": true,
			"processing": true,
			"stateSave": true,
			"serverside":true,
			"destroy": true,
			"scrollY": "500px",
			"scrollCollapse": true,
			"dom": ' <"search"fl><"top">rt<"bottom"ip><"clear">',
			"language": {
				"emptyTable": "No data available in table"
			},
			"order": [[1, "desc"]],
			"ajax": {
				"url": '../../../models/situation/get_places_types.hh',
				"type": "POST",
				dataSrc: '',
			},
			"columns": [
				{ "data": "#", render: renderCheck},
				{ "data": "TypeID"},
				{ "data": "TypeName" },
				{ "data": "TypeDescription" },
				
			],
           
			"columnDefs": [
				{ className: "text-center", "targets": [0] },
				{ className: "text-center", "targets": [1] },
				{ className: "text-center", "targets": [2] },
				{ className: "text-center", "targets": [3] },
				{ orderable: false, targets: [0,3] }
			],
			"fnDrawCallback": function( oSettings ) {
				$('#fetchingData tbody tr').each(function(){
					$('td:nth-child(2),td:nth-child(5)',this).css('display','none')
			  	})
		  	}
		});
		function renderCheck (data, type, full, meta) {
			return '<input type="radio" name="mds">';
		}
		
		function edtBtns (data, type, full, meta) {
			if(full.is_table == 0){
				return '<a href="javascript:void(0)" class="deleteBtn text-primary" title="Delete"><i class="fas fa-trash-alt"></i></a>';
			}else{
				//return '<a href="javascript:void(0)" class="editBtn text-primary" title="Edit"><i class="fas fa-edit"></i></a> ';
				return '';
			}
			
		}

	}
	fetch_data();


	$(".editBtn").click(function(){
		try{
		var id = sanitize($("input[type='radio'][name='mds']:checked").parent().parent().children()[1].innerHTML)
		window.location.href='edit_place_type.html?id='+id;
		return;
		}
		catch{
			$.alert({
				type:'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please select a row to perform this action</div>',
			});
		}
		// localStorage.setItem("id",id);
		// localStorage.setItem("id", "id"); //setter
	});


	
});




