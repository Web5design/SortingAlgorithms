(function(root, undef){
    
    var self = { VERSION: "0.0" };
    
    
    // auxilliaries
    var
        Str = Object.prototype.toString,
        
        hasKey = Object.prototype.hasOwnProperty,
        
        slice = Array.prototype.slice, splice = Array.prototype.splice,
        
        isArray = function(a) { return (a && '[object Array]'==Str.call(a)); },
        
        superCall = function() { 
            var args=slice.call( arguments ), argslen=args.length;
            
            if ( argslen )
            {
                var method = args.shift();
                if ('constructor'==method)
                {
                    return this.__super__.constructor.apply(this, args);
                }
                else if ( this.__super__[method] )
                {
                    return this.__super__[method].apply(this, args);
                }
            }
            
            return null;
        },
        
        Log = self.Log = (console && console.log) ? function(s){console.log(s);} : function() {},
        
        Merge = self.Merge = function(o1, o2) { 
            o1 = o1 || {}; 
            for (var p in o2) if ( hasKey.call(o2, p) )  o1[p] = o2[p];  
            return o1; 
        },
        
        // http://javascript.crockford.com/prototypal.html
        // http://stackoverflow.com/questions/12592913/what-is-the-reason-to-use-the-new-keyword-here
        // http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/
        Extends = self.Extends = function(Parent, ChildProto) {
            var F = function(){}; 
            var C = ChildProto.constructor;
            //ChildProto.constructor=null;
            //delete ChildProto.constructor;
            F.prototype = Parent.prototype;
            C.prototype = new F();
            C.prototype.constructor = C;
            C.prototype = Merge( C.prototype, ChildProto );
            C.prototype.__super__ = Parent.prototype;
            C.prototype.superCall = superCall;
            return C;
        },
        
        ID = self.ID = function(id) { return document.getElementById(id) || null; }
    ;

    
    var El = self.Element = self.El = Extends(Object,
    {
        constructor: function(id) {
            this._e = document.getElementById(id) || null;
        },
        
        _e: null,
        
        Get: function(id) { 
            return this._e;
        },
        
        Set: function(el) {
            this._e = el;
            return this;
        },
        
        Style: function(p, v) { 
            if (undef!==v)
            {
                this._e.style[''+p] = ''+v; 
                return this; 
            }
            return this._e.style[''+p];
        },
        
        Html: function(html){ 
            if (undef!==html)
            {
                this._e.innerHTML = ''+html; 
                return this;
            }
            return this._e.innerHTML;
        },
        
        Append: function(html){ 
            if (undef!==html)
            {
                this._e.innerHTML += ''+html; 
                return this;
            }
        },
        
        Add: function(n) { 
            this._e.appendChild(n); 
            return this; 
        },
        
        AddAll: function(ns) { 
            var l=ns.length, i=0; 
            while (i<l) { this._e.appendChild(ns[i]); i++; } 
            return this;
        },
        
        Event: function(ev, f, b) { 
            this._e.addEventListener(ev, f, b||false); 
            return this;
        },
        
        toString: function() {
            return this._e.innerHTML;
        }
        
    });
    // aliases
    El.prototype.e = El.prototype.dom = El.prototype.Get;
    
    self.Get = function(id) { return new El(id); };
    
    // export it
    root.U = self;
    
})(window);