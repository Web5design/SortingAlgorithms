(function(Sort, undef){

    //
    //  Comparison Algorithms
    //
    
    // http://en.wikipedia.org/wiki/Cocktail_shaker_sort
    Sort.CocktailSort = function(a) {
        var N=a.length, begin, end, swapped, i, t;

        if (N>1)
        {
            // `begin` and `end` marks the first and last index to check
            begin = -1;  end = N - 2;
            do{
                swapped = false;
                // increases `begin` because the elements before `begin` are in correct order
                begin++;
                for (i=begin; i<=end; i++)
                {
                    if (a[ i ] > a[ i + 1 ])
                    {
                        //swap( A[ i ], A[ i + 1 ] )
                        t=a[i]; a[i]=a[i+1]; a[i+1]=t;
                        swapped = true;
                    }
                }
                
                if (false == swapped)  break;
                
                swapped = false;
                // decreases `end` because the elements after `end` are in correct order
                end--;
                for (i=end; i>=begin; i--)
                {
                    if (a[ i ] > a[ i + 1 ])
                    {
                        //swap( A[ i ], A[ i + 1 ] )
                        t=a[i]; a[i]=a[i+1]; a[i+1]=t;
                        swapped = true;
                    }
                }
            }while (swapped);
        }
        
        // in-place
        return a;
    };
    
})(window.Sort);