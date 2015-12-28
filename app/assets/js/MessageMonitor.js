var LongPollSubscriber = new Class({
  Implements: Events,
  
  initialize: function() {
    this.etag= null;
    this.lastModified= null;
    this.longPollStartTime = null;
    this.maxLongPollTime = 5*60*1000; //5 minutes
    
    this.listener = new Request({method: 'get', evalResponse: false});
    this.listener.addEvents({
      success: function listenerSuccess(resp) {
        this.etag= this.listener.getHeader('Etag');
        this.lastModified= this.listener.getHeader('Last-Modified');
        
        var msgId = "" + Date.parse(this.lastModified)/1000 + ":" + this.etag;
        
        this.fireEvent('lastMessageId', msgId);
        this.fireEvent("message", [resp, msgId]);
        
        this.listen();
      }.bind(this),
      
      failure: function listenerFailure(resp) {
        this.fireEvent("error", [resp.status, resp.statusText]);
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
  },

  now: function() {
    return new Date().getTime();
  },

  maybeSendListenerRequest: function() {
    if(this.lastModified) {
      this.listener.setHeader("If-Modified-Since", this.lastModified);
    }
    if(this.etag) {
      this.listener.setHeader("If-None-Match", this.etag);
    }
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
    this.listener.cancel();
    return this; 
  }
});

var EventSourceSubscriber = new Class({
  Implements: Events, 
  
  initialize: function() {
    EventSource;
  },
  
  listen: function(url) {
    this.listener = new EventSource(url);
    var l = this.listener;
    l.onmessage = function(evt){
      this.fireEvent('lastMessageId', evt.lastEventId);
      this.fireEvent('message', [evt.data, evt.lastEventId]);
    }.bind(this);
    
    l.onopen = function(evt) {
      this.fireEvent('connect', evt);
    }.bind(this);
    
    l.onerror = function(evt) {
      this.fireEvent('error', evt);
    }.bind(this);
  },
  
  cancel: function() {
    if(this.listener) {
      this.listener.close();
    }
  }
});

var WebsocketSubscriber = new Class({
  Implements: Events, 
  
  initialize: function() {
    WebSocket;
  },
  
  listen: function(url) {
    this.listener = new WebSocket(url);
    var l = this.listener;
    l.onmessage = function(evt) {
      this.fireEvent('message', evt.data);
    }.bind(this);
    
    l.onopen = function(evt) {
      this.fireEvent('connect', evt);
      console.log("connect", evt);
    }.bind(this);
    
    l.onerror = function(evt) {
      this.fireEvent('error', evt);
      console.log("error", evt);
    }.bind(this);
  },
  
  cancel: function() {
    if(this.listener) {
      this.listener.close();
    }
  }
});


var MessageMonitor = new Class({
  Implements: Events,
  initialize: function(url, subscriberType) {
    var subs= {
      'eventsource': EventSourceSubscriber,
      'longpoll': LongPollSubscriber,
      'websocket': WebsocketSubscriber
    };
    this.url = url;
    var SubscriberClass;
    
    if(subscriberType) {
      SubscriberClass = subs[subscriberType];
      if(! SubscriberClass) {
        throw "unknown subscriber type " + subscriberType;
      }
    }
    else {
      for(var i in subs) {
        try{
          new subs[i]; //try it
          SubscriberClass = subs[i];
          break;
        } catch(err) { /*meh...*/ }
      }
      
      if(! SubscriberClass) {
        throw "can't use any subscriber type";
      }
    }
    
    this.subscriber = new SubscriberClass();
    this.subscriber.addEvents({
      message: function msg(msg, id) {
        this.fireEvent('message', [msg, id]);
      }.bind(this),
      lastMessageId: function msgId(id) {
        this.lastMessageId = id;
      }.bind(this),
      error: function fail(code, text) {
        this.fireEvent('failure', [code, text]);
      }.bind(this)
    });
    
    //explicitly stop just before leaving the page
    ['unload', 'beforeunload'].each(function(ev) {
      window.addEvent(ev, this.stop.bind(this));
    }.bind(this));
    
  },
  start: function() {
    this.subscriber.listen(this.url);
    return this;
  },
  
  stop: function() {
    this.subscriber.cancel();
  },
  
  saveState: function() {
    Cookie.write("messageMonitor:" + this.url, this.lastMessageId);
  }
  
});
