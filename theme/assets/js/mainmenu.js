$(document).ready(function() {
	init()
    function init() {
        if (!store.enabled) {
            alert('Local storage is not supported by your browser. Please disabled "Private Mode", or upgrade to a modern browser')
            return
        }   
    }
    var $itineraries = $('<div id="listOfItin"></div>');

    store.forEach(function(itID, value) {
       
        var itObject = store.get(itID);
        //alert(itObject);
        var cityN = itObject.city;
        var countryN = itObject.country;
        var startDate = itObject.startD;
        var endDate = itObject.endD;

        var $itineraryHTML = $('<div class="itinerary">' + '<div id="menu-left">' + '<a href=\"day.html?id='+ itID + '\">' + 
            cityN + ', '+ countryN + '<br>' + '<span class=\"small\">' + startDate + ' - ' + endDate + 
            '</span></a></div>' + '<div id="menu-right"> <button type="button"  id= ' + itID + 
            ' class=\"btn btn-danger btn-xs delete-button\"><span class="glyphicon glyphicon-remove"></span></button></div>' + '</div>');
        $itineraries.append($itineraryHTML);

    });

    $("#itineraries").html($itineraries);
    //end for loop

    $('.delete-button').click(function(){
    // console.log($(this).attr("id"));
        var id = $(this).attr("id");
        var itObject = store.get(id);
        var cityN = itObject.city;
        var countryN = itObject.country;
        var startDate = itObject.startD;
        var endDate = itObject.endD;

        var r = confirm('Do you want to delete the itinerary:\n' + cityN + ', ' + countryN + ' (' + startDate + ' - ' + endDate + ') ?');
        if (r==true) {
            store.remove(id);
            window.location.reload(true);
        }
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