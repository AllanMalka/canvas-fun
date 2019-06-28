// $(document).ready(function () {
    window.caci = false;
    $('#lkCircles').on('click', function () {
        $('#main').toggle();
        $('#csCircles').toggle();
        $('body').css('overflow-y', 'hidden');
        window.caci = new CanvasCircles($('#csCircles')[0]);
        running = true;
    });
    $('#lkNew').on('click', function () {
        $('#main').toggle();
        
    });
    function RefreshCanvasCircle(){
        console.log(window.caci);
        window.caci = false;
        console.log(window.caci);
    }
// });