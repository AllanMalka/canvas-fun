$(document).ready(function () {
    $('#lkCircles').on('click', function () {
        $('#main').toggle();
        $('#csCircles').toggle();
        $('body').css('overflow-y', 'hidden');
        running = true;
    });
});