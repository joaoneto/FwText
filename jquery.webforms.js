/*
 * Webforms plugin
 * Copyright (c) 2013 João Pinto Neto
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */
(function ($) {

  function log() {
    // if ($.fn.wf_debug && console && console.log) {
    //   console.log.apply(this, arguments);
    // }
  }

  $.fn.richtext = function (options) {
    var instance, textarea;
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
          'align-right'
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
      }

      return this.document.execCommand(type, false, arg);
    };

    function generateRichTextArea() {
      textarea.richTextArea = $('<div/>')
        .css({
          width: textarea.width(),
          height: textarea.height()
        })
        .addClass('wf-richtext')
        .appendTo(textarea.parent())
        .attr('contentEditable', true);
    }

    function generateToolbar() {
      textarea.toolBar = $('<div/>')
        .addClass('wf-richtext-toolbar')
        .appendTo(textarea.parent());

      $(settings.toolbar.buttons).each(function (i, btn) {
        var img = btn !== 'link' ? btn.toLowerCase() : 'share';
        var btnEl = $('<a/>')
          .addClass('btn')
          .attr('href', '#')
          .append($('<i/>').addClass('icon-' + img))
          .on('click', function (e) {
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
      return this;
    }

    this.test = function () {
      log('test');
      return this;
    };

    return this.each(function () {
      if (!$(this).data('instance')) {
        $(this).data('instance', init.apply(this));
        log('richtext instancied!');
      }
      instance = $(this).data('instance');
    });

  };



  $.fn.imgupload = function (options, callback) {
    callback = callback || function () {};
    options = options || {};

    var instance, img_form;
    var params = $.extend(
      {},
      $.ajaxSettings,
      { contentType: false, processData: false, cache: false, type: 'post' },
      { 'uploadDir': '.' },
      options
    );

    function init() {
      img_form = $(this);
      img_form.submit(function (e) {
        e.preventDefault();
        params.url = options.url || $(img_form).attr('action') || params.url;
        params.type = options.type || $(img_form).attr('method') || params.type;
        params.data = new FormData(this);
        params.data.append('uploadDir', params.uploadDir);
        params.success = function (data) {
          log(data)
          if (data.files) {
            $(data.files).each(function (i, p) {
              // data.files
              $(this).siblings('.richtext').exec('picture', p);
            });
          }
        };
        $.ajax(params);
      });
      return this;
    }

    return this.each(function () {
      if (!$(this).data('instance')) {
        $(this).data('instance', init.apply(this));
        log('imgupload instancied!');
      }
      instance = $(this).data('instance');
    });
  };

})(jQuery);