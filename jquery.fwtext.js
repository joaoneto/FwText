/*
 * FwText plugin
 * Copyright (c) 2013 João Pinto Neto
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */
(function ($) {

  function log() {
    if ($.fw.fw_debug && console && console.log) {
      console.log.apply(console, arguments);
    }
  }

  $.fw = $.fn;

  $.fw.richtext = function (options) {
    var textarea, lastElementSelected;
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

    var defaultTextareaEvents = {
      click: function (e) {
        var target = $(e.target);
        var $this = $(this);
        
        if (lastElementSelected !== this && target === this) {
          $this.trigger('onFocus', [$(lastElementSelected)]);
        }

        if (target.hasClass('fw-richtext')) {
          if (typeof lastElementSelected !== 'undefined' && e.target !== lastElementSelected)
            $.event.trigger('elementDeselected', [$(lastElementSelected)]);
            // $this.trigger('elementDeselected', [$(lastElementSelected)]);
        } else {
          target.trigger('elementSelected', [target]);
          // $this.trigger('elementSelected', [$(target)]);
        }

        lastElementSelected = target;

      }
    };

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
        $('.fw-upload').toggle();
        return;
      }

      return this.document.execCommand(type, false, arg);
    };

    function generateForm() {
        $('<div/>')
          .css('display', 'none')
          .addClass('fw-upload')
          .append(
            $('<form/>')
              .imgupload({}, function(data) {
                $(data.files).each(function (i, p) {
                  textarea.richTextArea.append( $('<img/>').attr({src: p}).resizable() );
                });
              })
              .attr('action', 'upload.php')
              .append($('<input/>').attr({ name: 'img_file', type: 'file' }), $('<input/>').attr({ type: 'submit'}))
          )
          .insertBefore(textarea);
    }

    function generateRichTextArea() {
      textarea.richTextArea = $('<div/>')
        // debug ---------------------------------------------------------------
        .append($('<img src=".face">').resizable())
        // .append($('<img src=".face">').resizable())
        .append($('<img src=".face">').resizable())
        // debug ---------------------------------------------------------------
        .css({
          width: textarea.width(),
          height: textarea.height()
        })
        .addClass('fw-richtext')
        .attr('contentEditable', true)
        .insertBefore(textarea);

        textarea.richTextArea.ownerDocument = document;
    }

    function generateToolbar() {
      textarea.toolBar = $('<div/>')
        .addClass('fw-richtext-toolbar')
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
      
      // $(textarea.richTextArea).bind(defaultTextareaEvents);
      $(document).bind(defaultTextareaEvents);

      // debug ---------------------------------------------------------------
      // $(textarea.richTextArea).bind('onFocus onBlur elementSelected elementDeselected', function (event, node) {
      //   log(event, node);
      // });
      // $(textarea.richTextArea).bind('elementDeselected', function (event, node) {
      //   log(event, node);
      // });

      // $(document).bind('elementDeselected', function (event, node) {
      //   $('.fw-area').remove();
      // });
      // debug ---------------------------------------------------------------

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


  /*
   * Plugin to upload files
   */
  $.fw.imgupload = function (options, callback) {
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


  /*
   * Plugin to resize objects (Workarond to webkit contentEditable)
   */
  $.fw.resizable = function (options) {

    return this.each(function (i, el) {
      log(el)
      $(el).bind({
        elementSelected: function (e, node) {
          e.stopPropagation();
          var area;
          
          $('.fw-area').remove();

          $('<div/>').addClass('fw-area')
            .css({
              border: '1px solid #333',
              width: node.width(),
              height: node.height(),
              left: node.offset().left,
              display: 'block',
              position: 'absolute'
            })
            .prependTo(node.parent());
          
          // log($('<div/>'))
          log('selected', el)
        },
        elementDeselected: function (e, node) {
          e.stopPropagation();
          log('pong', node);
          $('.fw-area').remove();
        },
        mousemove: function (e) {

        },
        mouseup: function () {
          
        }
      });

    });

  };

})(jQuery);