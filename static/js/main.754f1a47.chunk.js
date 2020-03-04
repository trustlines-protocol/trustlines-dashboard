(this["webpackJsonpproto-dashboard"]=this["webpackJsonpproto-dashboard"]||[]).push([[0],{14:function(e,t,n){},18:function(e,t,n){},19:function(e,t,n){},21:function(e,t,n){},22:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),l=n(8),c=n.n(l),o=(n(14),n(1)),s=n(5),u=n.n(s),i=n(2),m=n.n(i),f=n(3),d=n(6);function v(e){return b.apply(this,arguments)}function b(){return(b=Object(f.a)(m.a.mark((function e(t){return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(t);case 2:return e.abrupt("return",e.sent.json());case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}n(18);var E=function(e){var t=e.networkStatic,n=e.numUsers,a=e.numTransfers;return r.a.createElement("div",null,r.a.createElement("div",{className:"title"},t.name," (",t.abbreviation,")"),r.a.createElement("div",{className:"subtitle"},n," Users, ",a," Transfers"))};var h=function(e){var t=e.timestamp,n=Object(a.useState)(""),l=Object(o.a)(n,2),c=l[0],s=l[1];return Object(a.useEffect)((function(){function e(){s(u()(t).fromNow())}e();var n=setInterval(e,1e3);return function(){return clearInterval(n)}}),[t]),t&&r.a.createElement("span",null,u()(t).format("hh:mm:ss"),"(",c,")")};function p(e,t){for(var n={},a=0,r=Object.values(t);a<r.length;a++){n[r[a]]=[]}var l=!0,c=!1,o=void 0;try{for(var s,u=e[Symbol.iterator]();!(l=(s=u.next()).done);l=!0){var i=s.value;t[i.type]&&n[t[i.type]].push(i)}}catch(m){c=!0,o=m}finally{try{l||null==u.return||u.return()}finally{if(c)throw o}}return n}function w(e){var t=new Set,n={},a=!0,r=!1,l=void 0;try{for(var c,o=e[Symbol.iterator]();!(a=(c=o.next()).done);a=!0){for(var s=c.value,u=[s.from,s.to],i=0,m=u;i<m.length;i++){var f=m[i];t.add(f)}var d=u[0],v=u[1];if(v<d){var b=[v,d];d=b[0],v=b[1]}n[[d,v]]={id:d+v,from:d,to:v}}}catch(x){r=!0,l=x}finally{try{a||null==o.return||o.return()}finally{if(r)throw l}}var E=[],h=[],p=!0,w=!1,y=void 0;try{for(var g,j=t[Symbol.iterator]();!(p=(g=j.next()).done);p=!0){var O=g.value;E.push({id:O,label:O.slice(0,7)})}}catch(x){w=!0,y=x}finally{try{p||null==j.return||j.return()}finally{if(w)throw y}}for(var k=0,S=Object.values(n);k<S.length;k++){var N=S[k];h.push(N)}return[E,h]}var y={autoResize:!0,height:"100%",width:"100%",interaction:{selectConnectedEdges:!1}};var g=function(e){var t=e.network,n=e.onSelectTrustline,l=e.onSelectAccount,c=Object(a.useRef)(null),s=Object(a.useState)(0),u=Object(o.a)(s,2),i=u[0],b=u[1],g=Object(a.useState)(null),j=Object(o.a)(g,2),O=j[0],k=j[1],S=Object(a.useState)(null),N=Object(o.a)(S,2),x=N[0],U=N[1],I=Object(a.useState)(null),T=Object(o.a)(I,2),D=T[0],C=T[1],B=Object(a.useState)(null),z=Object(o.a)(B,2),A=z[0],P=z[1];return Object(a.useEffect)((function(){k(new d.a.Network(c.current,{},y))}),[]),Object(a.useEffect)((function(){O&&(O.off("selectEdge"),O.off("selectNode"),O.off("deselectEdge"),O.off("deselectNode"),O.off("stabilizationProgress"),O.on("selectEdge",(function(e){if(1===e.edges.length&&0===e.nodes.length){var a=O.body.data.edges.get(e.edges[0]),r={network:t.address,from:a.from,to:a.to};n(r)}})),O.on("selectNode",(function(e){1===e.nodes.length&&l(e.nodes[0])})),O.on("deselectEdge",(function(e){n(null)})),O.on("deselectNode",(function(e){l(null)})),O.on("stabilizationProgress",(function(e){b(Math.floor(e.iterations/e.total*100))})))}),[t,O,l,n]),Object(a.useEffect)((function(){if(O){console.log("Init fetch"),O.setData({}),b(0),U(0),C(0);var e=null,n=null,a=!0,r=function(){var r=0;function l(){return c.apply(this,arguments)}function c(){return(c=Object(f.a)(m.a.mark((function l(){var c,s,u,i,f,E,h;return m.a.wrap((function(l){for(;;)switch(l.prev=l.next){case 0:if(a){l.next=3;break}return console.log("Skip fetching, because old still in progress"),l.abrupt("return");case 3:return a=!1,console.log("Fetch events from block ",r),l.next=7,v("https://tlbc.relay.anyblock.tools"+"/api/v1/networks/".concat(t.address,"/events?fromBlock=").concat(r));case 7:if(0!==(c=l.sent).length){l.next=13;break}return console.log("No new events"),P(Date.now()),a=!0,l.abrupt("return");case 13:s=p(c,{TrustlineUpdate:"trustlineUpdateEvents",Transfer:"transferEvents"}),u=w(s.trustlineUpdateEvents),i=Object(o.a)(u,2),f=i[0],E=i[1],null==e?(console.log("Init network data"),e=new d.a.DataSet(f),n=new d.a.DataSet(E),h={nodes:e,edges:n},O.setData(h),O.once("stabilizationIterationsDone",(function(e){a=!0,b(100)}))):(console.log("Update network data"),e.update(f),n.update(E),a=!0),U((function(e){return e+s.transferEvents.length})),C(e.length),P(Date.now()),r=c[c.length-1].blockNumber+1;case 20:case"end":return l.stop()}}),l)})))).apply(this,arguments)}return l(),setInterval(l,5e3)}();return function(){return clearInterval(r)}}}),[O,t]),r.a.createElement("div",{style:{width:"100%",height:"100%"}},r.a.createElement(E,{networkStatic:t,numUsers:D,numTransfers:x}),"last updated: ",r.a.createElement(h,{timestamp:A}),100!==i&&r.a.createElement("progress",{className:"progress my-progress is-info",value:i,max:"100"},i,"%"),r.a.createElement("div",{style:{width:"100%",height:"90%"},ref:c}))};n(19);var j=function(e){var t=e.onNetworkSelect,n=Object(a.useState)([]),l=Object(o.a)(n,2),c=l[0],s=l[1],u=Object(a.useState)(null),i=Object(o.a)(u,2),d=i[0],b=i[1];Object(a.useEffect)((function(){function e(){return t.apply(this,arguments)}function t(){return(t=Object(f.a)(m.a.mark((function e(){var t;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,v("https://tlbc.relay.anyblock.tools/api/v1/networks");case 2:(t=e.sent).sort((function(e,t){return t.numUsers-e.numUsers})),s(t);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}e();var n=setInterval(e,1e4);return function(){return clearInterval(n)}}),[]);var E=Object(a.useCallback)((function(e){b(e.address),t(e)}),[t,b]);return r.a.createElement("aside",{className:"menu my-menu"},r.a.createElement("p",{className:"menu-label"},"Networks"),r.a.createElement("ul",null,c.map((function(e){return r.a.createElement("li",{key:e.address},r.a.createElement("a",{onClick:function(){return E(e)},className:"list-item "+(d===e.address?"is-active":"")},e.name," (",e.numUsers,")"))}))))},O=n(4),k=n.n(O);function S(e,t){var n=new k.a(e).div(new k.a(10).pow(t.decimals));return"".concat(n," ").concat(t.abbreviation)}var N=function(e){var t=e.network,n=e.from,l=e.to,c=Object(a.useState)({}),s=Object(o.a)(c,2),u=s[0],i=s[1];return Object(a.useEffect)((function(){function e(){return(e=Object(f.a)(m.a.mark((function e(){var a;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,v("https://tlbc.relay.anyblock.tools"+"/api/v1/networks/".concat(t.address,"/users/").concat(n,"/trustlines/").concat(l));case 2:a=e.sent,i(a);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}!function(){e.apply(this,arguments)}()}),[t,n,l]),r.a.createElement("div",null,r.a.createElement("div",{className:"title"},"Trustline Details"),r.a.createElement("table",{className:"table"},r.a.createElement("tbody",null,r.a.createElement("tr",null,r.a.createElement("th",null,"from"),r.a.createElement("td",null,u.user)),r.a.createElement("tr",null,r.a.createElement("th",null,"to"),r.a.createElement("td",null,u.counterParty)),r.a.createElement("tr",null,r.a.createElement("th",null,"Credit given"),r.a.createElement("td",null,S(u.given,t))),r.a.createElement("tr",null,r.a.createElement("th",null,"Credit received"),r.a.createElement("td",null,S(u.received,t))),r.a.createElement("tr",null,r.a.createElement("th",null,"Balance"),r.a.createElement("td",null,S(u.balance,t))))))};function x(e,t){if(null==e)return"...";var n=new k.a(e).div(new k.a(10).pow(t.decimals));return"".concat(n," ").concat(t.abbreviation)}var U=function(e){var t=e.network,n=e.address,l=Object(a.useState)({}),c=Object(o.a)(l,2),s=c[0],u=c[1];return Object(a.useEffect)((function(){function e(){return(e=Object(f.a)(m.a.mark((function e(){var a;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,v("https://tlbc.relay.anyblock.tools"+"/api/v1/networks/".concat(t.address,"/users/").concat(n));case 2:a=e.sent,u(a);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}!function(){e.apply(this,arguments)}()}),[t,n]),r.a.createElement("div",null,r.a.createElement("div",{className:"title"},"Account Details"),r.a.createElement("table",{className:"table"},r.a.createElement("tbody",null,r.a.createElement("tr",null,r.a.createElement("th",null,"User"),r.a.createElement("td",null,n)),r.a.createElement("tr",null,r.a.createElement("th",null,"Credit given"),r.a.createElement("td",null,x(s.given,t))),r.a.createElement("tr",null,r.a.createElement("th",null,"Credit received"),r.a.createElement("td",null,x(s.received,t))),r.a.createElement("tr",null,r.a.createElement("th",null,"Balance"),r.a.createElement("td",null,x(s.balance,t))),r.a.createElement("tr",null,r.a.createElement("th",null,"Available"),r.a.createElement("td",null,x(s.leftReceived,t))))))};n(20),n(21);u.a.relativeTimeThreshold("ss",10);var I=function(){var e=Object(a.useState)(null),t=Object(o.a)(e,2),n=t[0],l=t[1],c=Object(a.useState)(null),s=Object(o.a)(c,2),u=s[0],i=s[1],m=Object(a.useState)(null),f=Object(o.a)(m,2),d=f[0],v=f[1],b=Object(a.useCallback)((function(e){i(null),v(null),l(e)}),[]);return r.a.createElement("div",{className:"mycontainer columns"},r.a.createElement("div",{className:"column is-narrow"},r.a.createElement(j,{onNetworkSelect:b})),r.a.createElement("div",{className:"column is-three-quarter"},n?r.a.createElement(g,{network:n,onSelectTrustline:i,onSelectAccount:v}):r.a.createElement("div",{className:"has-text-centered"},"Select a network")),r.a.createElement("div",{className:"column is-one-quarter"},u?r.a.createElement(N,{network:n,from:u.from,to:u.to}):r.a.createElement("div",{className:"has-text-centered"},"Select a trustline"),r.a.createElement("br",null),r.a.createElement("br",null),d?r.a.createElement(U,{network:n,address:d}):r.a.createElement("div",{className:"has-text-centered"},"Select an account")))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(I,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},9:function(e,t,n){e.exports=n(22)}},[[9,1,2]]]);
//# sourceMappingURL=main.754f1a47.chunk.js.map