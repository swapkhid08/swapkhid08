

$(document).ready(function() {
    device_type_select = new SlimSelect({
        select: '#device_type'
    });
    make_select = new SlimSelect({
        select: '#make_model'
    });
    $.ajax({
        url: '../../../models/detector/detector_report_filters.hh',
        type: 'POST',
        success: function (result) {
            var result = JSON.parse(result);
            // console.log(result);
            detector_types_arr = result.detector_types;
            make_modal_arr = result.make_model;
            if (detector_types_arr.length < 1) {
                $.alert({
                    type: 'red',
                    title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                    content: '<div class="fw-bold">No detector type added</div>'
                });
                $('#device_type').empty();
            }
            else {              
                devicetable_tbody = '';
                for (var i = 0; i < detector_types_arr.length; i++) {
                    devicetable_tbody += '<option value="' + detector_types_arr[i].TypeID + '">' + detector_types_arr[i].TypeDescription + '</option>';
                }
                $('#device_type').html(devicetable_tbody);
                $('#device_type').trigger('change')
            }
        }
    });
    $('#device_type').on('change',function(){
        var type = $(this).val();
        var makemodal = make_modal_arr[type];
        var makemodalarr = [];
        for (const key in makemodal) {
            if(key!=undefined){
                makemodalarr.push(makemodal[key])
            }           
        }
        $('#make_model').empty();
        for (var i = 0; i < makemodalarr.length; i++) {
            $('#make_model').append('<option value="' + makemodalarr[i].ID + '">' + makemodalarr[i].Make +' - '+ makemodalarr[i].Model + '</option>')
        }
        $('#make_model').change();
    });
    $('#make_model').change(function(){
        get_dt();
    });
    get_dt = function(){
        $('#dataTable').DataTable({
            "processing": true,
            "serverSide": true,
            "searching": false,
            "destroy":true,
            "order":[[1,"asc"]],
            "columnDefs": [ { orderable: false, targets: [0]}],
            "ajax": {
                "url": "../../../models/detector/get_class_pcu.hh",
                "type": "POST",
                "data":{makeid:$('#make_model').val()},
                'dataSrc':function(res){
                    var check = res;
                    var return_data = new Array();
                    check = check.data
                    for(var i=0;i<check.length; i++){
                       return_data.push({
                            "radio":'<input type="radio" name="edit_pcu" class_id="'+check[i].ID+'" binNumber="'+check[i].binNumber+'" class_name="'+check[i].binName+'" pcu="'+check[i].PCU+'">',
                            "Class":check[i].binName ,
                            "PCU":check[i].PCU,
                        })
                    }
                    return return_data;
                }
            },
            // "rowsGroup": [0],
            "columns": [

                { "data": "radio"},
                { "data": "Class"},
                { "data": "PCU"}
            ]
        });
        function renderDate(data, type, full,meta){
            return data==null?'--':getFormattedDate(data,'Y-m-d H:m:s','d-m-y H:m:s');
        }
    }
    

    

    $('.closelist').click(function(){
        $('.editpcu-container').css('display','none')
    })
    $('.closelist').click();

    $('.editpcubtn').click(function(){
        try {
            $('.editpcu-container').css('display','block')
            var name = sanitize($("input[type='radio'][name='edit_pcu']:checked").attr('class_name'))
            if(name===undefined)
                throw new Error("Oops, class name is undefined");
            var pcu = sanitize($("input[type='radio'][name='edit_pcu']:checked").attr('pcu'))
            var id = sanitize($("input[type='radio'][name='edit_pcu']:checked").attr('class_id'))
            var binNumber = sanitize($("input[type='radio'][name='edit_pcu']:checked").attr('binNumber'))
            $('#edit_binNumber').val(binNumber);
            $('#edit_id').val(id);
            $('.edit_name').html(name);
            $('#edit_pcu').val(pcu);
        }
        catch (e) {
            $('.editpcu-container').css('display','none')
            $.alert({
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please select a class to edit PCU details</div>',
            });
        }
    });

    $('.edithlbtn').click(function(){
        if($('#edit_pcu').val()=='')
        {
            $.alert({
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please enter PCU</div>',
            });
            return;
        }
        $.ajax({
            url:'../../../models/detector/edit_pcu.hh',
            method:'POST',
            data:{
                class_name: ($('.edit_name').html().trim()),
                pcu:sanitize($('#edit_pcu').val()),
                id:sanitize($('#edit_id').val()),
                binNumber:sanitize($('#edit_binNumber').val()),
                makeid:sanitize($('#make_model').val())
            },
            success:function(res){
                if(res.trim() == 'success')
                    location.reload()
                else
                    $.alert({
                        type: 'red',
                        title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                        content: '<div class="fw-bold">Sorry, there has been a technical problem. Please report this error by sending an email to support@itspe.co.in with a screen shot</div>',
                        buttons: {
                            Ok: function () {
                                // window.location.href="detector_setup.html"
                            }
                        }
                    });
            }
        })
    })

    $('.deletecategorybtn').click(function(){
        try {
            var id = sanitize($("input[type='radio'][name='edit_category']:checked").attr('category_id'))
            $.ajax({
                url:'../../../models/vms/delete_category.hh',
                method:'POST',
                data:{
                    id: sanitize(id)
                },
                success:function(res){
                        location.reload()
                }
            })
        }
        catch (e) {
            $.alert({
                title: '<h3 class="text-danger fw-bold mb-0">Message</h3>',
                content: '<div class="fw-bold">Please select a category to delete category details</div>',
            });
        }
        
    })

});

