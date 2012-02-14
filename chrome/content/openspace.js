var OpenSpace = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
  },

  onClick: function() {
    window.open("chrome://openspace/content/window.xul", "", "width=400,height=200,chrome");
  }
};

window.addEventListener("load", function(e) { OpenSpace.onLoad(e); }, false); 
