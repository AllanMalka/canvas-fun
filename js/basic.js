$('#lkCircles').on('click', function () {
    $('#main').toggle();
    $('#csCircles').css('display', 'block');
    running = true;
});
$('#lkRuneKeyaboard').on('click', function () {
    $('#main').hide();
    $('#runeKeyboardWrapper').show();
});
$('#lkFibonacci').on('click', function () {
    $('#main').hide();
    $('#csFibonacci').css('display', 'block');
    fibInit();
});
$('.lkBack').on('click', function () {
    $('#main').show();
    $('#runeKeyboardWrapper').hide();
    $("#txtInput").val('');
    $('#txtOutput').text('');
    prevText = '';
});