/**
 * Created by rickhuang on 20/12/16.
 */
var select =

    (function () {

        /**
         * Created by rickhuang on 19/12/16.
         */

// 对基本方法的封装

        var rquickExpr = /^(?:#([\w-]+)|\.([\w-]+)|([\w]+)|(\*))$/;


        var myPush = function( target, els ) {
            var j = target.length,
                i = 0;
            // Can't trust NodeList.length
            while ( (target[j++] = els[i++]) ) {}
            target.length = j - 1;
        };

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
                each( getTag( '*', context ), function ( i, v ) {
                    if ( ( ' ' + v.className + ' ' )
                            .indexOf( ' ' + className + ' ' ) != -1 ) {
                        results.push( v );
                    }
                } );
            }
            return results;
        };


// 对循环的封装

        var each = function (arr, fn) {
            for (var i = 0; i < arr.length; i++) {
                if (fn.call(arr[i], i, arr[i]) === false) {
                    break;
                }
            }
        };

// get 方法封装 -- 通用的方法
        var get = function ( selector, context, results ) {
            results = results || [];
            context = context || document;
            var m = rquickExpr.exec( selector );
            if ( m ) {
                if ( context.nodeType ) {
                    context = [ context ];
                }
                // 如果 context 是一个 dom 数组就没有问题了
                // 但是 context 是一个选择器字符串. 有可能是 '.c'
                //
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


        var myTrim = function (str) {
            if (String.prototype.trim) {
                return str.trim();
            } else {
                return str.replace(/^\s+|\s+$/g, ''); // 去掉头尾的空格

            }
        };


        var select = function (selector, context, results) {
            results = results || [];

            var newSelectors = selector.split(',');

            each(newSelectors, function (i, v) {  // => ['.dv .c1', ' .c2']

//            需要解析的就是 v 获得 this
//            分割
                var list = v.split(' ');

//            context => list[0] -> list[1] -> list[length-1]

                var c = context;
                for (var i = 0; i < list.length; i++) {

                    if (list[i] === '') continue; // 防止 空字符串对后面产生影响
                    c = get(list[i], c);

                    // 如果list[i]是空字符，那么就是在c下面找空数据，是不会报错的
                }

                results.push.apply(results, c);
            });

            return results;
        };


        return select;
    })();
