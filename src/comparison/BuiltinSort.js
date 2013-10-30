(function(Sort, undef){

    //
    //  Comparison Algorithms
    //
    
    // default built-in sort algorithm
    Sort.BuiltinSort = function(a) {
        a.sort();
        // in-place
        return a;
    };
    
})(window.Sort);