
var subUrl="/pubsub/nchan";

function newSub(subType) {
  window.nchanSub=new MessageMonitor(subUrl, subType);
  window.nchanSub.addEvent('message', function(msg, id) {
    console.log(msg, id);
  });
  return window.nchanSub;
}

//load!
addEvent('domready', function() {
  newSub();
});

/*addEvent('load', function() {
  window.nchanSub.start();
});
*/
