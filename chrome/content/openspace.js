var OpenSpace = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
    setTimeout("OpenSpace.timer()", 2000);
  },

  onClick: function() {
    //window.open("chrome://openspace/content/window.xul", "", "width=400,height=200,chrome");
  },
  
  timer: function(){
	  var panel = document.getElementById("my-panel");
	  panel.setAttribute("style", "background-image: url('chrome://inspector/skin/btnSelecting-act.gif')");
	//alert('test');
	//setTimeout("OpenSpace.alert()", 2000);
  }
};

window.addEventListener("load", function(e) { OpenSpace.onLoad(e); }, false); 
