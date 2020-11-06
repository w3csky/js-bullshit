 //定义EventEmitter对象
    function EventEmitter(){
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

      this.eventBus={};
    }

    //为EventEmitter原型添加方法
    EventEmitter.prototype={

      //事件注册
      on(eventName,listener,isOnce){
        //event事件对应的任务队列
        let taskList=this.eventBus[event]||[];
        //向event的任务队列里添加任务
        taskList.push({
          listener:listener,
          //是否只执行一次，也可以默认省略
          once:isOnce,
        });
        this.eventBus[eventName]=taskList;
      },

      //销毁事件
      off(eventName){
        //从事件总线中销毁事件
        delete this.eventBus[eventName]
      },

     //事件触发
      emit(eventName){
        var _that=this;
        //event事件对应的任务队列
        let taskList=this.eventBus[eventName];

        //如果任务队列不存在或者为空
        if(!taskList||taskList.length===0){
          throw new Error(`You have not register any "${event}" event`)
        }
        /**
         * 对类数组元素 借用数组的slice方法 
         * [].slice.call(arguments) 等同于 Array.prototype.slice.call(arguments)
         * 从第1项参数开始，就是emit要传递的数据
         */
        let args=[].slice.call(arguments,1);
        //循环执行event对应的任务队列中的任务，并传入要传递的数据
        taskList.forEach(fn => {
          //执行每一个任务
          fn.listener.apply(this, args)
          //如果是执行一次的任务，执行完成之后，要销毁该事件
          if(fn.once){
            _that.off(eventName)
          }
        });
      },

      //只执行一次的事件
      once(eventName,listener){
        this.on(event,listener,true)
      }

    }
