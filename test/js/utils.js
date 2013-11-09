/**
*
*   Dom utils
*
**/
(function(root, export_as, undef){
    
    export_as = export_as || 'U';
    var self = { VERSION: '0.0.0' };
    
    
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
        
        Write = self.Write = function(s){ document.write(s); },
        
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
        
        // http://dustindiaz.com/smallest-domready-ever
        //R = root.R = self.R = self.Ready = function(f, t){ /in/.test(document.readyState)?setTimeout('R('+f+')', t||200):f(); },
        
        Ready = self.Ready = function(f, t) {
            t = t||200;
            if (/in/.test(document.readyState))
                setTimeout(function(){
                    Ready(f, t);
                }, t);
            else
                f();
        },
        
        //
        // basic ajax functions
        //
        Ajax = self.Ajax = function(type, url, params, callback) {
            var xmlhttp;
            if (window.XMLHttpRequest) // code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            else // code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); // or ActiveXObject("Msxml2.XMLHTTP"); ??
            
            xmlhttp.onreadystatechange = function() {
                if (callback && xmlhttp.readyState == 4) callback(xmlhttp.responseText, xmlhttp.status, xmlhttp);
            };
            
            xmlhttp.open(type, url, true);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.send(params);
        },
        
        Load = self.Load = function(type, url, params) {
            var xmlhttp;
            if (window.XMLHttpRequest) // code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            else // code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); // or ActiveXObject("Msxml2.XMLHTTP"); ??
            
            xmlhttp.open(type, url, false);  // 'false' makes the request synchronous
            xmlhttp.send(params);

            if (xmlhttp.status === 200)    return xmlhttp.responseText;
            return '';
        },
        
        El = self.Element = Extends(Object, {
            constructor: function(id) {
                if (id)
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
            
            Wrap: function(tag) { 
                var e=document.createElement(tag.toLowerCase()); 
                e.appendChild(this._e); 
                return this; 
            },
            
            Style: function(p, v, appendOrRemove) { 
                p = ''+p;
                var isClass = ('className'==p);
                
                if (undef!==v)
                {
                    if (appendOrRemove)
                    {
                        var prop;
                        
                        if (isClass)
                        {
                            prop = (this._e.className) ? this._e.className.split(' ') : [];
                        }
                        else
                        {
                            prop = (this._e.style[p]) ? this._e.style[p].split(' ') : [];
                        }
                        
                        if (appendOrRemove < 0)
                        {
                            // remove
                            var i = prop.indexOf(v);
                            if (i>-1)
                            {
                                prop.splice(i, 1);
                            }
                        }
                        
                        else if (appendOrRemove > 0)
                        {
                            // append
                            prop.push(v);
                        }
                        
                        if (isClass)
                            this._e.className = prop.join(' ');
                        else
                            this._e.style[p] = prop.join(' ');
                    }
                    else
                    {
                        this._e.style[p] = ''+v; 
                    }
                    
                    return this; 
                }
                if (isClass)
                    return this._e.className;
                else
                    return this._e.style[p];
            },
            
            Attr: function(a, v) {
                if (undef!==v)
                {
                    this._e.setAttribute(''+a, v);
                    return this;
                }
                return this._e.getAttribute(''+a);
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
                    this._e.innerHTML += ''+html; 
                return this;
            },
            
            Add: function(n) { 
                this._e.appendChild(n); 
                return this; 
            },
            
            AddEl: function(e) { 
                this._e.appendChild(e._e); 
                return this; 
            },
            
            AddAll: function(ns) { 
                var l=ns.length, i=0, e=this._e; 
                while (i<l) { e.appendChild(ns[i]); i++; } 
                return this;
            },
            
            AddAllEl: function(es) { 
                var l=es.length, i=0, e=this._e; 
                while (i<l) { e.appendChild(e[i]._e); i++; } 
                return this;
            },
            
            Event: function(ev, f, b) { 
                this._e.addEventListener(ev, f, b||false); 
                return this;
            },
            
            toString: function() {
                return this._e.innerHTML;
            }
            
        }),
        
        ID = self.ID = function(id) { return document.getElementById(id) || null; },
        
        Get = self.Get = function(id) { return new El(id); },
        
        Tag = self.Tag = function(tag) { return document.createElement(tag.toLowerCase()); },
        
        GetTag = self.GetTag = function(tag) { return new El().Set( document.createElement(tag.toLowerCase()) ); },
        
        Text = self.Text = function(s) { return document.createTextNode(''+s); },
        
        Wrap = self.Wrap = function(tag, t) { var e=document.createElement(tag.toLowerCase()); e.innerHTML=t; return e;}
    ;
    
    //
    // aliases
    //
    
    self.El = self.E = self.Element;
    self.CreateText = self.Text;
    self.DomReady = self.Ready;
    
    El.prototype.Attribute = El.prototype.Attr;
    El.prototype.e = El.prototype.dom = El.prototype.Dom = El.prototype.Get;
    
    
    
    //
    // export it
    root[export_as] = self;
    
})(window, 'U');