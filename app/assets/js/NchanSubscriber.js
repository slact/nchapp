
// https://github.com/yanatan16/nanoajax
!function(t,e){function n(t){return t&&e.XDomainRequest&&!/MSIE 1/.test(navigator.userAgent)?new XDomainRequest:e.XMLHttpRequest?new XMLHttpRequest:void 0}function o(t,e,n){t[e]=t[e]||n}var r=["responseType","withCredentials","timeout","onprogress"];t.ajax=function(t,a){function s(t,e){return function(){c||(a(void 0===f.status?t:f.status,0===f.status?"Error":f.response||f.responseText||e,f),c=!0)}}var u=t.headers||{},i=t.body,d=t.method||(i?"POST":"GET"),c=!1,f=n(t.cors);f.open(d,t.url,!0);var l=f.onload=s(200);f.onreadystatechange=function(){4===f.readyState&&l()},f.onerror=s(null,"Error"),f.ontimeout=s(null,"Timeout"),f.onabort=s(null,"Abort"),i&&(o(u,"X-Requested-With","XMLHttpRequest"),e.FormData&&i instanceof e.FormData||o(u,"Content-Type","application/x-www-form-urlencoded"));for(var p,m=0,v=r.length;v>m;m++)p=r[m],void 0!==t[p]&&(f[p]=t[p]);for(var p in u)f.setRequestHeader(p,u[p]);return f.send(i),f},e.nanoajax=t}({},function(){return this}());

// https://github.com/component/emitter
function Emitter(t){return t?mixin(t):void 0}function mixin(t){for(var e in Emitter.prototype)t[e]=Emitter.prototype[e];return t}Emitter.prototype.on=Emitter.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},Emitter.prototype.once=function(t,e){function i(){this.off(t,i),e.apply(this,arguments)}return i.fn=e,this.on(t,i),this},Emitter.prototype.off=Emitter.prototype.removeListener=Emitter.prototype.removeAllListeners=Emitter.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var i=this._callbacks["$"+t];if(!i)return this;if(1==arguments.length)return delete this._callbacks["$"+t],this;for(var r,s=0;s<i.length;s++)if(r=i[s],r===e||r.fn===e){i.splice(s,1);break}return this},Emitter.prototype.emit=function(t){this._callbacks=this._callbacks||{};var e=[].slice.call(arguments,1),i=this._callbacks["$"+t];if(i){i=i.slice(0);for(var r=0,s=i.length;s>r;++r)i[r].apply(this,e)}return this},Emitter.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},Emitter.prototype.hasListeners=function(t){return!!this.listeners(t).length};


"use strict";
function NchanSubscriber(url, subscriberType) {
  this.url = url;
  var SubscriberClass;
  
  if(subscriberType) {
    if(!this.transport[subscriberType]) {
      throw "unknown subscriber type " + subscriberType;
    }
    this.subscriber = new this.transport[subscriberType];
  }
  else {
    for(var i in this.transport) {
      try {
        this.subscriber = new this.transport[i]; //try it
        break;
      } catch(err) { /*meh...*/ }
    }
  }
  if(! this.subscriber) {
    throw "can't use any subscriber type";
  }
  
  this.subscriber.on('message', function msg(msg, id) {
    this.emit('message', msg, id);
  }.bind(this));
  this.subscriber.on('error', function fail(code, text) {
    this.emit('failure', code, text);
  }.bind(this));
  
  //explicitly stop just before leaving the page
  ['unload', 'beforeunload'].each(function(ev) {
    window.addEvent(ev, this.stop.bind(this));
  }.bind(this));
};

Emitter(NchanSubscriber.prototype);

NchanSubscriber.prototype.start = function() {
  this.subscriber.listen(this.url);
  return this;
};

NchanSubscriber.prototype.stop = function() {
  this.subscriber.cancel();
},

NchanSubscriber.prototype.saveState = function() {
  Cookie.write("messageMonitor:" + this.url, this.lastMessageId);
}

