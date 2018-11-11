const loc = window.location;

class Request {
  constructor(context) {
    this.ctx = context;
  }

  get protocol() {
    return loc.protocol;
  }

  get host() {
    return loc.host;
  }

  get hostname() {
    return loc.hostname;
  }

  get port() {
    return loc.port;
  }

  get href() {
    return loc.href;
  }

  get origin() {
    return loc.origin;
  }

  get pathname() {
    return loc.pathname;
  }

  get search() {
    return loc.search;
  }

  get url() {
    return loc.hash.slice(1)
  }

}

export default Request;