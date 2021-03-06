import domready from "domready";

"use strict";

//redirecty stuff
domready(function() {
  var map = {
    "#publisher-endpoint-configs":          "#how-channel-settings-work",
    "#keeping-the-channel-private":         "#keeping-a-channel-private",
    "#application-callbacks":               "#hooks-and-callbacks",
    "#subscribe-and-unsubscribe-callbacks": "#subscriber-presence",
    "#subsribe-and-unsubscribe-callbacks":  "#subscriber-presence",
    "#message-publishing-callbacks":        "#message-forwarding",
    "#using-redis":                         "#redis",
    "#authenticate-and-hide-the-channel-id-with-x-accel-redirect" : "#x-accel-redirect",
    "#authenticate-with-nchan_authorize_request": "#request-authorization"
  };
  
  var check = function() {
    if(map[document.location.hash]) {
      document.location.hash = map[document.location.hash];
    }
  }
  check();
});
