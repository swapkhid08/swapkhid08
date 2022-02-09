$(document).ready(function(){
    // var mds = $("input[type='radio'][name='mds']:checked").closest('tr');
    // console.log(mds)
    // var typeID = mds.children()[1].innerHTML.trim();
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
    var id = getUrlParameter('subtypeid');

    $.ajax({
                url: '../../../models/situation/get_subtype_details.hh',
                type: 'POST',
                data:{id : id},
                success: function (result) 
                {
                    result = JSON.parse(result)
                    if(result != "")
                    {
                        $("#placeSubType").val(result[0].TypeName);
                        $("#descriptionSubType").val(result[0].TypeDescription);
                    }
                }
            })


    $(".savebtn").click(function(){
        var myFormData = new FormData();
    
    
           placeSubType = $("#placeSubType").val(),
           description = $("#descriptionSubType").val(),
    
            myFormData.append('id', id)
            myFormData.append('subname', placeSubType)
            myFormData.append('subdesc', description)
    
            if(placeSubType == "" || description == ""){
                $.alert({
                    type: 'red',
                    title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                    content: '<div class="fw-bold">Please insert all the details</div>'
                });
            }
    
            $.ajax({
                url: '../../../models/situation/edit_place_subtypes.hh',
                type: 'POST',
                processData: false,
                contentType: false,
                data: myFormData,
                success: function (result) {
                    if (result == 'success') {
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
                    else if (result == 'F') {
                        $.alert({
                            type: 'red',
                            title: '<h3 class="text-danger fw-bold mb-0">Message </h3>',
                            content: '<div class="fw-bold">Sorry, there has been a technical problem. Please report this error by sending an email to support@itspe.co.in with a screen shot </div>'
                        });
                    }
                }
            });
    });
   
});

