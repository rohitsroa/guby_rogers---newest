$(function () {

    if ($('textarea#ta').length) {
        CKEDITOR.replace('ta');
        CKEDITOR.instances['ta'].ckdemo.document.getBody().getText();
        CKEDITOR.instances['ta'].editor1.editable().getText();
    }
    
    if ($("[data-fancybox]").length) {
        $("[data-fancybox]").fancybox();
    }
    
});
