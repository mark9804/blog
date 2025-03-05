export const headConfig = [
  ["meta", { name: "theme-color", content: "#fbfaf8" }],
  [
    "meta",
    {
      name: "theme-color",
      content: "#3c3834",
      media: "(prefers-color-scheme: dark)",
    },
  ],
  [
    "link",
    {
      rel: "icon",
      href: "https://avatars.githubusercontent.com/u/9006264?v=4",
    },
  ],
  [
    "link",
    {
      rel: "manifest",
      href: "/manifest.json",
    },
  ],
  [
    "link",
    {
      rel: "prefetch",
      href: "https://fonts.blue-archive.io/harmonyos-sans-webfont/harmonyos-sans-sc-400.css",
      as: "style",
      onload: "this.rel='stylesheet';this.onload=null;",
    },
  ],
  [
    "link",
    {
      rel: "prefetch",
      href: "https://fonts.blue-archive.io/harmonyos-sans-webfont/harmonyos-sans-sc-700.css",
      as: "style",
      onload: "this.rel='stylesheet';this.onload=null;",
    },
  ],
  [
    "script",
    {
      async: "",
      defer: "",
      type: "text/javascript",
    },
    `(function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "m0pjwvqh46");`,
  ],
  [
    "meta",
    {
      name: "viewport",
      content:
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
    },
  ],
];
