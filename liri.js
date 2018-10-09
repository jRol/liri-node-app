// dotenv require read and set evironment variables
require("dotenv").config();

/* console.log("-----------------------------------");
console.log("-----------------------------------");
console.log("/////  dotenv K E Y S  /////");
console.log("-----------------------------------");
console.log("TWITTER_CONSUMER_KEY: " + process.env.TWITTER_CONSUMER_KEY);
console.log("TWITTER_CONSUMER_SECRET: " + process.env.TWITTER_CONSUMER_SECRET);
console.log("TWITTER_ACCESS_TOKEN_KEY: " + process.env.TWITTER_ACCESS_TOKEN_KEY);
console.log("TWITTER_ACCESS_TOKEN_SECRET: " + process.env.TWITTER_ACCESS_TOKEN_SECRET);

console.log("SPOTIFY_ID: " + process.env.SPOTIFY_ID);
console.log("SPOTIFY_SECRET: " + process.env.SPOTIFY_SECRET);
console.log("-----------------------------------");
console.log("-----------------------------------"); */

// Spotify and Twitter requires
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");

// keys.js import
var keys = require("./keys");

// Request package import
var request = require("request");

// fs Node package import
var fs = require("fs");

/* console.log("-----------------------------------");
console.log("-----------------------------------");
console.log("/////  keys.js K E Y S  /////");
console.log("-----------------------------------");
console.log(keys);
console.log("-----------------------------------");
console.log("-----------------------------------"); */

/* console.log(keys.spotify);
console.log(keys.twitter); */

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
var searchName = process.argv[3];

var nullCommand = function() {
    console.log("No command entered!");
    console.log("-----------------------------------");
    console.log("Please enter one of the four following commands: ");
    console.log("> my-tweets");
    console.log("> spotify-this-song");
    console.log("> movie-this");
    console.log("> do-what-it-says");
    console.log("-----------------------------------");
    console.log("Example: node liri.js my-tweets");
    console.log("-----------------------------------");
    console.log("-----------------------------------");
};

var myTweets = function() {

    var paramsTwitter = {

        screen_name: "mdntphilosophy",
        count: 20
    };
    client.get("statuses/user_timeline", paramsTwitter, function(error, tweets, response) {
        if (!error) {
    
            console.log("Below are my 20 Latest Tweets, #1 being the Most Recent");
            console.log("-----------------------------------");
            console.log("-----------------------------------");

            for (var i = 0; i < tweets.length; i++) {
    
                
                console.log("Tweet #" + (i+1) + ": " + tweets[i].text);
                console.log("Created at: " + tweets[i].created_at);
                console.log("-----------------------------------");
                console.log("-----------------------------------");
            }    
        }
    });
};

var spotifyThisSong = function() {

    if (searchName == null || searchName === "") {

        console.log("No song name entered!");
        console.log("So we'll give you this gem instead:");
        var paramsSpotify = {

            type: "track",
            query: "track:The Sign artist:Ace of Base",
            limit: 1
        };
        spotify.search(paramsSpotify, function(err, data) {
            if (err) {
            return console.log('Error occurred: ' + err);
            }
            
            console.log("-----------------------------------");
            console.log("-----------------------------------");
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Song Name: " + data.tracks.items[0].name);
            console.log("Preview Link: " + data.tracks.items[0].preview_url);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("-----------------------------------");
            console.log("-----------------------------------");
        });
    }
    else {

        var paramsSpotify = {

            type: "track",
            query: "track:" + searchName,
            limit: 1
        };
        spotify.search(paramsSpotify, function(err, data) {
            if (err) {
            return console.log('Error occurred: ' + err);
            }

            if (data.tracks.items.length === 0) {

                console.log("No results match the Song Name: " + searchName);
                console.log("-----------------------------------");
                console.log("-----------------------------------");
            }
            else {

                console.log("Artist: " + data.tracks.items[0].artists[0].name);
                console.log("Song Name: " + data.tracks.items[0].name);

                if (data.tracks.items[0].preview_url == null) {

                    console.log("Preview Link: No Preview Link of the song on Spotify");
                }
                else {

                    console.log("Preview Link: " + data.tracks.items[0].preview_url);                   
                }
            
                console.log("Album: " + data.tracks.items[0].album.name);
                console.log("-----------------------------------");
                console.log("-----------------------------------");
            }
        });
    }
};

