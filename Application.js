import EventEmitter from 'events';
import Context from './Context';

class Application extends EventEmitter {

  constructor(option) {
    super()
    this.middleware = [];
    option = option || {}
    this.ctx = new Context(this)
    this.mode = option.mode || "hash";

    this.initEvents();
  }

  initEvents() {
    this.on('message', (a) => {
      console.log('message:', a)
    })
  }

  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    this.middleware.push(fn);
    return this;
  }
}

export default Application;