(function(e){function t(t){for(var r,a,u=t[0],s=t[1],c=t[2],l=0,d=[];l<u.length;l++)a=u[l],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&d.push(o[a][0]),o[a]=0;for(r in s)Object.prototype.hasOwnProperty.call(s,r)&&(e[r]=s[r]);p&&p(t);while(d.length)d.shift()();return i.push.apply(i,c||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],r=!0,a=1;a<n.length;a++){var u=n[a];0!==o[u]&&(r=!1)}r&&(i.splice(t--,1),e=s(s.s=n[0]))}return e}var r={},a={app:0},o={app:0},i=[];function u(e){return s.p+"js/"+({about:"about"}[e]||e)+"."+{about:"e6b6a161"}[e]+".js"}function s(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.e=function(e){var t=[],n={about:1};a[e]?t.push(a[e]):0!==a[e]&&n[e]&&t.push(a[e]=new Promise((function(t,n){for(var r="css/"+({about:"about"}[e]||e)+"."+{about:"aa6a9dfe"}[e]+".css",o=s.p+r,i=document.getElementsByTagName("link"),u=0;u<i.length;u++){var c=i[u],l=c.getAttribute("data-href")||c.getAttribute("href");if("stylesheet"===c.rel&&(l===r||l===o))return t()}var d=document.getElementsByTagName("style");for(u=0;u<d.length;u++){c=d[u],l=c.getAttribute("data-href");if(l===r||l===o)return t()}var p=document.createElement("link");p.rel="stylesheet",p.type="text/css",p.onload=t,p.onerror=function(t){var r=t&&t.target&&t.target.src||o,i=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");i.code="CSS_CHUNK_LOAD_FAILED",i.request=r,delete a[e],p.parentNode.removeChild(p),n(i)},p.href=o;var f=document.getElementsByTagName("head")[0];f.appendChild(p)})).then((function(){a[e]=0})));var r=o[e];if(0!==r)if(r)t.push(r[2]);else{var i=new Promise((function(t,n){r=o[e]=[t,n]}));t.push(r[2]=i);var c,l=document.createElement("script");l.charset="utf-8",l.timeout=120,s.nc&&l.setAttribute("nonce",s.nc),l.src=u(e);var d=new Error;c=function(t){l.onerror=l.onload=null,clearTimeout(p);var n=o[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src;d.message="Loading chunk "+e+" failed.\n("+r+": "+a+")",d.name="ChunkLoadError",d.type=r,d.request=a,n[1](d)}o[e]=void 0}};var p=setTimeout((function(){c({type:"timeout",target:l})}),12e4);l.onerror=l.onload=c,document.head.appendChild(l)}return Promise.all(t)},s.m=e,s.c=r,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)s.d(n,r,function(t){return e[t]}.bind(null,r));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/SIDSDataPlatform/",s.oe=function(e){throw console.error(e),e};var c=window["webpackJsonp"]=window["webpackJsonp"]||[],l=c.push.bind(c);c.push=t,c=c.slice();for(var d=0;d<c.length;d++)t(c[d]);var p=l;i.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"034f":function(e,t,n){"use strict";n("85ec")},"0759":function(e,t,n){e.exports=n.p+"media/blue economy_1_3.03ea4a6a.mp4"},"1fab":function(e,t,n){},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-container",{staticClass:"v-application v-application--is-ltr",attrs:{"data-app":"",id:"app",fluid:""}},[n("root-header"),n("v-row",{attrs:{"no-gutters":"",id:"content"}},[n("v-col",{attrs:{cols:"2"}},[n("nav-menu")],1),n("v-col",{attrs:{cols:"10"}},[n("router-view",{staticClass:"root-router"})],1)],1),n("root-footer")],1)},o=[],i=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("header",{staticClass:"header"},[r("video",{staticClass:"header_video",attrs:{autoplay:"",muted:"",loop:""},domProps:{muted:!0}},[r("source",{attrs:{src:n("0759"),type:"video/mp4"}})]),e._m(0),e._m(1),e._m(2)])},u=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"header-bar"},[r("a",{attrs:{href:"https://data.undp.org/",target:"_blank"}},[r("img",{staticClass:"header-bar_logo",attrs:{src:n("cf05"),alt:"UNDP COVID19 Data Futures Platform Logo"}})])])},function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("main",{staticClass:"header-text",attrs:{role:"main"}},[n("h1",{staticClass:"header-text_header header-text_header-big"},[e._v("Data Visualization Platform")]),n("h2",{staticClass:"header-text_header header-text_header-small"},[e._v("for the")]),n("h1",{staticClass:"header-text_header header-text_header-big"},[e._v("SMALL ISLAND DEVELOPING STATES ")]),n("hr",{staticClass:"header-text_divider"}),n("p",{staticClass:"header-text_description"},[e._v("UNDP’s integrated approach supports Small Island Developing States to accelerate transformative development based on three pillars: Climate Action, Blue Economy, and Digital Transformation. ")])])},function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("a",{staticClass:"header_button-down",attrs:{href:"#content"}},[n("img",{attrs:{alt:"Arrow Down Icon",src:"https://raw.githubusercontent.com/solodev/scroll-down-anchor/master/images/arrow-down-1.png"}})])}],s={name:"RootHeader"},c=s,l=(n("da1a"),n("2877")),d=Object(l["a"])(c,i,u,!1,null,"ce5b99d8",null),p=d.exports,f=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},m=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"footer-root"},[n("p",{staticClass:"footer-root_text"},[e._v("Powered by the UNDP Data Futures Platform")])])}],g={name:"HelloWorld",props:{msg:String}},h=g,b=(n("6399"),Object(l["a"])(h,f,m,!1,null,"6b12ebaf",null)),y=b.exports,v=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-list",{staticClass:"main-menu",attrs:{dense:""}},e._l(e.routes,(function(t){return n("v-list-item",{key:t.link,attrs:{to:t.link}},[n("v-list-item-content",[n("v-list-item-title",{domProps:{textContent:e._s(t.name)}})],1)],1)})),1)},D=[],S=(n("4de4"),n("d3b7"),{name:"NavMenu",computed:{routes:function(){return this.$router.options.routes.filter((function(e){return"*"!==e.path}))}},props:{msg:String}}),w=S,C=(n("df51"),n("6544")),x=n.n(C),_=n("8860"),I=n("da13"),k=n("5d23"),R=Object(l["a"])(w,v,D,!1,null,"c399eb6e",null),j=R.exports;x()(R,{VList:_["a"],VListItem:I["a"],VListItemContent:k["a"],VListItemTitle:k["c"]});var O={name:"Root",components:{RootHeader:p,RootFooter:y,NavMenu:j}},A=O,P=(n("034f"),n("62ad")),M=n("a523"),E=n("0fd9"),L=Object(l["a"])(A,a,o,!1,null,null,null),q=L.exports;x()(L,{VCol:P["a"],VContainer:M["a"],VRow:E["a"]});var F=n("1da1"),K=(n("96cf"),n("3ca3"),n("ddb0"),n("ac1f"),n("1276"),n("8c4f")),N=n("2f62"),U=(n("caad"),n("2532"),n("b0c0"),n("d81d"),n("7db0"),n("bc3a")),T=n.n(U),V=n("5698"),$="https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data",B={loadAllKeyData:W,loadMetaData:G,loadFundingCategories:z,loadSIDSData:X,loadIndicatorsCategories:Z,loadIndicatorsMeta:te};function W(){return H.apply(this,arguments)}function H(){return H=Object(F["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,T.a.get("".concat($,"/exports/allKeyData.json"));case 2:return t=e.sent,e.abrupt("return",t.data);case 4:case"end":return e.stop()}}),e)}))),H.apply(this,arguments)}function G(){return J.apply(this,arguments)}function J(){return J=Object(F["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,T.a.get("".concat($,"/exports/keyMetadata.json"));case 2:return t=e.sent,e.abrupt("return",t.data);case 4:case"end":return e.stop()}}),e)}))),J.apply(this,arguments)}function z(){return Q.apply(this,arguments)}function Q(){return Q=Object(F["a"])(regeneratorRuntime.mark((function e(){var t,n,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,T.a.get("".concat($,"/exports/fundingCategories.json"));case 2:for(r in t=e.sent,n=[],t.data)n.push(Object.assign({},t.data[r],{name:r}));return e.abrupt("return",n);case 6:case"end":return e.stop()}}),e)}))),Q.apply(this,arguments)}function X(){return Y.apply(this,arguments)}function Y(){return Y=Object(F["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,T.a.get("".concat($,"/sids_db.csv"));case 2:return t=e.sent,e.abrupt("return",V["b"](t.data));case 4:case"end":return e.stop()}}),e)}))),Y.apply(this,arguments)}function Z(){return ee.apply(this,arguments)}function ee(){return ee=Object(F["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,T.a.get("/SIDSDataPlatform/static/indicatorCategories.json");case 2:return t=e.sent,e.abrupt("return",t.data);case 4:case"end":return e.stop()}}),e)}))),ee.apply(this,arguments)}function te(){return ne.apply(this,arguments)}function ne(){return ne=Object(F["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,T.a.get("/SIDSDataPlatform/static/indicatorMeta.json");case 2:return t=e.sent,e.abrupt("return",t.data);case 4:case"end":return e.stop()}}),e)}))),ne.apply(this,arguments)}var re={namespaced:!0,state:{keyMetadata:null,allKeyData:null,fundingCategories:null,SIDSData:null,SIDSDataWithDonors:null,countryList:null},mutations:{setMetaData:function(e,t){e.keyMetadata=t},setKeyData:function(e,t){e.allKeyData=t},setFundingCategories:function(e,t){e.fundingCategories=t},setSIDSData:function(e,t){e.SIDSData=t},setSIDSDataWithDonors:function(e,t){e.SIDSDataWithDonors=t},setCountryList:function(e,t){e.countryList=t}},actions:{getMetaData:function(e){return Object(F["a"])(regeneratorRuntime.mark((function t(){var n,r,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(n=e.state,r=e.commit,n.keyMetadata){t.next=7;break}return t.next=4,B.loadMetaData();case 4:a=t.sent,console.log(a),r("setMetaData",a);case 7:case"end":return t.stop()}}),t)})))()},getAllKeyData:function(e){return Object(F["a"])(regeneratorRuntime.mark((function t(){var n,r,a,o;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(n=e.dispatch,r=e.state,a=e.commit,r.allKeyData){t.next=8;break}return t.next=4,B.loadAllKeyData();case 4:o=t.sent,console.log(o),a("setKeyData",o),n("generateCountryList",o);case 8:case"end":return t.stop()}}),t)})))()},setFundingCategories:function(e){return Object(F["a"])(regeneratorRuntime.mark((function t(){var n,r,a,o,i;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(n=e.state,r=e.commit,a=e.dispatch,n.fundingCategories){t.next=9;break}return t.next=4,B.loadFundingCategories();case 4:o=t.sent,i=o.filter((function(e){return n.SIDSData.some((function(t){return t.donors&&t.donors.includes(e.name)}))})),console.log(i),r("setFundingCategories",i),a("setFullDonorsInfo");case 9:case"end":return t.stop()}}),t)})))()},setSIDSData:function(e){return Object(F["a"])(regeneratorRuntime.mark((function t(){var n,r,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(n=e.state,r=e.commit,n.SIDSData){t.next=7;break}return t.next=4,B.loadSIDSData();case 4:a=t.sent,console.log(a),r("setSIDSData",a);case 7:case"end":return t.stop()}}),t)})))()},generateCountryList:function(e,t){var n=e.commit,r=[];for(var a in t){var o=t[a]["Profile"];o.id=a,o.map="".concat("https://sids-dashboard.github.io/SIDSDataPlatform/maps/relief/"+o.id+"Relief.png"),o.photo="".concat("https://sids-dashboard.github.io/SIDSDataPlatform/images/countryPhotos/"+o.id+".jpg"),r.push(o)}n("setCountryList",r)},setFullDonorsInfo:function(e){var t=e.state,n=e.commit,r=t.SIDSData.map((function(e){var n;return n=e.donors?e.donors.split(";").map((function(e){var n=t.fundingCategories.find((function(t){return t.name===e}));return"undefined"===typeof n?{name:e}:n})):[],e.donors=n,e}));n("setSIDSDataWithDonors",r)}}},ae={namespaced:!0,state:{indicatorsCategories:null,indicatorsMeta:null},mutations:{setCategories:function(e,t){e.indicatorsCategories=t},setMeta:function(e,t){e.indicatorsMeta=t}},actions:{getCategories:function(e){return Object(F["a"])(regeneratorRuntime.mark((function t(){var n,r,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(n=e.state,r=e.commit,n.keyMetadata){t.next=7;break}return t.next=4,B.loadIndicatorsCategories();case 4:a=t.sent,console.log(a),r("setCategories",a);case 7:case"end":return t.stop()}}),t)})))()},getMeta:function(e){return Object(F["a"])(regeneratorRuntime.mark((function t(){var n,r,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(n=e.state,r=e.commit,n.allKeyData){t.next=7;break}return t.next=4,B.loadIndicatorsMeta();case 4:a=t.sent,console.log(a),r("setMeta",a);case 7:case"end":return t.stop()}}),t)})))()}}};r["a"].use(N["a"]);var oe=new N["a"].Store({modules:{sids:re,indicators:ae}});r["a"].use(K["a"]);var ie=[{path:"/portfolio",link:"/portfolio",name:"UNDP SIDS Portfolio",props:function(e){return{region:e.query.region||"All",year:e.query.year||"2021",fundingCategory:decodeURIComponent(e.query.fundingCategory||"All"),fundingSource:decodeURIComponent(e.query.fundingSource||"All Funding Sources")}},component:function(){return n.e("about").then(n.bind(null,"c9e5"))},beforeEnter:function(){var e=Object(F["a"])(regeneratorRuntime.mark((function e(t,n,r){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,oe.dispatch("sids/getAllKeyData");case 2:return e.next=4,oe.dispatch("sids/setSIDSData");case 4:return e.next=6,oe.dispatch("sids/setFundingCategories");case 6:r();case 7:case"end":return e.stop()}}),e)})));function t(t,n,r){return e.apply(this,arguments)}return t}(),children:[{path:"samoa",name:"SAMOA",component:function(){return n.e("about").then(n.bind(null,"5a0b"))},props:function(e){return{region:e.query.region||"All",year:e.query.year||"all",fundingCategory:decodeURIComponent(e.query.fundingCategory||"All"),fundingSource:decodeURIComponent(e.query.fundingSource||"All Funding Sources")}}},{path:"sdgs",name:"SDGS",component:function(){return n.e("about").then(n.bind(null,"0b98"))},props:function(e){return{region:e.query.region||"All",year:e.query.year||"all",fundingCategory:decodeURIComponent(e.query.fundingCategory||"All"),fundingSource:decodeURIComponent(e.query.fundingSource||"All Funding Sources")}}},{path:"signature-solutions",name:"SignatureSolutions",component:function(){return n.e("about").then(n.bind(null,"cf68"))},props:function(e){return{region:e.query.region||"All",year:e.query.year||"all",fundingCategory:decodeURIComponent(e.query.fundingCategory||"All"),fundingSource:decodeURIComponent(e.query.fundingSource||"All Funding Sources")}}},{path:"*",redirect:"sdgs"},{path:"",redirect:"sdgs"}]},{path:"/development-indicators",link:"/development-indicators",name:"Development Indicators",component:function(){return n.e("about").then(n.bind(null,"59b7"))},props:function(){return{view:"indicators"}},beforeEnter:function(){var e=Object(F["a"])(regeneratorRuntime.mark((function e(t,n,r){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,oe.dispatch("indicators/getCategories");case 2:return e.next=4,oe.dispatch("indicators/getMeta");case 4:r();case 5:case"end":return e.stop()}}),e)})));function t(t,n,r){return e.apply(this,arguments)}return t}()},{path:"/vulnerability",link:"/vulnerability",name:"Vulnerability",component:function(){return n.e("about").then(n.bind(null,"59b7"))},props:function(){return{view:"vulnerability"}}},{path:"/country-profiles/:country?",link:"/country-profiles",name:"Country Profiles",component:function(){return n.e("about").then(n.bind(null,"35f2"))},beforeEnter:function(){var e=Object(F["a"])(regeneratorRuntime.mark((function e(t,n,r){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,oe.dispatch("sids/getMetaData");case 2:return e.next=4,oe.dispatch("sids/getAllKeyData");case 4:t.params.country||r({path:"/country-profiles/".concat(oe.state.sids.countryList[0].id)}),r();case 6:case"end":return e.stop()}}),e)})));function t(t,n,r){return e.apply(this,arguments)}return t}(),props:function(e){return{country:e.params.country||"",compare:e.query.compare&&e.query.compare.split(",")||[]}}},{path:"/geospatial-data",link:"/geospatial-data",name:"Geospatial Data",component:function(){return n.e("about").then(n.bind(null,"1f4d"))}},{path:"/about",link:"/about",name:"About",component:function(){return n.e("about").then(n.bind(null,"f820"))}},{path:"*",redirect:"/about"}],ue=new K["a"]({mode:"history",base:"/SIDSDataPlatform/",routes:ie}),se=n("f309");r["a"].use(se["a"]);var ce=new se["a"]({});n("52df"),n("1d15");r["a"].config.productionTip=!1,new r["a"]({router:ue,store:oe,vuetify:ce,render:function(e){return e(q)}}).$mount("#app")},6399:function(e,t,n){"use strict";n("1fab")},"71b3":function(e,t,n){},"80d5":function(e,t,n){},"85ec":function(e,t,n){},cf05:function(e,t,n){e.exports=n.p+"img/logo.9a6ea078.png"},da1a:function(e,t,n){"use strict";n("80d5")},df51:function(e,t,n){"use strict";n("71b3")}});
//# sourceMappingURL=app.90186f58.js.map