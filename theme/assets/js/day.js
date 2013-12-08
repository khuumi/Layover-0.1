var foursquare = new Foursquare;
 foursquare.setClientID("ZWOHYPAJV1ST0JXJKCBNYRQTKTQVSZA0F5442IEUSLVIJDZT", "22Y31QA5Q53OUCF4LRVTMT0XLEHKOCKKXFWPQMKJAM44UF3P");
//foursquare.setClientID("U5OHF02BYSKE2IY2U0XQUHCLQHWHRDYD5UMPSBEEYXJVP0ST", "KVNMWNIISEF3VJFH1YP2SSC35TKUZQGHXNCE3NCQICSKFJXA");
foursquare.setURL("https://api.foursquare.com/v2/");
foursquare.setVersionParameter("20131205");

$(document).ready(function() {
    init();
    function init() {
        if (!store.enabled) {
            alert('Local storage is not supported by your browser. Please disabled "Private Mode", or upgrade to a modern browser')
            return
        }   
    }

    var itID = getParameterByName('id');
    console.log(itID);

    var $itineraries = $('<div id="listOfItin"></div>');

    store.forEach(function(itID, value) {
       
        var itObject = store.get(itID);
        //alert(itObject);
        var cityN = itObject.city;
        var countryN = itObject.country;
        var startDate = itObject.startD;
        var endDate = itObject.endD;

        var $itineraryHTML = $('<div class="itinerary">' + '<div id="menu-left">' + '<a href=\"day.html?id='+ itID + '\">' + 
            cityN.toUpperCase() + ', '+ countryN.toUpperCase() + '<br>' + '<span class=\"small\">' + startDate + ' - ' + endDate + 
            '</span></a></div>' + '<div id="menu-right"> <button type="button"  id= ' + itID + 
            ' class=\"btn btn-danger btn-xs delete-button\"><span class="glyphicon glyphicon-remove"></span></button></div>' + '</div>');
        $itineraries.append($itineraryHTML);

    });

    $("#itineraries").html($itineraries);
    //end for loop


    $('.delete-button').click(function(){
        // console.log($(this).attr("id"));
            var id = $(this).attr("id");

                        alert(id);

        store.remove(id);
        window.location.reload(true);

    }); //end delete button function


    var itinerary = store.get(itID);

    /* Fullcalender init */
    $('#calendar').fullCalendar({
        //header: false,
        // header: {
        //     left:   '',
        //     center: 'title',
        //     right:  ''
        // },
        defaultView: 'agendaDay',
        allDaySlot: false,
        height: 530,
        editable: true,
        slotEventOverlap: false,
        droppable: true, // this allows things to be dropped onto the calendar !!!
        drop: function(date, allDay) { // this function is called when something is dropped
        
            // retrieve the dropped element's stored Event Object
            var originalEventObject = $(this).data('eventObject');
            
            // we need to copy it, so that multiple events don't have a reference to the same object
            var copiedEventObject = $.extend({}, originalEventObject);
            
            // assign it the date that was reported
            copiedEventObject.start = date;
            copiedEventObject.allDay = allDay;
            
            // render the event on the calendar
            // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
            $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);
            
            // is the "remove after drop" checkbox checked?
            if ($('#drop-remove').is(':checked')) {
                // if so, remove the element from the "Draggable Events" list
                $(this).remove();
            }
            
        }
    });

    /* Test event objects */
    // var date = new Date();
    // var d = date.getDate();
    // var m = date.getMonth();
    // var y = date.getFullYear();
    // var test1 = {
    //     id: 1,
    //     title: 'Test Event 1',
    //     start: new Date(y, m, d, 16, 0),
    //     end: new Date(y, m, d, 17, 30),
    //     allDay: false
    // }
    // var test2 = {
    //     id: 2,
    //     title: 'Test Event 2',
    //     start: new Date(y, m, d, 9, 20),
    //     end: new Date(y, m, d, 10, 55),
    //     allDay: false
    // }

    // $('.event').each(function() {
    //     var eventObject = {
    //         title: $.trim($(this).text()) // use the element's text as the event title
    //     };
        
    //     // store the Event Object in the DOM element so we can get to it later
    //     $(this).data('eventObject', eventObject);
        
    //     // make the event draggable using jQuery UI
    //     $(this).draggable({
    //         zIndex: 999,
    //         revert: true,      // will cause the event to go back to its
    //         revertDuration: 0.5  //  original position after the drag
    //     });

    // });

    $('#search-button').click(function() {
        //here the add button is called, I want to get the information
        //from the add button to create a new itinerary 
        $('#result').html('');
        var query = $("#search-input").val();

        var location = itinerary.city + ", " + itinerary.country;
        console.dir("query: " + query);
        console.dir("location: " + location);

        var queryString = [
            query ? "query=" + query : null,
            "near=" + location,
          ].filter(Boolean).join('&');

        //requesting search-tweets
        console.dir('Requesting venues_explore for help');
        foursquare.explore_venue (
            { q: queryString, limit: 30}, function (reply) {
                console.dir("reply:");
                console.dir(reply);
                //var $result = $('<div id=\"result\"></div>')
                var count = 1;
                for (var i in reply) {
                    var venue = "";
                    console.dir(reply[i].venue);
                    var venue = reply[i].venue;
                    var venue_img = typeof venue.photos.groups[0] !== "undefined" ? venue.photos.groups[0].items[0].prefix + 
                    "300x300" + venue.photos.groups[0].items[0].suffix : "error.jpg";

                    console.dir(venue_img);

                    //set variables
                    var venue_name = venue.name;
                    var venue_id = venue.id;
                    var address = typeof venue.location.address !== "undefined" ? venue.location.address + "<br>" : "";
                    address += typeof venue.location.crossStreet !== "undefined" ? " (" + venue.location.crossStreet + ")" : "";

                    var rating = typeof venue.rating !== "undefined" ? venue.rating : "N/A";
                    var category = typeof venue.categories[0] !== "undefined" ? venue.categories[0].shortName : "Uncategorized";

                    var $row = $('<hr/><div class=\"list-row event\" id=\"' + venue_id + '\">' + '<div class=\"list-left\">' + count +
                        '.</div><div class=\"list-middle\"><b>' + venue_name + '</b><br><small>' + address + category + 
                        ' (rating: ' + rating + ')</small>' + '</div><div class=\"list-right\">' +
                        '<img src=\"' + venue_img + '\" onerror="this.style.display=\'none\'" width=120px height=120px border=\"0\"></div></div>');
                    $('#result').append($row);
                    count += 1;
                }
                

                $('.event').each(function() {
                    var eventObject = {
                        title: $.trim($(this).text()) // use the element's text as the event title
                    };
                    
                    // store the Event Object in the DOM element so we can get to it later
                    $(this).data('eventObject', eventObject);
                    
                    // make the event draggable using jQuery UI
                    $(this).draggable({
                        zIndex: 999,
                        revert: true,      // will cause the event to go back to its
                        revertDuration: 0.5  //  original position after the drag
                    });

                });
            }
        );

    });

    // /* Test render events */
    // $('#test1').click(function() {
    //     $('#calendar').fullCalendar('renderEvent', test1, true);
    // });
    // $('#test2').click(function() {
    //     $('#calendar').fullCalendar('renderEvent', test2, true);
    // });
});


// Get query parameters
// http://stackoverflow.com/a/901144
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}