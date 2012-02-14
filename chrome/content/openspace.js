var jsLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].
                getService(Components.interfaces.mozIJSSubScriptLoader);

jsLoader.loadSubScript("chrome://openspace/content/jquery-1.7.1.min.js");
jQuery.noConflict();

var OpenSpace = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
    setTimeout("OpenSpace.timer()", 1);
  },

  onClick: function() {
    window.open("chrome://openspace/content/window.xul", "", "width=400,height=200,chrome");
  },
  
  timer: function(){
	var myspace = 0;
	  
	jQuery.get(OpenSpace.spaces[myspace].url, OpenSpace.spaces[myspace].handler, OpenSpace.spaces[myspace].type)
		.error(function(){ 
			jQuery("#openspace-status-image").attr("src","chrome://openspace/skin/grey.png");
		});
		
	setTimeout("OpenSpace.timer()", 60000);
  },

  spaces: [
		{
			name: "ACKspace",
			url: "https://ackspace.nl/status.php",
			type: "json",
			handler: function(data){
				OpenSpace.setStatus(data.open);
			}
		},
		
		{
			name: "Bitlair",
			url: "https://bitlair.nl/statejson.php",
			type: "json",
			handler: function(data){
				OpenSpace.setStatus(data.open);
			}
		},
		{
			name: "Fabelier",
			url: "http://status.fabelier.org/status.json",
			type: "json",
			handler: function(data){
				OpenSpace.setStatus(data.open);
			}
		},
		{
			name: "Frack",
			url: "http://frack.nl/spacestate/?api",
			type: "json",
			handler: function(data){
				OpenSpace.setStatus(data.open);
			}
		},
		{
			name: "HeatSync Labs",
			url: "http://intranet.heatsynclabs.org/~access/cgi-bin/spaceapi.rb",
			type: "json",
			handler: function(data){
				OpenSpace.setStatus(data.open);
			}
		},
		{
			name: "Hickerspace",
			url: "https://hickerspace.org/api/room_extended/",
			type: "json",
			handler: function(data){
				OpenSpace.setStatus(data.open);
			}
		},
		{
			name: "Kwartzlab MakerSpace",
			url: "http://at.kwartzlab.ca/spaceapi/index.php",
			type: "json",
			handler: function(data){
				OpenSpace.setStatus(data.open);
			}
		},
		{
			name: "Makers Local 256",
			url: "https://256.makerslocal.org/status.json",
			type: "json",
			handler: function(data){
				OpenSpace.setStatus(data.open);
			}
		},
		{
			name: "Maschinenraum",
			url: "http://twitter.com/statuses/user_timeline.json?screen_name=mr_door_status&count=1&callback=?",
			type: "json",
			handler: function(data){

				//var tweet = data[0].text;
				alert("test");
				
				/// process links and reply
				//tweet = tweet.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, function(url) {
				//    return '<a href="%27+url+%27">'+url+'</a>';
				//}).replace(/B@([_a-z0-9]+)/ig, function(reply) {
				//   return  reply.charAt(0)+'<a href="http://twitter.com/%27+reply.substring%281%29+%27">'+reply.substring(1)+'</a>';
				//});
			      
				// output the result
				//$("#tweet").html(tweet);
			}
		},    
		{
			name: "Milwaukee Makerspace",
			url: "http://apps.2xlnetworks.net/milwaukeemakerspace/",
			type: "json",
			handler: function(data){
				OpenSpace.setStatus(data.open);
			}
		},
		{
			name: "MidsouthMakers",
			url: "http://midsouthmakers.org/spaceapi/",
			type: "json",
			handler: function(data){
				OpenSpace.setStatus(data.open);
			}
		},
		{
			name: "Noisebridge",
			url: "http://api.noisebridge.net/spaceapi/",
			type: "json",
			handler: function(data){
				OpenSpace.setStatus(data.open);
			}
		},
		{
			name: "Pumping Station: One",
			url: "http://space.pumpingstationone.org:8000/spaceapi/ps1",
			type: "json",
			handler: function(data){
				OpenSpace.setStatus(data.open);
			}
		},
		{
			name: "RaumZeitLabor",
			url: "http://status.raumzeitlabor.de/",
			type: "html",
			handler: function(data){
				
				var match = data.match(/green.png/g);
				if(match == "green.png")
					OpenSpace.setStatus(true);
				else
					OpenSpace.setStatus(false);
				
			}
		},
		{
			name: "RevSpace",
			url: "https://revspace.nl/status/status.php",
			type: "json",
			handler: function(data){
				OpenSpace.setStatus(data.open);
			}
		},
		{
			name: "Shackspace",
			url: "http://shackspace.de/sopen/text/en",
			type: "text",
			handler: function(data){
				if(data == "open")
					OpenSpace.setStatus(true);
				else
					OpenSpace.setStatus(false);
				
			}
		},
		{
			name: "syn2cat",
			url: "http://www.hackerspace.lu/od/",
			type: "json",
			handler: function(data){
				OpenSpace.setStatus(data.open);
			}
		},
		{
			name: "tetalab",
			url: "http://status.tetalab.org/status.json",
			type: "json",
			handler: function(data){
				OpenSpace.setStatus(data.open);
			}
		},
		{
			name: "TkkrLab",
			url: "http://tkkrlab.nl/statejson.php",
			type: "json",
			handler: function(data){
				OpenSpace.setStatus(data.open);
			}
		},
		{
			name: "TOG",
			url: "http://tog.ie/cgi-bin/space",
			type: "json",
			handler: function(data){
				OpenSpace.setStatus(data.open);
			}
		},
		{
			name: "Void Warranties",
			url: "http://we.voidwarranties.be/SpaceAPI/",
			type: "json",
			handler: function(data){
				OpenSpace.setStatus(data.open);
			}
		}
	],
  
  setStatus: function(status){
	  if(status == true)
		jQuery("#openspace-status-image").attr("src","chrome://openspace/skin/green.png");
	  else
		jQuery("#openspace-status-image").attr("src","chrome://openspace/skin/red.png");
  }
};

/*
// doesn't work
jQuery("#openspace-status-image").click(function(event){
	//OpenSpace.onClick(event);
	alert("test");
});
//*/
window.addEventListener("load", function(e) { OpenSpace.onLoad(e); }, false); 
