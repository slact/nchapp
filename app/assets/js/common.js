//load!
var init=new Array();
window.addEvent('domready',function() {
  window.init.each(function(item, index) {
    item();
  });
});

function registerRequiredLogin(where) {
  where.getElements('a.mustLogin').each(function(el) {
    el.addEvent('click', function(event) {
      //for some reason, some don't like preventDefault. Like IE.
      event.preventDefault();
      window.async.send($(ev.target).getProperty("href")); 
      return false;
    });
  });
}


function toggle(elementId) {
  $(elementId).toggleClass('hidden');
}
