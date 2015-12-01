var LongPollSubscriber = new Class({
  Implements: Events,
  
  initialize: function(url) {
    this.etag= null;
    this.lastModified= null;
    this.url = url;
    this.loadState();
    this.longPollStartTime = null;
    this.maxLongPollTime = 5*60*1000; //5 minutes
    
    this.listener = new Request({method: 'get'});
    this.listener.addEvents({
      success: function listenerSuccess(resp) {
        this.etag= this.listener.getHeader('Etag');
        this.lastModified= this.listener.getHeader('Last-Modified');
        this.saveState();
        this.fireEvent("success", resp);
        this.listen();
      }.bind(this),
      
      failure: function listenerFailure(resp) {
        this.fireEvent("failure", [resp, this.listener]);
        setTimeout(function() {
          this.listen();
        }.bind(this), 1000);
      }.bind(this)
    });
    
    setInterval(function cautiousLongPollRestarter() {
      if(this.listener.isRunning() && (this.now() > (this.longPollStartTime + this.maxLongPollTime))) {
        this.cancel().listen();
      }
    }.bind(this), this.maxLongPollTime/2); 
    
    ['unload', 'beforeunload'].each(function(ev) {
      window.addEvent(ev, this.cancel.bind(this));
    }.bind(this));
  },

  now: function() {
    return new Date().getTime();
  },

  maybeSendListenerRequest: function() {
    this.listener.setHeader("If-Modified-Since", this.lastModified);
    this.listener.setHeader("If-None-Match", this.etag);
    this.listener.send({url:this.url});
    this.longPollStartTime = this.now();
  },
  
  _listen: function(when) {
    if(when===false) { return; }
    setTimeout(this.maybeSendListenerRequest.bind(this), typeOf(when)=='number' ? when : 0);
    return this;
  },
  
  listen: function(url) {
    if(url) this.url=url;
    return this._listen();
  },
  
  cancel: function() {
    this.listener.cancel(); return this; 
  },
  
  saveState: function() {
    Cookie.write("longpoll:" + this.url, this.lastModified + ":" + this.etag);
  },
  
  loadState: function() {
    var msgId = Cookie.read("longpoll:" + this.url);
    if(msgId) {
      var matches = msgId.match(/^(.*?):(\d+)$/);
      this.lastModified = matches[1];
      this.etag= matches[2];
    }
  }
});

var EventMonitor = new Class({
  Implements: Events,
  initialize: function(url) {
    this.subscriber = new LongPollSubscriber(url);
    this.subscriber.addEvents({
      success: function win(resp) {
        this.fireEvent('data', resp);
      }.bind(this),
      failure: function fail(xhr, resp) {
        this.fireEvent('failure', xhr, resp);
      }.bind(this)
    });
  },
  start: function(url) {
    this.subscriber.listen(url);
    return this;
  }
});