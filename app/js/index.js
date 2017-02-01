import m from "mithril";
import NchanSubscriber from "nchan";
import domready from "domready";


domready(()=>{
  var sub = NchanSubscriber("/foo")
  console.log("hiya")
  
})
