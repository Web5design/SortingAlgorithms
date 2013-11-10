(function(Sort, undef){

    //
    //  Numerical/Counting Algorithms
    //
    
    //
    // the main idea is this :
    // there is a 'trivial' and very fast O(n) (under all cases) algorithm
    // that sorts N 'homogeneous-equidistant' numbers in [m, M]  (IndexSort, re-indexing the series)
    // for general N random numbers with an arbitrary dynamic range (or CDF)
    // if an algorithm or function can map these numbers 'uniquely' to 
    // 'homogeneous-equidistant' numbers N in O(n) time
    // then general (number series) sorting can be done in O(n) time (under all cases)
    //
    // equidistant numbers have this (more or less general) form:
    // a[i]=Min + Perm(i)*Const, where Perm(i) is a permutation of the i's in [0, N-1] set (with possible duplicates)
    // these can be sorted (very fast) in O(n) time (IndexSort)
    //
    
    //
    // this 'general' algorithm depends on dynamic range of the input number series
    // possible solutions:
    // a.  try to uniformize the dynamic range (using CDF??, possible numeric fluctuations)  => O(n)
    // b.  use a non-linear transform to uniformize the dynamic range (which transform??, maybe CDF to uniform??) => O(n)
    // c.  separate series in sub-series of similar dynamic range and use 'recursion' (how??) => O(n)
    //
    // ** the "non-linearity" is "already in the numbers series"  (physical O(n) computation)
    //
    // ** lexical sorting can be done with same algorithm provided any '1-1' map between strings and numbers
    // which preserves lexical/string ordering
    //
    
    var Array64F = Sort.Array64F, Array16U = Sort.Array16U, Array32U = Sort.Array32U,
        splice = Array.prototype.splice,
        subSort = Sort.IndexSort // Sort.QuickSort
    ;
    
    // custom O(n) algorithm for arbitrary random numbers
    var StatisticalSort = Sort.StatisticalSort = function(a, subsort) {
        var N=a.length, isOdd, m, M, sum, norm, i, j,
            sgn, fsgn, tie, isSorted, x,
            PDF, CDF, indexes, ranges, rangesmap,
            ai, offset, Ar, Nr
            ;
        
        // trivial case
        if (N>1)
        {
            // allow to choose sub-sort algorithm
            subSort = subsort || subSort;
            
            isOdd = N%2;
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
                if (0>sgn) a.reverse(); // sorted in reverse order
                return a;
            }
            
            // compute PDF, CDF in O(n) steps
            PDF = new Array64F(N);
            CDF = new Array64F(N+1);
            sum = 0; norm = 1/(M-m); 
            for (i=0; i<N; i+=2)
            {
                PDF[i] = norm*(a[i]-m);
                sum += PDF[i];
                PDF[i+1] = norm*(a[i+1]-m);
                sum += PDF[i+1];
            }
            if (isOdd)
            {
                PDF[N-1] = norm*(a[N-1]-m);
                sum += PDF[N-1];
            }
            
            // CDF(x)=P(X<=x)  =x (for uniform variable)
            norm = 1/sum; 
            CDF[0] = 0;
            for (i=0; i<N; i+=2)
            {
                CDF[i+1] = PDF[i]*norm + CDF[i];
                CDF[i+2] = PDF[i+1]*norm + CDF[i+1];
            }
            if (isOdd)
            {
                CDF[N] = PDF[N-1]*norm + CDF[N-1];
            }
            PDF = null;   //delete it now
            
            //
            // CDF map, groups elements of similar dynamic range together (maps them in similar index), it seems
            // possibly this can be used in a recursion, or possibly using another sort (eg indexsort, counting sort, quicksort, etc..)
            //
            
            indexes = new Array32U(N); 
            norm = (N)/(M-m);
            for (i=0; i<N; i++) 
                indexes[i] = ~~(norm*(a[i]-m) + 0.5); 
            
            // find dynamic ranges in O(n) steps
            rangesmap = new Array32U(N);
            for (i=0; i<N; i++)  rangesmap[i] = 0;
            
            ranges = new Array();
            //norm=(N)/(M-m);
            
            for (i=0; i<N; i++)
            {
                ai = ~~( (N-1) * CDF[ indexes[i] ]  +0.5);
                if (rangesmap[ai])
                {
                    ranges[rangesmap[ai]-1].push( a[i] );
                }
                else
                {
                    rangesmap[ai] = ranges.length+1;
                    ranges.push( [ a[i] ] );
                }
            }
            CDF = null;   // delete it now
            
            //log(ranges);
            
            offset = 0;
            for (i=0; i<N; i++)
            {
                if (rangesmap[i])
                {
                    Ar = ranges[rangesmap[i]-1];
                    Nr = Ar.length;
                    
                    if (Nr>1)
                    {
                        // recursion ??
                        subSort( Ar ); 
                        splice.apply(a, [offset, Nr].concat( Ar ) );
                        offset += Nr;
                    }
                    else
                    {
                        splice.apply(a, [offset, Nr].concat( Ar ) );
                        offset += Nr;
                    }
                }
            }
        }
        // in-place
        return a;
    };
    
})(Sort);