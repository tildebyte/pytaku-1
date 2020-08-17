import { Navbar } from "../common-components.js";

const Home = {
  oncreate: (vnode) => {
    document.title = "Pytaku";
  },
  view: (vnode) => {
    return m("div.main", [
      m(Navbar),
      m("div.content", [
        m("p", "Try searching for some manga title using the box above."),
        m("p", "Logging in allows you to follow manga titles."),
      ]),
    ]);
  },
};

export default Home;
