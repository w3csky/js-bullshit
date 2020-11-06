/**
    * 一个 Promise有以下几种状态:
    *  pending: 初始状态，既不是成功，也不是失败状态。
    *  fulfilled: 意味着操作成功完成。
    *  rejected: 意味着操作失败。
    */


    const PENDING='pending'
    const FULFILLED='fulfilled'
    const REJECTED='rejected'

    /**
    * executor
    * executor是带有 resolve 和 reject 两个参数的函数 。
    * Promise构造函数执行时立即调用executor 函数， resolve 和 reject 两个函数作为参数传递给executor
    *（executor 函数ß在Promise构造函数返回所建promise实例对象前被调用）
    */
    function MyPromise(executor){
      var that=this;
      //promise 初始状态是pending
      that.state=PENDING
      that.value=null;
      that.err=null;

      resolve=function(value){
      var that=this;
        //promise状态改变是不可逆操作
        if(that.state==PENDING){
          that.state=FULFILLED
          that.value=value;
        }
      }

      MyPromise.reject=function (err){
        var that=this;
        if(that.state==PENDING){
          that.state=REJECTED
          that.err=err;
        }
      }
      

      try{
        executor(resolve,reject)
      }catch(err){
        this.reject(err)
      }
    }

    MyPromise.resolve=function(value){
      var that=this;
        //promise状态改变是不可逆操作
        if(that.state==PENDING){
          that.state=FULFILLED
          that.value=value;
        }
      }

      MyPromise.reject=function (err){
        var that=this;
        if(that.state==PENDING){
          that.state=REJECTED
          that.err=err;
        }
      }



    /**
    * @reference MDN https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise
    * @content pending 状态的 Promise 对象可能会变为fulfilled 状态并传递一个值给相应的状态处理方法，也可能变为失败状态（rejected）并传递失败信息。
    * 当其中任一种情况出现时，Promise 对象的 then 方法绑定的处理方法（handlers ）就会被调用（then方法包含两个参数：onfulfilled 和 onrejected，它们都是 Function 类型。
    * 当Promise状态为fulfilled时，调用 then 的 onfulfilled 方法，当Promise状态为rejected时，调用 then 的 onrejected 方法， 所以在异步操作的完成和绑定处理方法之间不存在竞争）。
    */

    //给对象添加方法
    MyPromise.prototype={
      then:function(onfulfilled,onrejected){
        var that=this;
        if(that.state==FULFILLED){
          onfulfilled(that.value)
        }

        if(that.state==REJECTED){
          onrejected(that.value)
        }
      }
    }



    var MP=MyPromise.resolve(4)

     MP.then(function(v){
      alert(v)
    },function(){

    })
