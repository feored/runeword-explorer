import{f as d,d as c,s as b,b as m,t as v,r as p}from"../chunks/disclose-version.B91IQsLN.js";import{n as i,t as h,m as $,g as x,s as _,p as w,f as E,h as S}from"../chunks/runtime.Bt03uQr4.js";import{s as f}from"../chunks/render.CVBTHH0g.js";import{i as j}from"../chunks/lifecycle.CTIARq0a.js";import{s as q}from"../chunks/entry.Be6eHlK0.js";function y(s,r,t){if(s==null)return r(void 0),i;const e=s.subscribe(r,t);return e.unsubscribe?()=>e.unsubscribe():e}function z(s,r,t){const e=t[r]??(t[r]={store:null,source:$(void 0),unsubscribe:i});if(e.store!==s)if(e.unsubscribe(),e.store=s??null,s==null)e.source.v=void 0,e.unsubscribe=i;else{var n=!0;e.unsubscribe=y(s,u=>{n?e.source.v=u:_(e.source,u)}),n=!1}return x(e.source)}function A(){const s={};return h(()=>{for(var r in s)s[r].unsubscribe()}),s}const B=()=>{const s=q;return{page:{subscribe:s.page.subscribe},navigating:{subscribe:s.navigating.subscribe},updated:s.updated}},C={subscribe(s){return B().page.subscribe(s)}};var D=v("<h1> </h1> <p> </p>",1);function K(s,r){w(r,!1);const t=A(),e=()=>z(C,"$page",t);j();var n=D(),u=d(n),g=c(u);p(u);var a=b(b(u,!0)),l=c(a);p(a),E(()=>{var o;f(g,e().status),f(l,(o=e().error)==null?void 0:o.message)}),m(s,n),S()}export{K as component};
