$.fn.eeResizable = function(config) {
  config = $.extend({
    minWidth: 60,
    maxWidth: 1000,
    tolerance: 8
  }, config);

  $.each(this, function(i, li) {
    var table = this;
    var lockTable = true;
    var enteredStrikeZone = false;

    var edgeWhenUnLocked;
    var indexWhenUnLocked;

    $(document).on('mouseup blur', function() {
      lockTable = true;
    });

    $(li).find('td, th').mousemove(function(event) {
      var smoothing = 1;
      var offset = $(this).offset();
      var width = $(this).outerWidth();
      var clientX = event.clientX;
      var atLeftEdge = clientX - offset.left < config.tolerance;
      var atRightEdge = offset.left + width - event.clientX < config.tolerance;
      var cursorNearEdge = atLeftEdge || atRightEdge;

      if (cursorNearEdge) {
        $(this).css({ cursor: (atLeftEdge ? 'e-resize' : 'w-resize') });
        if (!enteredStrikeZone) {
          $(this).mousedown(function () {
            $(table).disableSelection();
            lockTable = false;
            if (atLeftEdge) edgeWhenUnLocked = 0;
            if (atRightEdge) edgeWhenUnLocked = 1;
            indexWhenUnLocked = $(this).index();
            console.log("Unlock table", edgeWhenUnLocked, indexWhenUnLocked);
          });

          $(this).mouseup(function() {
            console.log("Lock table");
            $(table).enableSelection();
            lockTable = true;
          });
        }
        enteredStrikeZone = true;
      } else {
        enteredStrikeZone = false;
        $(this).off('mousedown');
        $(this).off('mouseup');
        $(this).css({ cursor: 'default' });
      }

      if (!lockTable) {
        var shiftLeft = (edgeWhenUnLocked == 0);
        var header = $(this).parents('table');
        var self = header.find('th:eq(' + indexWhenUnLocked + ')');
        var elementsToSquish;
        var elementsToFix;
        var movement = event.originalEvent.movementX / smoothing;
        if (shiftLeft) {
          elementsToFix = header.find('th:gt(' + indexWhenUnLocked + ')');
          elementsToSquish = header.find('th:lt(' + indexWhenUnLocked + ')');
          movement = -movement;
        } else {
          elementsToSquish = header.find('th:gt(' + indexWhenUnLocked + ')');
          elementsToFix = header.find('th:lt(' + indexWhenUnLocked + ')');
        }

        var squishableElements = [];
        elementsToSquish.each(function(i, el) {
          if ($(el).actualWidth() - movement < config.maxWidth && $(el).actualWidth() - movement > config.minWidth)
            squishableElements.push(el)
        });

        if (($(self).actualWidth() > config.minWidth && movement < 0) || ($(self).actualWidth() < config.maxWidth && movement > 0)
            && squishableElements.length > 0) {

          elementsToFix.each(function(i, el) {
            $(el).css({ width: $(el).actualWidth() });
          });

          var index = Math.round(Math.random() * (squishableElements.length)-1);
          var squish = $(squishableElements[index]);
          squish.css({ width: squish.actualWidth() - movement });
          $(self).css({
            width: 'auto'
          });

        }

      }

    });

    $(li).find('td, th').mouseleave(function() {
      $(this).off('mousedown');
      $(this).off('mouseup');
      enteredStrikeZone = false;
    });

  });

};

$.fn.actualWidth = function() {
  return $(this).innerWidth() + parseInt($(this).css('border-left-width') || 0) +
         parseInt($(this).css('border-right-width') || 0);
};

$.fn.disableSelection = function() {
  return this
    .attr('unselectable', 'on')
    .css('user-select', 'none')
    .on('selectstart', false);
};

$.fn.enableSelection = function() {
  return this
    .attr('unselectable', 'off')
    .css('user-select', 'text')
    .off('selectstart');
};