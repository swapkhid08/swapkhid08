
$(document).ready(function(){

    get_dt = function(scn){
        $('#dataTable').DataTable({
            "processing": true,
            "serverSide": true,
            "searching": false,
            "order":[[0,"desc"]],
            "columnDefs": [ { orderable: false, targets: [1,2]}],
            "ajax": {
                "url": "../../utils/get_detector_livedata.php",
                "type": "POST",
                "data": function ( d ) {
                    d.scn = scn
                    _scn = d.scn
                }
            },
            // "rowsGroup": [0],
            "columns": [
                // { "data": "SignalSCN"},
                { "data": "ShortDescription"},
                { "data": "SystemCodeNumber"},
                { "data": "det_desc"},
                { "data": "TotalFlow"},
                // { "data": "Occupancy"},
                // { "data": "Headway"},
                // { "data": "Speed"},
                { "data": "LastUpdated"}
            ]
        });
    }

    function getParam( name )
    {
     name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
     var regexS = "[\\?&]"+name+"=([^&#]*)";
     var regex = new RegExp( regexS );
     var results = regex.exec( window.location.href );
     if( results == null )
      return "";
    else
     return results[1];
    }

    get_dt(getParam('scn'))

})
