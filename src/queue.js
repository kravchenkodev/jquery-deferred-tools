// place for queue

$.extend({

    addQueue: function (options) {
        $.queues = $.queues || []
        
        if ($.isArray(options)) {
            for (var i = 0; i < options.length; i++) {
                $.queues.push(options[i])
            }
        }
        else {
            $.queues.push($.proxyActions(options))
        }
    }

,   clearQueue: function (args) {
        $.queues = []
        return args
    }

,   runQueue: function () {
        var defer = $.when() // resolved promise
        ,   that  = $

        $.each($.queues, function(i, item) {

            defer = defer.then(function(result) {
                return $.callFunction(item.action, item.args ? item.args : result)
            })

            if (item.error) {
                defer.fail(function (err) {
                    return $.callFunction(item.error, err)
                })
            }

            if (item.progress) {
                defer.progress(function (result) {
                    return $.callFunction(item.progress, result)
                })
            }

        })

        return defer.then(function (args) { return $.clearQueue(args) })
    }

,   proxy: function(func){
        if(!func){
            return func
        }
        else if(typeof func.then == 'function'){
            func.__then = func.then
            var self = $
            func.then = function (onResolved, onReject, onProgress){
                return self.proxy(func.__then(self.proxy(onResolved), self.proxy(onReject), self.proxy(onProgress)))
            }
            return func
        }
        else if(func.proxied){
            return func
        }
        else {
            var boundedFunc = func.bind($)
            for(var i in func){
                boundedFunc[i] = func[i]
            }
            boundedFunc.proxied = true
            return boundedFunc
        }
    }

,   callFunction: function (action, args) {
        action = $.isFunction(action) ? action : $[action]
        return $.isArray(args) ? action.apply($, args) : action(args)
    }

,   isArray: function (obj) {
        return obj instanceof Array
    }

,   isFunction: function (obj) {
        return typeof obj === 'function'
    }

,   proxyActions: function(obj){
        for(var prop in obj){
            if($.isFunction(obj[prop])){
                obj[prop] = $.proxy(obj[prop])
            }
        }
        return obj
    }

})