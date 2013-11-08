(function(Sort, undef){

    //
    //  Comparison Algorithms
    //
    
    // auxilliaries
    var gaps = [701, 301, 132, 57, 23, 10, 4, 1], gl = gaps.length;
    
    // for reference
    // http://en.wikipedia.org/wiki/Shellsort
    
    // adapted from: https://github.com/mgechev/javascript-algorithms
    // Shellsort which uses the gaps in the lexical scope of the IIFE.
    
    Sort.ShellSort = function(a) {
        var gap, current, k, i, j, N=a.length;

        if (N<=1) return a;
        
        for (k = 0; k < gl; k ++) 
        {
            gap = gaps[k];
            for (i = gap; i < N; i += gap) 
            {
                current = a[i];
                for (j = i; j >= gap && a[j - gap] > current; j -= gap) 
                {
                    a[j] = a[j - gap];
                }
                a[j] = current;
            }
        }
        
        // in-place
        return a;
    };
    Sort.ShellSort.reference = "http://en.wikipedia.org/wiki/Shellsort";
    
    
})(Sort);