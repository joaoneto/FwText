(function ($, webforms, window, document, undefined) {
    webforms.wysiwyg = function(el) {
      var name = 'Wysiwyg';
      var textarea = $(el);
      var instance;

      function foo() {
        instance.richTextArea.html('foo');
        return this;
      }

      function bar() {
        instance.richTextArea.html('bar');
        return this;
      }

/*
    function getContentEditableText(id) {
        var ce = $("<pre />").html($("#" + id).html());
        if ($.browser.webkit)
          ce.find("div").replaceWith(function() { return "\n" + this.innerHTML; });
        if ($.browser.msie)
          ce.find("p").replaceWith(function() { return this.innerHTML + "<br>"; });
        if ($.browser.mozilla || $.browser.opera || $.browser.msie)
          ce.find("br").replaceWith("\n");

        return ce.text();
    }
*/

      function init() {
        // debug
        // textarea.hide();

        textarea.richTextArea = $('<div/>')
        .css({
          width: textarea.width(),
          height: textarea.height(),
          border: '#000 1px solid'
        })
        .appendTo(textarea.parent())
        .attr('contentEditable', true);

        return textarea;
      }
      
      if (!textarea.data('instance')) {
        textarea.data('instance', init());
      }

      instance = textarea.data('instance');
      return { bar: bar, foo: foo, instance: instance }
    }
})(window.jQuery, window.webforms, window, document)
