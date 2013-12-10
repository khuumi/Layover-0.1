var foursquare = new Foursquare;
foursquare.setClientID("ZWOHYPAJV1ST0JXJKCBNYRQTKTQVSZA0F5442IEUSLVIJDZT", "22Y31QA5Q53OUCF4LRVTMT0XLEHKOCKKXFWPQMKJAM44UF3P");
//foursquare.setClientID("U5OHF02BYSKE2IY2U0XQUHCLQHWHRDYD5UMPSBEEYXJVP0ST", "KVNMWNIISEF3VJFH1YP2SSC35TKUZQGHXNCE3NCQICSKFJXA");
foursquare.setURL("https://api.foursquare.com/v2/");
foursquare.setVersionParameter("20131205");

// var mapbox = new Mapbox;

$(document).ready(function() {
    var map = L.mapbox.map('map', 'jameshong.ggk4nail', {
            maxZoom:16,
            attributionControl:false
        });

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

    for(var i in itinerary.events){
        itinerary.events[i].start = new Date(itinerary.events[i].start);
        itinerary.events[i].end = new Date(itinerary.events[i].end);
    }

    //console.log(itinerary.events);

    function get_calendar_height() {
        return $('#main-left').height();
    }
    
    // dynamic calendar resize -- messes up resizing events for some reason
    // $(window).resize(function() {
    //     $('#calendar').fullCalendar('option', 'height', get_calendar_height());
    // });

    /* Fullcalender init */
    $('#calendar').fullCalendar({
        //header: false,
         header: {
             left:   'prev',
             center: '',
             right:  'next'
         },
        defaultView: 'agendaDay',
        events: itinerary.events, 
        allDaySlot: false,
        editable: true,
        height: get_calendar_height(),
        slotEventOverlap: false,

        eventClick: function(calEvent, jsEvent, view) {

            // console.log(calEvent._id);
            // console.log(calEvent.venueID);

            $('#calendar-popup').html('<div class="popup-loading"><img src="assets/img/venue-loading.gif"></div>');
            var event_id = calEvent._id;
            var venue_id = calEvent.venueID;
            console.log(calEvent);

            getVenueInfo(venue_id, function(response) {

                // console.dir('info:');
                // console.dir(response);
                console.dir('venue info:');
                console.dir(response);
                var venue_info = parseInfo(response);
                $('#calendar-popup').html(venue_info + '<br/><button class="delete-event" id="'+ event_id +'">Delete</button>');
                addMap(response);

                $('.delete-event').click(function() {
                    var r = confirm('Are you sure you want to remove this event from your schedule?');
                    if (r == true) {
                        var eid = $(this).attr('id');
                        $('#calendar').fullCalendar( 'removeEvents', eid );
                        $.fancybox.close();
                    }
                });
            });

            $('#calendar-popup-link').trigger('click');

        },

        droppable: true, // this allows things to be dropped onto the calendar !!!

        eventDrop: function(event, dayDelta, minuteDelta ) {

            //weird bug whenever I try to change an event that I made this session. 

            var itObj = store.get(itID);
            console.log(itObj);


            for (var i in itObj.events){

                console.log(event._id);
                if(itObj.events[i]._id == event._id)
                {

                    end = new Date(itObj.events[i].end);
                   // end.setMinutes(end.getMinutes() + minuteDelta);
                   // start = new Date(itObj.events[i].end);

                    curMin = end.getMinutes();


                    console.log("currentMin = " +curMin);

                    console.log("minuteDelta  = " +minuteDelta);
                    
                    end.setMinutes(minuteDelta + curMin);

                    newEnd = end.toUTCString();
                    newStart = start.toUTCString();
                    console.log(newEnd);
                        console.log("hello");

                    console.log(event.start + "\t" +newEnd);

                    var myEvent = { venueID: event.venueID, title: event.title, start: newStart, end: newEnd, allDay: false};

                    // itObj.events[i].end = event.end.toUTCString();
                    // itObj.events[i].start = event.start.toUTCString();


                    console.log("hello");
                    itObj.events.splice(i, 1);
                    itObj.events.push(myEvent);
                    store.remove(itID);
                    store.set(itID, itObj);

                }
            }

        }, 




        eventResize: function(event, dayDelta, minuteDelta){

            //weird bug whenever I try to change an event that I made this session. 


            var itObj = store.get(itID);
            console.log(itObj);


            for (var i in itObj.events){


                if(itObj.events[i]._id == event._id)
                {

                    var end = new Date(itObj.events[i].end);
                  //  var start = new Date(itObj.events[i].end);
                   // end.setMinutes(end.getMinutes() + minuteDelta);

                    curMin = end.getMinutes();


                    console.log("currentMin = " +curMin);

                    console.log("minuteDelta  = " +minuteDelta);
                    
                     end.setMinutes(minuteDelta + curMin);

                    newEnd = end.toUTCString();
                    newStart = start.toUTCString();
                    console.log(newEnd);
                    console.log("hello");

                    var myEvent = { venueID: event.venueID, title: event.title, start: newStart, end: newEnd, allDay: false};

                    // itObj.events[i].end = event.end.toUTCString();
                    // itObj.events[i].start = event.start.toUTCString();


                    console.log("hello");
                    itObj.events.splice(i, 1);
                    itObj.events.push(myEvent);
                    store.remove(itID);
                    store.set(itID, itObj);

                }
            }

        }, 



        drop: function(date, allDay, jsEvent, ui) { // this function is called when something is dropped
        
            // retrieve the dropped element's stored Event Object
            var originalEventObject = $(this).data('eventObject');

            console.log(originalEventObject);
            //console.log($(this).data('eventObject'));
            
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
            
            var eventObject = $(this).data('eventObject');


            console.log(copiedEventObject);

            console.log("Newly added start and end date");
            console.log(copiedEventObject.start.toUTCString());
            console.log(copiedEventObject.end.toUTCString());

           // console.log(eventObject._id);

            //The event object that will get populated to our array
            var myEvent = { venueID: eventObject.venueID, title: eventObject.title, start: copiedEventObject.start.toUTCString(), end: copiedEventObject.end.toUTCString(), allDay: false};


            console.log(myEvent);
            // console.dir(myEvent);

            // console.log(date);

            //We need to get the object from localstorage, push the event object to array,
            //After that remove the old object from localstorage and set the new object. 
            var itObj = store.get(itID);
            itObj.events.push(myEvent);
            store.remove(itID);
            store.set(itID, itObj);

            console.log(store.get(itID));


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
                var count = 1;
                if(reply.length == 0) {
                    $('#result').html('<div class="no-results">No results.</div>');
                }
                else {
                    for (var i in reply) {
                        var venue = "";
                        var venue = reply[i].venue;
                        var venue_img = typeof venue.photos.groups[0] !== "undefined" ? venue.photos.groups[0].items[0].prefix + 
                        "300x300" + venue.photos.groups[0].items[0].suffix : "error.jpg";

                        //set variables
                        var venue_name = venue.name;
                        var venue_id = venue.id;
                        var address = typeof venue.location.address !== "undefined" ? venue.location.address + "<br>" : "";
                        address += typeof venue.location.crossStreet !== "undefined" ? " (" + venue.location.crossStreet + ")" : "";

                        // var rating = typeof venue.rating !== "undefined" ? venue.rating : "N/A";
                        var rating = typeof venue.rating !== "undefined" ? '<div class="rating" itemprop="aggregateRating" itemscope itemtype="http://schema.org/AggregateRating">' + 
                        'Rating: <span itemprop="ratingValue" style="display:none">' + (venue.rating) + '</span> <i class="icon-star"></i><i class="icon-star"></i>' +
                        '<i class="icon-star"></i><i class="icon-star"></i><i class="icon-star-half"></i>' + '</div>' : "";


                        var category = typeof venue.categories[0] !== "undefined" ? venue.categories[0].shortName : "Uncategorized";

                        //var $detail = $();
                        //var detail = info.url;

                        var $row = $('<hr/><a class="fancybox" href="#popup"><div class=\"list-row event\" id=\"' + venue_id + '\">' + '<div class=\"list-left\">' + count +
                            '.</div><div class=\"list-middle\"><span class="venue-name"><b>' + venue_name + '</b></span><br><small>' + address + category + 
                            '<p>' + rating + '</p></div><div class=\"list-right\">' +
                            '<img class="bordered" src=\"' + venue_img + '\" onerror="this.style.display=\'none\'" width=120px height=120px border=\"0\"></div>'+'</div></a>');
                        $('#result').append($row);
                        count += 1;
                    }
                } // end if/else

                $('.event').each(function() {
                    var eventObject = {
                        title: $.trim($(this).find('.venue-name').text()), // use the element's text as the event title
                        venueID: $(this).attr('id')
                    };
                    


                    // store the Event Object in the DOM element so we can get to it later
                    $(this).data('eventObject', eventObject);

                    console.dir(eventObject);
                    
                    // make the event draggable using jQuery UI
                    $(this).draggable({
                        zIndex: 999,
                        revert: true,        // will cause the event to go back to its
                        revertDuration: 0.5  //  original position after the drag
                    });

                }); // end even each function

                $('.event').click(function() {

                    $('#popup').html('<div class="popup-loading"><img src="assets/img/venue-loading.gif"></div>');
                    
                    venue_id = $(this).attr('id');
                    console.log(venue_id);
                    getVenueInfo(venue_id, function(response) {
                        // console.dir('venue info:');
                        // console.dir(response);
                        // var venue_info = parseInfo(response);
                        // $('#popup').html(venue_info);
                        // var lat = response.location.lat;
                        // var lng = response.location.lng;
                        
                        // // map.markerLayer.setGeoJSON(geoJson);
                        // var map = L.mapbox.map('map', 'jameshong.ggk4nail', {
                        //     maxZoom:15,
                        //     attributionControl:false
                        // }).setView([lat, lng], 14);
                        // L.mapbox.markerLayer({
                        //     type: 'Feature',
                        //     geometry: {
                        //         type: 'Point',
                        //         coordinates: [lng, lat]
                        //     },
                        //     properties: {
                        //         title: response.name,
                        //         description: '',
                        //         'marker-size': 'large',
                        //         'marker-color': '#5E9DC8',
                        //         'marker-symbol': 'circle'
                        //     }
                        // }).addTo(map);
                        // console.dir('info:');
                        // console.dir(response);
                        //$('#popup').html(response.contact.formattedPhone);
                    }); // end getVenueInfo function
                }); //end event click function
            }
        ); //end foursquare explore function
    }); //end search function


    // Return venue information by calling get_venue function
    function getVenueInfo(venue_id, callback) {
        var url = '';
        foursquare.get_venue ({q: venue_id}, function(response) {
            console.dir('venue info:');
            console.dir(response);
            var venue_info = parseInfo(response);
            $('#popup').html(venue_info);
            addMap(response);
            return callback(venue_info);
        });
    } //end getVenueInfo

    function parseInfo(info) {
        var venue_name = '<span class="venue-name"><b>' + info.name + '</b></span>';
        var venue_categories = '';
        var i = 0;
        if (info.categories !== "undefined")
            for (i=0; i<info.categories.length; i++) {
                venue_categories = venue_categories + info.categories[i].name + (i !== info.categories.length - 1 ? ', ' : '');
            }

        var address = typeof info.location.address !== "undefined" ? info.location.address : "";
            address += typeof info.location.crossStreet !== "undefined" ? " (" + info.location.crossStreet + ")" : "";
            address += typeof info.location.city !== "undefined" ? ", " + info.location.city : "";
            address += typeof info.location.state !== "undefined" ? ", " + info.location.state : (typeof info.location.country !== "undefined" ? ", " + info.location.country : "");
            address += typeof info.location.postalCode !== "undefined" ? " " + info.location.postalCode : "";

        var phone = typeof info.contact !== "undefined" ? '<span class="glyphicon glyphicon-earphone"></span>' + info.contact.formattedPhone : "";

        var url = typeof info.url !== "undefined" ? ('<a href=\"' + info.url + '\" target=\"_blank\">' + info.url + '</a>') : ('<a href=\"' + info.shortUrl + '\" target=\"_blank\">' + info.shortUrl + '</a>');

        var hours = typeof info.hours !== "undefined" ? info.hours.status : "";

        var menus = typeof info.menu !== "undefined" ? '<a href=\"' + info.menu.url + '\" target=\"_blank\">View Menu</a>' : "";

        var rating = typeof info.rating !== "undefined" ? '<div class="rating" itemprop="aggregateRating" itemscope itemtype="http://schema.org/AggregateRating">' + 
        '<span itemprop="ratingValue">' + (info.rating) + '</span> /10 <i class="icon-star"></i><i class="icon-star"></i>' +
        '<i class="icon-star"></i><i class="icon-star"></i><i class="icon-star-half"></i>' + '</div>' : "";

        var str = venue_name + '<br><small>' + venue_categories + '<br>' + address + '</small><br><hr /><p>' + phone + ' ' + url + '<br>' + hours + ' ' + menus + '</p><hr />' + rating ;

        var output = '<div class="popup-left">' + str + '</div><div class="popup-right"><div id="map" class="map"></div></div>';
        return output;
    } //end parseInfo

    function addMap(response) {
        var lat = response.location.lat;
        var lng = response.location.lng;
        
        map.remove();
        map = L.mapbox.map('map', 'jameshong.ggk4nail', {
            maxZoom:16,
            attributionControl:false
        }).setView([lat, lng], 15);

        L.mapbox.markerLayer({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [lng, lat]
            },
            properties: {
                title: response.name,
                description: '',
                'marker-size': 'large',
                'marker-color': '#5E9DC8',
                'marker-symbol': 'circle-stroked'
            }
        }).addTo(map);
    } //end addMap
});

// Get query parameters
// http://stackoverflow.com/a/901144
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
