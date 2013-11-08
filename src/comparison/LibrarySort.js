(function(Sort, undef){

    //
    //  Comparison Algorithms
    //
    
    // auxilliaries
    var isNone=function(x) { return ((undef===x) || (null===x)); },
        
        /*binary_search = function(a, element, start, end) {
            var mid, m;
            mid = start + ~~(0.5*(end-start) + 0.5);
            if (start == end)
            {
                if (!isNone(a[mid]) && a[mid] <= element) return (mid + 1);
                else return mid;
            }
            else
            {
                m = mid;
                while (m<end && isNone(a[m])) m++;
                if (m == end)
                {
                    if (!isNone(a[m]) && a[m] <= element) return (m + 1);
                    else return binary_search(a, element, start, mid);
                }
                else if (m == start)
                {
                    if (a[m] > element) return m;
                    else return binary_search(a, element, m+1, end);
                }
                else
                {
                    if (a[m] == element) return (m + 1);
                    else if (a[m] > element) return binary_search(a, element, start, m-1);
                    else return binary_search(a, element, m+1, end);
                }
            }
        },*/
        
        binary_search_iter = function(a, element, start, end) {
            var mid, m;
            while(true)
            {
                mid = start + ~~(0.5*(end-start)/* + 0.5*/);
                
                if (start == end)
                {
                    if (!isNone(a[mid]) && a[mid] <= element) return (mid + 1);
                    else return mid;
                }
                else
                {
                    m = mid;
                    
                    while (m<end && isNone(a[m])) m++;
                    
                    if (m == end)
                    {
                        if (!isNone(a[m]) && a[m] <= element) return (m + 1);
                        else { end=mid; continue; }
                    }
                    else if (m == start)
                    {
                        if (a[m] > element) return m;
                        else { start=m+1; continue; }
                    }
                    else
                    {
                        if (a[m] == element) return (m + 1);
                        else if (a[m] > element) {end=m-1; continue; }
                        else { start=m+1; continue; }
                    }
                }
            }
        },
        
        insert = function(a, element, index, last_insert_index) {
            var t;
            // nonlocal last_insert_index
            if (isNone(a[index]))
            {
                a[index] = element;
            }
            else
            {
                while ( !isNone(a[index]) )
                {
                    t=a[index]; a[index]=element; element=t;
                    index++;
                }
                a[index] = element;  index++;
            }
            
            if (index > last_insert_index[0])  last_insert_index[0] = index;
        },
        
        balance =  function(a, num_spaces, total_inserted, last_insert_index) {
            var queue, N=a.length, inserted, index, top, bottom, spaces;
            
            //nonlocal last_insert_index
            queue = new Array(N);
            inserted = index = 1;
            top = bottom = 0;
     
            while (inserted < total_inserted)
            {
                spaces = 0;
                while (spaces < num_spaces)
                {
                    if (!isNone(a[index]))
                    {
                        queue[bottom] = a[index];
                        bottom++;
                    }
                    a[index] = undef
                    index++; spaces++;
                }    
                if (!isNone(a[index]))
                {
                    queue[bottom] = a[index];
                    bottom++;
                }
                a[index] = queue[top];
                index++; top++; inserted++;
            }
            last_insert_index[0] = index - 1;
        }
    ;
    
    // http://en.wikipedia.org/wiki/Library_sort
    Sort.LibrarySort = function(a, eps) {
        var N=a.length, copy, copy_len, last_insert_index, 
            inserted, index, round_inserts, insertion_index, i, ai;
        
        eps=eps||0;
        
        copy_len=~~(N*(1+eps)+0.5); copy = new Array(copy_len);
        copy[0] = a[0];
        last_insert_index=[0];  inserted = index = 1;
     
        while (inserted < N)
        {
            round_inserts = inserted;
     
            while (inserted < N && round_inserts > 0)
            {
                insertion_index = binary_search_iter(copy, a[index], 0, last_insert_index[0]);
                insert(copy, a[index], insertion_index, last_insert_index);
                round_inserts--; inserted++; index++;
            }
            balance(copy, eps, inserted, last_insert_index);
        }
        
        ai=0;
        for (i=0; i<copy_len; i++) { if (!isNone(copy[i])) a[ai++]=copy[i]; }
        
        // in-place
        return a;
    };
    Sort.LibrarySort.reference = "http://en.wikipedia.org/wiki/Library_sort";
    
    
})(Sort);