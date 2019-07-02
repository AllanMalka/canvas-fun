let prevText = '';
$("#txtInput").on('keyup', function (e) {
    let inputtxt = $(this).val();

    let input = '';
    let txtArray = [];
    
    prevText = inputtxt;
    txtArray = inputtxt.split(' ');
    txtArray.map(txt => {
        if(rune = FindRune(txt, false)) {
            input += rune;
        } else {
            let tempArray = [];
            for (let i = 0; i < txt.length; i++)
                tempArray.push(txt.charAt(i));

            tempArray.map(temptxt => {
                input += FindRune(temptxt, true);
            });
        }
        input += ' ';

    });
    $('#txtOutput').text($.trim(input));
});


const FindRune = (txt, org) => {
    
    switch (txt.toLowerCase()) {
        case 'fehu': case 'feoh': case 'fe': case 'f': return '\u16A0';
        case 'v': return '\u16A1';
        case 'uruz': case 'ur': case 'u': return '\u16A2';
        case 'yr': return '\u16A3';  
        case 'y': return '\u16A4';
        case 'w': return '\u16A5';
        case 'thurisaz': case 'thurs': case 'thorn': return '\u16A6';  
        case 'eth': return '\u16A7';  
        case 'ansuz': case 'å': case 'a': return '\u16A8';
        case 'os': /* case 'o': */ return '\u16A9';
        /* case 'a': */ case 'ac': return '\u16AA';  
        case 'aesc': return '\u16AB';  
        // case 'long-branch-oss o': return '\u16AC';  
        // case 'short-twig-oss o': return '\u16AD';  
        case 'o': return '\u16AE';  
        case 'oe': case 'ø': return '\u16AF';
        case 'on': return '\u16B0';  
        case 'raido': case 'rad': case 'reid': case 'r': return '\u16B1';
        case 'kauna': return '\u16B2';  
        case 'cen': return '\u16B3';  
        case 'kaun': case 'k': return '\u16B4';
        case 'g': return '\u16B5';
        case 'eng': return '\u16B6';  
        case 'gebo': case  'gyfu': /* case 'g': */ return '\u16B7';  
        case 'gar': return '\u16B8';  
        case 'wunjo': case  'wynn': /* case 'w': */ return '\u16B9';  
        case 'haglaz': case 'h': return '\u16BA';
        case 'haegl': /* case 'h': */ return '\u16BB';  
            // case 'long-branch-hagall h': return '\u16BC';  
            // case 'short-twig-hagall h': return '\u16BD';  
        case 'naudiz': case 'nyd': case 'naud': case 'n': return '\u16BE';
            // case 'short-twig-naud n': return '\u16BF';  
            // case 'dotted-n': return '\u16C0';  
        case 'isaz': case 'is': case 'iss': case 'i': return '\u16C1';
        case 'e': return '\u16C2';
        case 'jeran': case 'j': return '\u16C3';
        case 'ger': return '\u16C4';  
            // case 'long-branch-ar ae': 
        case 'ae': case 'æ': return '\u16C5';
            // case 'short-twig-ar a': return '\u16C6';  
        case 'iwaz': case 'eoh': return '\u16C7';  
        case 'pertho': case 'peorth': case 'p': return '\u16C8';
        case 'algiz': case 'eolhx': return '\u16C9';  
        case 'sowilo': case 's': return '\u16CA';
        // case: 'long-branch-sol s': 
        case 'sigel': return '\u16CB';
        // case 'short-twig-sol s': return '\u16CC';  
        case 'c': return '\u16CD';
        case 'z': return '\u16CE';
        case 'tiwaz': case 'tir': case 'tyr': case 't': return '\u16CF';  
            // case 'short-twig-tyr t': return '\u16D0';  
        case 'd': return '\u16D1';
        case 'berkanan': case 'beorc': case 'bjarkan': case 'b': return '\u16D2';
            // case 'short-twig-bjarkan b': return '\u16D3';  
            // case 'dotted-p': return '\u16D4';  
            // case 'open-p': return '\u16D5';  
        case 'ehwaz': case 'eh': /*case 'e': */ return '\u16D6';  
        case 'mannaz': case 'man': case 'm': return '\u16D7';
            // case 'long-branch-madr m': return '\u16D8';  
            // case 'short-twig-madr m': return '\u16D9'; 
        case 'laukaz': case 'lagu': case 'logr': case 'l': return '\u16DA';
            // case 'dotted-l': return '\u16DB';  
            case 'ingwaz': return '\u16dc';  
            case 'ing': return '\u16dd';  
            case 'dagaz': case 'daeg': /* case 'd': */ return '\u16de';  
            case 'othalan': case 'ethel': /* case 'o': */ return '\u16df';  
            case 'ear': return '\u16e0';  
            case 'ior': return '\u16e1';  
            case 'cweorth': return '\u16e2';  
            case 'calc': return '\u16e3';  
            case 'cealc': return '\u16e4';  
            case 'stan': return '\u16e5';  
            // case 'long-branch-yr': return '\u16e6';  
            // case 'short-twig-yr': return '\u16e7';  
            // case 'icelandic-yr': return '\u16e8';  
        case 'q': return '\u16e9';
        case 'x': return '\u16ea';
        case '.': return '\u16eb';
        case ':': return '\u16ec';
            //case 'cross punctuation': return '\u16ed';  
            // case 'arlaug symbol': return '\u16ee';  
            // case 'tvimadur symbol': return '\u16ef';  
            // case 'belgthor symbol': return '\u16f0';     

        default:
            return org ? txt : false;
    }
}