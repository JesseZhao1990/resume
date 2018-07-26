/**
 * 实现一个event bus，可以用于比较远的组件通信
 */

class EventBus {
  constructor() {
    this.events = this.events || Object.create(null);
  }
  // 触发订阅的执行
  emit(type, ...args){
    let e;
    e = this.events[type];
    if (Array.isArray(e)) {
      e.map( each => {
        each.apply(this,args);
        return each;
      })
    }
  }

  // 订阅
  on(type,cb){
    const e = this.events[type];
    if(!e){
      this.events[type] = [cb];
    }else{
      e.push(cb)
    }
  }

}

const eventBus = new EventBus();
export default eventBus;