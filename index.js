export const URL = (loc = window.location, { stable = true } = {}) => {
  // We also accept a partial object
  if (typeof loc === "string") {
    loc = new window.URL(loc);
  }

  const retrieve = () => {
    const path = loc.pathname || "/";
    const params = new URLSearchParams(loc.search.slice(1));
    const query = {};
    // It *is* already parsed for some reason :shrug:
    for (const [key, value] of params.entries()) {
      if (/\[\]$/.test(key)) {
        console.error("Arrays in URL are not supported");
      } else {
        if (query[key]) {
          console.warn(`The URL query param '${key}' is duplicated`);
        }
        query[key] = value;
      }
    }
    const hash = (loc.hash || "").replace(/^#/, "");
    return { path, query, hash };
  };

  const enc = encodeURIComponent;

  const toString = ({ path, query, hash }) => {
    if (typeof query !== "string") {
      query = Object.entries(query)
        // Make it stable
        .sort(([a], [b]) => {
          if (!stable) return 0;
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        })
        .map(([key, value]) => `${enc(key)}=${enc(value)}`)
        .join("&");
    }
    query = query ? `?${query.replace(/^\?/, "")}` : "";
    hash = hash ? `#${hash.replace(/^#/, "")}` : "";
    return loc.origin + path + query + hash;
  };

  const update = data => {
    const url = toString({ ...retrieve(), ...data });
    if (loc === window.location) {
      window.history.pushState({ url }, null, url);
    }
  };

  // Sort the query params
  if (toString(retrieve()) !== loc.href) {
    update();
  }

  return {
    URL,
    get path() {
      return retrieve().path;
    },
    set path(path) {
      update({ path });
    },
    // Alias to allow for the more familiar `.pathname`
    get pathname() {
      return retrieve().path;
    },
    set pathname(path) {
      update({ path });
    },
    get href() {
      return toString(retrieve());
    },
    toString,
    query: new Proxy(retrieve().query, {
      get: (orig, key) => retrieve().query[key],
      deleteProperty: (orig, key) => {
        const { [key]: abc, ...query } = retrieve().query;
        update({ query });
        return true;
      }
    })
  };
};

export default URL(window.location);