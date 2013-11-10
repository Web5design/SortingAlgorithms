(function(Sort, undef){

    //
    //  Comparison Algorithms
    //
    
    // auxilliaries
    var log = console.log;
    var splice = Array.prototype.splice,
        Min = Math.min, Log = Math.log, Log2 = Log(2),
        
        Merge = function(a, left, middle, right) {
            // need at least 2 elements to merge
            if (right>left)
            {
                var merged = new Array(), l = left, r = middle+1;
                
                // merge
                while (l<=middle && r<=right) 
                    merged.push( ( a[l]<=a[r] ) ? a[ l++ ] : a[ r++ ] );
                while (l<=middle) 
                    merged.push( a[ l++ ] );
                while (r<=right) 
                    merged.push( a[ r++ ] );
                
                // move the merged back to the a array
                splice.apply(a, [left, merged.length].concat(merged));
            }
            return a;
        }
    ;
    
    // http://en.wikipedia.org/wiki/Merge_sort
    var RecursiveMergeSort = Sort.RecursiveMergeSort = function(a, left, right) {
        if (undef===left && undef===right) { left=0; right=a.length-1; }
        
        // if list size is 0 (empty) or 1, consider it sorted and return it
        // (using less than or equal prevents infinite recursion for a zero length m)
        if (left < right)
        {
            var middle = ~~(left + 0.5*(right-left+1));  
            // else list size is > 1, so split the list into two sublists
            // 1. DIVIDE Part...
            // recursively call merge_sort() to further split each sublist
            // until sublist size is 1
            RecursiveMergeSort(a, left, middle-1);  
            RecursiveMergeSort(a, middle, right);
            
            // merge the sublists returned from prior calls to merge_sort()
            // and return the resulting merged sublist
            // 2. CONQUER Part...
            Merge(a, left, middle-1, right);
        }
        
        // in-place
        return a;
    };
    Sort.RecursiveMergeSort.reference = "http://en.wikipedia.org/wiki/Merge_sort";
    
    // http://en.wikipedia.org/wiki/Merge_sort
    // http://www.sinbadsoft.com/blog/a-recursive-and-iterative-merge-sort-implementations/
    // http://java.dzone.com/articles/recursive-and-iterative-merge
    Sort.MergeSort = Sort.IterativeMergeSort = function(a) {
        var N=a.length;
        
        if (N>1)
        {
            var logN = ~~(Log(N)/Log2)+1, i, j, size=1, halfSize=0, off;
            for (i=1; i<=logN; i++)
            {
                halfSize = size;
                size <<= 1;
                
                for (j=0; j<N; j+=size) 
                {
                    off = j; //(j) ? j+1 : j;
                    Merge(a, off, off+halfSize, Min(off+size, N-1));
                    log([off, off+halfSize, Min(off+size, N-1)]);
                    log(a);
                }
            }
        }
        
        // in-place
        return a;
    };
    Sort.MergeSort.reference = "http://en.wikipedia.org/wiki/Merge_sort";
    
    
})(Sort);