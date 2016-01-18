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
    scrollValues.pageNavHeight = elements.pageNavDark.offsetHeight;

    for(var i = 0, len = elements.navOptions.length; i < len; i++) {
      elements.navOptions[i].getElementsByTagName('a')[0].addEventListener('click', navClick);
    }

    updateNav(0);
  }

  function initSectionHeights() {
    elements.mainSections = document.getElementsByClassName("js--main-section");
    updateSectionHeights();

    window.addEventListener("resize", updateSectionHeights, false);
    window.addEventListener("orientationchange", updateSectionHeights, false);
    window.addEventListener("scroll", _.throttle(scrollUpdate, 100), false);

  }

  function initSideSections() {
    elements.sideSectionWrapper = document.getElementById("page-sides");
    elements.sideSections = document.getElementsByClassName("js--side-section");
    scrollUpdate();
  }

  function navClick(event) {
    console.log("clicked on a nav!", event.target.getAttribute('section-index'));

    var index = event.target.getAttribute('section-index');

    //window.scrollTo(0, (index * scrollValues.screenHeight));

    scrollToY((index * scrollValues.screenHeight), 750, 'easeInOutQuint');

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

    if(maxIndex >= elements.sideSections.length) {
      elements.sideSections[(elements.sideSections.length - 1)].removeClass("hidden");
      console.log("beyond the last page");
    }

    updateNav(maxIndex);

  }

  function resetSide() {
    elements.sideSectionWrapper.removeClass('absolute');
  }

  function setSideAbsolute() {
    elements.sideSectionWrapper.classList.add('absolute');
    elements.sideSectionWrapper.style.height = scrollValues.screenHeight + 'px';
    elements.sideSectionWrapper.style.bottom = scrollValues.screenHeight + 'px';
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

    if (scrollValues.top > (documentHeight - scrollValues.screenHeight - scrollValues.pageNavHeight)) {
      //elements.pageNavDark.classList.add('hidden');
      elements.pageNavDark.classList.add('white');
    } else {
      elements.pageNavDark.removeClass('white');
      //elements.pageNavDark.removeClass('hidden');
    }

    if(scrollValues.top > (documentHeight - (scrollValues.screenHeight * 2))) {
      console.log("in the final stretch");
      setSideAbsolute();
    } else {
      resetSide();
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

  // first add raf shim
// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      function( callback ){
        window.setTimeout(callback, 1000 / 60);
      };
  })();

// main function http://stackoverflow.com/a/26808520/2247841
  function scrollToY(scrollTargetY, speed, easing) {
    // scrollTargetY: the target scrollY property of the window
    // speed: time in pixels per second
    // easing: easing equation to use

    var scrollY = window.scrollY,
      scrollTargetY = scrollTargetY || 0,
      speed = speed || 2000,
      easing = easing || 'easeOutSine',
      currentTime = 0;

    // min time .1, max time .8 seconds
    var time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));

    // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
    var PI_D2 = Math.PI / 2,
      easingEquations = {
        easeOutSine: function (pos) {
          return Math.sin(pos * (Math.PI / 2));
        },
        easeInOutSine: function (pos) {
          return (-0.5 * (Math.cos(Math.PI * pos) - 1));
        },
        easeInOutQuint: function (pos) {
          if ((pos /= 0.5) < 1) {
            return 0.5 * Math.pow(pos, 5);
          }
          return 0.5 * (Math.pow((pos - 2), 5) + 2);
        }
      };

    // add animation loop
    function tick() {
      currentTime += 1 / 60;

      var p = currentTime / time;
      var t = easingEquations[easing](p);

      if (p < 1) {
        requestAnimFrame(tick);

        window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
      } else {
        console.log('scroll done');
        window.scrollTo(0, scrollTargetY);
      }
    }

    // call it once to get started
    tick();
  }

})();
