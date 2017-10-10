//发布-订阅类
function Event() {
    this.events = {};
}
Event.prototype = {
    on: function(key, fun) {
        if (!this.events[key]) {
            this.events[key] = [];
        }
        this.events[key].push(fun);
    },
    emit: function() {
        let key = Array.prototype.shift.call(arguments),
            fns = this.events[key];

        if (key.indexOf('.') !== -1) {
            let parent = key.split('.');
            for (var i = 0, l = parent.length; i < l; i++) {
                let parentAttr = Array.prototype.slice.call(parent, 0, l - i - 1);
                this.emit(parentAttr.join('.'), arguments);
            }
        }
        if (!fns || fns.length === 0) {
            return false;
        }
        for (let i = 0, fn; fn = fns[i]; i++) {
            fn.apply(this, arguments);
        }
    }
}
function Observer(data, rawPath, observer) {
    this.data = data;
    this.rawPath = rawPath ? rawPath + '.' : '';
    this.$event = observer && observer.$event ? observer.$event : new Event();
    this.walk(data);

}
Observer.prototype = {
    walk: function(obj) {
        let keys = Object.keys(obj)
        for (var i = 0, l = keys.length; i < l; i++) {
            this.convert(keys[i], obj[keys[i]])
        }
    },
    convert: function(key, val) {
        let _this = this;
        var property = Object.getOwnPropertyDescriptor(this.data, key);
        if (property && property.configurable === false) {
            return
        }
        let parent = {}
        Object.defineProperty(parent, '$event', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.$event
        })
        let child = new Observer(val, this.rawPath + key, parent);
        Object.defineProperty(this.data, key, {
            enumerable: true,
            configurable: true,
            get: function() {
                return val;
            },
            set: function(newVal) {
                console.log('你设置了' + key);
                console.log('新的' + key + ' = ' + newVal)
                if (newVal === val) return;
                val = newVal
                _this.$event.emit(_this.rawPath + key, val);
                child = new Observer(newVal, _this.rawPath + key, parent)
            }
        })

    },
    $watch: function(attr, callback) {
        this.$event.on(attr, callback);
    }
}
let app2 = new Observer({
    name: {
        firstName: 'shaofeng',
        lastName: 'liang'
    },
    age: 25
});
app2.$watch('name', function(newName) {
    console.log('我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。')
});