(function(Sort, undef){

    //
    //  Comparison Algorithms
    //
    
    // auxilliaries
    var
        splice=Array.prototype.splice,
        Min=Math.min,
        /*MergeCopy = function(left, right) {
            var merged=new Array(), cl=left.length, cr=right.length;
            
            // assign the element of the sublists to 'result' variable until there is no element to merge. 
            while (cl>0 && cr>0)
            {
               // compare the first two element, which is the small one, of each two sublists.
                if (left[0] <= right[0])
                {
                    // the small element is copied to 'result' variable.
                    // delete the copied one(a first element) in the sublist.
                    merged.push(left.shift());  cl--;
                }
                else
                {
                    // same operation as the above(in the right sublist).
                    merged.push(right.shift()); cr--;
                }
            }
            // copy all of remaining elements from the sublist to 'result' variable, when there is no more element to compare with.
            //while (cl>0) { merged.push(left.shift()); cl--; }
            // same operation as the above(in the right sublist).
            //while (cr>0) { merged.push(right.shift()); cr--; }
            if (cl>0) merged=merged.concat(left);
            else if (cr>0) merged=merged.concat(right);
            // return the result of the merged sublists(or completed one, finally).
            // the length of the left and right sublists will grow bigger and bigger, after the next call of this function.
            return merged;
        },*/
        
        Merge = function(a, left, middle, right/*, offset*/) {
            var merged, m, l, r, rl, ll, ml, args;
            // workaround needed by discrepancy 
            // between recursive and iterative versions
            offset=1; //(offset) ? 1 : 0;
            ml=right-left+offset;
            // need at least 2 elements to merge
            if (ml>1)
            {
                merged = new Array(ml);
                rl=right-middle+offset; ll=middle-left+offset; 
                l = r = m = 0; 
                
                // merge
                while (l<ll && r<rl) merged[m++]=(a[left+l]<=a[middle+r]) ? a[left + l++] : a[middle + r++];
                //while (r<rl) merged[m++]=a[middle + r++];
                //while (l<ll) merged[m++]=a[left + l++];
                if (r<rl) { args=[m, rl-r+1].concat(a.slice(middle+r, middle+rl));  splice.apply(merged, args); }
                else if (l<ll) { args=[m, ll-l+1].concat(a.slice(left+l, left+ll)); splice.apply(merged, args); }
                
                // move the merged back to the a array
                //while (ml--) a[left+ml]=merged[ml];
                args=[left, ml].concat(merged); splice.apply(a, args);            
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
            Merge(a, left, middle, right, 1);
        }
        
        // in-place
        return a;
    };
    
    // http://en.wikipedia.org/wiki/Merge_sort
    // http://www.sinbadsoft.com/blog/a-recursive-and-iterative-merge-sort-implementations/
    // http://java.dzone.com/articles/recursive-and-iterative-merge
    Sort.MergeSort = Sort.IterativeMergeSort = function(a) {
        var N=a.length;
        
        if (N>1)
        {
            var i, j, halfN=~~(0.5*N)+1;
            for (i=1; i<=halfN+2; i<<=1)
            {
                for (j=i; j<N; j+=(i<<1)) 
                    Merge(a, j-i, j, Min(j+i, N)-1, 1);
            }
        }
        
        // in-place
        return a;
    };
    Sort.MergeSort.reference = "http://en.wikipedia.org/wiki/Merge_sort";
    
    
})(Sort);