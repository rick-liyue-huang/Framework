/*
    *
    * 1. firstly, write the basic ones
    * getTag('tag'), getId('id'), getClass('classname')
    *
    * 2. when operate the DOM element, we need to get the several elements, so need an array
    * getId('id', results), getTag('tag', results), getClass('classname', results)
    *
    * 3.used too much loop, so decrease the repeated codes
    * 
    * each(array function(i, v) {});
    * inside is:
    * fn.call(arr[i], i, arr[i]);
    * note： if we use 'call' or 'apply', the first argument must be object or {}, the default one is window.
    *
    * 4. encap the 'get' function
    * get(selector, results);
    *
    * 5. need to complete under context --- parentElement
    * select('selector', context, results);
    *
    * 6. in order to solve the browser capability, need to clear blank
    *  rickTrim()
    *
    * deal with the IE lower edition .push method, 
    *
    * provide a 'support' object, complete the browser capablity in the oject, so can decrease the prototype serach amount.
    *
    *
    * */

    /*
    * push
    * push.apply的形式调用
    * 功能push.apply(伪数组1， 伪数组2)
    *
    * */

    

var select =

(function () {

        /*
        * get('selector', parentElement，results); -> here 'context' is the parentEle
        *
        * 
        * 1.firstly, we assume that the parentEle is the dom element
        *
        * 2. if the context is the array, we should do the loop through
        * 
        * 3. if context is 'string' type, such as '.c', we transfer it by 'get()'
        * 
        * 4. combination selectors 
             'blank', '>' '~'....
             I will deal with the combine selector ',', because ',' is the most basic one.
          
          5. 5. we will deal with the some more complex selectors such as '.dv .c1, .c2'
             
        * */

        // used to confirm the browser capability.

     let support = {};

            support.getElementsByClassName = !!document.getElementsByClassName;

            support.getElementsByClassName = (function() {
                let isExist = !!document.getElementsByClassName;

                if (isExist && typeof document.getElementsByClassName === 'function') {

                    let div = document.createElement('div');
                    let divWithClass = document.createElement('div');

                    divWithClass.className = 'c';
                    div.appendChild(divWithClass);
                    return div.getElementsByClassName('c') === divWithClass;
                }
                return false;
            })();

            if (document.getElementsByClassName) {
                console.log('support classname method'); //support classname method
            } else {
                console.log('no support');
            }



// encap the basic methods

    var rquickExpr = /^(?:#([\w-]+)|\.([\w-]+)|([\w]+)|(\*))$/;


    var push = [].push;
    var list;
    try {
        var c = document.createElement('div');
        c.appendChild(document.createElement('div'));
        list = c.getElementsByTagName("*"); // list 是一个伪数组
        push.apply([], list);

    } catch (e) {

        push = {
            apply: function (target, els) {
                var j = target.length,
                    i = 0;
                while ((target[j++] = els[i++])) {}
                target.length = j - 1;
            }
        };

    } finally {
        c = list = null;

    }

    var getTag = function ( tag, context, results ) {
        results = results || [];
        try {
            results.push.apply( results, context.getElementsByTagName( tag ) );
        } catch ( e ) {
            myPush( results, context.getElementsByTagName( tag ) );
        }

        return results;
    };

    var getId = function ( id, results ) {
        results = results || [];
        results.push( document.getElementById( id ) );
        return results;
    };

    var getClass = function ( className, context, results ) {
        results = results || [];

        if ( document.getElementsByClassName ) {
            results.push.apply( results, context.getElementsByClassName( className ) );
        } else {
            let tempArr = [], i;

            for (i = 0; i < tempArr.length; i++) {
                // we do some change here
                let list = tempArr[i].className.split(' ');
                for (let j = 0; j < list.length; j++) {
                    if (list[j] === className) {
                        results.push(tempArr[i]);
                        break;
                    }
                }
            }
        }
        return results;
    };


// encap the 'loop' method

    let each = function (arr, fn) {
            let i,
                tempRes;

            for (i = 0; i < arr.length; i++) {
                tempRes = fn.call(arr[i], i, arr[i]);
                if (tempRes === false) {
                    break;
                } else if (tempRes === -1) {
                    continue;
                }
            }
        };

// encap 'get' methods
    var get = function ( selector, context, results ) {
        results = results || [];
        context = context || document;
        var m = rquickExpr.exec( selector );
        if ( m ) {
            if ( context.nodeType ) {
                context = [ context ];
            }
            
            if ( typeof context == 'string' ) {
                context = get( context );
            }
            each( context, function ( i, v ) {
                if ( m[ 1 ] ) {
                    results = getId( m[ 1 ], results );
                } else if ( m[ 2 ] ) {
                    results = getClass( m[ 2 ], v, results );
                } else if ( m[ 3 ] ) {
                    results = getTag( m[ 3 ], this, results );
                } else if ( m[ 4 ] ) {
                    results = getTag( m[ 4 ], this, results );
                }
            } );
        }

        return results;
    };


var rickTrim = function (str) {
        if (String.prototype.trim) {
            return str.trim();
        } else {
            return str.replace(/^\s+|\s+$/g, ''); // clear blank on both ends

        }
    };


var select = function (selector, context, results) {
        results = results || [];

        var newSelectors = selector.split(',');

        each(newSelectors, function (i, v) {  // => ['.dv .c1', ' .c2']

            var list = v.split(' ');

//            context => list[0] -> list[1] -> list[length-1]

            var c = context;
            for (var i = 0; i < list.length; i++) {

                if (list[i] === '') continue; // avoid the blank string ''
                c = get(rickTrim(list[i]), c);

                
            }

            results.push.apply(results, c);
        });

        return results;
    };


return select;

})();