var Datum = new Class({
  Implements: Events,
  
  ingest: function(data) {
    Object.each(data, function(val, attr)  {
      this[attr]=val;
    }, this);
  }
});

/*
var Foo = new Class({
  Extends: Datum,
  
  initialize: function(data) {
    this.ingest(data);
    this.display();
  },
  
  display: function() {
    //show the thing
  }
});
*/
