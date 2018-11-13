import EventEmitter from 'events';
import Context from './Context';
import Request from './Request';


class Application extends EventEmitter {

  constructor(option) {
    super()
    this.middleware = [];
    option = option || {}
    this.req = new Request(this);
    this.ctx = new Context(this, this.req)
    this.mode = option.mode || "hash";

    this.hashHistory = new HashHistory().listen(this.callback())
  }

  callback(){
    let fn = null;
    return (req, res)=>{


      this.handle_request(this.ctx, fn)
    }
    // () => {

    //   let hash = window.location.hash;
    //   if (hash.charAt(0) === '#') hash = hash.slice(1);
    //   if (hash.charAt(0) !== '/') hash = `/${hash}`;
  
    //   let routes = this.$route.match(hash, 'GET');
    //   routes.forEach(route=>{
    //     // app.action(route.)
    //     route.handle((res, res)=>{
  
    //     })
    //   })
    //   console.log(routes)
    // }
  }

  handle_request(req, res){
    
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

  createContext() {

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