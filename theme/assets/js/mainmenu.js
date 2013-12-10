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
       
        var id = store.get(itID);
        var $itineraryHTML = $('<div class="itinerary">' + '<div id="menu-left">' + '<a href=\"day.html?id='+ itID + '\">' + 
            id.city + ', '+ id.country + '<br>' + '<span class=\"small\">' + id.startD + ' - ' + id.endD + 
            '</span></a></div>' + '<div id="menu-middle"><button type="button" id=' + itID + 
            ' class=\"btn btn-info btn-xs edit-button\">' + '<span class="glyphicon glyphicon-edit"></span></button></div>' + 
            ' <div id="menu-right"><button type="button"  id= ' + itID + ' class=\"btn btn-danger btn-xs delete-button\">' + 
            ' <span class="glyphicon glyphicon-remove"></span></button></div>' + '</div>');
        $itineraries.append($itineraryHTML);

    });

    $("#itineraries").html($itineraries);
    //end for loop

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
                        window.location.reload(true);
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