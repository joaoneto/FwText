/*
 * Webforms plugin
 * Copyright (c) 2013 João Pinto Neto
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */
(function ($) {

  function log() {
    if ($.fn.wf_debug && console && console.log) {
      console.log.apply(console, arguments);
    }
  }

  $.wf = $.fn;

  $.wf.richtext = function (options) {
    var textarea;
    var settings = $.extend(
      {},
      {
        'toolbar': { 'buttons': [
          'font',
          'bold',
          'italic',
          'link',
          'picture',
          'list',
          'indent-left',
          'indent-right',
          'align-left',
          'align-center',
          'align-right',
          'upload'
        ] }
      },
      options
    );

    function exec(type, arg) {
      arg = arg || null;

      if (type === 'list') {
        type = 'insertUnorderedList';
      } else if (type === 'align-left') {
        type = 'JustifyLeft';
      } else if (type === 'align-center') {
        type = 'JustifyCenter';
      } else if (type === 'align-right') {
        type = 'JustifyRight';
      } else if (type === 'indent-right') {
        type = 'Outdent';
      } else if (type === 'indent-left') {
        type = 'Indent';
      } else if (type === 'picture') {
        type = 'insertImage';
      } else if (type === 'upload') {
        $('.wf-upload').toggle();
        return;
      }

      return this.document.execCommand(type, false, arg);
    };

    function generateForm() {
        $('<div/>')
          .css('display', 'none')
          .addClass('wf-upload')
          .append(
            $('<form/>')
              .imgupload({}, function(data) {
                $(data.files).each(function (i, p) {
                  textarea.richTextArea.append( $('<img/>').attr({src: p}));
                });
              })
              .attr('action', 'upload.php')
              .append($('<input/>').attr({ name: 'img_file', type: 'file' }), $('<input/>').attr({ type: 'submit'}))
          )
          .insertBefore(textarea);
    }

    function generateRichTextArea() {
      textarea.richTextArea = $('<div/>')
        .css({
          width: textarea.width(),
          height: textarea.height()
        })
        .addClass('wf-richtext')
        .attr('contentEditable', true)
        .insertBefore(textarea);
    }

    function generateToolbar() {
      textarea.toolBar = $('<div/>')
        .addClass('wf-richtext-toolbar')
        .insertBefore(textarea);

      $(settings.toolbar.buttons).each(function (i, btn) {
        var img = btn !== 'link' ? btn.toLowerCase() : 'share';
        var btnEl = $('<a/>')
          .addClass('btn')
          .attr('href', '#')
          .append($('<i/>').addClass('icon-' + img))
          .bind('click', function (e) {
            e.preventDefault();
            exec(btn);
            textarea.richTextArea.focus();
          });
        textarea.toolBar.append(btnEl);
      });
    }

    function init() {
      textarea = $(this);
      textarea.hide();
      generateToolbar();
      generateRichTextArea();
      generateForm();
      return this;
    }

    this.test = function () {
      log('test');
    };

    return this.each(function () {
      if (!$(this).data('instance')) {
        $(this).data('instance', init.apply(this));
        log('richtext instancied!');
      }
    });

  };



  $.wf.imgupload = function (options, callback) {
    callback = callback || function () {};
    options = options || {};

    options = $.extend(
      {},
      $.ajaxSettings,
      { contentType: false, processData: false, cache: false, type: 'post', uploadDir: '.' },
      options
    );
    options.success = callback;

    return this.each(function () {
      $(this).bind('submit', function (e) {
        e.preventDefault();
        options.url = $(this).attr('action') || options.url;
        options.data = new FormData(this);
        options.data.append('uploadDir', options.uploadDir);
        $.ajax(options);
      });
    })

  };

})(jQuery);