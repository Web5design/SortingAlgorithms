(function(Sort, undef){

    //
    //  Numerical/Counting Algorithms
    //
    
    // use a typed-array if possible for extra speed
    var IndexArray = Sort.Array32U
        //, eps = 1e-10
    ;
    
    // custom O(n) algorithm for 'homogeneous-equidistant' random numbers in [m, M] (with possible duplicates)
    // works by 're-indexing' the series
    Sort.IndexSort = function(a)  {
        var N=a.length, m, M, norm, aclone, i, ai,
            dupls, rangeLen, indexes, offset, off, 
            sgn, fsgn, tie, isSorted, x
        ;
        
        // trivial case
        if (N>1)
        {
            // calculate some order statistics (effective range)
            m = M = a[0]; 
            x = a[1]-a[0];
            fsgn = x ? (x < 0 ? -1 : 1) : 0;
            tie = (0==fsgn) ? true : false;
            isSorted = true; // assume already sorted
            for (i=1; i<N; i++) 
            { 
                // after finding out it is not sorted, avoid any extra calculations
                if (isSorted) 
                { 
                    x = a[i]-a[i-1];
                    sgn = x ? (x < 0 ? -1 : 1) : 0;
                    if (tie && sgn) { fsgn = sgn; tie = false; }
                    if (sgn && (sgn != fsgn))  isSorted = false;
                }
                // compute min-max range
                if (a[i]>M) M = a[i]; 
                else if (a[i]<m) m = a[i];
            }
            
            // this covers sorted, reverse-sorted and also all duplicates cases
            if (isSorted)
            {
                if (0>sgn) a.reverse(); // sorted in reverse order?
                return a;
            }
            
            // calculate indexes and duplicates offsets
            norm = (N-1)/(M-m);  
            rangeLen = N;
            indexes = new IndexArray(N);  
            dupls = new IndexArray(rangeLen);
            for (i=0; i<rangeLen; i++) dupls[i]=0;
            
            for (i=0; i<N; i++) 
            { 
                x = a[i];
                ai = indexes[i] = ~~(norm*(x-m)+0.5); 
                dupls[ai]++; 
            }
            
            offset = 0;
            for (i=0; i<rangeLen; i++) 
            { 
                off = dupls[i]; 
                dupls[i] = offset; 
                offset += off; 
            }
            
            aclone = a.slice();
            // use sth similar to countingsort to accomodate duplicates
            for (i=0; i<N; i++) 
            { 
                ai = indexes[i]; 
                a[ dupls[ai] ] = aclone[i]; 
                dupls[ai]++; 
            }
        }
            
        // in-place
        return a;
    };
    
})(Sort);