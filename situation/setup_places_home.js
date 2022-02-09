var id;
var SubTypeRef;
function addPlaceModal() {
	window.location.href = "setup_places.html";
}

// function editPlaceModal() {
// 	window.location.href = "edit_setup_places.html";
// }


$(document).ready(function () {
    
	function getPlaceData() {
		$.ajax({
			url: '../../../models/situation/get_all_places.hh',
			type: 'POST',
			data: { display: 'place' },
			success: function (res) {
				res = JSON.parse(res);
				// localStorage.removeItem("createZoneData");
				// localStorage.removeItem("editZoneData");
				$('#dataTable').DataTable({
					// "pageLength": 25,
					"scrollY": "500px",
					"scrollCollapse": true,
					"columnDefs": [
						{ orderable: false, targets: [0] },
						{
							targets: [4],
							className: 'text-center'
						}
					],
					"order": [[1, "asc"]],
					"data": res,
					"columns": [
						{
							data: "id",
							render: function (data) {
								return '<input type="radio" class="editor-active" name="id" id=' + data + ' value=' + data + '>';
							},
							className: "dt-body-center"
						},
						{ "data": "id" },
						{ "data": "ShortDescription" },
						{ "data": "LongDescription" },
						{ "data": "Features", render: renderBtn },
						// {"view": '<span class="viewdetails" scn="' + check[i].SystemCodeNumber + '" sdesc="' + check[i].ShortDescription + '" ldesc="' + check[i].LongDescription + '" nor="' + check[i].Northing + '" eas="' + check[i].Easting + '" stype="' + check[i].AccidentType + '"  stime="' + check[i].AccidentTime + '" etime="' + check[i].EndDate + '" sev="' + check[i].Severity + '" rby="' + check[i].ReportedBy + '" mby="' + check[i].ModifiedBy + '">View/Edit Details</span>'}

					],
					
				});
				$('.viewdetails').click(function () {			
					$('#viewModal').modal('show'); 			
				})
				function renderBtn (data, type, full, meta) {
					return '<a class="viewdetails" onclick="editTypes(' + full.id+ ')" title="View Details"><i class="fas fa-eye"></i></a>';	
				}
			}
		});
	}
	getPlaceData();
	

	$('#deleteZoneModal').click(function () {
		var id = $("input[name='id']:checked").val();

		
		if (id == '' || id == undefined) {
			$.alert({
				type: 'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please select a Place to edit</div>',
			});
		}
		else {
			$.confirm({
				type: 'dark',
				title: '<h3 class="text-primary fw-bold mb-0">Confirmation</h3>',
				content: '<div class="fw-bold">Are you sure, you want to delete this data ?</div>',
				buttons: {
					yes: function () {
						$.ajax({
							url: '../../../models/situation/delete_place.hh',
							type: 'POST',
							data: { id:id, deletezone: 'yes' },
							success: function (res) {
								$('#' + id).empty();
								$.confirm({
									type:'green',
									title: '<h3 class="text-success fw-bold mb-0">Success</h3>',
									content: '<div class="fw-bold">Selected data is deleted successfully</div>',
									buttons: {
										Ok: function () {
											window.location.href = "setup_places_home.html";
										}
									}
								}
								);
							}
						});
					},
					no: function () {
						$.alert({
							// type:'red',
							title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
							content: '<div class="fw-bold">Selected operation is cancelled</div>',
							buttons: {
								Ok: function () {
									window.location.href = "setup_places_home.html";
								}
							}
						});
						
					}
				}
			});
		}
	});

	$('#editPlaceModal').click(function () {
		
		id = $("input[name='id']:checked").val();
		localStorage.setItem("id",id);
		// localStorage.setItem("id", "id"); //setter
		

					
		if (id == '' || id == undefined) {
			$.alert({
				type:'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please select a row to perform this action</div>',
			});
		} else {
			window.location.href = "edit_setup_places.html?id="+id;
			return;
		}

	});
    function editDetails(id,typeid) {
        // document.getElementById("view_tbody").removeAttribute("disabled"); 
        $('.inpDisable').prop('disabled',true);
        $('.inputDisabled'+id).prop("disabled", false);
        $('.update_btn').click(function () {
    
            var myFormData = new FormData();
    
            var subname = $('#name'+id).val(),
                subdesc = $('#desc'+id).val(),
                subtype_id= $('#subid'+id).val(),
                type_id= $('.typeid'+typeid).val();

            myFormData.append('subname', subname)
            myFormData.append('place', type_id)
            myFormData.append('subdesc', subdesc)
            myFormData.append('id', subtype_id)
            
    
            $.ajax({
                url: '../../../models/situation/edit_place_types.hh',
                method: 'POST',
                processData: false,
                contentType: false,
                data: myFormData,
                success: function (res) {
                    if (res == 'success') {
                        $.alert({
                            type: 'green',
                            title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
                            content: '<div class="fw-bold">Situation recorded successfully</div>',
                            buttons: {
                                OK: function () {
                                    window.location.href = 'setup_places_home.html';
                                }
                            }
                        });
                    } else {
                        $.alert({
                            type: 'red',
                            title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                            content: '<div class="fw-bold">Sorry, there has been a technical problem. Please report this error by sending an email to support@itspe.co.in with a screen shot</div>'
                        });
                        return;
                    }
    
    
                }
            });
        });
      }
});

function editTypes(typeId) {
        $.ajax({
            url: '../../../models/situation/get_place_details.hh',
            data: { id: typeId },
            type: 'POST',
            success: function (result) {
                $('#view_tbody').html('');

                var view_tbody = '';
                if (result != '' && result != 'S') {
                result = JSON.parse(result);
                placeData = result[0];
                typeid = placeData.TypeID;
                subtypeid = placeData.SubTypeRef;
                subtypeid=subtypeid.split(',')
                    if (subtypeid.length > 0) {
                        $.ajax({
                            url: '../../../models/situation/get_place_subtypes.hh',
                            method: 'POST',
                            data: {
                                place: typeid
                            },
                            success: function (res) {
                                res = JSON.parse(res);
                                for (var i = 0; i < Object.keys(res).length; i++) {
                                    if (subtypeid.includes(res[i].SubTypeID)) {
										view_tbody +=  '<tr><th>'+res[i].TypeName+'</th><th>'+ res[i].TypeDescription+'</th></tr>';
                                    }
                                    $('#view_tbody').html(view_tbody);
                                }

                            }
                        });
                        
                    }
                }
                $("#viewModal").modal('show');
            }
            
        });
       
        // insertData(res[0]);
    // }
    
}



