/**
 * A Foursquare library in JavaScript
 */

var Foursquare = function () {

    // needs user input from main.js, hardcoded for now
    // client.setClientID("ZWOHYPAJV1ST0JXJKCBNYRQTKTQVSZA0F5442IEUSLVIJDZT", "22Y31QA5Q53OUCF4LRVTMT0XLEHKOCKKXFWPQMKJAM44UF3P");
    // client.setURL("https://api.foursquare.com/v2/");
    // client.setVersionParameter("20131205");
    var CLIENT_ID = null;
    var CLIENT_SECRET = null;
    var url = null;
    var v = null;

    var setClientID = function (id, secret) {
        this.CLIENT_ID = id;
        this.CLIENT_SECRET = secret;
    };

    var setURL = function (url) {
        this.url = url;
    }

    var setVersionParameter = function (v) {
        this.v = v;
    }

    /**
     * Main API handler working on any request made
     *
     * @param string   query         The query you requested (eg. venues/search?near=New York, NY)
     * @param function callback      The callback to call with the reply
     */
    var _call = function (query, callback) {
        //  params in a format such that:
        //  params = {q: queryString, limit: 50}
        //  where queryString equals:
        //  var queryString = [
            //   query ? query : null,
            //   near ? "near=" + place : null,
            // ].filter(Boolean).join('&');

        var full_url = this.url + query + "v=" + this.v + "&client_id=" + this.CLIENT_ID + "&client_secret=" + this.CLIENT_SECRET;
        console.dir("requested url: " + full_url)

        $.ajax({
            url: full_url,
            dataType: 'json',
            context: document.body,
            success: callback
        }).error(function(jqXHR, textStatus, errorThrown){
            console.log("Request faild: " + textStatus);
            console.log(errorThrown);
        });
    };

    // var search_venue = function (fn, params, callback) {
    //  var search_method = "venues/" + fn + "?";
    //  var query = build_query(params);
    //  var method = search_method + query + (query.length > 0 ? "&" : "");
    //  this._call(method, 
    //      fn == "explore" ? function(reply) {callback(reply.response.groups[0].items)} : function(reply) {callback(reply.response.venues)}
    //  );
    // }

    var explore_venue = function (params, callback) {
        var query = build_query(params);
        var method = "venues/explore?" + query + (query.length > 0 ? "&venuePhotos=1&" : "");
        this._call(method, function(reply) {callback(reply.response.groups[0].items)});
    }

    var get_venue = function (params, callback) {
        var query = build_query(params);
        var method = "venues/" + query + "?";
        
        this._call(method, function(reply) {callback(reply.response.venue)});
    }

    var get_category = function (callback) {
        var query = "venues/categories?";
        this._call(query, function(reply) {callback(reply.response.categories)});
    }

    var build_query = function (params) {
        var query = "";
        query += typeof params.q !== "undefined" ? params.q : "";
        query += typeof params.limit !== "undefined" ? "&limit=" + params.limit : "";

        return query;
    }

    return {
        setClientID: setClientID,
        setURL: setURL,
        setVersionParameter: setVersionParameter,
        // search_venue: search_venue,
        explore_venue: explore_venue,
        get_venue: get_venue,
        get_category: get_category,
        _call: _call
    };
};
