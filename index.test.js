import burla from "./index";

const replace = url => window.history.replaceState(null, null, url);
const push = url => window.history.pushState(null, null, url);

describe("burla", () => {
  it("can be stringify", () => {
    expect("" + burla).toBe(burla.href);
  });

  it("is localhost by default", () => {
    expect(burla.href).toBe("http://localhost/");
  });
});

describe("burla.path", () => {
  it("can set up the path", () => {
    expect(burla.href).toBe("http://localhost/");
    burla.path = "/hello/world";
    expect(burla.href).toBe("http://localhost/hello/world");
    burla.path = "/";
    expect(burla.href).toBe("http://localhost/");
  });

  it("can set up the pathname", () => {
    expect(burla.href).toBe("http://localhost/");
    burla.pathname = "/hello/world";
    expect(burla.href).toBe("http://localhost/hello/world");
    burla.pathname = "/";
    expect(burla.href).toBe("http://localhost/");
  });

  it("can read the path set with `burla.path = ...`", () => {
    expect(burla.path).toBe("/");
    burla.path = "/hello/world";
    expect(burla.path).toBe("/hello/world");
    burla.path = "/";
    expect(burla.path).toBe("/");
  });

  it("can read the path set with `pushState(...)`", () => {
    expect(burla.path).toBe("/");
    push("/hello/world");
    expect(burla.path).toBe("/hello/world");
    push("/");
    expect(burla.path).toBe("/");
  });

  it("can read the path set with `replaceState(...)`", () => {
    expect(burla.path).toBe("/");
    replace("/hello/world");
    expect(burla.path).toBe("/hello/world");
    replace("/");
    expect(burla.path).toBe("/");
  });
});

describe("burla.query", () => {
  it("can read parameters", () => {
    expect(burla.href).toBe("http://localhost/");
    replace("/?a=b&e=f&c=d");
    expect(burla.query.a).toBe("b");
    expect(burla.query.c).toBe("d");
    expect(burla.query.e).toBe("f");
    expect(burla.href).toBe("http://localhost/?a=b&c=d&e=f");
    replace("/");
    expect(burla.href).toBe("http://localhost/");
  });

  it("can set a query parameter", () => {
    expect(burla.href).toBe("http://localhost/");
    burla.query.hello = "world";
    expect(burla.href).toBe("http://localhost/?hello=world");
    delete burla.query.hello;
    expect(burla.href).toBe("http://localhost/");
  });

  it("can read the parameter set with `pushState(...)`", () => {
    expect(burla.query.hello).toBe(undefined);
    push("/?hello=world");
    expect(burla.query.hello).toBe("world");
    push("/");
    expect(burla.query.hello).toBe(undefined);
  });

  it("can read the parameter set with `replaceState(...)`", () => {
    expect(burla.query.hello).toBe(undefined);
    replace("/?hello=world");
    expect(burla.query.hello).toBe("world");
    replace("/");
    expect(burla.query.hello).toBe(undefined);
  });

  it("sets the parameters alphabetically", () => {
    expect(burla.href).toBe("http://localhost/");
    burla.query.hello = "world";
    expect(burla.href).toBe("http://localhost/?hello=world");
    burla.query.bye = "there";
    expect(burla.href).toBe("http://localhost/?bye=there&hello=world");
    delete burla.query.bye;
    expect(burla.href).toBe("http://localhost/?hello=world");
    delete burla.query.hello;
    expect(burla.href).toBe("http://localhost/");
  });

  it("does not accept arrays in queries", () => {
    expect(() => {
      burla.URL("http://localhost/?a[]=b");
    }).toThrow();
  });

  it("does not accept duplicated keys in queries", () => {
    expect(() => {
      burla.URL("http://localhost/?a=b&c=d&a=e");
    }).toThrow();
  });
});

describe("burla.hash", () => {
  it("is empty by default", () => {
    expect(burla.hash).toBe("");
  });

  it("is empty by default", () => {
    expect(burla.hash).toBe("");
  });
});

describe("burla.URL", () => {
  it("defaults to window.location", () => {
    const url = burla.URL();
    expect(url.path).toBe("/");
    expect(url.pathname).toBe("/");
    expect(burla.path).toBe("/");
    expect(window.location.pathname).toBe("/");
    replace("/users");
    expect(url.path).toBe("/users");
    expect(url.pathname).toBe("/users");
    expect(burla.path).toBe("/users");
    expect(window.location.pathname).toBe("/users");
    replace("/");
    expect(url.path).toBe("/");
    expect(url.pathname).toBe("/");
    expect(burla.path).toBe("/");
    expect(window.location.pathname).toBe("/");
  });

  it("can read a path", () => {
    const url = burla.URL("http://localhost/users?hello=world");
    expect(url.path).toBe("/users");
    expect(url.query.hello).toBe("world");
    expect(burla.path).toBe("/");
    expect(window.location.pathname).toBe("/");
  });

  it("is stable by default", () => {
    const url = burla.URL("http://localhost/users?c=d&a=b");
    expect(url.href).toBe("http://localhost/users?a=b&c=d");
  });

  it("can be made non-stable", () => {
    const url = burla.URL("http://localhost/users?c=d&a=b", { stable: false });
    expect(url.href).toBe("http://localhost/users?c=d&a=b");
  });
});
