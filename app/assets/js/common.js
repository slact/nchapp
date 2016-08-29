"use strict";

function insertTableOfContents(tocElSelector) {
  var tocContainer = document.getElement(tocElSelector);
  if(!tocContainer) {
    return;
  }
  
  var els = tocContainer.getParent().getElements(tocElSelector + ", h1, h2, h3, h4, h5");
  var tocSeen = false;
  
  var hs=[];
  var current_heading;
  
  var toc= new Element('ul', {'class': 'tableOfContents'});
  var lastUl = toc;
  var lastLevel;
  var lastLi;
  var headingsFound = 0;
  
  var makeLi = function(el) {
    var li = new Element('li');
    li.adopt(new Element('a', {'text': el.get('text'), 'href':"#" + el.get('id')}));
    return li;
  };
  
  Array.each(els, function(el, i) {
    if(el == tocContainer) {
      tocSeen = true;
    }
    else if(tocSeen) {
      headingsFound ++;
      var lvl = parseInt(el.get('tag')[1]);
      if(!lastLevel) {
        lastLevel = lvl;
      }
      
      if(lastLevel == lvl) {
        lastLi = makeLi(el);
        lastUl.adopt(lastLi);
      }
      else if(lvl > lastLevel) {
        lastUl = new Element('ul');
        lastLi.adopt(lastUl);
        lastLi = makeLi(el);
        lastUl.adopt(lastLi);
        lastLevel = lvl;
      }
      else {
        if(lastUl == toc) {
          throw "oh no!";
        }
        lastUl = lastUl.getParent().getParent();
        lastLi = makeLi(el);
        lastUl.adopt(lastLi);
        lastLevel = lvl;
      }
    }
  });
  
  if(headingsFound > 0 ){
    var toggle = new Element("a", {"class": "toggle", href:"#"});
    toggle.addEvent('click', function(ev) {
      ev.stop();
      tocContainer.toggleClass("tableOfContentsHidden");
    });
    tocContainer.adopt(toggle);
    
    tocContainer.adopt(new Element("h2", {text: "Contents"}));
    tocContainer.adopt(toc);
  }
}

addEvent('domready', function() {
  insertTableOfContents(".tableOfContents");
});
