var id = $("input[name='id']:checked").val();
// console.log("id = ".id);

$(document).ready(function () {

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
    var vid = getUrlParameter('id');


    $(".savebtn").click(function () {
        var myFormData = new FormData();

        var subtypeName = $("#placeSubType").val();
        var descSubtype = $("#descriptionSubType").val();


        myFormData.append('place',vid),
        myFormData.append('subname',subtypeName),
        myFormData.append('subdesc',descSubtype)



        if (subtypeName == " " || descSubtype == "") {
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please insert all the details</div>'
            });
        }


        $.ajax({
            url: '../../../models/situation/add_places_subtypes.hh',
            method: 'POST',
            processData: false,
            contentType: false,
            data: myFormData,
            
            success: function (res) {
                console.log(res);

                if (res == 'S') {
                    $.confirm({
                        type: 'green',
                        title: '<h3 class="text-success fw-bold mb-0">Message</h3>',
                        content: '<div class="fw-bold">Record added Successfully </div> ',
                        buttons: {
                            Ok: function () {
                                // localStorage.removeItem("createZoneData");
                                // location.reload();
                                window.location.href = "edit_place_type.html?id="+vid;
                            }
                        }
                    });
                }
                else if (res == 'F') {
                    $.alert({
                        type: 'red',
                        title: '<h3 class="text-danger fw-bold mb-0">Message </h3>',
                        content: '<div class="fw-bold">Sorry, there has been a technical problem. Please report this error by sending an email to support@itspe.co.in with a screen shot </div>'
                    });
                }
                else if (res == 'Fail') {
                    $.alert({
                        type: 'red',
                        title: '<h3 class="text-danger fw-bold mb-0">Message </h3>',
                        content: '<div class="fw-bold">You haven\'t made any changes </div>'
                    });
                }
            }
        });
    });





});