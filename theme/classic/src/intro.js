document.getElementById("avatar").src = config.theme_config.avatar;
document.getElementById("intro-text-title").innerHTML =
  config.theme_config.author + "'s Blog";
document.getElementById("intro-text-intro").innerHTML =
  "—— " + config.theme_config.introduction;

async function init_post_container() {
  let post_container = "";
  for (let x = 0; x < config.post.length; x++) {
    const post = {};
    post.url = settings.post + config.post[x].url + ".md";
    await fetch(post.url)
      .then((response) => response.text())
      .then((content) => {
        post.preview = {
          response: content,
        };
        post.preview.mdcontent = markdownrender(content);
        return markdownrender(content);
      })
      .then((content) => {
        document.getElementsByClassName("none")[0].innerHTML = content;
        imgs = document
          .getElementsByClassName("none")[0]
          .getElementsByTagName("img");
        for (var i = 0; i < imgs.length; i++) {
          imgs[i].src = "";
        }
      })
      .then(function () {
        post.preview.title = document
          .getElementsByClassName("none")[0]
          .getElementsByTagName("h1")[0].innerText;
        post.preview.intro = config.post[x].introduction;
      })
      .then(function () {
        if (window.location.search == "?page=archive") {
          post.container =
            '<div class="post-container"><h1>' +
            post.preview.title +
            '</h1><div class="post-info">' +
            post.preview.mdcontent +
            '</div><p><a href="?p=' +
            config.post[x].url +
            '">Reading<i class="material-icons arrow_forward"></i></a></p></div>';
        } else {
          post.container =
            '<div class="post-container"><h1>' +
            post.preview.title +
            '</h1><p class="post-intro">' +
            post.preview.intro +
            '</p><p><a href="?p=' +
            config.post[x].url +
            '">Reading<i class="material-icons arrow_forward"></i></a></p></div>';
        }
        post_container = post_container + post.container;
        document.getElementById("post").innerHTML = post_container;
      })
      .then(function () {
        document.getElementsByClassName("none")[0].innerHTML = "";
      });
  }
  return post_container;
}

async function init_plugins() {
  blogging_info("Load Plugin who loadtime = themerender");
  for (let i in config.plugins) {
    if (config.plugins[i].loadtime == "themerender") {
      blogging_info("Load "+config.plugins[i].name+ " with defer enabled "+config.plugins[i].defer);
      for (let b in config.plugins[i].depend){
        let a = document.createElement("script");
        a.src = config.plugins[i].depend[b];
        await document.head.appendChild(a);
      }
      let a = document.createElement("script");
      a.src = config.plugins[i].script;
      if (config.plugins[i].defer){
        a.defer = true;
      }
      document.head.append(a);
      setTimeout(()=>{
        blogging_info("plugins load finnsh");
      },1)
    }
  }
}

function loadcomments() {
  if (config.comment.enable) {
    blogging_info("Start load comment");
    for (x in comment.depend.js) {
      a = document.createElement("script");
      a.src = comment.depend.js[x];
      document.getElementById("jscomments").append(a);
    }
    a = document.createElement("script");
    a.src = settings.domain + "src/js/" + comment.load;
    a.defer = "defer";
    document.getElementById("jscomments").append(a);
  }
}

function config_page() {
  var imgs = document.getElementsByTagName("img");
  for (let i = 0; i < imgs.length; i++) {
    imgs[i].loading = "lazy";
  }
  let a = document.createElement("link");
  a.rel = "shortcut icon";
  a.href = config.theme_config.avatar;
  document.head.append(a);
};
if (getpar("page")) {
  init_plugins();config_page();
  init_post_container().then((content) => {
    document.getElementById("post").innerHTML = content;
  });
} else {
  loadcomments();
  init_plugins();
  config_page();
}
document.getElementById("des").content = config.theme_config.introduction;
