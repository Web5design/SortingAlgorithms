(function(Sort, undef){

    //
    //  Numerical/Counting Algorithms
    //
    
    //
    // the main idea is this :
    // there is a 'trivial' and very fast O(n) (under all cases) algorithm
    // that sorts N 'homogeneous-equidistributable' numbers in [m, M]  (IndexSort, re-indexing the series)
    // for general N random numbers with an arbitrary dynamic range (or CDF)
    // if an algorithm or function can map these numbers 'uniquely' to 
    // 'homogeneous-equidistributable' numbers N in O(n) time
    // then general (number series) sorting can be done in O(n) time (under all cases)
    //
    // equidistributable numbers have this (more or less general) form:
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
    
    var log=console.log;
    var Array64F=Sort.Array64F, Array16U=Sort.Array16U, 
        Min=Math.min, Sqrt=Math.sqrt, Log=Math.log, Sgn=function(x){return x ? x < 0 ? -1 : 1 : 0;};
    
    // custom O(n) algorithm for arbitrary random numbers
    Sort.StatisticalSort = function(a) {
        var N=a.length, Nr, m, M, sum, norm, i, j, indexes,
            PDF, CDF, //H, SumH,
            ranges, rangesmap, map, invmap, aclone,
            //Si, Sa, Sia, Sii, Saa, correlation_coefficient, eps=0.86
            sgn, prevsgn, isSorted, x,
            IndexSort=Sort.IndexSort
            ;
        
        // trivial case
        if (N>1)
        {
            // compute some order statistics (max-min-correlation) in O(n) steps
            m=M=a[0];
            sgn=Sgn(a[1]-a[0]); isSorted=true; // assume list is already sorted
            //Si=Sa=Sia=Sii=Saa=0; Sa=a[0]; Saa=a[0]*a[0];
            for (i=1; i<N-1; i++)
            {
                // after finding out it is not sorted, avoid any extra calculations
                if (isSorted) { x=a[i+1]-a[i]; prevsgn=sgn; sgn=x ? x < 0 ? -1 : 1 : 0; if (sgn!==prevsgn) isSorted=false; }
                //Si+=i; Sa+=a[i]; Sia+=i*a[i]; Sii+=i*i; Saa+=a[i]*a[i];
                if (a[i]>M) M=a[i]; else if (a[i]<m) m=a[i];
            }
            if (a[N-1]>M) M=a[N-1]; else if (a[N-1]<m) m=a[N-1];
            
            // this covers sorted, reverse-sorted and also all duplicates cases
            if (isSorted)
            {
                if (0>sgn) a.reverse(); // sorted in reverse order
                return a;
            }
            //correlation_coefficient=(N*Sia-Si*Sa)/(Sqrt(N*Sii-Si*Si)*Sqrt(N*Saa-Sa*Sa));
            // already sorted or all elements are same
            /*if ((m==M) || (correlation_coefficient>eps))
            {
                log('already sorted');
                return a;
            }
            // else sorted in reverse order
            else if (correlation_coefficient<-eps)
            {
                log('already reverse sorted');
                return a.reverse();
            }*/
            
            // compute PDF, CDF in O(n) steps
            sum=0; norm=1/(M-m);
            PDF=new Array64F(N);
            for (i=0; i<N; i++)
            {
                PDF[i]=norm*(a[i]-m);
                sum+=PDF[i];
            }
            
            // CDF(x)=P(X<=x)  =x (for uniform variable)
            CDF=new Array64F(N+1); norm=1/sum;
            //H=new Array64F(N); // Entropy
            //sumH=new Array64F(N); // Entropy
            CDF[0]=0;
            for (i=0; i<N; i++)
            {
                PDF[i]*=norm;
                //H[i]=(PDF[i]) ? -Log(PDF[i])*PDF[i] : 0;
                //sumH[i]=(i) ? sumH[i-1]+H[i] : H[i];
                CDF[i+1]=CDF[i] + PDF[i];
            }
            PDF=null;   //delete it now
            
            //
            // CDF map, groups elements of similar dynamic range together (maps them in similar index), it seems
            // possibly this can be used in a recursion, or possibly using another sort (eg indexsort, counting sort, quicksort, etc..)
            //
            
            indexes=new Array16U(N); norm=(N)/(M-m);
            for (i=0; i<N; i++) { indexes[i]=~~(norm*(a[i]-m) + 0.5); }
            
            // find dynamic ranges in O(n) steps
            rangesmap=new Array16U(N);
            ranges=new Array();
            norm=(N)/(M-m);
            var ii, ai;
            for (i=0; i<N; i++)
            {
                ai=indexes[i]; ii=~~((N-1)*(CDF[ai]));
                if (rangesmap[ii])
                {
                    ranges[rangesmap[ii]-1].push(a[i]);
                }
                else
                {
                    rangesmap[ii]=ranges.length+1;
                    ranges.push([a[i]]);
                }
            }
            CDF=null;   // delete it now
            
            //map=new Array16U(N);  //invmap=new Array(N);
            var a2, offset=0;
            for (i=0; i<N; i++)
            {
                if (rangesmap[i])
                {
                    a2=IndexSort(ranges[rangesmap[i]-1]); Nr=a2.length;
                    Array.prototype.splice.apply(a, [offset, Nr].concat(a2));
                    offset+=Nr;
                    /*for (j=0; j<Nr; j++)
                    {
                        ai=~~(indexes[i] + 0.5);
                        ii=~~((N-1)*(CDF[ai]));
                        map[i]=ii; //invmap[ii]=i;
                    }*/
                }
            }
            
            // sort-reindex in O(n) steps
            /*aclone=a.slice();
            for (i=0; i<N; i++)
            {
                a[map[i]]=aclone[i];  //a[i]=aclone[invmap[i]];
            }*/
        }
        
        // in-place
        return a;
    };
    
})(window.Sort);