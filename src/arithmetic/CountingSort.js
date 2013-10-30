(function(Sort, undef){

    //
    //  Numerical/Counting Algorithms
    //
    
    var Array16U=Sort.Array16U;
    
    // http://en.wikipedia.org/wiki/Counting_sort
    Sort.CountingSort = function(a) {
        var N=a.length, m, M, count, total, i, K, key, t, aclone;
        
        if (N>1)
        {
            // find min-max values (effective range)
            m=M=a[0];
            for (i=1; i<N; i++) 
            { 
                if (a[i]>M) M=a[i];
                if (a[i]<m) m=a[i];
            }
            
            // calculate histogram:
            // allocate an array Count[0..k] ; THEN
            // initialize each array cell to zero ; THEN
            // accomodate to handle fractional numbers (as possible)
            K=~~(M-m+0.5)+1; count=new Array16U(K);
            for (i=0; i<N; i++)
            {
                key=~~(a[i]-m+0.5);
                if (count[key]) count[key]++;
                else count[key]=1;
            }
             
            // calculate starting index for each key:
            total = 0;
            for (i=0; i<K; i++)
            {
                if (count[i])
                {
                    t = count[i];
                    count[i] = total;
                    total += t;
                }
            }
            
            // copy inputs into output array in order:
            // allocate an output array Output[0..n-1] ; THEN
            aclone=a.slice();
            for (i=0; i<N; i++)
            {
                key=~~(a[i]-m+0.5);
                if (!count[key]) count[key]=0;
                
                a[count[key]] = aclone[i];
                count[key]++;
            }
        }
        
        // in-place
        return a;
    };
    
})(window.Sort);