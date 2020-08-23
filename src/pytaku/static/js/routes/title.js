import { Auth } from "../models.js";
import { LoadingMessage, Button, fullChapterName, Chapter } from "../utils.js";

function Title(initialVNode) {
  let isLoading = false;
  let isTogglingFollow = false;
  let title = {};

  return {
    oninit: (vnode) => {
      document.title = "Manga";
      isLoading = true;
      m.redraw();

      Auth.request({
        method: "GET",
        url: "/api/title/:site/:titleId",
        params: {
          site: vnode.attrs.site,
          titleId: vnode.attrs.titleId,
        },
      })
        .then((resp) => {
          title = resp;
          document.title = title.name;
        })
        .finally(() => {
          isLoading = false;
        });
    },
    view: (vnode) => {
      return m(
        "div.content",
        isLoading
          ? m(LoadingMessage)
          : [
              m("h1", title.name),
              m("div.title--details", [
                Auth.isLoggedIn()
                  ? m(Button, {
                      icon: "bookmark",
                      disabled: isTogglingFollow ? "disabled" : null,
                      text: isTogglingFollow
                        ? "submitting..."
                        : title.is_following
                        ? "following"
                        : "follow",
                      color: title.is_following ? "red" : "green",
                      title: title.is_following
                        ? "Click to unfollow"
                        : "Click to follow",
                      onclick: (ev) => {
                        isTogglingFollow = true;
                        m.redraw();
                        Auth.request({
                          method: "POST",
                          url: "/api/follow",
                          body: {
                            site: title.site,
                            title_id: title.id,
                            follow: !title.is_following,
                          },
                        })
                          .then((resp) => {
                            title.is_following = resp.follow;
                          })
                          .finally(() => {
                            isTogglingFollow = false;
                          });
                      },
                    })
                  : null,
                " ",
                m(
                  "a.touch-friendly[title=Go to source site][target=_blank]",
                  { href: title.source_url },
                  [title.site, m("i.icon.icon-arrow-up-right")]
                ),
              ]),
              m("img.title--cover[alt=cover]", { src: title.cover }),
              title.descriptions.map((desc) => m("p", desc)),
              title.chapters
                ? title.chapters.map((chapter) =>
                    m(Chapter, { site: title.site, titleId: title.id, chapter })
                  )
                : m("p", "This one has no chapters."),
            ]
      );
    },
  };
}

export default Title;