NchanSubscriber.prototype.transport = {
  'longpoll': (function () {
    function Longpoll() {
      this.headers = {};
      this.longPollStartTime = null;
      this.maxLongPollTime = 5*60*1000; //5 minutes
      this.retryDelay = 1000;
    }
    
    Emitter(Longpoll.prototype);
    
    Longpoll.prototype.listen = function(url) {
      if(this.req) {
        throw "already listening";
      }
      if(url) { this.url=url; }
      var setHeader = function(incoming, name, req) {
        if(incoming) { this.headers[name]= incoming; }
      }.bind(this);
      
      this.reqStartTime = new Date().getTime();
      
      var  requestCallback;
      requestCallback = function (code, response_text, req) {
        setHeader(req.getResponseHeader('Last-Modified'), 'If-Modified-Since', req);
        setHeader(req.getResponseHeader('Etag'), 'If-None-Match', req);
        
        if(code >= 200 && code <= 210) {
          //legit reply
          var content_type = req.getResponseHeader('Content-Type');
          if (!this.parseMultipartMixedMessage(content_type, response_text, req)) {
            this.emit("message", response_text, {'content-type': content_type, 'id': this.msgIdFromResponseHeaders(req)});
          }
          
          this.reqStartTime = new Date().getTime();
          this.req = nanoajax.ajax({url: this.url, headers: this.headers}, requestCallback);
        }
        else if(code === null && response_text != "Abort") {
          //an error appears
          console.log("error");
          this.emit("error", code, response_text);
          delete this.req;
          if(this.retryOnError) {
            setTimeout(function() {
              this.listen();
            }.bind(this), this.retryDelay);
            
          }
        }
        else {
          //don't care about abortions 
          delete this.req;
          console.log("abort!");
        }
        
        console.log(this.req, code, response_text);
      }.bind(this);
      
      this.reqStartTime = new Date().getTime();
      this.req = nanoajax.ajax({url: this.url, headers: this.headers}, requestCallback);
      
      return this;
    };
    
    Longpoll.prototype.parseMultipartMixedMessage = function(content_type, text, req) {
      var m = content_type.match(/^multipart\/mixed;\s+boundary=(.*)$/);
      if(!m) { 
        return false;
      }
      var boundary = m[1];
      
      var msgs = m.split("--" + boundary);
      if(msgs[0] != "" || msgs[msgs.length] != "--") { throw "weird multipart/mixed split"; }
      
      msgs = msgs.slice(1, -1);
      for(var i in msgs) {
        m = msgs[i].match(/(.*)\n\n(.*)/m);
        var hdrs = m[1].split("\n");
        
        var meta = {};
        for(var j in hdrs) {
          var hdr = hdrs.match(/^([^:]+):\s+(.*)/);
          if(hdr && hdr[1] == "Content-Type") {
            meta["content-type"] = hdr[2];
          }
        }
        
        if(i == msgs.length - 1) {
          meta["id"] = this.msgIdFromResponseHeaders(req);
        }
        this.emit('message', msgs[2], meta);
      }
      return true;
    };
    
    Longpoll.prototype.msgIdFromResponseHeaders = function(req) {
      var lastModified, etag;
      lastModified = req.getResponseHeader('Last-Modified');
      etag = req.getResponseHeader('Etag');
      if(lastModified) {
        return "" + Date.parse(lastModified)/1000 + ":" + (etag || "0");
      }
      else if(etag) {
        return etag;
      }
      else {
        return null;
      }
    };
    
    Longpoll.prototype.cancel = function() {
      if(this.req) {
        this.req.abort();
      }
      return this; 
    };
    
    return Longpoll;
  })(),
  
  'eventsource': (function() {
    function ESWrapper() {
      EventSource;
    }
    Emitter(ESWrapper.prototype);
    
    ESWrapper.prototype.listen= function(url) {
      this.listener = new EventSource(url);
      var l = this.listener;
      l.onmessage = function(evt){
        this.emit('message', evt.data, {id: evt.lastEventId});
      }.bind(this);
      
      l.onopen = function(evt) {
        this.emit('connect', evt);
      }.bind(this);
      
      l.onerror = function(evt) {
        this.emit('error', evt);
      }.bind(this);
    };
    
    ESWrapper.prototype.cancel= function() {
      if(this.listener) {
        this.listener.close();
        delete this.listener;
      }
    };
    
    return ESWrapper;
  })(),
  
  'websocket': (function() {
    function WSWrapper() {
      WebSocket;
    }
    Emitter(WSWrapper.prototype);
    
    WSWrapper.prototype.listen = function(url) {
      this.listener = new WebSocket(url);
      var l = this.listener;
      l.onmessage = function(evt) {
        this.emit('message', evt.data);
      }.bind(this);
      
      l.onopen = function(evt) {
        this.emit('connect', evt);
        console.log("connect", evt);
      }.bind(this);
      
      l.onerror = function(evt) {
        this.emit('error', evt);
        console.log("error", evt);
      }.bind(this);
    };
    
    WSWrapper.prototype.cancel = function() {
      if(this.listener) {
        this.listener.close();
        delete this.listener;
      }
    };
    
    return WSWrapper;
  })()
}

