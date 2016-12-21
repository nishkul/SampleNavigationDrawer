if (window.hasOwnProperty('swig')) {
    swig.setFilter('clean_html',function (str) {
        if (str) {
            // Strip unnecessary <br> tags from start and end of string
            str = str.replace(/^(<br[^>]*>\s*){2,}/g,'').replace(/(<br[^>]*>\s*){2,}$/g,'');
        }

        return str;
    });

    swig.setFilter('int_to_char', function (num, char_case) {
        var char = '';
        if (num <= 26) {
            char = String.fromCharCode((char_case == 'upper' ? 64 : 96) + num);
        }

        return char;
    });

    swig.setFilter('nl2br',function (str) {
        if (str) {
            str = str.replace(/\r?\n/g, '<br/>');
        }

        return str;
    });
}
