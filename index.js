import EventEmitter from 'events';
import compose from 'koa-compose';
import Context from './Context';
import Request from './Request';
import HashHistory from 'bitorjs-hashhistory';
import routeCompose from './compose';

class Application extends EventEmitter {

  constructor(option) {
    super()
    option = option || {}
    this.beforeRouteMiddleware = [];
    this.afterRouteMiddleware = [];
    this.middleware = [];
    this.req = new Request(this);
    this.ctx = new Context(this, this.req)
    this.mode = option.mode || "hash";
    this.hashHistory = new HashHistory(this.mode);
  }

  startServer() {
    this.hashHistory.listen(this.callback())
  }

  /**
   *  callback : url 变化后回调 
   * */
  callback() {
    const fn = compose(this.middleware);
    return (url) => {
      let to = url;
      let from = this.ctx.url;
      this.ctx.from = from;
      this.ctx.to = to;
      this.ctx.url = to;
      const afterFn = routeCompose(this.afterRouteMiddleware);
      return afterFn(this.ctx.to, this.ctx.from).then(() => {
        this.handle_request(this.ctx, fn)
        console.log('afterfilter end')
      })

    }
  }

  handle_request(ctx, fnMiddleware) {
    return fnMiddleware(ctx).then(() => {
      this.emit('request-end');
      console.log('request end')
    });
  }


  // for middleware
  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    this.middleware.push(fn);
    return this;
  }

  beforeEach(fn) {
    // fn = (to, from, next)=>{}
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    this.beforeRouteMiddleware.push(fn);
    return this;
  }

  afterEach(fn) {
    // fn = (to, from)=>{}
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    this.afterRouteMiddleware.push(fn);
    return this;
  }

  filter(callback, to) {
    const beFn = routeCompose(this.beforeRouteMiddleware.concat([callback]));

    return beFn(to, this.hashHistory.url).then(() => {

      console.log('beforefilter end')
    })
  }

  // for history
  back() {
    let his = this.hashHistory.history,
      pointer = this.hashHistory.pagePointer;
    this.filter(() => {
      this.hashHistory.back();
    }, his[pointer - 1]);
  }

  forward() {
    let his = this.hashHistory.history,
      pointer = this.hashHistory.pagePointer;
    this.filter(() => {
      this.hashHistory.forward()
    }, his[pointer + 1])
  }

  go(step) {
    let his = this.hashHistory.history,
      pointer = this.hashHistory.pagePointer;

    this.filter(() => {
      this.hashHistory.go(step)
    })
  }

  reload() {
    this.filter(() => {
      this.hashHistory.reload()
    }, this.ctx.url)
  }

  replace(...args) {
    this.filter(() => {
      this.hashHistory.replace(...args);
    }, ...args)
  }

  redirect(...args) {
    this.filter(() => {
      this.hashHistory.redirect(...args);
    }, ...args)
  }
}

export default Application;