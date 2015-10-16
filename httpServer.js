var port = 9000;
var parseString = require('xml2js').parseString;
var http = require("http");
var request = require("request");

var rssFeeds = {
	cbb:{
	hostname: 'rss.earwolf.com',
	path:'/comedy-bang-bang',
	port:80,
	method:'GET'
},
smash:{
	hostname: 'www.smashingmagazine.com',
	path:'/feed/',
	port:80,
	method:'GET'
},
presse:{
	hostname: 'rss.lapresse.ca',
	path:'/776.xml',
	port:80,
	method:'GET'
},
kirupa:{
	hostname: 'feeds.feedburner.com',
	path:'/kirupa/vXRx',
	port:80,
	method:'GET'
}
}


function requestRSS(key){
				http.request(rssFeeds[key], function(resRequest){

				console.log(key + ": " +resRequest.statusCode);
				console.log(resRequest.headers)
				var total = '';
				resRequest.setEncoding('utf8');
				resRequest.on('data', function (chunk) {
					total += chunk;
				});
				resRequest.on('end', function(){
					var xml = total;
					parseString(xml, function (err, result) {
						rssFeeds[key]["rssResponse"] = result;
					})
				})
			}).end();

}

for(var key in rssFeeds){
	requestRSS(key);
}


var feedArray = [];

/*setTimeout(function() {
	console.log(rssFeeds["presse"]);
	console.log(rssFeeds["smash"]);
	console.log(rssFeeds["cbb"]);
	console.log(rssFeeds["kirupa"]);
}, 3000);
*/
var responseFeed = {}

var server = http.createServer(function(req,res){
    res.setHeader("Content-Type", "text/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    req.on('data', function(chunk){
    	if(req.url === "/addFeed"){
    		saveRssFeed(chunk.toString());
    	}
    	feedArray = chunk.toString().split("feed=").join("").split("&");
    });
    req.on('end', function(){ 
    	if(req.url === "/addFeed"){
    		res.end();
    	}
    	else
    	{	
		for (i in feedArray){
				responseFeed[feedArray[i]] = rssFeeds[feedArray[i]].rssResponse.rss.channel[0];
			}
       res.end(JSON.stringify(responseFeed));
    	}
    });
});
server.listen(port);

function saveRssFeed(str){
		var exp = /feed=http%3A%2F%2F|feed=/;
		var arrayString = str.replace(exp,"").replace(/%2F/g,"/").split(/\/(.+)?/);
		arrayString[1] = "/" + arrayString[1]
		console.log(arrayString);
	}




//to change the body of the request into and array:
//string.split("feed=").join("").split("&");
//HURRAY!










