"use strict";(self.webpackChunkcompose_destinations_docs=self.webpackChunkcompose_destinations_docs||[]).push([[90],{3905:function(e,n,t){t.d(n,{Zo:function(){return c},kt:function(){return m}});var a=t(7294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function r(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,a,o=function(e,n){if(null==e)return{};var t,a,o={},i=Object.keys(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var l=a.createContext({}),p=function(e){var n=a.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):r(r({},n),e)),t},c=function(e){var n=p(e.components);return a.createElement(l.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},d=a.forwardRef((function(e,n){var t=e.components,o=e.mdxType,i=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),d=p(t),m=o,g=d["".concat(l,".").concat(m)]||d[m]||u[m]||i;return t?a.createElement(g,r(r({ref:n},c),{},{components:t})):a.createElement(g,r({ref:n},c))}));function m(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var i=t.length,r=new Array(i);r[0]=d;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,r[1]=s;for(var p=2;p<i;p++)r[p]=t[p];return a.createElement.apply(null,r)}return a.createElement.apply(null,t)}d.displayName="MDXCreateElement"},5370:function(e,n,t){t.r(n),t.d(n,{assets:function(){return c},contentTitle:function(){return l},default:function(){return m},frontMatter:function(){return s},metadata:function(){return p},toc:function(){return u}});var a=t(3117),o=t(102),i=(t(7294),t(3905)),r=["components"],s={sidebar_position:10},l="Code generation configs",p={unversionedId:"codegenconfigs",id:"codegenconfigs",title:"Code generation configs",description:"Generated files package name",source:"@site/docs/codegenconfigs.md",sourceDirName:".",slug:"/codegenconfigs",permalink:"/codegenconfigs",draft:!1,editUrl:"https://github.com/raamcosta/compose-destinations-docs/edit/main/docusaurus/docs/codegenconfigs.md",tags:[],version:"current",sidebarPosition:10,frontMatter:{sidebar_position:10},sidebar:"tutorialSidebar",previous:{title:"Deep links",permalink:"/deeplinks"},next:{title:"Bottom bar navigation",permalink:"/common-use-cases/bottom-bar-navigation"}},c={},u=[{value:"Generated files package name",id:"generated-files-package-name",level:2},{value:"Disabling NavGraphs generation",id:"disabling-navgraphs-generation",level:2},{value:"Multi module configs",id:"multi-module-configs",level:2}],d={toc:u};function m(e){var n=e.components,t=(0,o.Z)(e,r);return(0,i.kt)("wrapper",(0,a.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"code-generation-configs"},"Code generation configs"),(0,i.kt)("h2",{id:"generated-files-package-name"},"Generated files package name"),(0,i.kt)("p",null,"If you want the generated files to be placed in a specific package name, you can configure it like this:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'ksp {\n    arg("compose-destinations.codeGenPackageName", "your.preferred.packagename")\n}\n')),(0,i.kt)("h2",{id:"disabling-navgraphs-generation"},"Disabling NavGraphs generation"),(0,i.kt)("p",null,"You can disable the ",(0,i.kt)("inlineCode",{parentName:"p"},"NavGraphs")," generated object like this:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'ksp {\n    arg("compose-destinations.generateNavGraphs", "false")\n}\n')),(0,i.kt)("p",null,"This config is only meant for the default (",(0,i.kt)("inlineCode",{parentName:"p"},'"singlemodule"'),") mode. See more about modes on next section.\nIt will make ",(0,i.kt)("inlineCode",{parentName:"p"},"@NavGraph")," annotations ignored in the code generating process since these are hints only used in the generating of the ",(0,i.kt)("inlineCode",{parentName:"p"},"NavGraphs")," object. KSP task will log some warnings about this.\nRead more about when you might want to do this ",(0,i.kt)("a",{parentName:"p",href:"defining-navgraphs#manually-defining-navigation-graphs"},"here"),"."),(0,i.kt)("h2",{id:"multi-module-configs"},"Multi module configs"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-kotlin"},'ksp {\n   arg("compose-destinations.mode", "[GENERATION_MODE_FOR_MODULE]")\n   arg("compose-destinations.moduleName", "[YOUR_MODULE_NAME")\n}\n')),(0,i.kt)("p",null,"For multi-module apps, you can now use the above two configs in each module's ",(0,i.kt)("inlineCode",{parentName:"p"},"build.gradle")," where you are going to use Compose Destinations ",(0,i.kt)("inlineCode",{parentName:"p"},"ksp")," dependency (in other words where you will annotate composables with ",(0,i.kt)("inlineCode",{parentName:"p"},"@Destination"),"). ",(0,i.kt)("inlineCode",{parentName:"p"},"GENERATION_MODE_FOR_MODULE")," can be replaced with:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("inlineCode",{parentName:"p"},'"destinations"'),':\nKSP will generate the destinations of the module and expose a list with all of them. Doesn\'t generate any nav graphs. The nav graphs should then be manually built in the "navigation module" where you call the ',(0,i.kt)("inlineCode",{parentName:"p"},"DestinationsNavHost"),".\nThis is useful if your module wants to expose single or multiple destinations but they should belong to a navigation graph that also contains destinations from other modules.",(0,i.kt)("br",{parentName:"p"}),"\n",(0,i.kt)("strong",{parentName:"p"},"Example of usage:")," Chris Banes tivi project - ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/raamcosta/tivi"},"https://github.com/raamcosta/tivi"),(0,i.kt)("br",{parentName:"p"}),"\n","Note also that you don't necessarily need to use ",(0,i.kt)("inlineCode",{parentName:"p"},"routedIn")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"withIn")," methods like we do in this repository.\nThat is only needed if you want some ",(0,i.kt)("inlineCode",{parentName:"p"},"Destinations")," to belong to multiple navigation graphs.)")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("inlineCode",{parentName:"p"},'"navgraphs"'),":\nThe module will generate a nav graph and its destinations (or graphs if you use ",(0,i.kt)("inlineCode",{parentName:"p"},"@NavGraph"),' annotations on some destination).\nThis should be used if your module generates one or multiple navigation graphs that will then be consumed in another module, usually the "navigation module" that calls ',(0,i.kt)("inlineCode",{parentName:"p"},"DestinationsNavHost"),".",(0,i.kt)("br",{parentName:"p"}),"\n",(0,i.kt)("strong",{parentName:"p"},"Example of usage:")," Philipp Lackner project - ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/raamcosta/CalorieTracker"},"https://github.com/raamcosta/CalorieTracker"))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("inlineCode",{parentName:"p"},'"singlemodule"')," (default if none is specified):\nMeant for apps where navigation-related code is in a single module. It generates a ",(0,i.kt)("inlineCode",{parentName:"p"},"NavGraphs"),' object with all nav graphs inside and it nests all of them inside the "root" one. It is also the only mode that generates a ',(0,i.kt)("inlineCode",{parentName:"p"},"SingleModuleExtensions.kt")," file (this is basically a file with utilities that you can always create yourself if you need to. These utilities use the generated ",(0,i.kt)("inlineCode",{parentName:"p"},"NavGraphs.root")," and/or expose the (generated) sealed version of a Destination instead of the DestinationSpec from the core module)."))))}m.isMDXComponent=!0}}]);