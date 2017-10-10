// 传入参数只考虑对象，不考虑数组。
// new Observer返回一个对象，其 data 属性要能够访问到传递进去的对象。
// 通过 data 访问属性和设置属性的时候，均能打印出右侧对应的信息。

// 要实现的结果如下：
app1.data.name // 你访问了 name
app.data.age = 100;  // 你设置了 age，新的值为100
app2.data.university // 你访问了 university
app2.data.major = 'science'  // 你设置了 major，新的值为 science

function Observer(obj){
   // 把obj的所有属性设置为访问器属性
   this.walk(obj);
   this.data = obj;
}
 Observer.prototype = {
    walk : function(obj){
      Object.keys(obj).forEach(function(key){
         var value = obj[key];
         if (typeof value === 'object'){
           new Observer(value);
         } 
         Object.defineProperty(obj, key, {
          get: function(){
             console.log('访问了:' + key + ' : ' + value)
               return value;
          },
          set: function(newValue){
                console.log('新建了:' + key + '新值为:' + newValue);
                value = newValue;
          }
         });
       })
    },
    $watch: function(key, callback){
       var value = this.data.key;
       Object.defineProperty(this.data, key, {
        get: function(){
          return value;
        },
        set: function(newValue){
            value = newValue;
            callback();
        }
       })
    }
 }
var app1 = new Observer({
  name: 'youngwind',
  obj_inner: {
     a: 2,
     b: 3
  },
  age: 21
});
//  app1.$watch('age', function() {
//          console.log('我的年纪变了，现在已经是：'+ app1.data.age + '岁了');
//  });
// app1.data.age = 7;
app1.$watch('obj_inner', function(){
    console.log('可是是a或者b发生了改变');
})
this.data.obj_inner.a = 4;
// console.log(app1.data.age);

