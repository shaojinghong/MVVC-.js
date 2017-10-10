//发布-订阅类
function Event(){
   this.events = {};
}
Event.prototype = {
    on: function(key, fun){
       if (!this.events[key]){
         this.events[key] = [];
       } 
       if (typeof fun == 'function'){
         this.events[key].push(fun);
       }
    },
    emit: function(attr){
      var funs = this.events[attr];
      if (attr.indexOf('.') > 0){
        var attrs = attr.split('.');
        var parentAttr = Array.prototype.slice.call(attrs, 0, attrs.length-1).join('.');
        this.emit(parentAttr);
      }
      if (funs && funs.length > 0){
          for (var i = 0; i < funs.length; i ++){
            funs[i]();
          }
      } else {
        console.log('没有绑定' + attr + '事件');
        return 
      }
    }
}
var $event = new Event();
//Observer类
function Observer(obj){
   this.data = obj;
   this.$event = $event;
   this.walk(obj, this.$event);
   
}
Observer.prototype = {
   walk: function(obj, $event){
      var _this = this;
      Object.keys(obj).forEach(function(key){
         var value = obj[key];
         if (typeof value === 'object'){
           console.log(value);
           new Observer(value);
         } 
         Object.defineProperty(obj, key, {
          get: function(){
               return value;
          },
          set: function(newValue){
                if (value == newValue) return false;
                value = newValue;
                // 触发数据改动的事件
                $event.emit(key);
          }
         });
       })
    },
   $watch: function(val, callback){
      this.$event.on(val, callback);
    }
}
var app2 = new Observer({
    name: {
        firstName: 'shaofeng',
        lastName: 'liang'
    },
    age: 25
});
// 监听数据name
app2.$watch('name', function (newName) {
    console.log('我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。')
});
app2.data.name.firstName = 'hahaha';
