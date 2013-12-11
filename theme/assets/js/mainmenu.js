$(document).ready(function() {
    init()

    $('.input-daterange').datepicker({
        // format: 'yyyy-mm-dd',
        startDate: (new Date()).toString()
        // orientation: "bottom auto"   
    });

    $('.input-daterange').datepicker().on('changeDate', function(){
        $(this).blur();
    });
    function init() {
        if (!store.enabled) {
            alert('Local storage is not supported by your browser. Please disabled "Private Mode", or upgrade to a modern browser')
            return
        }   
    }
    var $itineraries = $('<div id="listOfItin"></div>');

    store.forEach(function(itID, value) {



        var id = store.get(itID);
        var $itineraryHTML = $('<div class="itinerary">' + '<div id="menu-left">' + '<a href=\"day.html?id='+ itID + '\">' + 
            id.city + ', '+ id.country + '<br>' + '<span class=\"small\">' + id.startD + ' - ' + id.endD + 
            '</span></a></div>' + '<a class="editbox" href="#date-popup" id='+ itID + '><div id="menu-middle"><button type="button" class=\"btn btn-info btn-xs edit-button\">' + '<span class="glyphicon glyphicon-edit"></span></button></div></a>' + 
            ' <div id="menu-right"><button type="button"  id= ' + itID + ' class=\"btn btn-danger btn-xs delete-button\">' + 
            ' <span class="glyphicon glyphicon-remove"></span></button></div>' + '</div>');
        $itineraries.append($itineraryHTML);

    });

    $("#itineraries").html($itineraries);
    //end for loop


    $('.editbox').click(function(){

         var itID = $(this).attr("id");

         var editPopup = '<h3> Please enter your new dates</h3>'+
                        '<div class="input-daterange" id="time">'+
                            '<input type="text" class="input-small" name="start"  id="start_date_edit" placeholder="mm-dd-yyyy" />' +
                            '<span class="add-on" style="color: black">to</span>' +
                            '<input type="text" class="input-small" name="end" id = "end_date_edit" placeholder="mm-dd-yyyy" />' +
                            '<button class="btn btn-success save-button" id='+ itID + '>Save</button>' +

                        '</div>';
                

        $('#date-popup').html(editPopup);

        $('#start_date_edit').datepicker();
        $('#end_date_edit').datepicker();

        

    $('.save-button').click(function(){
    
        var itID = $(this).attr("id");

        // console.log(itID);
        var id = store.get(itID);

        var startDate = $("#start_date_edit").val().split('-').join('/');
        var endDate = $("#end_date_edit").val().split('-').join('/');;

        if (startDate == "" || endDate == "") { //Validation
            //var err = ("The following fields must be filled:" + (location == "" ?"\n - Location":"") + (startDate == ""?"\n - Start Date":"") + (endDate == ""?"\n - End Date":""));
            //alert(err);
            var n = noty({text: 'Error: All fields are required.', layout:'topCenter', type:'warning', timeout: '5000'});
            console.dir("printed error");
            return false;
        };

        var locID = id.locid;

        var sDate = new Date(startDate);
        var eDate = new Date(endDate);

        var startDay = sDate.getDate();
        var startMonth = sDate.getMonth()+1;
        var startYear = sDate.getFullYear();

        var endDay = eDate.getDate();
        var endMonth = eDate.getMonth()+1;
        var endYear = eDate.getFullYear();

        //We need to get the dates from here and save it as day, month, and year

        var arrayofEvents = new Array();

        var itineraryID = locID+ ';'+startYear+'/'+startMonth+'/'+startDay+'-'+endYear+'/'+endMonth+'/'+endDay;


        store.set(itineraryID, {locid: id.locid, city: id.city, country: id.country, 
        sDay: startDay, sMonth: startMonth, sYear: startYear, 
        eDay: endDay, eMonth: endMonth, eYear: endYear, startD: startDate, endD: endDate, 
        events: id.events });
        
        store.remove(itID);
        window.location = "day.html?id=" + itineraryID;
        

    })




    });



    $('.delete-button').click(function(){
    // console.log($(this).attr("id"));
        var itID = $(this).attr("id");
        var id = store.get(itID);

        var r = noty({
            text: 'Are you sure you want to delete this itinerary?',
            layout:'topCenter',
            type:'confirmation',
            buttons: [
                {addClass: 'confirm-btn', text: 'Ok', onClick: function($noty) {
                        store.remove(itID);
                        window.location = 'index.html';
                        $noty.close();
                    }   
                },
                {addClass: 'confirm-btn', text: 'Cancel', onClick: function($noty) {
                        $noty.close();
                }
            }],
            killer: true
        });
        //var r = confirm('Do you want to delete the itinerary:\n' + id.city + ',' + id.country + ' (' + id.startD + ' - ' + id.endD + ') ?');

    }); //end delete button function
});

;(function(){

            // Menu settings
            $('#menuToggle, .menu-close').on('click', function(){
                $('#menuToggle').toggleClass('active');
                $('body').toggleClass('body-push-toleft');
                $('#theMenu').toggleClass('menu-open');
            });


})(jQuery)
