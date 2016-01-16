(function() {

  var mainSections;
  var utilities = {};

  document.addEventListener("DOMContentLoaded", function(event) {
    siteInitiate();
  });

  function siteInitiate() {
    console.log("site loaded");
    initSectionHeights();
  }

  function initSectionHeights() {
    mainSections = document.getElementsByClassName("js--main-section");
    updateSectionHeights();

    window.addEventListener("resize", updateSectionHeights, false);
    window.addEventListener("orientationchange", updateSectionHeights, false);
    window.addEventListener("scroll", _.throttle(scrollUpdate, 200), false);

  }

  function updateSectionHeights() {
    console.log("updating seciton height");
    var screenHeight = window.innerHeight;
    for(var i = 0, len = mainSections.length; i < len; i++) {
      mainSections[i].style.height = screenHeight + 'px';
    }
  }

  function scrollUpdate() {
    console.log("scroll update");
  }

  // listen to scroll

  // check against height of page

  // todo use throttle not debounce

})();
