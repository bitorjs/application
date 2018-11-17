import EventEmitter from 'events';
import compose from 'koa-compose';
import Router from 'bitorjs-router';
import Context from './Context';
import Request from './Request';
import HashHistory from 'bitorjs-hashhistory';



class Application extends EventEmitter {

  constructor(option) {
    super()
    this.middleware = [];
    option = option || {}
    this.$route = new Router();
    this.req = new Request(this);
    this.ctx = new Context(this, this.req)
    this.mode = option.mode || "hash";
  }

  startServer() {
    if (this.hashHistory === undefined) {
      this.hashHistory = new HashHistory().listen(this.callback())
    }
  }

  callback() {
    const fn = compose(this.middleware);
    return (url) => {

      this.ctx.url = url;
      this.handle_request(this.ctx, fn)
    }
  }

  handle_request(ctx, fnMiddleware) {
    return fnMiddleware(ctx).then(() => {
      console.log('request end')
    });
  }

  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    this.middleware.push(fn);
    return this;
  }

  back() {
    this.hashHistory.back();
  }

  forward() {
    this.hashHistory.forward()
  }

  go(step) {
    this.hashHistory.go(step)
  }

  reload() {
    this.hashHistory.reload()
  }

  redirect(...args) {
    this.hashHistory.redirect(...args);
  }
}

export default Application;