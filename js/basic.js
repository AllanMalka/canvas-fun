$('#lkCircles').on('click', function () {
    $('#main').toggle();
    $('#csCircles').toggle();
    $('body').css('overflow-y', 'hidden');
    running = true;
});
$('#lkRuneKeyaboard').on('click', function () {
    $('#main').hide();
    $('#runeKeyboardWrapper').show();
});
$('.lkBack').on('click', function () {
    $('#main').show();
    $('#runeKeyboardWrapper').hide();
    $("#txtInput").val('');
    $('#txtOutput').text('');
    prevText = '';
});