(function(Sort, undef){

    //
    //  Comparison Algorithms
    //
    
    // http://en.wikipedia.org/wiki/Insertion_sort
    Sort.InsertionSort = function(a) {
        var N=a.length, i, valueToInsert, holePos;
        
        if (N>1)
        {
            // The values in A[i] are checked in-order, starting at the second one
            for (i=1; i<N; i++)
            {
                // at the start of the iteration, A[0..i-1] are in sorted order
                // this iteration will insert A[i] into that sorted order
                // save A[i], the value that will be inserted into the array on this iteration
                valueToInsert = a[i];
                // now mark position i as the hole; A[i]=A[holePos] is now empty
                holePos = i;
                // keep moving the hole down until the valueToInsert is larger than 
                // what's just below the hole or the hole has reached the beginning of the array
                while (holePos > 0 && valueToInsert < a[holePos - 1])
                { 
                    //value to insert doesn't belong where the hole currently is, so shift 
                    a[holePos] = a[holePos - 1]; //shift the larger value up
                    holePos--;       //move the hole position down
                }
                // hole is in the right position, so put valueToInsert into the hole
                a[holePos] = valueToInsert;
                // A[0..i] are now in sorted order
            }
        }
        
        // in-place
        return a;
    };
    
})(window.Sort);