var movieThis = function() {

    if (searchName == null || searchName === "") {

        searchName = "Mr.+Nobody";
        var queryUrl = "http://www.omdbapi.com/?t=" + searchName + "&apikey=a4f96d5e";

        /* console.log(queryUrl); */

        console.log("No movie title entered!");
        console.log("So we'll give you this gem instead:");

        request(queryUrl, function(error, response, body) {

            // If the request is successful (i.e. if the response status code is 200)
            if (!error && response.statusCode === 200) {
        
                console.log("-----------------------------------");
                console.log("-----------------------------------");
                console.log("Movie Title: " + JSON.parse(body).Title);
                console.log("Year of Release: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Country where movie was produced: " + JSON.parse(body).Country);
                console.log("Language of the movie: " + JSON.parse(body).Language);
                console.log("Movie Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
                console.log("-----------------------------------");
                console.log("-----------------------------------");
            }
        });
    }
    else {

        var queryUrl = "http://www.omdbapi.com/?t=" + searchName + "&apikey=a4f96d5e";

        request(queryUrl, function(error, response, body) {

            if (!error && response.statusCode === 200) {

                if (JSON.parse(body).Error === "Movie not found!") {

                    console.log("No results match the Movie Title: " + searchName);
                    console.log("-----------------------------------");
                    console.log("-----------------------------------");
                }
                else {

                    console.log("Movie Title: " + JSON.parse(body).Title);
                    console.log("Year of Release: " + JSON.parse(body).Year);
                    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);

                    for (var i = 0; i < JSON.parse(body).Ratings.length; i++) {

                        if (JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {

                            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                            break;
                        }
                        
                        if (i === JSON.parse(body).Ratings.length - 1) {

                            console.log("Rotten Tomatoes Rating: No Rotten Tomatoes Rating on IMDb");
                            break;
                        }
                    }

                    console.log("Country where movie was produced: " + JSON.parse(body).Country);
                    console.log("Language of the movie: " + JSON.parse(body).Language);
                    console.log("Movie Plot: " + JSON.parse(body).Plot);
                    console.log("Actors: " + JSON.parse(body).Actors);
                    console.log("-----------------------------------");
                    console.log("-----------------------------------");
                } 
            }
        });    
    }
};

var invalidCommand = function() {
    console.log("Invalid command entered!");
    console.log("-----------------------------------");
    console.log("Please enter one of the four following commands: ");
    console.log("> my-tweets");
    console.log("> spotify-this-song");
    console.log("> movie-this");
    console.log("> do-what-it-says");
    console.log("-----------------------------------");
    console.log("Example: node liri.js my-tweets");
    console.log("-----------------------------------");
    console.log("-----------------------------------");
};

console.log("-----------------------------------");
console.log("-----------------------------------");
console.log("You selected the following command: " + command);
console.log("-----------------------------------");
console.log("-----------------------------------");


if (command == null) {

    nullCommand();
}
else if (command === "my-tweets") {

    myTweets();
}
else if (command === "spotify-this-song") {

    spotifyThisSong();

    /* var paramsSpotify = {

        type: "track",
        query: "track:The Sign artist:Ace of Base",
        limit: 1
    };
    spotify.search(paramsSpotify, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        
        console.log(paramsSpotify);
        console.log(data);

        console.log(data.tracks.items[0]);
        console.log(data.tracks.items[0].artists);
        console.log(data.tracks.items[0].name);
        console.log(JSON.stringify(data)); 

        for (var i = 0; i < data.tracks.items.length; i++) {

            for (var j = 0; j < data.tracks.items[i].artists.length; j++) {

                console.log("-----------------------------------");
                console.log("-----------------------------------");
                console.log("Artist: " + data.tracks.items[i].artists[j].name);
                console.log("Song: " + data.tracks.items[i].name);

            }
            console.log("-----------------------------------");
            console.log("-----------------------------------");
            console.log("Artist: " + data.tracks.items[i].artists[i].name);
            console.log("Song: " + data.tracks.items[i].name);
            console.log(JSON.stringify(data.tracks.items[i].artists));
        } 
    }); */
}
else if (command === "movie-this") {

    movieThis();
}
else if (command === "do-what-it-says") {

    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }

        var dataArr = data.split(",");

        command = dataArr[0];
        searchName = dataArr[1];

        if ((command === null && searchName === null) || command === "") {

            nullCommand();
        }
        else if (command === "my-tweets") {

            myTweets();
        }
        else if (command === "spotify-this-song") {

            spotifyThisSong();
        }
        else if (command === "movie-this") {

            movieThis();
        }
        else {

            invalidCommand();
        }
    });
}
else {

    invalidCommand();
}