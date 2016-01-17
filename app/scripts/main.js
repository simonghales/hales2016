(function() {

  var doc = document.documentElement;
  var elements = {};
  var navMap = {
    0: 0,
    1: 1,
    2: 2,
    3: 2,
    4: 3
  };
  var utilities = {};
  var scrollValues = {
    currentIndex: 0,
    range: 200,
    screenHeight: 0,
    pageNavHeight: 0,
    pageNavOffset: 10,
    previousTop: 0,
    top: 0
  };

  var body = document.body,
    html = document.documentElement;

  document.addEventListener("DOMContentLoaded", function(event) {
    siteInitiate();
  });

  function siteInitiate() {
    console.log("site loaded");
    initNav();
    initSectionHeights();
    initSideSections();
  }

  function initNav() {
    elements.navOptions = document.getElementsByClassName("js--nav-option");
    elements.pageNavDark = document.getElementById('page-nav--dark');
    elements.pageNavWhite = document.getElementById('page-nav--white');
    scrollValues.pageNavHeight = (elements.pageNavWhite.offsetHeight) ? elements.pageNavWhite.offsetHeight : elements.pageNavDark.offsetHeight;
    updateNav(0);
  }

  function initSectionHeights() {
    elements.mainSections = document.getElementsByClassName("js--main-section");
    updateSectionHeights();

    window.addEventListener("resize", updateSectionHeights, false);
    window.addEventListener("orientationchange", updateSectionHeights, false);
    window.addEventListener("scroll", _.throttle(scrollUpdate, 50), false);

  }

  function initSideSections() {
    elements.sideSections = document.getElementsByClassName("js--side-section");
    scrollUpdate();
  }

  function updateNav(index) {

    console.log(navMap, index, navMap[index]);
    var navIndex = navMap[index];

    for(var i = 0, len = elements.navOptions.length; i < len; i++) {
      console.log("updating nav", index, i);
      if (i === navIndex) {
        elements.navOptions[i].classList.add('active');
      } else {
        elements.navOptions[i].removeClass('active');
      }
    }

  }

  function updateNavWhite(offset) {

    // todo, it keeps reverting to 3 values weird

    console.log("offset", offset);

    elements.pageNavWhite.style.clipPath = "inset(" + offset + "px 0px 0px 0px)";
    elements.pageNavWhite.style.webkitClipPath = "inset(" + offset + "px 0px 0px 0px)";

    var invertedOffset = scrollValues.pageNavHeight - offset;

    elements.pageNavDark.style.clipPath = "inset(0px 0px " + offset + "px 0px)";
    elements.pageNavDark.style.webkitClipPath = "inset(0px 0px " + offset + "px 0px)";

  }

  function updateSectionHeights() {
    scrollValues.screenHeight = window.innerHeight;
    scrollValues.range = scrollValues.screenHeight / 2;
    console.log("updating seciton height");
    for(var i = 0, len = elements.mainSections.length; i < len; i++) {
      elements.mainSections[i].style.height = scrollValues.screenHeight + 'px';
    }
  }

  function updateSideSection(maxIndex) {

    if(maxIndex === scrollValues.currentIndex) return;

    scrollValues.currentIndex = maxIndex;

    console.log("updating to index: " + maxIndex);
    for(var i = 0; i < maxIndex; i++) {
      elements.sideSections[i].classList.add("hidden");
    }
    for(var i = maxIndex, len = elements.sideSections.length; i < len; i++) {
      elements.sideSections[i].removeClass("hidden");
    }

    for(var i = 0, len = elements.sideSections.length; i < len; i++) {
      if(i === maxIndex || i === (maxIndex - 1) || i === (maxIndex + 1)) {
        elements.sideSections[i].removeClass("hidden-strict");
      } else {
        elements.sideSections[i].classList.add("hidden-strict");
      }
    }

    updateNav(maxIndex);

  }

  function scrollUpdate() {
    scrollValues.previousTop = scrollValues.top;
    scrollValues.top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

    var index = Math.floor(scrollValues.top / scrollValues.screenHeight);
    var newIndex = index;
    var scrollingDown = (scrollValues.top >= scrollValues.previousTop);

    if(scrollingDown) {
      var checkIndex = index + 1;
      var checkHeight = (scrollValues.screenHeight * checkIndex) - scrollValues.range;
      if(scrollValues.top >= checkHeight) {
        newIndex = index + 1;
        updateSideSection(newIndex);
      } else {
        newIndex = index;
        updateSideSection(newIndex);
      }
    } else {
      var checkIndex = index + 1;
      var checkHeight = (scrollValues.screenHeight * checkIndex) - scrollValues.range;
      if(scrollValues.top <= checkHeight) {
        newIndex = index;
        updateSideSection(newIndex);
      }

    }

    var documentHeight = Math.max( body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight );

    if (scrollValues.top > (documentHeight - scrollValues.screenHeight - scrollValues.pageNavHeight) - scrollValues.pageNavOffset) {
      var offset = ((documentHeight - scrollValues.screenHeight) - scrollValues.top) - scrollValues.pageNavOffset;
      console.log("near the bottom of the page", offset);
      updateNavWhite(offset);
      //elements.pageNavDark.classList.add('hidden');
      elements.pageNavWhite.removeClass('hidden');
    } else {
      elements.pageNavWhite.classList.add('hidden');
      //elements.pageNavDark.removeClass('hidden');
    }

  }

  //http://stackoverflow.com/a/6976865/2247841
  HTMLElement.prototype.removeClass = function(remove) {
    var newClassName = "";
    var i;
    var classes = this.className.split(" ");
    for(i = 0; i < classes.length; i++) {
      if(classes[i] !== remove) {
        newClassName += classes[i] + " ";
      }
    }
    this.className = newClassName.trim();
  }

})();
