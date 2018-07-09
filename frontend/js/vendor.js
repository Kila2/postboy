import './jQueryLoader';
// Need to import jQuery first to expose it on window
import $ from "jquery";


window.jQuery.fn.putCursorAtEnd = function() {

  return this.each(function() {

    // Cache references
    let $el = $(this),
      el = this;

    // Only focus if input isn't already
    if (!$el.is(":focus")) {
      $el.focus();
    }

    // If this function exists... (IE 9+)
    if (el.setSelectionRange) {

      // Double the length because Opera is inconsistent about whether a carriage return is one character or two.
      let len = $el.val().length * 2;

      // Timeout seems to be required for Blink
      setTimeout(function() {
        el.setSelectionRange(len, len);
      }, 1);

    } else {

      // As a fallback, replace the contents with itself
      // Doesn't work in Chrome, but Chrome supports setSelectionRange
      $el.val($el.val());

    }

    // Scroll to the bottom, in case we're in a tall textarea
    // (Necessary for Firefox and Chrome)
    this.scrollTop = 999999;

  });

};