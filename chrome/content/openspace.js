var OpenSpace = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
    setTimeout("OpenSpace.alert()", 2000);
  },

  onClick: function() {
    window.open("chrome://openspace/content/window.xul", "", "width=400,height=200,chrome");
  },
  
  alert: function(){
	alert('test');
	setTimeout("OpenSpace.alert()", 2000);
  }
};

window.addEventListener("load", function(e) { OpenSpace.onLoad(e); }, false); 
