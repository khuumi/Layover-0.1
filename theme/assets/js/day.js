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

    //display current itinerary
    var itID = getParameterByName('id');
    var id = store.get(itID);

    $('#header-itinerary').html(id.city + ', ' + id.country + ' (' + id.startD + ' - ' + id.endD + ')');


    var itinerary = store.get(itID);

    /* Fullcalender init */
    $('#calendar').fullCalendar({
        //header: false,
         header: {
             left:   'prev',
             center: '',
             right:  'next'
         },
        defaultView: 'agendaDay',
        allDaySlot: false,
        height: 530,
        editable: true,
        slotEventOverlap: false,

        // eventClick: function(calEvent, jsEvent, view) {

        //     $('#calendar').fullCalendar( 'removeEvents', calEvent.id );

        // },

        droppable: true, // this allows things to be dropped onto the calendar !!!
        drop: function(date, allDay, jsEvent, ui) { // this function is called when something is dropped
        
            // retrieve the dropped element's stored Event Object
            var originalEventObject = $(this).data('eventObject');
            
            // we need to copy it, so that multiple events don't have a reference to the same object
            var copiedEventObject = $.extend({}, originalEventObject);
            var duration = 90;
            
            // assign it the date that was reported
            copiedEventObject.start = date;
            copiedEventObject.end = new Date(date.getTime() + duration * 60000);
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

    var startYear = id.startD.substring(0,4);
    var startMonth = id.startD.substring(5,7);
    var startDay = id.startD.substring(8,10);
    var endYear = id.endD.substring(0,4);
    var endMonth = id.endD.substring(5,7);
    var endDay = id.endD.substring(8,10);

    $('#calendar').fullCalendar( 'gotoDate', startYear, startMonth-1, startDay);

    // Get number of days between two dates
    // http://stackoverflow.com/a/2627493
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var startDate = new Date(startYear,startMonth-1,startDay);
    var endDate = new Date(endYear,endMonth-1,endDay);
    var totalDays = Math.round(Math.abs((startDate.getTime() - endDate.getTime())/(oneDay)));
    totalDays++;

    var currentDay = 1;

    $('.fc-button-prev').hide();
    if(currentDay == totalDays) {
        $('.fc-button-next').hide();
    }

    $('.fc-button-prev').click(function(e) {
        if(currentDay == 2) {
            $(this).hide();
        }
        $('.fc-button-next').show();
        currentDay--;
    });
    $('.fc-button-next').click(function(e) {
        if(currentDay == totalDays - 1) {
            $(this).hide();
        }
        $('.fc-button-prev').show();
        currentDay++;
    });


    $("#search-input").keyup(function(e){
        if(e.keyCode == 13){
            $("#search-button").click();
        }
    });

    $('#search-button').click(function() {
        //here the add button is called, I want to get the information
        //from the add button to create a new itinerary 
        $('#result').html('<img class="loading" src="assets/img/loading.gif">');
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
                $('#result').html('');
                console.dir("reply:");
                console.dir(reply);
                //var $result = $('<div id=\"result\"></div>')
                var count = 1;
                if(reply.length == 0) {
                    $('#result').html('<div class="no-results">No results.</div>');
                }
                else {
                    for (var i in reply) {
                        var venue = "";
                        console.dir(reply[i].venue);
                        var venue = reply[i].venue;
                        var venue_img = typeof venue.photos.groups[0] !== "undefined" ? venue.photos.groups[0].items[0].prefix + 
                        "300x300" + venue.photos.groups[0].items[0].suffix : "error.jpg";

                        //set variables
                        var venue_name = venue.name;
                        var venue_id = venue.id;
                        var address = typeof venue.location.address !== "undefined" ? venue.location.address + "<br>" : "";
                        address += typeof venue.location.crossStreet !== "undefined" ? " (" + venue.location.crossStreet + ")" : "";

                        var rating = typeof venue.rating !== "undefined" ? venue.rating : "N/A";
                        var category = typeof venue.categories[0] !== "undefined" ? venue.categories[0].shortName : "Uncategorized";

                        //var $detail = $();
                        
                        //var detail = info.url;

                        var $row = $('<hr/><a class="fancybox" href="#popup"><div class=\"list-row event\" id=\"' + venue_id + '\">' + '<div class=\"list-left\">' + count +
                            '.</div><div class=\"list-middle\"><span class="venue-name"><b>' + venue_name + '</b></span><br><small>' + address + category + 
                            ' (rating: ' + rating + ')</small>' + '</div><div class=\"list-right\">' +
                            '<img class="bordered" src=\"' + venue_img + '\" onerror="this.style.display=\'none\'" width=120px height=120px border=\"0\"></div>'+'</div></a>');
                        $('#result').append($row);
                        count += 1;
                    }
                }

                $('.event').each(function() {
                    var eventObject = {
                        title: $.trim($(this).find('.venue-name').text()), // use the element's text as the event title
                        id: $(this).attr('id')
                    };
                    
                    // store the Event Object in the DOM element so we can get to it later
                    $(this).data('eventObject', eventObject);
                    
                    // make the event draggable using jQuery UI
                    $(this).draggable({
                        zIndex: 999,
                        revert: true,        // will cause the event to go back to its
                        revertDuration: 0.5  //  original position after the drag
                    });

                });

                $('.event').click(function() {
                    var info = getVenueInfo(venue_id);
                    //$(this).find('.extra-data').text();
                    console.log(info);
                    $('#popup').html(info);
                });
            }
        );

    });


    $('#placeholder').click(function() {
        var info = getVenueInfo(venue_id);
        //$(this).find('.extra-data').text();
        console.log(info);
        $('#popup').html(info);
    })

    // Return venue information by calling get_venue function
    function getVenueInfo(venue_id) {
        var url = '';
        foursquare.get_venue (
            {q: venue_id}, function(response) {
                console.dir(response);
                url = response.contact.formattedPhone;
                console.dir(url);
            });
        return url;
    }
});


// Get query parameters
// http://stackoverflow.com/a/901144
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}