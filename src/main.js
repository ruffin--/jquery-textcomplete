/*!
 * jQuery.textcomplete
 *
 * Repository: https://github.com/yuku-t/jquery-textcomplete
 * License:    MIT (https://github.com/yuku-t/jquery-textcomplete/blob/master/LICENSE)
 * Author:     Yuku Takahashi
 */
 /*global jQuery */

if (jQuery === 'undefined') {
  throw new Error('jQuery.textcomplete requires jQuery');
}

(function ($) {
  'use strict';
  var warn, id;

  warn = function (message) {
    if (console.warn) { console.warn(message); }
  };

  id = 1;

  $.fn.textcomplete = function (strategies, option) {
    var args, self, $this, completer;

    args = Array.prototype.slice.call(arguments);
    return this.each(function () {
      self = this;
      $this = $(this);
      completer = $this.data('textComplete');
      if (!completer) {
        option = option || {};
        option._oid = id++;  // unique object id
        completer = new $.fn.textcomplete.Completer(this, option);
        $this.data('textComplete', completer);
      }
      if (typeof strategies === 'string') {
        if (!completer) {
          return;
        }
        args.shift();
        completer[strategies].apply(completer, args);
        if (strategies === 'destroy') {
          $this.removeData('textComplete');
        }
      } else {
        // For backward compatibility.
        // TODO: Remove at v0.4
        $.each(strategies, function (obj) {
          $.each(['header', 'footer', 'placement', 'maxCount'], function (name) {
            if (obj[name]) {
              completer.option[name] = obj[name];
              warn(name + 'as a strategy param is deprecated. Use option.');
              delete obj[name];
            }
          });
        });
        completer.register($.fn.textcomplete.Strategy.parse(strategies, {
          el: self,
          $el: $this
        }));
      }
    });
  };

}(jQuery));
