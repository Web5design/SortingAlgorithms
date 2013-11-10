/**
*
*   Sort.js
*   Sorting Algorithms implemented in JavaScript
*   for study and experimentation, in a concise library
*
*   @version: 0.1
* 
*   https://github.com/foo123/SortingAlgorithms
*
**/
(function(root, undef){

    /***********************************************************
    
    Sorting Series (a kind of discrete optimization problem)
    lies at the center of Computer Science and Algorithms
    because of its many uses
    
    (Ref. http://en.wikipedia.org/wiki/Sorting_algorithm)
    
    Also Sorting, in one way or another, is integral part
    of many other important algorithms and applications (see eg. Knuth)
    
    For example Sorting is very closely associated to Searching, 
    another topic of immense importance and applications
    
    Under certain sorting states, searching can be achieved in O(logN) time
    or even in O(1) time (constant) for almost every search term
    
    Sorting has 3 approaches:
    
    Block vs. Online/Adaptive:
    ===========================
    
    * In the Block case, the whole array is available at once
    for this case many algorithms are known
    (comparison-based=> O(N^2), O(NlogN) complexities)
    and
    (number/count based=> O(N) complexity) (see below)
    
    * In the Adaptive/Online case, the input series is
    accesed one at a time (for example an time-input signal)
    In this case some of the previous algorithms can be transformed to work adaptively
    
    Apart from that, there are algorithms 
    (like Dynamic Lists, Dynamic Heaps and Balanced Trees, Tries, eg AVL Trees)
    which keep an input sequence always in a 'sorted' state (with each new input)
    With relatively low complexity (eg O(logN))
    
    Comparison-Based vs. Arithmetic/Count-Based:
    =============================================
    
    * Comparison-based sorting algorithms (InsertionSort, MergeSort, QuickSort, etc..) sort
    a series by comparing elements with each other in some optimum sense
    
    The best time complexity of these algorithms is (at present) O(NlogN)
    
    However better than this can be achieved
    
    * Arithmetic/Count-based sorting algorithms (CountingSort, BucketSort, RadixSort, etc..), 
    do not use comparisons (of any kind) between elements, 
    but instead use their arithmetic/counting/statistical properties
    
    This makes possible algorithms which can sort in linear O(N) time (the fastest possible)
    However these algorithms have some limitations (eg only Integers, or special kinds of Numbers)
    
    Is O(N) sorting possible for arbitrary random numbers??
    
    ------------------------------------------------------
    
    NOTE: The calculation of asymptotic complexity is done usually (using recursive relations)
    with the Master Theorem (Refs. http://en.wikipedia.org/wiki/Master_theorem, http://en.wikipedia.org/wiki/Introduction_to_Algorithms) :
    
    T(n) = aT(n/b) + f(n),  a>=1, b>1
    
    eg. for MergeSort => T(n) = 2T(n/2) + O(n) =>  T(n) = O(nlogn)
    
    ---------------------------------------------------------
    
    This package implements showcases of various (best known) sorting algorithms 
    (and a couple of custom ones)
    for study, experimentation and use in applications
    In a concice library
    
    https://github.com/foo123/SortingAlgorithms
    
    ***********************************************************/
    
    var Sort = { VERSION: "0.1" };
    
    //
    //
    // Typed Arrays Substitute 
    Sort.Array = Array;
    Sort.Array32F = (typeof Float32Array !== "undefined") ? Float32Array : Array;
    Sort.Array64F = (typeof Float64Array !== "undefined") ? Float64Array : Array;
    Sort.Array8I = (typeof Int8Array !== "undefined") ? Int8Array : Array;
    Sort.Array16I = (typeof Int16Array !== "undefined") ? Int16Array : Array;
    Sort.Array32I = (typeof Int32Array !== "undefined") ? Int32Array : Array;
    Sort.Array8U = (typeof Uint8Array !== "undefined") ? Uint8Array : Array;
    Sort.Array16U = (typeof Uint16Array !== "undefined") ? Uint16Array : Array;
    Sort.Array32U = (typeof Uint32Array !== "undefined") ? Uint32Array : Array;
    
    // utils
    Sort.utils = {};
    
     // math methods
    var
        R = Sort.utils.R = Math.random, 
        Min = Math.min, Max = Math.max,
        Sqrt = Math.sqrt, Log = Math.log,
        Sgn = Sort.utils.Sign = function(x){
            return x ? (x < 0 ? -1 : 1) : 0;
        },
        RNDF = Sort.utils.RandomFloat = function(m, M) { 
            m = (undef==m) ? 0 : m; 
            M = (undef==M) ? 1 : M; 
            return ((M-m)*R() + m); 
        },
        RNDI = Sort.utils.RandomInteger = function(m, M) { 
            return ~~((M-m)*R() + m); 
        }
    ;
        
    // https://en.wikipedia.org/wiki/Normal_distribution
    // https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
    // https://en.wikipedia.org/wiki/Marsaglia_polar_method
    var 
        _spare, isSpareReady=false,
        G = Sort.utils.Gauss = function(mu, sigma) {
            
            mu = (undef===mu) ? 0.0 : mu;
            sigma = (undef===sigma) ? 1.0 : sigma;
            
            if (isSpareReady) 
            { 
                isSpareReady=false;  
                return mu + sigma*_spare;  
            }
            
            // generate 2 new pairs
            var reject=true, u, v, s, multiplier, z0;
            while (reject)
            {
                u = RNDF(-1,1);  
                v = RNDF(-1,1);
                s = u*u+v*v; 
                reject = (0.0>=s || s>=1.0);
            }
            multiplier = Sqrt(-2.0*Log(s)/s);  
            _spare = v*multiplier; 
            isSpareReady = true;  
            
            z0 = u*multiplier; 
            return mu + sigma*z0;
        }
    ;
    
    // auxilliary methods
    
    // check whether an array of numbers is sorted
    // used to check algorithm validity under different cases
    Sort.isSorted = function(a) {
        var N=a.length, i, x, s, fs, tie;
        
        // already sorted
        if (N<=1) return true;
        
        x = a[1]-a[0];
        fs = x ? (x < 0 ? -1 : 1) : 0;
        tie = (0==fs) ? true : false;
        for (i=1; i<N; i++)
        {
            x = a[i]-a[i-1];
            s = x ? (x < 0 ? -1 : 1) : 0;
            if (tie && s) { fs = s; tie = false; }
            if (s && (s !== fs))  return false;
        }
        return true;
    };
    
    function asNumbers(a,b) { return a - b; }
    
    Sort.utils.Constant = function(N, c) { 
        var a = new Array(N); 
        while(N--) a[N] = c||0;  
        return a; 
    };
    
    Sort.utils.Range = function(N) { 
        var a = new Array(N); 
        while(N--) a[N] = N;  
        return a; 
    };
    
    Sort.utils.ReverseRange = function(N) { 
        var a = new Array(N), i = -1; 
        while(++i<N) a[i] = N-i-1;  
        return a; 
    };
    
    Sort.utils.Equidistant = function(N, m, M, inc) {
        var a = new Array(N), i, v=m;
        for (i=0; i<N; i++)
        {
            a[i] = v;
            v += inc;
        }
        return a;
    };
    
    Sort.utils.IntegerEquidistributable = function(N, m, M) {
        var a = new Array(N), i;
        for (i=0; i<N; i++)
        {
            a[i] = RNDI(m, M);
        }
        return a.sort(asNumbers);
    };
    
    Sort.utils.RandomEquidistributable = function(N, m, M) {
        var a = new Array(N), i;
        for (i=0; i<N; i++)
        {
            a[i] = RNDF(m, M);
        }
        return a.sort(asNumbers);
    };
    
    Sort.utils.IntegerDynamicRange = function(N, m, M, rangeInc, numCuts) {
        var a = new Array(N), i, k, range=0;
        k = 0;
        for (i=0; i<N; i++)
        {
            a[i] = RNDI(m, M) + range;
            if (k>=numCuts)
            {
                k = 0;
                range += rangeInc;
            }
            k++;
        }
        return a.sort(asNumbers);
    };
    
    Sort.utils.RandomDynamicRange = function(N, m, M, rangeInc, numCuts) {
        var a = new Array(N), i, k, range=0;
        k = 0;
        for (i=0; i<N; i++)
        {
            a[i] = RNDF(m, M) + range;
            if (k>=numCuts)
            {
                k = 0;
                range += rangeInc;
            }
            k++;
        }
        return a.sort(asNumbers);
    };
    
    // this is a shuffling algorithm
    // http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    Sort.Shuffle = Sort.utils.FisherYatesKnuthShuffle = function(a) {
        var N=a.length, perm, swap;
        while(N--){ perm=RNDI(0, N); swap=a[N]; a[N]=a[perm]; a[perm]=swap; }   
        // in-place
        return a;
    };
    
    // simple timer statistics class
    var Timer = Sort.Timer = function(t) {
        
        var 
            startTime = (undef!==t) ? t : (new Date()).getTime(),
            //prevTime = startTime,
            endTime = Infinity,
            msMin = Infinity, 
            msMax = 0
        ;
        
        this.getMs = function() {
            var ms = endTime - startTime;
            msMin = Min( msMin, ms );
            msMax = Max( msMax, ms );
            return ms;
        };
        
        this.start = function () {
            startTime = (new Date()).getTime();
            return this;
        };
        
        this.end = function () {
            endTime = (new Date()).getTime();
            //if ( endTime > prevTime + 1000 ) prevTime = endTime;
            return this;
        };

        this.reset = function () {
            startTime = (new Date()).getTime();
            //prevTime = startTime;
            endTime = Infinity;
            return this;
        };
        
        this.update = function () {
            endTime = (new Date()).getTime();
            //if ( endTime > prevTime + 1000 ) prevTime = endTime;
            startTime = endTime;
            return this;
        };
    };
    
    var slice = Array.prototype.slice;
    
    // time a function process and return the statistic
    Sort.Time = function(callback, processToTime) {
        var timer, args, ms, delay1=300, delay2=300, d=delay1+delay2;
        
        if (processToTime)
        {
            args = slice.call(arguments);
            args.shift();
            args.shift();
            
            timer = new Timer();
            
            // start the timer
            timer.start();
            
            // use delays, to avoid timer get stuck
            setTimeout(function(){
                
                // run the process with optional args passed
                processToTime.apply({}, args);
                
                setTimeout(function(){
                    // return the timing result
                    timer.end();
                    var ms = timer.getMs()-d;
                    if (callback) callback.call(timer, ms);
                    
                }, delay2);
                
                
            }, delay1);
        }
        return 0;
    };

    // export it
    root.Sort = Sort;
    
})(window);