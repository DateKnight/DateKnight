//   Initialize Firebase
  var config = {
    apiKey: "AIzaSyDol-FwBLa9LmnH0nFd2RqqPGtXFWq6C50",
    authDomain: "dateknight-f4122.firebaseapp.com",
    databaseURL: "https://dateknight-f4122.firebaseio.com",
    projectId: "dateknight-f4122",
    storageBucket: "dateknight-f4122.appspot.com",
    messagingSenderId: "144687519953"
  };
  firebase.initializeApp(config);
  var database = firebase.database();


var locations = []


// Ambreen - working on hide(); element to separate the Activity and Cuisine search
$(document).ready(function (){
    $( "#activity-div" ).hide();
    $("#save").hide();
    console.log("what!!")
})

// This is for the "Click Here to select a Date Activity" button
$(document).on("click", "#save" , function() {
    $("#cuisine-div").hide();
    $("#activity-div").show();
    resetResults();
       
    });


function fetchResults(input) {
   
   // this will display the Activity input field and the "Click here to select a Date Activity" button
    $("#save").show();
   

    console.log("button clicked")
    zipcode = $("#inputZip").val();
    console.log(zipcode)
    activity = $("#activity-input").val();
    cuisine = $("#cuisine-input").val();

    if (activity == "Choose...") {
        input = cuisine;
    } else {
        input = activity;
    }
    
    var myurl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=by-" + input + "&location=" + zipcode + "&limit=3";
    // var btnValue = activityBtn.val();
    console.log(input);
    $.ajax({
        url: myurl,
        headers: {
            'Authorization': 'Bearer Nzuf7W7Q8AlGEUYy2or2Ws5m1jj_nmsTw2YZrH-rnyTeK8ijSbkXFOGC3Wn0rU_yJLMwssYKjl4ubv-9oCeoLkF-WEBckSTLdA3qnRGe9V1R6DK3_U0VdHRMvp2_XHYx',
        },
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            // Grab the results from the API JSON return
            dataVar = data
            var totalresults = data.total;
            console.log("Results: ", data);
            // If our results are greater than 0, continue
            if (totalresults > 0) {
                // Display a header on the page with the number of results
                $('#announce-results').append("Here are the results!");
                // Itirate through the JSON array of 'businesses' which was returned by the API
                $.each(data.businesses, function (i, item) {
                    // Store each business's object in a variable
                    var id = item.id;
                    // var alias = item.alias;
                    var phone = item.display_phone;
                    var image = item.image_url;
                    var name = item.name;
                    var rating = item.rating;
                    // var reviewcount = item.review_count;
                    var address = item.location.address1;
                    var city = item.location.city;
                    var state = item.location.state;
                    var zipcode = item.location.zip_code;
                    var coordinates = item.coordinates;
                    var yelpsite = item.url;
                    // console.log("Leon's coordinates test", coordinates);
                    locations.push(coordinates);

                    var resultHtml = `
                        <div class="card">
                        <img src="${image}" class="card-img-top" alt="${name}">
                        <div class="card-body">
                          <h5 class="card-title">${name}</h5>
                          <p class="card-text">${address} ${city} ${state} ${zipcode} ${phone} ${rating}</p>
                          <a href="${yelpsite}" class="btn btn-primary " target="_blank">View on Yelp</a>
                          <button class="btn btn-primary likeButton" id="save-selection" data-name="${name}">I Like This One</button>
                          </div>
                      </div>
                    `;

                    // Append our result into our page
                    $('#results').append(resultHtml);

                    
                });
            } else {
                // If our results are 0; no businesses were returned by the JSON therefor we display on the page no results were found
                $('#announce-results').append('<h5>We discovered no results!</h5>');
            }

            //TODO: I think i can put the map thingy here
            displayMap();

            $(".likeButton").on("click", function(){
                // We will push thisClicked to firebase
                thisClicked = $(this).data("name")
                var restaurantNameObject = {
                    Name: thisClicked
                };
            database.ref().push(restaurantNameObject);
            // console.log("Leon's this click", thisClicked);

            //TODO: figure out how to push each result into an array. 
            });
        }
    });

}
// Reset button function
$(document).on("click", "#reset" , function() {
    console.log("Aloha!!!");
   resetResults();
   $("#cuisine-div").show();
   $("#activity-div").hide();

    
    });

    function resetResults() {
        $("#results").empty();
        $("#map").empty();
        $("#announce-results").empty();
        $("#inputZip").val("");
        $("#activity-input").prop("selectedIndex",0);
        $("#cuisine-input").prop("selectedIndex",0);
    }
//Leon created the dataVar and set it global to = the 'data' from the JSON object. This way he can manipulate the data within the displayMap(); function */
var dataVar = ""
// create a function that gets the value on click
$("#results").empty();
$("#submit").on("click", fetchResults);


function displayMap() {
    console.log("Leon's Locations var:", locations);

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        //DONE: The center of the maps is grabbied via the first business's latitude and longitutde coordinates. 
        center: new google.maps.LatLng(dataVar.businesses[0].coordinates.latitude, dataVar.businesses[0].coordinates.longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    //TODO: based on the length of the search results, push the longitude and latitude into the markers

    var infowindow = new google.maps.InfoWindow();

    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i].latitude, locations[i].longitude),
            map: map
        });

        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infowindow.setContent(locations[i][0]);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }
};

// $(".likeButton").on("click", function(){
//     thisClicked = $("this")
// console.log(thisClicked);
// });