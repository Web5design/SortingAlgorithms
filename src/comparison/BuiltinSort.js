(function(Sort, undef){

    //
    //  Comparison Algorithms
    //
    
    function asNumbers(a,b) { return a - b; }
    
    // default built-in sort algorithm
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    Sort.BuiltinSort = function(a) {
        a.sort(asNumbers);
        // in-place
        return a;
    };
    Sort.BuiltinSort.reference = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort";
    
})(Sort);