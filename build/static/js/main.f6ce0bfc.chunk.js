(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{15:function(t,e,n){t.exports=n.p+"static/media/image-from-rawpixel-id-558785-jpeg.be7bc74e.jpg"},29:function(t,e,n){t.exports=n.p+"static/media/search-solid.f542b8a3.svg"},30:function(t,e,n){t.exports=n.p+"static/media/youtube-icon.98390dab.svg"},31:function(t,e,n){t.exports=n.p+"static/media/spotify-icon.e3366f54.svg"},32:function(t,e,n){t.exports=n.p+"static/media/youtube-music-icon.dda65f8d.svg"},33:function(t,e,n){t.exports=n.p+"static/media/deezer-icon.506ac5b7.svg"},34:function(t,e,n){t.exports=n(67)},40:function(t,e,n){},41:function(t,e,n){},42:function(t,e,n){t.exports=n.p+"static/media/image-from-rawpixel-id-558806-jpeg.c8726bd6.jpg"},43:function(t,e,n){},48:function(t,e){},50:function(t,e){},65:function(t,e,n){},66:function(t,e,n){},67:function(t,e,n){"use strict";n.r(e);var r=n(0),i=n.n(r),a=n(28),o=n.n(a),s=(n(40),n(3)),l=n(4),c=n(7),u=n(5),p=n(2),f=n(6),d=(n(41),n(15)),v=n.n(d),h=(n(42),n(43),n(29)),m=n.n(h),b=(n(44),{youtubeMusic:"music.youtube",youtube:"youtube",spotify:"spotify",appleMusic:"music.apple",deezer:"deezer"}),g={notValid:""};function y(t){var e,n=function(t){var e=-1,n="";for(var r in b){var i=U(t,b[r]);if(-1!==i){e=i,n=b[r];break}}var a=t.substring(e);return a=function(t){var e=t.indexOf("/");return t.substring(e+1)}(a),console.log("Service Name: "+n),{service:n,cutUrl:a}}(t);if(n.service===b.youtube||n.service===b.youtubeMusic){var r,i,a=x(function(t){var e=t.cutUrl,n={};if(-1===e.indexOf("watch?"))return n.type="album",n;n.type="track",T(e);for(var r=T(e).split("&"),i=0;i<r.length;i++){var a=r[i].indexOf("="),o=r[i].substring(0,a),s=r[i].substring(a+1,r[i].length);n[o]=s}return console.log(n),n}(n),"track");if("isAlbum"in a)return{notValid:"this is playlist. Now we cant work with them",artist:"",track:"this is playlist. Now we cant work with them",url:"",service:n.service};if("notValid"in a)return{notValid:"Not found:(",artist:"",track:"Not found:(",url:"",service:n.service};console.log(a);var o,s=a.items[0].snippet.title.indexOf("-");return-1!==a.items[0].snippet.title.indexOf("-")?(r=a.items[0].snippet.title.substring(0,s),i=a.items[0].snippet.title.substring(s,a.items[0].snippet.title.length)):(r=a.items[0].snippet.channelTitle,i=a.items[0].snippet.title),i=w(i),r=w(r),i=O(i),r=O(r),"youtube"===n.service?o="https://www.youtube.com/watch?v="+a.items[0].id:"youtubeMusic"===n.service&&(o="https://www.music.youtube.com/watch?v="+a.items[0].id),e=V(r,i,o,n.service),console.log(e),-1!==(s=e.artist.indexOf(" - Topic"))&&(e.artist=e.artist.substring(0,s)),e}if(n.service===b.spotify){var l=S(function(t){var e=t.cutUrl,n={},r=e.split("/");return n[r[0]]=r[1],console.log(n),n}(n),"track");if(console.log(l),"album"===l.type)return{artist:"",track:"this is album",url:"",notValid:"this is album"};if("notValid"in l)return{artist:"",track:"error:"+l.notValid,url:"",notValid:"error:"+l.notValid};var c=l.name,u=l.external_urls.spotify,p=l.artists[0].name;return c=w(c),p=w(p),c=O(c),e=V(p=O(p),c,u,n.service)}if(n.service===b.deezer){var f=N(function(t){var e=t.cutUrl,n={},r=e.split("/");"artist"!==r[0]&&"track"!==r[0]||(n[r[0]]=r[1]);return console.log(n),n}(n),"track");if("album"===f.type)return{artist:"",track:"this is album",url:"",notValid:"this is album"};if("notValid"in f)return{artist:"",track:"error:"+f.notValid,url:"",notValid:"error:"+f.notValid};var d=f.title_short,v=f.link,h=f.artist.name;return d=w(d),h=w(h),d=O(d),e=V(h=O(h),d,v,b.deezer)}return{notValid:"Not Found:(",artist:"Not Found:(",track:"",url:""}}function k(t){var e;return-1!==t.indexOf(".")&&(e=t.indexOf("."),-1!==(e=t.indexOf("/",e)))}function w(t){var e,n=t;return-1!==t.indexOf("(")&&-1!==t.indexOf(")")&&(e=t.indexOf("("),n=t.substring(0,e)+t.substring(t.indexOf(")")+1,t.length)),-1!==t.indexOf("[")&&-1!==t.indexOf("]")&&(e=t.indexOf("["),n=t.substring(0,e)+t.substring(t.indexOf("]")+1,t.length)),n}function O(t){var e,n=t;return-1!==t.indexOf(/feat/i)&&(e=t.indexOf(/feat/i),n=t.substring(0,e)),n}function x(t,e){var n=t.type;delete t.type;var r=new XMLHttpRequest,i="https://www.googleapis.com/youtube/v3/";if("album"===n)return i+="playlistItems?",{isAlbum:""};switch(e){case"track":i+="videos?";break;case"search":i+="search?";break;default:return console.log("not valid request type"),g}for(var a in i+="part=snippet",t)switch(a){case"v":i+="&id="+t[a];break;case"q":i+="&q="+t[a]+"&maxResults=25&type=video&videoCategoryId=10";break;case"list":case"feature":break;default:return console.log("bad argument = Not Found"),g}i+="&key=AIzaSyBEYdv5D-1VmQHgb5d3jR2qn2mo_mvlr9g",r.open("GET",i,!1),r.send();var o={notValid:""};return 200!==r.status?alert(r.status+": "+r.statusText):0!==JSON.parse(r.responseText).pageInfo.totalResults?o=JSON.parse(r.responseText):o.notValid="Not Found",console.log(o),o}function S(t,e){var n=function(){var t=function(t){var e=document.cookie.match(new RegExp("(?:^|; )"+t.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,"\\$1")+"=([^;]*)"));return e?decodeURIComponent(e[1]):void 0}("spotifyKey");return t||function(){var t,e=new XMLHttpRequest;if(e.open("GET","/token",!1),e.send(),200!==e.status)alert(e.status+": "+e.statusText+"Can't get spotify token from sendtrack server");else{var n=JSON.parse(e.responseText);t=n.token,function(t,e,n){var r=(n=n||{}).expires;if("number"==typeof r&&r){var i=new Date;i.setTime(i.getTime()+1e3*r),r=n.expires=i}r&&r.toUTCString&&(n.expires=r.toUTCString());e=encodeURIComponent(e);var a=t+"="+e;for(var o in n){a+="; "+o;var s=n[o];!0!==s&&(a+="="+s)}document.cookie=a}("spotifyKey",n.token,{expires:(n.expires-Date.now())/1e3})}return console.log(t),t}()}(),r=g,i="https://api.spotify.com/v1/";if("artists"in t)return r.notValid="artist",r;switch(e){case"track":i+="tracks/"+t.track;break;case"search":i+="search?q="+t.q+"&type=track&limit=10";break;default:return g}console.log(i);var a=new XMLHttpRequest;return a.open("GET",i,!1),a.setRequestHeader("Accept","application/json"),a.setRequestHeader("Content-Type","application/json"),a.setRequestHeader("Authorization","Bearer "+n),a.send(),200!==a.status?(alert(a.status+": "+a.statusText),r[g]=a.statusText):0!==JSON.parse(a.responseText).total&&(r=JSON.parse(a.responseText)),console.log(a.responseText),r}function N(t,e){var n=g,r="/deezer/";switch(e){case"track":r+="track?id="+t.track;break;case"search":r+="search?artist="+t.artist+"&track="+t.track;break;default:return n.notValid="Bad Request Type",n}console.log(r);var i=new XMLHttpRequest;return i.open("GET",r,!1),i.send(),200!==i.status?(alert(i.status+": "+i.statusText),n[g]=i.statusText):0!==JSON.parse(i.responseText).total&&(n=JSON.parse(i.responseText)),console.log(n),n}function T(t){var e=t.indexOf("watch?");return t.substring(e+"watch?".length)}function E(t){var e={spotify:"Not Found",youtube:"Not Found",youtubeMusic:"Not Found",deezer:"Not Found"};if(t.hasOwnProperty("notValid"))return console.log(t.notValid),e;function n(t,e,n,r){return{artist:t,track:e,url:n,albumArt:r}}if(t.initialService!==b.spotify){var r={q:t.artist+" "+t.track};console.log(t);var i=S(r,"search");if(console.log(i),!i.hasOwnProperty("type")&&"album"!==i.type&&!i.hasOwnProperty("notValid")){var a=function(t,e){var n=e.artist,r=e.track,i={notValid:"Not Found2"},a=!0,o=!1,s=void 0;try{for(var l,c=t.tracks.items[Symbol.iterator]();!(a=(l=c.next()).done);a=!0){var u=l.value,p=!1;if("track"===u.type){if(console.log(u.name),!j(r,u.name)&&!j(u.name,r))continue;var f=!0,d=!1,v=void 0;try{for(var h,m=u.artists[Symbol.iterator]();!(f=(h=m.next()).done);f=!0){var b=h.value;if(j(n,b.name)&&j(b.name,n)){p=!0;break}p=!1}}catch(g){d=!0,v=g}finally{try{f||null==m.return||m.return()}finally{if(d)throw v}}if(i=u,p)return i}}}catch(g){o=!0,s=g}finally{try{a||null==c.return||c.return()}finally{if(o)throw s}}return i}(i,t);if(!a.hasOwnProperty("notValid")){for(var o="",s=0;s<a.artists.length;s++)s!==a.artists.length-1?o+=a.artists[s].name+", ":o+=a.artists[s].name;e.spotify=n(o,a.name,a.external_urls.spotify,a.album.images[0].url)}}}if(t.initialService!==b.youtubeMusic||t.initialService!==b.youtube){var l={q:t.artist+" "+t.track};console.log(l.q),console.log("Initial Service: "+t.initialService);var c=x(l,"search");if(!c.hasOwnProperty("notValid")){var u=function(t,e){var n=e.artist,r=e.track,i={notValid:"Not Found2"},a=!1,o=!0,s=!1,l=void 0;try{for(var c,u=t.items[Symbol.iterator]();!(o=(c=u.next()).done);o=!0){var p=c.value;if(-1!==p.snippet.channelTitle.indexOf("- Topic")){var f=p.snippet.channelTitle.substring(0,p.snippet.channelTitle.indexOf(" - Topic"));if(!j(r,p.snippet.title)&&!j(p.snippet.title,r))continue;if(!j(n,f)&&!j(f,n))continue;i=p,a=!0;break}}}catch(y){s=!0,l=y}finally{try{o||null==u.return||u.return()}finally{if(s)throw l}}if(!a){var d=!0,v=!1,h=void 0;try{for(var m,b=t.items[Symbol.iterator]();!(d=(m=b.next()).done);d=!0){var g=m.value;if(j(n+" "+r,g.snippet.title)||j(g.snippet.title,n+" "+r)){i=g;break}}}catch(y){v=!0,h=y}finally{try{d||null==b.return||b.return()}finally{if(v)throw h}}}return i}(c,t);if(!u.hasOwnProperty("notValid"))if(-1===u.snippet.channelTitle.indexOf("- Topic")){var p="",f=u.snippet.title,d=u.snippet.title,v=d.indexOf("-");-1!==d.indexOf("-")&&(p=d.substring(0,v).trim(),f=d.substring(v+1,d.length).trim()),t.initialService!==b.youtubeMusic&&(e.youtubeMusic=n(p,f,"https://music.youtube.com/watch?v="+u.id.videoId,u.snippet.thumbnails.high.url)),t.initialService!==b.youtube&&(e.youtube=n(p,f,"https://youtube.com/watch?v="+u.id.videoId,u.snippet.thumbnails.high.url))}else t.initialService!==b.youtubeMusic&&(e.youtubeMusic=n(u.snippet.channelTitle.substring(0,u.snippet.channelTitle.indexOf("- Topic")),u.snippet.title,"https://music.youtube.com/watch?v="+u.id.videoId,u.snippet.thumbnails.high.url)),t.initialService!==b.youtube&&(e.youtube=n(u.snippet.channelTitle.substring(0,u.snippet.channelTitle.indexOf("- Topic")),u.snippet.title,"https://youtube.com/watch?v="+u.id.videoId,u.snippet.thumbnails.high.url))}}if(t.initialService!==b.deezer){console.log("deezer array");var h=N({artist:t.artist,track:t.track},"search");if(h.hasOwnProperty("notValid"))console.log("deezer not valid");else{var m=h.data[0];e.deezer=n(m.artist.name,m.title_short,m.link,m.album.cover_xl)}}return console.log(e),e}function j(t,e){var n=new RegExp("[\\s-\\]\\[\\)\\(\\/\\.&]","i"),r=t.split(n),i=e.split(n);r=r.filter(function(t){return""!==t}),i=i.filter(function(t){return""!==t}),console.log(r),console.log(i);var a=!0,o=!1,s=void 0;try{for(var l,c=r[Symbol.iterator]();!(a=(l=c.next()).done);a=!0){var u=l.value,p=!1,f=!0,d=!1,v=void 0;try{for(var h,m=i[Symbol.iterator]();!(f=(h=m.next()).done);f=!0){var b=h.value,g=new RegExp(b,"i");if(-1!==u.search(g)){p=!0,console.log("Found");break}p=!1}}catch(y){d=!0,v=y}finally{try{f||null==m.return||m.return()}finally{if(d)throw v}}if(!p)return console.log("not equal"),!1}}catch(y){o=!0,s=y}finally{try{a||null==c.return||c.return()}finally{if(o)throw s}}return console.log("equal"),!0}function V(){return{artist:arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",track:arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",url:arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",initialService:arguments.length>3&&void 0!==arguments[3]?arguments[3]:""}}function U(t,e){var n=t.indexOf(e);return-1!==n&&(n+=e.length),n}var _=function(t){function e(t){var n;return Object(s.a)(this,e),(n=Object(c.a)(this,Object(u.a)(e).call(this,t))).state={placeholder:"Enter: Url / artist - name",content:"",isUrl:!1},n.handleInputChange=n.handleInputChange.bind(Object(p.a)(n)),n.handleSubmit=n.handleSubmit.bind(Object(p.a)(n)),n}return Object(f.a)(e,t),Object(l.a)(e,[{key:"handleInputChange",value:function(t){var e=t.target.value;this.setState(function(){return{content:e,isUrl:k(e)}}),console.log("changed")}},{key:"handleSubmit",value:function(t){t.preventDefault();var e=this.state.content;this.state.isUrl||this.setState(function(){return{content:"",isUrl:!1}}),this.props.onSubmit(e,this.state.isUrl),this.setState(function(){return{content:"",isUrl:!1}}),console.log("submit")}},{key:"render",value:function(){return i.a.createElement("div",{className:"input-form container"},i.a.createElement("form",{className:"input-form__text-form"},i.a.createElement("input",{value:this.state.content,placeholder:this.state.placeholder,onChange:this.handleInputChange,onSubmit:this.handleSubmit}),i.a.createElement("button",{onClick:this.handleSubmit},i.a.createElement("img",{src:m.a,alt:""}))))}}]),e}(r.Component),C=(n(65),function(t){function e(){return Object(s.a)(this,e),Object(c.a)(this,Object(u.a)(e).apply(this,arguments))}return Object(f.a)(e,t),Object(l.a)(e,[{key:"render",value:function(){return i.a.createElement("div",{className:"link container"},i.a.createElement("a",{href:this.props.url,className:"link__element container",target:"_blank",rel:"noopener noreferrer"},i.a.createElement("img",{src:this.props.albumArt,className:"link__album-art",alt:""}),i.a.createElement("div",{className:"link__artist-track container"},i.a.createElement("div",{className:"link__track-name"},this.props.track),i.a.createElement("div",{className:"link__artist-name"},this.props.artist)),i.a.createElement("img",{src:this.props.service,className:"link__service-name",alt:""})))}}]),e}(r.Component)),I=(n(66),n(30)),q=n.n(I),R=n(31),M=n.n(R),A=n(32),F=n.n(A),z=n(33),L=n.n(z),J=function(t){function e(t){var n;return Object(s.a)(this,e),(n=Object(c.a)(this,Object(u.a)(e).call(this,t))).getInfo=n.getInfo.bind(Object(p.a)(n)),n.getLinks=n.getLinks.bind(Object(p.a)(n)),n}return Object(f.a)(e,t),Object(l.a)(e,[{key:"getInfo",value:function(){return i.a.createElement("div",{className:"links-block__input-object"},this.props.artist,i.a.createElement("br",null),this.props.track,i.a.createElement("br",null),this.props.url,i.a.createElement("br",null))}},{key:"getLinks",value:function(){var t,e=[];for(var n in this.props.arrayOfUrls)if("Not Found"!==this.props.arrayOfUrls[n]){var r=this.props.arrayOfUrls[n];switch(n){case"spotify":r.service=M.a;break;case"youtube":r.service=q.a;break;case"youtubeMusic":r.service=F.a;break;case"deezer":r.service=L.a}e.push((t=r,i.a.createElement(C,{service:t.service,artist:t.artist,track:t.track,url:t.url,albumArt:t.albumArt})))}return console.log(e),e}},{key:"render",value:function(){return i.a.createElement("div",{className:"links-block container"},i.a.createElement(this.getInfo,null),i.a.createElement(this.getLinks,null))}}]),e}(r.Component),P=function(t){function e(t){var n;return Object(s.a)(this,e),(n=Object(c.a)(this,Object(u.a)(e).call(this,t))).initialState={artist:"",track:"",url:"",background:v.a,arrayOfUrls:{spotify:"Not Found",youtube:"Not Found",youtubeMusic:"Not Found"}},n.state=n.initialState,n.getLink=n.getLink.bind(Object(p.a)(n)),n}return Object(f.a)(e,t),Object(l.a)(e,[{key:"getLink",value:function(t,e){var n,r=v.a,i=E(n=e?y(t):function(t){if(""===t)return{notValid:"empty string"};var e;-1!==t.indexOf("-")&&(e=t.split("-")),-1!==t.indexOf("\u2013")&&(e=t.split("\u2013")),console.log(e);var n={notValid:"not valid input"};return(e=e.filter(function(t){return""!==t})).length>1&&(n=V(e[0].trim(),e[1].trim())),n}(t));"Not Found"!==i.spotify?r=i.spotify.albumArt:"Not Found"!==i.youtubeMusic&&(r=i.youtubeMusic.albumArt),this.setState(function(){return{artist:n.artist,track:n.track,url:n.url,arrayOfUrls:i,background:r}})}},{key:"render",value:function(){return i.a.createElement("div",{className:"App"},i.a.createElement("img",{className:"bg",src:this.state.background,alt:""}),i.a.createElement(_,{onSubmit:this.getLink}),i.a.createElement(J,{arrayOfUrls:this.state.arrayOfUrls,artist:this.state.artist,track:this.state.track,url:this.state.url}),i.a.createElement("div",{id:"result"}))}}]),e}(r.Component),H=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function W(t,e){navigator.serviceWorker.register(t).then(function(t){t.onupdatefound=function(){var n=t.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."),e&&e.onUpdate&&e.onUpdate(t)):(console.log("Content is cached for offline use."),e&&e.onSuccess&&e.onSuccess(t)))})}}).catch(function(t){console.error("Error during service worker registration:",t)})}o.a.render(i.a.createElement(P,null),document.getElementById("root")),function(t){if("serviceWorker"in navigator){if(new URL("/SendTrack",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",function(){var e="".concat("/SendTrack","/service-worker.js");H?(function(t,e){fetch(t).then(function(n){var r=n.headers.get("content-type");404===n.status||null!=r&&-1===r.indexOf("javascript")?navigator.serviceWorker.ready.then(function(t){t.unregister().then(function(){window.location.reload()})}):W(t,e)}).catch(function(){console.log("No internet connection found. App is running in offline mode.")})}(e,t),navigator.serviceWorker.ready.then(function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")})):W(e,t)})}}()}},[[34,1,2]]]);
//# sourceMappingURL=main.f6ce0bfc.chunk.js.map