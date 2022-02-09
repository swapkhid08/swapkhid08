$(document).ready(function () {


    $(".savebtn").click(function () {
        var myFormData = new FormData();


        var type = $("#placeType").val();
        var description = $("#description").val();

        myFormData.append('name', type)
        myFormData.append('desc', description)


        if (type == '' || description == '') {
            $.alert({
                type: 'red',
                title: '<h3 class="text-danger fw-bold mb-0">Message </h3>',
                content: '<div class="fw-bold">Please enter all details to perform this action </div>'
            });
        }
        else {

            $.ajax({
                url: '../../../models/situation/add_places_types.hh',
                method: 'POST',
                processData: false,
                contentType: false,
                data: myFormData,
                success: function (res) {
                    // console.log(res);

                    if (res == 'S') {
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
                    else if (res == 'F') {
                        $.alert({
                            type: 'red',	
                            title: '<h3 class="text-danger fw-bold mb-0">Message </h3>',
                            content: '<div class="fw-bold">Sorry, there has been a technical problem. Please report this error by sending an email to support@itspe.co.in with a screen shot </div>'
                        });
                    }
                    else {
                        $.alert({
                            type: 'red',
                            title: '<h3 class="text-danger fw-bold mb-0">Message </h3>',
                            content: '<div class="fw-bold">Sorry, there has been a technical problem. Please report this error by sending an email to support@itspe.co.in with a screen shot </div>'
                        });
                    }
                }
            });
        }



    })
});