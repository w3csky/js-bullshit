//定义EventEmitter对象
function EventEmitter() {
   /**
    * 事件总线，用于承载事件及其对应的任务
    * 数据结构如下
       {
           'event1':[
               {listener:xxx,once:true},
               {listener:yyy,once:false}
           ],
           'event2':[
               {listener:foo,once:true},
               {listener:bar,once:false}
           ]
       ...
       }
   */

   this._events = {};
}

var proto = EventEmitter.prototype;

//为EventEmitter原型添加方法
//事件注册方法
proto.on = function (
   eventName,
   listener,
   isOnce
) {
   //参数缺失
   if (!eventName || !listener) return;
   //event事件对应的任务队列
   var taskList = this._events[eventName] || [];
   //向event的任务队列里添加任务
   taskList.push({
       listener: listener,
       //是否只执行一次，默认为false
       once: isOnce?true:false,
   });
   this._events[eventName] = taskList;
};

//事件注册方法别名
proto.addListener = proto.on;

//销毁事件 从指定监听器数组中删除一个监听器
proto.off = function (eventName, listener) {
   //未指定要销毁的事件名
   if(!eventName) return;

   //要删除的event对应的任务队列
   var taskList=this._events[eventName];
   //event对应的任务队列为空
   if(!taskList) return;

   //如果未指定具体要删除的监听器，直接删除该事件对应的所有的监听器
   if(!listener){
       //从事件总线中销毁事件
       delete this._events[eventName];
       return;
   }

   //查找要删除的listener所在的位置
   var _listenerIndex;
   for(var i=0;i<taskList.length;i++){
       if(taskList[i]&&taskList[i].listener===listener){
           _listenerIndex=i;
           break;
       }
   }

   if(_listenerIndex!==undefined){
       //删除改listener
       taskList.splice(_listenerIndex,1);
   }


};
//事件销毁方法别名
proto.removeListener = proto.off

//销毁所有的事件及监听器
proto.removeAllListeners=function(){
   //直接将事件总线置空
   this._events={};
}

//事件触发
proto.emit = function (eventName) {
   var _that = this;
   //event事件对应的任务队列
   var taskList = this._events[eventName];

   //如果任务队列不存在或者为空
   if (!taskList || taskList.length === 0) {
       throw new Error(
           `You have not register any "${eventName}" event`
       );
   }
   /**
    * 对类数组元素 借用数组的slice方法
    * [].slice.call(arguments) 等同于 Array.prototype.slice.call(arguments)
    * 从第1项参数开始，就是emit要传递的数据
    */
   var args = [].slice.call(arguments, 1);
   //循环执行event对应的任务队列中的任务，并传入要传递的数据
   taskList.forEach((fn) => {
       //执行每一个任务
       fn.listener.apply(this, args);
       //如果是执行一次的任务，执行完成之后，要销毁该事件
       if (fn.once) {
           _that.off(eventName);
       }
   });
};

//只执行一次的事件
proto.once = function (eventName, listener) {
   this.on(eventName, listener, true);
};


