import Router from '../router/router';

class Context {
  constructor(app, request) {
    this.app = app;
    this.req = request;
    this.$route = new Router();
    // this.$route.register('/a11', 'GET', {}, () => {})
    // this.$route.register('/a12', 'GET', {}, () => {})
    // this.$route.register("*", "GET", {}, () => {})
    // // this.hashHistory = new HashHistory().listen(() => {

    // //   let hash = window.location.hash;
    // //   if (hash.charAt(0) === '#') hash = hash.slice(1);
    // //   if (hash.charAt(0) !== '/') hash = `/${hash}`;

    // //   let routes = this.$route.match(hash, 'GET');
    // //   routes.forEach(route => {
    // //     // app.action(route.)
    // //     route.handle((res, res) => {

    // //     })
    // //   })
    // //   console.log(routes)
    // // })
  }
}

export default Context;