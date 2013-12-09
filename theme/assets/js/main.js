$(document).ready(function() {
    init();
    function init() {
        if (!store.enabled) {
            alert('Local storage is not supported by your browser. Please disabled "Private Mode", or upgrade to a modern browser')
            return
        }   
    }

    function initialize() {
          var options = {
                types: ['(cities)'],
            };

          var input = document.getElementById('location-input');

          var autocomplete = new google.maps.places.Autocomplete(input, options);
    } //end initialize

    google.maps.event.addDomListener(window, 'load', initialize);  


	$('.input-daterange').datepicker({
        format: 'yyyy-mm-dd',
        startDate: (new Date()).toString()
        // orientation: "bottom auto"	
    });

    $('.input-daterange').datepicker().on('changeDate', function(){
        $(this).blur();
    }); 


    $('#add-button').unbind('click').click(function() {
        //here the add button is called, I want to get the information
        //from the add button to create a new itinerary 

        var location = $("#location-input").val();

        var locID = location.split(' ').join('_').replace(/\,/g,'');
        //locID = locID.replace(",", "");

        var res = location.split(",");

        var cityName = res[0];
        var countryName  = res[1];

        var startDate = $("#start_date").val().split('-').join('/');
        var endDate = $("#end_date").val().split('-').join('/');;

        if (location == "" || startDate == "" || endDate == "") { //Validation
            var err = ("The following fields must be filled:" + (location == "" ?"\n - Location":"") + (startDate == ""?"\n - Start Date":"") + (endDate == ""?"\n - End Date":""));
            alert(err);
            console.dir("printed error");
            return false;
        };

        var sDate = new Date(startDate);
        var eDate = new Date(endDate);

        var startDay = sDate.getDate();
        var startMonth = sDate.getMonth()+1;
        var startYear = sDate.getFullYear();

        var endDay = eDate.getDate();
        var endMonth = eDate.getMonth()+1;
        var endYear = eDate.getFullYear();

        //We need to get the dates from here and save it as day, month, and year


        var itineraryID = locID+ ';'+startYear+'/'+startMonth+'/'+startDay+'-'+endYear+'/'+endMonth+'/'+endDay;
        var arrayofEvents = new Array();

        console.dir(locID);


        store.set(itineraryID, {city: cityName, country: countryName, 
        sDay: startDay, sMonth: startMonth, sYear: startYear, 
        eDay: endDay, eMonth: endMonth, eYear: endYear, startD: startDate, endD: endDate, 
        events: arrayofEvents });

        window.location = 'day.html?id=' + itineraryID;

    }); //end add-button function


});
