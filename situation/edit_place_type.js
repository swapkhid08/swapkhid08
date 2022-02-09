// var id = $("input[name='id']:checked").val();
// console.log("id = ".id);
var vid;
$(document).ready(function () {
    //took the id from url
    var getUrlParameter = function getUrlParameter(sParam) {
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
    vid = getUrlParameter('id');
    console.log(vid);

//took place details type and description
    $.ajax({
        url: '../../../models/situation/get_places_types.hh',
        method: 'POST',
        data: {
            id: vid
        },
        success: function (res) {
            // $('#type').html('');
            res = JSON.parse(res);
            for (var i = 0; i < res.length; i++) {

                if (vid == res[i].TypeID) {
                    $('#placeType').val(res[i].TypeName);   
                    $('#description').val(res[i].TypeDescription);

                    //$('#supporttype').append('<option value="' + res[i].TypeID + '" selected>' + res[i].TypeDescription + '</option>')
                }
            }
        }
    })
//table for subtype on page using modal
    fetch_groups();
	function fetch_groups () {
		$('#dataTable').dataTable().fnDestroy();
		$('#dataTable').DataTable({
            "searching": false,
            "pageLength": 5,
            "destroy": true,
			"columnDefs": [{ orderable: false, targets: [0]}],
            "order": [[3, "desc"]],
            
			
			"columns": [
				{ "data": "radio" },
				{ "data": "id" },
				{ "data": "TypeName"},
				{ "data": "TypeDescription"}
			],
			"fnDrawCallback": function (oSettings) {
				$('#dataTable tbody tr').each(function () {
					$('td:nth-child(2)', this).css('display', 'none')
				})
            },
            "ajax": {
				"url": "../../../models/situation/get_place_subtypes.hh",
				"type":"POST",
                "data": {
                    "place": vid
                },

				'dataSrc': function (res) {
					var check = res;
					var return_data = new Array();
					// check = check.data
					for (var i = 0; i < check.length; i++) {
						return_data.push({
							"radio": '<td><input type="radio" name="mds"></td>',
							"id": check[i].SubTypeID,
							"TypeName": check[i].TypeName,
							"TypeDescription": check[i].TypeDescription,
						})
					}
					return return_data;
				}
			},
		});
        // function renderName (data, type, full, meta) {
        //     var name =  full.TypeName ;
        //     return name;
        // }
        // function renderDescription (data, type, full, meta) {
        //     var desc = full.TypeDescription;
        //     return desc
        // }
	}
    $(".savebtn").click(function () {
        var myFormData = new FormData();
            placeType = $("#placeType").val(),
            description = $("#description").val(),
            myFormData.append('place', vid)
            myFormData.append('name', placeType)
            myFormData.append('desc', description)
            if(placeType == "" || description == ""){
                $.alert({
                    type: 'red',
                    title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                    content: '<div class="fw-bold">Please insert all the details</div>'
                });
            }

        $.ajax({
            url: '../../../models/situation/edit_place_types.hh',
            method: 'POST',
            processData: false,
            contentType: false,
            data: myFormData,
            success: function (res) {
                console.log(res);
                if (res == 'success') {
                    $.confirm({
                        type: 'green',
                        title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
                        content: '<div class="fw-bold">Record added Successfully </div> ',
                        buttons: {
                            Ok: function () {
                                // localStorage.removeItem("createZoneData");
                                // location.reload();
                                window.location.href = "setup_type.html";
                            }
                        }
                    });
                }
                else{
                    $.alert({
                        type: 'red',
                        title: '<h3 class="text-danger fw-bold mb-0">Message </h3>',
                        content: '<div class="fw-bold">Sorry, there has been a technical problem. Please report this error by sending an email to support@itspe.co.in with a screen shot </div>'
                    });
                }

             }
        });
    });
    $("#add_subType").click(function () {
            var id = vid
            window.location.href='add_subtype.html?id='+id;
		$.ajax({
			url: '../../../models/situation/add_places_subtypes.hh',
			type: 'POST',
			success: function (result) {
                if (result != '' && result != 'S') {
                                result = JSON.parse(result);
                                // console.log(result);
                                if (result.length > 0) {
                                    for (var i = 0; i < result.length; i++) {
                                        // var d = i + 1;
                                        var funscn = "'" + result[i].SubTypeID + "'";
                                        // view_tbody +=  '<tr><td>'+result[i].SubTypeID+'</td><td><input type= "text" class="inputDisabled up_sdesc form-control" value="' + result[i].TypeName + '" disabled></td><td><input type= "text" class="inputDisabled form-control" value="' + result[i].TypeDescription + '" disabled></td><td><button onclick="editDetails(event);" class="btn btn-customPrimary"> <span class="fa fa-edit btn-icon" /></button></td><td><button onclick="deleteDetails(this);" class="btn btn-customPrimary "> <span class="far fa-trash-alt btn-icon" /></button></td></tr>';
                                        view_tbody +=  '<tr><td><input id="name'+result[i].SubTypeID+'"type= "text" class="input'+result[i].SubTypeID+' up_sdesc form-control inp" value="' + result[i].TypeName + '" ></td><td><input id="desc'+result[i].SubTypeID+'"type= "text" class="inputDisabled'+result[i].SubTypeID+' form-control inpDisable" value="' + result[i].TypeDescription + '" ></td></tr>';
                                    }
                                    view_tbody += '<tr><td colspan="5"><button class="btn btn-primary update_btn">Submit</button></td></tr>';
                                    $('#view_tbody').html(view_tbody);
                                }

                }
            }
        })
    });
});


function editSubtypeRecord() {
    try{
		subtypeid = sanitize($("input[type='radio'][name='mds']:checked").parent().parent().children()[1].innerHTML);
        console.log(vid +"hello");
		window.location.href='edit_subtype.html?subtypeid='+subtypeid;
		return;
		}
		catch{
			$.alert({
				type:'red',
				title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
				content: '<div class="fw-bold">Please select a row to perform this action</div>',
			});
		}
    };
    // window.location.href='edit_subtype.html';

    //     var id = sanitize($("input[type='radio'][name='mds']:checked").parent().parent().children()[1].innerHTML)
    //     window.location.href='edit_subtype.html?id='+vid &'PostData2='+id
  
    
//     $.ajax({
//         url: '../../../models/situation/add_places_subtypes.hh',
//         type: 'POST',
//         // data:{
//         //     place : vid
//         // },
//         success: function (result) {
//             if (result != '' && result != 'S') {
//                             result = JSON.parse(result);
//                             // console.log(result);
//                             if (result.length > 0) {
//                                 for (var i = 0; i < result.length; i++) {
//                                     // var d = i + 1;
//                                     var funscn = "'" + result[i].SubTypeID + "'";
//                                     // view_tbody +=  '<tr><td>'+result[i].SubTypeID+'</td><td><input type= "text" class="inputDisabled up_sdesc form-control" value="' + result[i].TypeName + '" disabled></td><td><input type= "text" class="inputDisabled form-control" value="' + result[i].TypeDescription + '" disabled></td><td><button onclick="editDetails(event);" class="btn btn-customPrimary"> <span class="fa fa-edit btn-icon" /></button></td><td><button onclick="deleteDetails(this);" class="btn btn-customPrimary "> <span class="far fa-trash-alt btn-icon" /></button></td></tr>';
//                                     view_tbody +=  '<tr><td><input id="name'+result[i].SubTypeID+'"type= "text" class="input'+result[i].SubTypeID+' up_sdesc form-control inp" value="' + result[i].TypeName + '" ></td><td><input id="desc'+result[i].SubTypeID+'"type= "text" class="inputDisabled'+result[i].SubTypeID+' form-control inpDisable" value="' + result[i].TypeDescription + '" ></td></tr>';
            
            
//                                 }
//                                 view_tbody += '<tr><td colspan="5"><button class="btn btn-primary update_btn">Submit</button></td></tr>';
//                                 $('#view_tbody').html(view_tbody);
//                             }

//             }
//         }
//     })
// };

function deleteSubtypeRecord() {
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
                            url: '../../../models/situation/delete_place_subtypes.hh',
                            data: { id: typeID},
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
                                                window.location.href='edit_place_type.html?id='+vid;
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
        

    };
