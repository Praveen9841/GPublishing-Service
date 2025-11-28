/**
 *
 * -----------------------------------------------------------------------------
 *
 * Template : Bizup - Creative Agency & Portfolio HTML Template
 * Author : reacthemes
 * Author URI : https://reactheme.com/ 
 *
 * -----------------------------------------------------------------------------
 *
 **/

(function ($) {
    'use strict';

    var DEFAULT_ERROR = 'Oops! An error occurred and your message could not be sent.';

    function clearForm($form) {
        $form.find('input[type="text"], input[type="email"], input[type="tel"], textarea').val('');
        $form.find('select').each(function () {
            this.selectedIndex = 0;
        });
    }

    function setMessage($messages, type, text) {
        if (!$messages || !$messages.length) {
            window.alert(text);
            return;
        }

        $messages.removeClass('success error').addClass(type).text(text);
    }

    $('form[data-ajax="true"]').each(function () {
        var $form = $(this);
        var $messages = $($form.data('message'));

        $form.on('submit', function (e) {
            e.preventDefault();

            var formData = $form.serialize();

            $.ajax({
                type: $form.attr('method') || 'POST',
                url: $form.attr('action'),
                data: formData
            })
                .done(function (response) {
                    setMessage($messages, 'success', response);
                    clearForm($form);
                })
                .fail(function (data) {
                    var errorText = data && data.responseText ? data.responseText : DEFAULT_ERROR;
                    setMessage($messages, 'error', errorText);
                });
        });
    });

})(jQuery);