"use strict";(self.webpackChunkcompose_destinations_docs=self.webpackChunkcompose_destinations_docs||[]).push([[382],{3905:(e,n,t)=>{t.d(n,{Zo:()=>c,kt:()=>h});var a=t(7294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function r(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,a,o=function(e,n){if(null==e)return{};var t,a,o={},i=Object.keys(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var l=a.createContext({}),p=function(e){var n=a.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):r(r({},n),e)),t},c=function(e){var n=p(e.components);return a.createElement(l.Provider,{value:n},e.children)},d="mdxType",m={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},u=a.forwardRef((function(e,n){var t=e.components,o=e.mdxType,i=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),d=p(t),u=o,h=d["".concat(l,".").concat(u)]||d[u]||m[u]||i;return t?a.createElement(h,r(r({ref:n},c),{},{components:t})):a.createElement(h,r({ref:n},c))}));function h(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var i=t.length,r=new Array(i);r[0]=u;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s[d]="string"==typeof e?e:o,r[1]=s;for(var p=2;p<i;p++)r[p]=t[p];return a.createElement.apply(null,r)}return a.createElement.apply(null,t)}u.displayName="MDXCreateElement"},7062:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>r,default:()=>m,frontMatter:()=>i,metadata:()=>s,toc:()=>p});var a=t(3117),o=(t(7294),t(3905));const i={sidebar_position:2},r="Non-navigation parameters",s={unversionedId:"destination-arguments/navhost-level-parameters",id:"version-1.x/destination-arguments/navhost-level-parameters",title:"Non-navigation parameters",description:"Besides things that the previous screen can pass to the next one, Composable destinations can also make use of certain components usually passed in from the NavHost call level (even when using vanilla Compose Navigation).",source:"@site/versioned_docs/version-1.x/destination-arguments/navhost-level-parameters.md",sourceDirName:"destination-arguments",slug:"/destination-arguments/navhost-level-parameters",permalink:"/destination-arguments/navhost-level-parameters",draft:!1,editUrl:"https://github.com/raamcosta/compose-destinations-docs/edit/main/docusaurus/versioned_docs/version-1.x/destination-arguments/navhost-level-parameters.md",tags:[],version:"1.x",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Navigation arguments",permalink:"/destination-arguments/navigation-arguments"},next:{title:"Basics",permalink:"/navigation/basics"}},l={},p=[{value:"Manually call your screen Composable",id:"manually-call-your-screen-composable",level:3},{value:"Use <code>dependenciesContainerBuilder</code> to prepare dependencies",id:"use-dependenciescontainerbuilder-to-prepare-dependencies",level:3}],c={toc:p},d="wrapper";function m(e){let{components:n,...t}=e;return(0,o.kt)(d,(0,a.Z)({},c,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"non-navigation-parameters"},"Non-navigation parameters"),(0,o.kt)("p",null,"Besides things that the previous screen can pass to the next one, Composable destinations can also make use of certain components usually passed in from the NavHost call level (even when using vanilla Compose Navigation).\nCompose Destinations supports some of these out of the box:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("inlineCode",{parentName:"p"},"NavController")," (or ",(0,o.kt)("inlineCode",{parentName:"p"},"NavHostController"),") - If part of the Composable function parameters, Compose Destinations will pass in the ",(0,o.kt)("inlineCode",{parentName:"p"},"NavController")," used in the ",(0,o.kt)("inlineCode",{parentName:"p"},"DestinationsNavHost"),".")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("inlineCode",{parentName:"p"},"DestinationsNavigator")," - This is an interface wrapper around ",(0,o.kt)("inlineCode",{parentName:"p"},"NavController")," useful for inverting the dependency in the ",(0,o.kt)("inlineCode",{parentName:"p"},"NavController"),". This enables your Composable to be testable and previewable since you can just pass an empty implementation (one is available out of the box ",(0,o.kt)("inlineCode",{parentName:"p"},"EmptyDestinationsNavigator"),"). Read more in the ",(0,o.kt)("a",{parentName:"p",href:"../navigation/basics"},"navigation section"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("inlineCode",{parentName:"p"},"NavBackStackEntry")," - the back stack entry correspondent to the destination composable. You should avoid depending on this directly.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("inlineCode",{parentName:"p"},"ResultBackNavigator")," / ",(0,o.kt)("inlineCode",{parentName:"p"},"ResultRecipient")," - needed for sending results back from a destination to the previous one. Read more ",(0,o.kt)("a",{parentName:"p",href:"../navigation/backresult"},"here")))),(0,o.kt)("p",null,"Even though most screen Composables will only need their navigation arguments and some of the components mentioned above, if you have a scenario where you need to pass something else, you can:"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"#manually-call-your-screen-composable"},"1. Manually call your screen Composable, which is made super easy by the library"),(0,o.kt)("br",{parentName:"p"}),"\n","This is the preferred way if you want to send something that is tied to Compose runtime (f.ex a ",(0,o.kt)("inlineCode",{parentName:"p"},"State<Something>"),"). The other approach uses a ",(0,o.kt)("inlineCode",{parentName:"p"},"Map<Class<[Component]>, [Component]>")," so if ",(0,o.kt)("inlineCode",{parentName:"p"},"Component")," changes your screen won't be recomposed. Also, it is a bit type safer since you are the one calling the Composable function."),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"#use-dependenciescontainerbuilder-to-prepare-dependencies"},"2. Use ",(0,o.kt)("inlineCode",{parentName:"a"},"dependenciesContainerBuilder")," to prepare certain components to certain/all screens"),(0,o.kt)("br",{parentName:"p"}),"\n","This is simpler if you want to make some component available to multiple screens. It should only be used for passing dependencies which are static for the lifetime of your screens (example: ",(0,o.kt)("inlineCode",{parentName:"p"},"ViewModels"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"ScaffoldState"),", etc)."),(0,o.kt)("admonition",{type:"caution"},(0,o.kt)("p",{parentName:"admonition"},"If your annotated Composable has parameters that Compose Destinations cannot provide, are not navigation arguments and you did not provide them via one of the above approaches, the app will crash at runtime when you navigate to that screen.")),(0,o.kt)("h3",{id:"manually-call-your-screen-composable"},"Manually call your screen Composable"),(0,o.kt)("p",null,"The ",(0,o.kt)("inlineCode",{parentName:"p"},"DestinationsNavHost")," call has a ",(0,o.kt)("inlineCode",{parentName:"p"},"manualComposableCallsBuilder")," which can be used to manually call some ",(0,o.kt)("inlineCode",{parentName:"p"},"Destination")," Composables:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-kotlin"},'// Just as an example of something you might want to send to some destinations\nval scaffoldState = rememberScaffoldState()\n\nDestinationsNavHost(\n    navGraph = NavGraphs.root\n) {\n    composable(SomeScreenDestination) { //this: DestinationScope<SomeScreenDestination.NavArgs>\n        SomeScreen(\n            arg1 = navArgs.arg1, // navArgs is a lazily evaluated `SomeScreenDestination.NavArgs` instance, field of `DestinationScope`\n            navigator = destinationsNavigator, // destinationsNavigator is a `DestinationsNavigator` (also lazily evaluated)\n            backStackEntry = navBackStackEntry, // navBackStackEntry is a `DestinationScope` field\n            scaffoldState = scaffoldState,\n            resultBackNavigator = resultBackNavigator(), // needed if "SomeScreen" needs to send argument back to previous screen\n            resultRecipient = resultRecipient(), // needed if "SomeScreen" needs to receive results from a forward screen\n        )\n    }\n}\n')),(0,o.kt)("admonition",{type:"note"},(0,o.kt)("p",{parentName:"admonition"},"Notice you don't need to manually call all destinations. The ",(0,o.kt)("inlineCode",{parentName:"p"},"NavHost")," will be filled with all destinations and nested navigation graphs of ",(0,o.kt)("inlineCode",{parentName:"p"},"NavGraphs.root"),".")),(0,o.kt)("p",null,"This feature makes sure you have all control you need in some less common cases.\nWhen some destination gets navigated to, if you are manually calling it here in the ",(0,o.kt)("inlineCode",{parentName:"p"},"DestinationsNavHost")," then the library will call your composable function with the navigation arguments (if the destination has navigation arguments). If you are not, the library will call your annotated Composable instead."),(0,o.kt)("admonition",{title:"animations",type:"info"},(0,o.kt)("p",{parentName:"admonition"},"If you're using animations, you might want to use ",(0,o.kt)("inlineCode",{parentName:"p"},"animatedComposable")," or ",(0,o.kt)("inlineCode",{parentName:"p"},"bottomSheetComposable")," if you need the ",(0,o.kt)("inlineCode",{parentName:"p"},"AnimatedVisibilityScope")," or the ",(0,o.kt)("inlineCode",{parentName:"p"},"ColumnScope")," receivers respectively. These scopes are given by the respective Accompanist library. If you don't need them, you can still use ",(0,o.kt)("inlineCode",{parentName:"p"},"composable")," function like in the example above.")),(0,o.kt)("h3",{id:"use-dependenciescontainerbuilder-to-prepare-dependencies"},"Use ",(0,o.kt)("inlineCode",{parentName:"h3"},"dependenciesContainerBuilder")," to prepare dependencies"),(0,o.kt)("p",null,"If you have some dependencies which you want to make available to all or multiple destinations, you can leverage this ",(0,o.kt)("inlineCode",{parentName:"p"},"DestinationsNavHost")," parameter to prepare them."),(0,o.kt)("p",null,"For example, if you wanted to make ",(0,o.kt)("inlineCode",{parentName:"p"},"ScaffoldState")," available to all annotated Composables, you could just do:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-kotlin"},"val scaffoldState = rememberScaffoldState()\n\nDestinationsNavHost(\n    dependenciesContainerBuilder = { //this: DependenciesContainerBuilder<*>\n        dependency(scaffoldState)\n    }\n)\n")),(0,o.kt)("p",null,'This lambda will be called everytime a new screen is navigated to to let you prepare components safely scoped to that screen only, since this "container" will not live behond the screen that is navigated to.'),(0,o.kt)("p",null,"After this, you can just add a ",(0,o.kt)("inlineCode",{parentName:"p"},"ScaffoldState")," typed parameter in any annotated Composable, and the library will provide it."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-kotlin"},"@Destination\n@Composable\nfun MyScreen(\n    scaffoldState: ScaffoldState\n) { /*...*/ }\n")),(0,o.kt)("p",null,"If you want to provide dependencies to a specific Destination or a specific navigation graph (i.e all destinations that are direct children), you can do:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-kotlin"},'val scaffoldState = rememberScaffoldState()\n\nDestinationsNavHost(\n    dependenciesContainerBuilder = { //this: DependenciesContainerBuilder<*>\n        // \ud83d\udc47 Provides scaffoldState to "YourSpecificDestination"\n        dependency(YourSpecificDestination) { scaffoldState }\n\n        // \ud83d\udc47 Provides SettingsViewModel scoped to the "settings" nav graph to all\n        // destinations who request it and are direct children of "settings" nav graph\n        dependency(NavGraphs.settings) {\n            val parentEntry = remember(navBackStackEntry) {\n                navController.getBackStackEntry(NavGraphs.settings.route)\n            }\n            viewModel<SettingsViewModel>(parentEntry)\n        }\n    }\n)\n')),(0,o.kt)("admonition",{type:"info"},(0,o.kt)("p",{parentName:"admonition"},(0,o.kt)("inlineCode",{parentName:"p"},"dependenciesContainerBuilder")," lambda is scoped in a ",(0,o.kt)("inlineCode",{parentName:"p"},"DependenciesContainerBuilder")," which is also a ",(0,o.kt)("inlineCode",{parentName:"p"},"DestinationScope"),". So, everything we have available ",(0,o.kt)("a",{parentName:"p",href:"#manually-call-your-screen-composable"},"when manually calling a Composable screen"),", you also have here, including a ",(0,o.kt)("inlineCode",{parentName:"p"},"destination")," with the ",(0,o.kt)("inlineCode",{parentName:"p"},"DestinationSpec")," that is being navigated to.",(0,o.kt)("br",{parentName:"p"}),"\n","This enables you to make decisions here and have dependencies only available to specific destinations or specific navigation graphs or any other case you might have.")))}m.isMDXComponent=!0}}]);