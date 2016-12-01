"use strict";

function insertTableOfContents(tocElSelector, pageElSelector) {
  var tocContainer = document.getElement(tocElSelector);
  console.log(tocContainer);
  if(!tocContainer) {
    return;
  }
  
  var els = document.getElement(pageElSelector).getElements("h1, h2, h3, h4, h5");
  var tocSeen = true;
  
  var hs=[];
  var current_heading;
  
  var toc= new Element('ul', {'class': 'tableOfContents'});
  var lastUl = toc;
  var lastLevel;
  var lastLi;
  var headingsFound = 0;
  
  var goIn = function() {
    var ul = lastLi.getFirst('ul');
    if(!ul) {
      ul = new Element('ul');
      lastLi.adopt(ul);
    }
    lastUl = ul;
  };
  
  var goOut = function(num) {
    if(num == 0 || lastUl == toc) {
      return lastUl;
    }
    num--;
    lastUl = lastUl.getParent().getParent();
    return goOut(num);
  };
  
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
        goIn();
        lastLi = makeLi(el);
        lastUl.adopt(lastLi);
        lastLevel = lvl;
      }
      else {
        goOut(lastLevel - lvl);
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
  insertTableOfContents(".sidebar .tableOfContents", "#page");
});
