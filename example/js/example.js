(function () {
    
    function createRandDeferred(delay) {
        var deferred = new $.Deferred
        ,   delay = delay || Math.rand() * 1000

        setTimeout(function () {
            console.log('deferred resolved')
            deferred.resolve(delay)
        }, delay)

        return deferred
    }

    function testQueue() {

        $.addQueue([
                { action: createRandDeferred, args: 2000 },
                { action: createRandDeferred, args: 2000 },
                { action: createRandDeferred, args: 2000 },
                { action: createRandDeferred, args: 2000 },
                { action: createRandDeferred, args: 2000 }
            ])

        $.runQueue()

    }

    testQueue()


})()