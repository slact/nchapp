import m from "mithril";
import NchanSubscriber from "nchan";
import domready from "domready";

"use strict";

function insertTableOfContents(tocElSelector, pageElSelector) {
  var tocContainer = document.querySelector(tocElSelector);
  if(!tocContainer) {
    return;
  }
  
  var els = document.querySelector(pageElSelector).querySelectorAll("h1, h2, h3, h4, h5");

  class Heading {
    constructor(el) {
      if(el) {
        this.tag = el.tagName;
        this.tagLvl = parseInt(el.tagName[1]);
        this.id = el.id;
        this.text = el.textContent;
      }
      else {
        this.tagLvl = 0;
      }
      this.subs = [];
    }
    
    subheading(heading) {
      var last = this.subs[this.subs.length - 1];
      if(!last || last.tagLvl == heading.tagLvl) {
        this.subs.push(heading);
      }
      else if(heading.tagLvl > last.tagLvl) {
        return last.subheading(heading);
      }
      else if(heading.tagLvl > this.tagLvl){
        this.subs.push(heading);
      }
      else {
        console.log("whut?")
      }
    }
    
    m() {
      if(this.tagLvl == 0) {
        return [
          m("a.toggle",  {href:"#"}),
          m("h2", "Contents"),
          m("ul.tableOfContents", this.subs.map((sub) => { return sub.m() }))
        ];
      }
      
      var subList = [];
      if(this.subs.length > 0) {
        subList.push(m("ul", this.subs.map((sub) => { return sub.m() })));
      }
      return m("li", [ m('a', {"href": "#" + this.id}, this.text)].concat(subList))
    }
  }
  
  var rootHeading = new Heading();
  
  els.forEach(function(el) {
    //console.log(el, i)
    rootHeading.subheading(new Heading(el));
  });
  
  m.render(tocContainer, rootHeading.m());
  
}

domready(function() {
  insertTableOfContents(".sidebar .tableOfContents", "#page");
});

domready(function() {
  //grab nav links
  var links = document.querySelector("ul.navigation").querySelectorAll("li a")
  
  var nav = m("ul.navigation", [...links].map((a)=>{
    return m("a", {"classList": a.classList, href: a.href, text: a.textContent})
  }));
  
  
  m.render(document.querySelector("#topBar"), [m("img.logo", {src: "/img/nchan_top_logo.png", alt: "NCHAN"}), nav])
})


