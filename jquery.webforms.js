/*
 * Webforms plugin
 * Copyright (c) 2013 João Pinto Neto
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */
(function($){
  function log() {
    if ($.fn.wf_debug && console && console.log)
      console.log.apply(this, arguments);
  }

  $.fn.richtext = function(options) {
    var instance, textarea;
    var settings = $.extend(
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

        $(settings.toolbar.buttons).each(function(i, btn) {
            var img = btn != 'link' ? btn.toLowerCase() : 'share';
            var btnEl = $('<a/>')
              .addClass('btn')
              .attr('href', '#')
              .append($('<i/>').addClass('icon-' + img))
              .click(function(e) {
                e.preventDefault();
                exec(btn);
                textarea.richTextArea.focus();
              })
            textarea.toolBar.append(btnEl);
        });
    }

    function exec(type, arg) {
      arg = arg || null;
      if (type == 'list') {
        type = 'insertUnorderedList';
      }
      else if (type == 'align-left') {
        type = 'JustifyLeft';
      }
      else if (type == 'align-center') {
        type = 'JustifyCenter';
      }
      else if (type == 'align-right') {
        type = 'JustifyRight';
      }
      else if (type == 'indent-right') {
        type = 'Outdent';
      }
      else if (type == 'indent-left') {
        type = 'Indent';
      }
      else if (type == 'picture') {
        return uploadFile();
      }
      
      return this.document.execCommand(type, false, arg);
    }

    function uploadFile() {
      // <form action="upload.php" method="post" enctype="multipart/form-data" class="img-upload form-horizontal">
      // <input type="file" name="img_file" class="input-file" />

      // var $form = $('<form/>')
      // .attr({action: 'upload.php', method: 'post', enctype: 'multipart/form-data'})
      // .imgupload(function(data){log(data)})
      // .append($(''))
      // log($form)
    }

    function init() {
      textarea = $(this);
      textarea.hide();
      generateToolbar();
      generateRichTextArea();
      return this;
    }

    return this.each(function() {
      if (!$(this).data('instance')) {
        $(this).data('instance', init.apply(this));
      }
      instance = $(this).data('instance');
    });

  };



  $.fn.imgupload = function(options, callback) {
    callback = typeof options == 'function' ? options : callback || function() {};
    options = typeof options != 'function' ? options : {};

    var instance, img_form;
    var settings = $.extend(
      { 'uploadDir': 'upload' },
      options
    );

    function init() {
      img_form = $(this);
      img_form.submit(function() {
        var form_data = new FormData(img_form[0]);
        log(form_data);

        var params = $.extend(true, {}, $.ajaxSettings, {
          contentType: false,
          processData: false,
          cache: false,
          type: method || 'POST'
        });

        $.ajax(params);

        // $(this).ajaxSubmit({
        //   dataType:  'json',
        //   // beforeSubmit:  function() {
        //   // },
        //   success: function(responseText, statusText, xhr, $form) {
        //     callback(responseText);
        //   },
        //   clearForm: true
        // });
        return false;
      });

      return this;
    }

    return this.each(function() {
      if (!$(this).data('instance')) {
        $(this).data('instance', init.apply(this));
      }
      instance = $(this).data('instance');
    });
  }

})(jQuery);