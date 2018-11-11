import Request from './Request';
import HashHistory from '../HashHistory';
import Router from '../router/router';

class Context {
  constructor(app) {
    this.app = app;
    this.req = new Request(this);
    this.$route = new Router();
    this.$route.register('/a11', 'GET', {}, () => {})
    this.$route.register('/a12', 'GET', {}, () => {})
    this.$route.register("*", "GET", {}, () => {})
    this.hashHistory = new HashHistory().listen(() => {

      let hash = window.location.hash;
      if (hash.charAt(0) === '#') hash = hash.slice(1);
      if (hash.charAt(0) !== '/') hash = `/${hash}`;

      let r = this.$route.match(hash, 'GET');
      console.log(r)
    })
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

export default Context;