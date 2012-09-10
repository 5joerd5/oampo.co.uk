function getTransitionEvent() {
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition':'transitionEnd',
      'OTransition':'oTransitionEnd',
      'MSTransition':'msTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}

var Filterer = function() {
    this.categories = $("ul.categories a");
    this.categories.on("click", this.filter.bind(this));

    this.tiles = $("div.tile");

    this.transitionEvent = getTransitionEvent();
    this.tiles.on(this.transitionEvent, this.setDisplay.bind(this));
}

Filterer.prototype.filter = function(event) {
    var category = $(event.target);

    var needAdd = !category.hasClass("active");
    this.categories.removeClass("active");
    if (needAdd) {
        category.addClass("active");
    }

    var needShow = true;
    var tiles = this.tiles.filter(":visible");
    tiles.css("opacity", "0");

    if (tiles.length == 0) {
        this.show();
    }
}

Filterer.prototype.setDisplay = function(event) {
    var tile = $(event.target);
    if (tile.css("opacity") == "1") {
        return;
    }

    tile.hide();

    // If there is still a visible tile then don't start showing
    var tiles = this.tiles.filter(":visible");
    if (tiles.length) {
        return;
    }

    this.show();
}

Filterer.prototype.show = function() {
    var category = $("ul.categories a.active");

    // No category selected, so show them all
    if (category.length == 0) {
        this.tiles.show();
        setTimeout(this.setOpacity.bind(this, this.tiles), 100);
        return
    }
    
    var tiles = this.tiles.get();
    var categoryName = category.data("category").toLowerCase();
    for (var i=0; i<tiles.length; i++) {
        var tile = $(tiles[i]);
        if (tile.data("categories").indexOf(categoryName) != -1) {
            tile.show();
            setTimeout(this.setOpacity.bind(this, tile), 100);
       }
    }
};

Filterer.prototype.setOpacity = function(tile) {
    tile.css("opacity", "1");
}

var Slider = function() {
    this.history = window.History;

    this.history.Adapter.bind(window, 'statechange',
                              this.onStateChange.bind(this));

    this.indexDiv = $("div#content>:first-child");
    this.pageDiv = $("div#content>:last-child");

    $("a.ajax").on("click", this.onClick.bind(this));

    this.transitionEvent = getTransitionEvent();
    this.indexDiv.on(this.transitionEvent, this.onIndexTransition.bind(this));
    this.pageDiv.on(this.transitionEvent, this.onPageTransition.bind(this));
}

Slider.prototype.onStateChange = function() {
    var state = this.history.getState();
    this.load(state.url);
}

Slider.prototype.onClick = function(event) {
    this.load(event.currentTarget.pathname);
    this.history.pushState({}, "", event.currentTarget.pathname);
    event.preventDefault();
}


Slider.prototype.load = function(url) {
    if (url == "/") {
        this.pageDiv.css("opacity", "0");
    }
    else {
        this.indexDiv.css("opacity", "0");
    }
}

Slider.prototype.onIndexTransition = function() {
    if (this.indexDiv.css("opacity") == "0") {
        this.indexDiv.hide();
        this.pageDiv.show();
        this.pageDiv.css("opacity", "1");
    }
}

Slider.prototype.onPageTransition = function() {
    if (this.pageDiv.css("opacity") == "0") {
        this.pageDiv.hide();
        this.indexDiv.show();
        this.indexDiv.css("opacity", "1");  
    }
}  


$(document).ready(function() {
    window.filterer = new Filterer();
//    window.slider = new Slider();
});
