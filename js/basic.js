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
$('#lkCanvas3d').on('click', function () {
    $('#main').hide();
    $('#csCanvas3d').css('display', 'block');
    fibInit();
});
$('#lkRuneBack').on('click', function () {
    $('#main').show();
    $('#runeKeyboardWrapper').hide();
    $("#txtInput").val('');
    $('#txtOutput').text('');
    prevText = '';
});

const MathRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
// start canvas
$(document).ready(function () {

    sceneInit();

    // fibInit();
});

const showsome = d => console.log(d);