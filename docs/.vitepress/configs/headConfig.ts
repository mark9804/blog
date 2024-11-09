import { BASE_URL } from "../constants";

export const headConfig = [
  [
    "link",
    {
      rel: "icon",
      href: BASE_URL + "/favicon.ico",
    },
  ],
  [
    "link",
    {
      rel: "manifest",
      href: BASE_URL + "/manifest.json",
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
    "link",
    {
      rel: "prefetch",
      href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,1,0",
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
];
