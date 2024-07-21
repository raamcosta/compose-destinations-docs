"use strict";(self.webpackChunkcompose_destinations_docs=self.webpackChunkcompose_destinations_docs||[]).push([[3524],{8190:(n,e,a)=>{a.r(e),a.d(e,{assets:()=>l,contentTitle:()=>o,default:()=>h,frontMatter:()=>s,metadata:()=>r,toc:()=>d});var i=a(4848),t=a(8453);const s={sidebar_position:1},o="Basics",r={id:"navigation/basics",title:"Basics",description:"Navigate to Destinations",source:"@site/docs/navigation/basics.md",sourceDirName:"navigation",slug:"/navigation/basics",permalink:"/v2/navigation/basics",draft:!1,unlisted:!1,editUrl:"https://github.com/raamcosta/compose-destinations-docs/edit/main/docusaurus/docs/navigation/basics.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Arguments from NavHost",permalink:"/v2/arguments/nav-host-parameters"},next:{title:"Navigating back with a result",permalink:"/v2/navigation/backresult"}},l={},d=[{value:"Navigate to Destinations",id:"navigate-to-destinations",level:2},{value:"Navigate to NavGraphs",id:"navigate-to-navgraphs",level:2},{value:"DestinationsNavigator vs NavController",id:"destinationsnavigator-vs-navcontroller",level:2}];function c(n){const e={admonition:"admonition",br:"br",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,t.R)(),...n.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(e.h1,{id:"basics",children:"Basics"}),"\n",(0,i.jsx)(e.h2,{id:"navigate-to-destinations",children:"Navigate to Destinations"}),"\n",(0,i.jsxs)(e.p,{children:["To navigate to a destination you need a ",(0,i.jsx)(e.code,{children:"DestinationsNavigator"}),"."]}),"\n",(0,i.jsxs)(e.p,{children:["To get a ",(0,i.jsx)(e.code,{children:"DestinationsNavigator"}),":"]}),"\n",(0,i.jsxs)(e.ul,{children:["\n",(0,i.jsx)(e.li,{children:"Simply receive a DestinationsNavigator in your annotated screens."}),"\n"]}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-kotlin",children:"@Composable\nfun MyScreen(\n    navigator: DestinationsNavigator\n) { /*...*/ }\n"})}),"\n",(0,i.jsxs)(e.p,{children:["Or do (if you need it at a top level such as around ",(0,i.jsx)(e.code,{children:"DestinationsNavHost"}),", bottom bar, etc):"]}),"\n",(0,i.jsxs)(e.ul,{children:["\n",(0,i.jsxs)(e.li,{children:[(0,i.jsx)(e.code,{children:"navController.rememberDestinationsNavigator()"})," if in a Composable"]}),"\n",(0,i.jsxs)(e.li,{children:[(0,i.jsx)(e.code,{children:"navController.toDestinationsNavigator()"})," if NOT in a Composable"]}),"\n"]}),"\n",(0,i.jsx)(e.p,{children:"Then you can:"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-kotlin",children:"navigator.navigate(GreetingScreenDestination)\n"})}),"\n",(0,i.jsx)(e.p,{children:"Or if the destination has navigation arguments:"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-kotlin",children:'// All arguments will be available in the invoke function, including the default values\nnavigator.navigate(ProfileScreenDestination(id = 1, groupName = "Kotlin 4ever <3"))\n// OR\nval navArgs = ProfileScreenDestination.NavArgs(id = 1, groupName = "Kotlin 4ever <3")\nnavigator.navigate(ProfileScreenDestination(navArgs))\n'})}),"\n",(0,i.jsx)(e.h2,{id:"navigate-to-navgraphs",children:"Navigate to NavGraphs"}),"\n",(0,i.jsx)(e.p,{children:"To navigate to a NavGraph, do:"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-kotlin",children:'navigator.navigate(ProfileNavGraph(id = "some id"))\n\n// OR from within the same module that is declaring it:\n// "NavGraphs" may be prefixed with the module name if that is declared in a ksp config.\n\nnavigator.navigate(NavGraphs.profile(id = "some id"))\n'})}),"\n",(0,i.jsx)(e.p,{children:"Navigating to a nav graph results in navigating to its start route.\nSo what if that start route also has mandatory arguments?\nWell, in that case, Compose Destinations will also require those arguments."}),"\n",(0,i.jsxs)(e.p,{children:["Example: (start route of ProfileGraph, requires ",(0,i.jsx)(e.code,{children:"ProfileMainScreenNavArgs"}),")"]}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-kotlin",children:'navigator.navigate(\n    ProfileNavGraph(\n        id = "some id",\n        startRouteArgs = ProfileMainScreenNavArgs(/*pass in the fields needed*/)\n    )\n)\n'})}),"\n",(0,i.jsxs)(e.ul,{children:["\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsx)(e.p,{children:"If your nav graph doesn't have its own nav arguments, it may still require arguments to be navigated to, if its\nstart route does.\nThis ensures destination arguments will always be present, even if you navigated to its nav graph."}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsx)(e.p,{children:"If the start route of a nav graph is another nav graph which in turn has a start destination\nthat also needs arguments, then you'll be required to pass all those in."}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsx)(e.p,{children:'In a multi module scenario, all arguments part of this "chain" need to be public so that other\nmodules can navigate to your module\'s nav graph.'}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(e.h2,{id:"destinationsnavigator-vs-navcontroller",children:"DestinationsNavigator vs NavController"}),"\n",(0,i.jsxs)(e.p,{children:["Use ",(0,i.jsx)(e.code,{children:"NavController"})," only when you need APIs that are not available on ",(0,i.jsx)(e.code,{children:"DestinationsNavigator"}),". ",(0,i.jsx)(e.code,{children:"DestinationsNavigator"})," is about navigating and managing the back stack with Compose Destinations friendly and type safe APIs.",(0,i.jsx)(e.br,{}),"\n","Besides, it is good practice to not depend directly on ",(0,i.jsx)(e.code,{children:"NavController"})," on your annotated Composables. You should opt to use ",(0,i.jsx)(e.code,{children:"DestinationsNavigator"})," instead, which is an interface wrapper of ",(0,i.jsx)(e.code,{children:"NavController"}),". Making use of this dependency inversion principle allows you to easily pass an empty implementation (one is available already ",(0,i.jsx)(e.code,{children:"EmptyDestinationsNavigator"}),") for previews or a fake for testing."]}),"\n",(0,i.jsx)(e.admonition,{type:"caution",children:(0,i.jsxs)(e.p,{children:["On recent versions of official compose navigation artifact, ",(0,i.jsx)(e.code,{children:"NavController"})," has new ",(0,i.jsx)(e.code,{children:"navigate"})," methods that can take anything. Because of this, our old ",(0,i.jsx)(e.code,{children:"NavController.navigate"})," extension functions that received a ",(0,i.jsx)(e.code,{children:"Direction"})," (similar to ",(0,i.jsx)(e.code,{children:"DestinationsNavigator"}),") had to be removed. Since then, you must use ",(0,i.jsx)(e.code,{children:"DestinationsNavigator"})," to navigate."]})})]})}function h(n={}){const{wrapper:e}={...(0,t.R)(),...n.components};return e?(0,i.jsx)(e,{...n,children:(0,i.jsx)(c,{...n})}):c(n)}},8453:(n,e,a)=>{a.d(e,{R:()=>o,x:()=>r});var i=a(6540);const t={},s=i.createContext(t);function o(n){const e=i.useContext(s);return i.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}function r(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(t):n.components||t:o(n.components),i.createElement(s.Provider,{value:e},n.children)}}}]);