$(function () {

    if ($('textarea#ta').length) {
        CKEDITOR.instances.editor1.element.getText()
    }

    $('a.confirmDeletion').on('click', function () {
        if (!confirm('Confirm deletion'))
            return false;
    });
    
    if ($("[data-fancybox]").length) {
        $("[data-fancybox]").fancybox();
    }

});
CKEDITOR.instances.editor1.element.getText()
