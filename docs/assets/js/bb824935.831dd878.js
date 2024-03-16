"use strict";(self.webpackChunkcompose_destinations_docs=self.webpackChunkcompose_destinations_docs||[]).push([[3524],{8190:(n,e,a)=>{a.r(e),a.d(e,{assets:()=>l,contentTitle:()=>s,default:()=>v,frontMatter:()=>o,metadata:()=>r,toc:()=>d});var i=a(4848),t=a(8453);const o={sidebar_position:1},s="Basics",r={id:"navigation/basics",title:"Basics",description:"Navigate to Destinations",source:"@site/docs/navigation/basics.md",sourceDirName:"navigation",slug:"/navigation/basics",permalink:"/v2/navigation/basics",draft:!1,unlisted:!1,editUrl:"https://github.com/raamcosta/compose-destinations-docs/edit/main/docusaurus/docs/navigation/basics.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Arguments from NavHost",permalink:"/v2/arguments/nav-host-parameters"},next:{title:"Navigating back with a result",permalink:"/v2/navigation/backresult"}},l={},d=[{value:"Navigate to Destinations",id:"navigate-to-destinations",level:2},{value:"Navigate to NavGraphs",id:"navigate-to-navgraphs",level:2},{value:"DestinationsNavigator vs NavController",id:"destinationsnavigator-vs-navcontroller",level:2},{value:"Avoiding duplicate navigation",id:"avoiding-duplicate-navigation",level:2}];function c(n){const e={admonition:"admonition",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,t.R)(),...n.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(e.h1,{id:"basics",children:"Basics"}),"\n",(0,i.jsx)(e.h2,{id:"navigate-to-destinations",children:"Navigate to Destinations"}),"\n",(0,i.jsxs)(e.p,{children:["To navigate to a destination you need a ",(0,i.jsx)(e.code,{children:"NavController"})," or a ",(0,i.jsx)(e.code,{children:"DestinationsNavigator"}),".\nBoth are valid arguments for annotated Composables and will be provided by the library at runtime."]}),"\n",(0,i.jsx)(e.admonition,{type:"info",children:(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.code,{children:"DestinationsNavigator"}),' is meant only for navigating from one screen to another. If you need some kind of "top-level navigation" (example: Bottom navigation bar, App drawer, etc) you should use the same ',(0,i.jsx)(e.code,{children:"NavController"})," instance you pass to ",(0,i.jsx)(e.code,{children:"DestinationsNavHost"}),"."]})}),"\n",(0,i.jsx)(e.p,{children:"Then you can:"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-kotlin",children:"navigator.navigate(GreetingScreenDestination)\n\n// OR using NavController.navigate extension function\n\nnavController.navigate(GreetingScreenDestination)\n"})}),"\n",(0,i.jsx)(e.p,{children:"Or if the destination has navigation arguments:"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-kotlin",children:'// All arguments will be available in the invoke function, including the default values\nnavigator.navigate(ProfileScreenDestination(id = 1, groupName = "Kotlin 4ever <3"))\n// OR\nval navArgs = ProfileScreenDestination.NavArgs(id = 1, groupName = "Kotlin 4ever <3")\nnavigator.navigate(ProfileScreenDestination(navArgs))\n'})}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-kotlin",children:'navController.navigate(ProfileScreenDestination(id = 1, groupName = "Kotlin 4ever <3"))\n// OR\nval navArgs = ProfileScreenDestination.NavArgs(id = 1, groupName = "Kotlin 4ever <3")\nnavController.navigate(ProfileScreenDestination(navArgs))\n'})}),"\n",(0,i.jsx)(e.h2,{id:"navigate-to-navgraphs",children:"Navigate to NavGraphs"}),"\n",(0,i.jsx)(e.p,{children:"To navigate to a NavGraph, do:"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-kotlin",children:'navigator.navigate(ProfileNavGraph(id = "some id"))\n\n// OR from within the same module that is declaring it:\n// "NavGraphs" may be prefixed with the module name if that is declared in a ksp config.\n\nnavigator.navigate(NavGraphs.profile(id = "some id"))\n'})}),"\n",(0,i.jsx)(e.p,{children:"Navigating to a nav graph results in navigating to its start route.\nSo what if that start route also has mandatory arguments?\nWell, in that case, Compose Destinations will also require those arguments."}),"\n",(0,i.jsxs)(e.p,{children:["Example: (start route of ProfileGraph, requires ",(0,i.jsx)(e.code,{children:"ProfileMainScreenNavArgs"}),")"]}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-kotlin",children:'navigator.navigate(\n    ProfileNavGraph(\n        id = "some id",\n        startRouteArgs = ProfileMainScreenNavArgs(/*pass in the fields needed*/)\n    )\n)\n'})}),"\n",(0,i.jsxs)(e.ul,{children:["\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsx)(e.p,{children:"If your nav graph doesn't have its own nav arguments, it may still require arguments to be navigated to, if its\nstart route does.\nThis ensures destination arguments will always be present, even if you navigated to its nav graph."}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsx)(e.p,{children:"If the start route of a nav graph is another nav graph which in turn has a start destination\nthat also needs arguments, then you'll be required to pass all those in."}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\n",(0,i.jsx)(e.p,{children:'In a multi module scenario, all arguments part of this "chain" need to be public so that other\nmodules can navigate to your module\'s nav graph.'}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(e.h2,{id:"destinationsnavigator-vs-navcontroller",children:"DestinationsNavigator vs NavController"}),"\n",(0,i.jsxs)(e.p,{children:["It is good practice to not depend directly on ",(0,i.jsx)(e.code,{children:"NavController"})," on your Composables. You can opt to use ",(0,i.jsx)(e.code,{children:"DestinationsNavigator"})," instead, which is an interface wrapper of ",(0,i.jsx)(e.code,{children:"NavController"}),". Making use of this dependency inversion principle allows you to easily pass an empty implementation (one is available already ",(0,i.jsx)(e.code,{children:"EmptyDestinationsNavigator"}),") for previews or a fake for testing."]}),"\n",(0,i.jsx)(e.h2,{id:"avoiding-duplicate-navigation",children:"Avoiding duplicate navigation"}),"\n",(0,i.jsxs)(e.p,{children:["If you dig around official Compose Samples, you will see this pattern of checking the state of the current ",(0,i.jsx)(e.code,{children:"NavBackStackEntry"})," and only navigating if it is ",(0,i.jsx)(e.code,{children:"RESUMED"}),". ",(0,i.jsx)(e.code,{children:"DestinationsNavigator"})," can avoid duplicate navigation calls by using this same pattern under the hood if you simply pass ",(0,i.jsx)(e.code,{children:"onlyIfResumed = true"})," to the navigate call like this:"]}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-kotlin",children:"navigator.navigate(ProfileScreenDestination(id = 1), onlyIfResumed = true)\n"})})]})}function v(n={}){const{wrapper:e}={...(0,t.R)(),...n.components};return e?(0,i.jsx)(e,{...n,children:(0,i.jsx)(c,{...n})}):c(n)}},8453:(n,e,a)=>{a.d(e,{R:()=>s,x:()=>r});var i=a(6540);const t={},o=i.createContext(t);function s(n){const e=i.useContext(o);return i.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}function r(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(t):n.components||t:s(n.components),i.createElement(o.Provider,{value:e},n.children)}}}]);