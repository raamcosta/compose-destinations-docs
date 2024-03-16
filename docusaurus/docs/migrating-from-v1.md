---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Migrating from v1

Follow these steps to migrate from v1. 

Please, if you find you had to do something which is not covered in this page or it's not clear,
open an issue on [here](https://github.com/raamcosta/compose-destinations), [here](https://github.com/raamcosta/compose-destinations-docs) or write a message on kotlin slack [#compose-destinations channel](https://kotlinlang.slack.com/archives/C06CS4UCQ10).  
You can also quickly open a PR to improve documentation by using "Edit this page" button at the end of each page.

The ones that start with "If", you can skip if you don't meet that criteria. Otherwise expand it and go through the steps explained.

### 1. RootNavGraph annotation was renamed to RootGraph
Going forward, the convention for navigation graph annotations is to call them "SomethingGraph". This will generate "SomethingNavGraph" classes so we end up with different names. Classes in your code can be used for any number of things, so making their name the more specific one makes sense. While nav graph annotations will always be used in the same context, so just "Graph" suffix is enough.

### 2. Destination annotation now requires a navigation graph type argument.
If you're not using any custom navigation graphs, then you just need to add `<RootGraph>` to all `@Destination` usages and delete `@RootNavGraph` annotations.
If you do have custom navigation graph annotations, then use the annotation name instead of "RootGraph".
Example:

<Tabs>
  <TabItem value="v1" label="v1" default>

```kotlin
@Destination
@Composable
fun MyScreen() { /*...*/ }

@RootNavGraph(start = true)
@Destination
@Composable
fun MyStartScreen() { /*...*/ }

@MyGraph(start = true)
@Destination
@Composable
fun AnotherScreen() { /*...*/ }
```
  
</TabItem>
<TabItem value="v2" label="v2">

```kotlin
@Destination<RootGraph>
@Composable
fun MyScreen() { /*...*/ }

@Destination<RootGraph>(start = true)
@Composable
fun MyStartScreen() { /*...*/ }

@Destination<MyGraph>(start = true)
@Composable
fun AnotherScreen() { /*...*/ }
```

  </TabItem>
<TabItem value="diff" label="diff">

```diff
-@Destination
+@Destination<RootGraph>
 @Composable
 fun MyScreen() { /*...*/ }
 
-@RootNavGraph(start = true)
-@Destination
+@Destination<RootGraph>(start = true)
 @Composable
 fun MyStartScreen() { /*...*/ }
 
-@MyGraph(start = true)
-@Destination
+@Destination<MyGraph>(start = true)
 @Composable
 fun AnotherScreen() { /*...*/ }
```

  </TabItem>
</Tabs>

### 3. Small package name and name changes

- `SingleModuleExtensions.kt` file, no longer generated, so:
    - `appDestination()` -> `destination()`
    - `appCurrentDestinationFlow` -> `currentDestinationFlow`
    - `appCurrentDestinationAsState()` -> `currentDestinationAsState()`
    - `startAppDestination` -> `startDestination`
    - `NavGraph` -> `NavGraphSpec`

- `Destination.kt` file is no longer generated, so: (note that replacements are not sealed)
    - sealed `Destination` -> `DestinationSpec` 
    - sealed `DirectionDestination` -> `DirectionDestinationSpec`
    - sealed `TypedDestination<T>` -> `TypedDestinationSpec<T>`

- `rememberAnimatedNavHostEngine` -> `rememberNavHostEngine`
- `navArgsDelegate` parameter of `@Destination` renamed to `navArgs`
- `DestinationSpec<T>` -> `TypedDestinationSpec<T>` 
- `DestinationSpec<*>` -> `DestinationSpec`
- Some core APIs changed package name. If you have some red imports, try deleting the import and importing it again.  
- Generated code is now on `com.ramcosta.composedestinations.generated` package by default, instead of getting the common part of all destination's package names. If you use "moduleName", then that is suffixed to the above package name.
So you will have to either set the current package name used on v1 by the library as your "codeGenPackageName" or, you'll need to re-import all Destinations.

To set the "codeGenPackageName" do this in your build.gradle(.kts) file
```kotlin
    ksp {
        arg("compose-destinations.codeGenPackageName", "your.preferred.package.name") // replace package name!
    }
```

### 4. If using your own NavGraph annotations
<details>
    <summary>Expand</summary>

<h3>Nav graph annotations now requires a parent navigation graph type argument.</h3>

Same as with `@Destination<MyGraph>`, custom navigation graph annotations now need to identify their parent nav graph in its type argument rather than annotating it.

<Tabs>
  <TabItem value="v1" label="v1" default>

```kotlin
@RootNavGraph
@NavGraph
annotation class MyGraph(
    val start: Boolean = false
)

@MyGraph(start = true)
@NavGraph
annotation class AnotherGraph(
    val start: Boolean = false
)
```
  
</TabItem>
<TabItem value="v2" label="v2">

```kotlin
@NavGraph<RootGraph>
annotation class MyGraph

@NavGraph<MyGraph>(start = true)
annotation class AnotherGraph
```

  </TabItem>
</Tabs>

:::info
In the above example (both before and after), we're making a "MyGraph" that is nested in "Root" and a "AnotherGraph" that is nested in "MyGraph" and is its start route.
:::

<h3>Navigation graphs with no parent (used to pass to DestinationsNavHost) should now be annotated with @NavHostGraph</h3>

This will generate a special `NavHostGraph` object which has slightly different characteristics (also the annotation has different parameters) then a normal navigation graph.  
Also, `default` `NavGraph` parameter (which was usually used in these graphs) no longer exists, so you do have to be explicit in all `@Destination` and add the graph you want it to belong to (such as `@Destination<MyGraph>`).

<Tabs>
  <TabItem value="v1" label="v1" default>

```kotlin
@NavGraph(default = true)
annotation class MyMainGraph(
    val start: Boolean = false
)

@MyMainGraph(start = true)
@Destination
@Composable
fun MyStartScreen() { /*...*/ }

@Destination //because default = true on MyMainGraph, when absent, Destination would belong to that graph
@Composable
fun AnotherScreen() { /*...*/ }
```
  
</TabItem>
<TabItem value="v2" label="v2">

```kotlin
@NavHostGraph
annotation class MyMainGraph

@Destination<MyMainGraph>(start = true)
@Composable
fun MyStartScreen() { /*...*/ }

@Destination<MyMainGraph>
@Composable
fun AnotherScreen() { /*...*/ }
```

  </TabItem>
</Tabs>

</details>

### 5. If using bottom sheet destinations
<details>
    <summary>Expand</summary>

<h3>Animations core is now a bottom sheet that you add alongside the core, not instead of.</h3>

So the core dependency should now be:

```kotlin
ksp("io.github.raamcosta.compose-destinations:ksp:<version>")
implementation("io.github.raamcosta.compose-destinations:core:<version>")
```

And when using bottom sheet destinations, add also this one:

```kotlin
implementation("io.github.raamcosta.compose-destinations:bottom-sheet:<version>")
```
</details>

### 6. If you have set "compose-destinations.mode" on gradle ksp config

<details>
    <summary>Expand</summary>

There's no "mode" anymore. Let's talk about each mode we had on v1:

<h3>"destinations"</h3>

You can set "generateNavGraphs" to false to have a similar output for that module

```kotlin
ksp {
    arg("compose-destinations.generateNavGraphs", "false")
}
```

The output is slightly different, on v2 there's an object that contains the list of destinations instead of the field list being top level.
You can import all destinations to certain nav graph defined in another module by using `@ExternalModuleDestinations<ModuleDestinationsOutputObject>` in companion object of that nav graph annotation class.


<h3>"navgraphs" & "singlemodule"</h3>

These existed to control generation of certain files that are no longer generated, so if you had these, you should be safe to just delete it.

</details>



### 7. If you have set "compose-destinations.useComposableVisibility" on gradle ksp config

<details>
    <summary>Expand</summary>

The approach on v1 was not great because it wouldn't allow you to have internal Composable with public generated Destination, which is 
what may make sense on some multi module projects.

On v2, you can have any combination though since the annotation lets you control the visibility of the generated Destination.
Example:

```kotlin
@Destination(
    visibility = CodeGenVisibility.INTERNAL // or PUBLIC
)
@Composable
internal fun MyScreen() { /*...*/ }
```

:::note
You can create your own Destination annotations if you want to simplify this for the whole module, like:
```kotlin
@Destination<AnyGraph>(visibility = CodeGenVisibility.INTERNAL)
annotation class InternalDestination<T: Annotation>(
    //copy all fields from Destination annotation you want usages of this one to be able to use, like
    val route: String = COMPOSABLE_NAME,
    val start: Boolean = false,
    val navArgs: KClass<*> = Nothing::class,
    val deepLinks: Array<DeepLink> = [],
    val style: KClass<out DestinationStyle> = DestinationStyle.Default::class,
    val wrappers: Array<KClass<out DestinationWrapper>> = []
)
```
:::

</details>

### 8. If using `route` param Destination annotation

<details>
    <summary>Expand</summary>

Generated destinations class name is now based of the route and not the Composable name. By default, routes are also set based on the composable name, so, by default, there should be no difference. However, if you're setting any manual routes, then the generated Destination object will likely have a different name.
Given this, for those cases, you'll need to change the usages to the new name.

</details>

### 9. If using `DestinationStyle.Runtime`

<details>
    <summary>Expand</summary>

This was removed. Depending on the reason for using it, we have new and better ways to solve the same issue:  
If using it,
- for changing style when using destinations from different modules
    - There's now a way to do that with annotation `@ExternalDestination<MyDestinationFromAnotherModule>(style = MyStyle::class)`
    Example:

```kotlin
// navigation module
@NavHostGraph // or @NavGraph<ParentGraph>
annotation class MyGraph {

    @ExternalDestination<MyDestinationFromAnotherModule>(style = MyStyle::class)
    companion object Includes
}
```

- for other reasons
    - You can use `MyDestination animateWith MyAnimation` or passing in lambdas (as in the official lib) on `manualComposableCallsBuilder` param of DestinationsNavHost

Example:

```kotlin
DestinationsNavHost(
    //...
) {
    // works for default transitions on NavGraphs as well!
    ProfileScreenDestination animateWith MyAnimatedStyle
    // OR
    ProfileScreenDestination.animateWith(
        enterTransition = { /*...*/},
        exitTransition = { /*...*/},
        popEnterTransition = { /*...*/},
        popExitTransition = { /*...*/}
    )
}
```

</details>

### 10. If have any custom implementation of a `DestinationStyle` type

<details>
    <summary>Expand</summary>

`DestinationStyle` is now an abstract class instead of an interface, so extending it requires "()"  
Example:

```kotlin
object ProfileTransitions : DestinationStyle.Animated() {
    //...
}
```

Besides, specifically for `DestinationStyle.Animated`, it has changed to have getters of lambdas rather than functions.
This is because this way it results in more one to one with official APIs and it lets us keep some of them as null (instead of returning null).
Example:

<Tabs>
  <TabItem value="v1" label="v1" default>

```kotlin
object ProfileTransitions : DestinationStyle.Animated {

  override fun AnimatedContentTransitionScope<NavBackStackEntry>.enterTransition(): EnterTransition? {

    return when (initialState.destination()) {
      GreetingScreenDestination ->
        slideInHorizontally(
          initialOffsetX = { 1000 },
          animationSpec = tween(700)
        )
      else -> null
    }
  }

  override fun AnimatedContentTransitionScope<NavBackStackEntry>.exitTransition(): ExitTransition? {

    return when (targetState.destination()) {
      GreetingScreenDestination ->
        slideOutHorizontally(
          targetOffsetX = { -1000 },
          animationSpec = tween(700)
        )
      else -> null
    }
  }
}
```

</TabItem>
<TabItem value="v2" label="v2">

```kotlin
object ProfileTransitions : DestinationStyle.Animated() {

  override val enterTransition: AnimatedContentTransitionScope<NavBackStackEntry>.() -> EnterTransition? = {
    when (initialState.destination()) {
      GreetingScreenDestination ->
        slideInHorizontally(
          initialOffsetX = { 1000 },
          animationSpec = tween(700)
        )
      else -> null
    }
  }

  override val exitTransition: AnimatedContentTransitionScope<NavBackStackEntry>.() -> ExitTransition? = {
    when (targetState.destination()) {
      GreetingScreenDestination ->
        slideOutHorizontally(
          targetOffsetX = { -1000 },
          animationSpec = tween(700)
        )
      else -> null
    }
  }
}
```

  </TabItem>
<TabItem value="diff" label="diff">

```diff
- object ProfileTransitions : DestinationStyle.Animated {
+ object ProfileTransitions : DestinationStyle.Animated() {
 
-    override fun AnimatedContentTransitionScope<NavBackStackEntry>.enterTransition(): EnterTransition? {
-
-        return when (initialState.destination()) {
+    override val enterTransition: AnimatedContentTransitionScope<NavBackStackEntry>.() -> EnterTransition? = {
+        when (initialState.destination()) {
             GreetingScreenDestination ->
                 slideInHorizontally(
                     initialOffsetX = { 1000 },
         }
     }
 
-    override fun AnimatedContentTransitionScope<NavBackStackEntry>.exitTransition(): ExitTransition? {
-
-        return when (targetState.destination()) {
+    override val exitTransition: AnimatedContentTransitionScope<NavBackStackEntry>.() -> ExitTransition? = {
+        when (targetState.destination()) {
             GreetingScreenDestination ->
                 slideOutHorizontally(
                     targetOffsetX = { -1000 },
         }
     }
```

  </TabItem>
</Tabs>


</details>

### 11. If you are defining Nav graph level animations on `rememberAnimatedNavHostEngine` or `rememberNavHostEngine` call

<details>
    <summary>Expand</summary>

On v2 `rememberNavHostEngine` doesn't have these options.
Instead, you can define default animations for navigation graphs at the annotation level or when importing a navigation graph from another module.
Example:

```kotlin
@NavGraph<RootGraph>(
    defaultTransitions = MyAnimatedDestinationStyle::class
)
annotation class MyGraph {

    // or when importing
    @ExternalNavGraph<AnotherModuleGraph>(
        defaultTransitions = MyAnimatedDestinationStyle::class
    )
    companion object Includes

}
```

OR

If you need to have logic on your animations based on any runtime state, you can do so in the `manualComposableCallsBuilder`.  
Example:

```kotlin
DestinationsNavHost(
    //...
) {
    MyGraph.animateWith(
        enterTransition = { /*...*/ },
        exitTransition = { /*...*/ },
        popEnterTransition = { /*...*/ },
        popExitTransition = { /*...*/ },
    )
}

```

</details>

### 12. If you are still using the deprecated "navGraph" param of `Destination` annotation

<details>
    <summary>Expand</summary>

Firstly, create an annotation class for each navigation graph you need, defining `RootGraph` as its parent, like this:

```kotlin
@NavGraph<RootGraph>
annotation class MyGraph

@NavGraph<RootGraph>
annotation class AnotherGraph

//...
```

Then, use those in your destinations.

```kotlin
@Destination<MyGraph>
@Composable
fun MyScreen() { /*...*/ }

@Destination<AnotherGraph>
@Composable
fun AnotherScreen() { /*...*/ }
```
</details>



### 13. If you are passing dependencies via `dependenciesContainerBuilder` param of `DestinationsNavHost` call

<details>
    <summary>Expand</summary>

<Tabs>
  <TabItem value="v1" label="v1" default>

```kotlin
DestinationsNavHost(
    //...
    dependenciesContainerBuilder = {
        dependency(aDependencyForEveryDestination)

        dependency(ProfileScreenDestination) { anotherDependency }
        dependency(ProfileScreenDestination) { someOtherDependency }

        dependency(NavGraphs.settings) {
            val parentEntry = remember(navBackStackEntry) {
                navController.getBackStackEntry(NavGraphs.settings.route)
            }
            viewModel<SettingsViewModel>(parentEntry)
        }   

        dependency(NavGraphs.settings) { anotherDependencyForSettingsGraph }   
    }
)
```
  
</TabItem>
<TabItem value="v2" label="v2">

```kotlin
DestinationsNavHost(
    //...
    dependenciesContainerBuilder = {
        dependency(aDependencyForEveryDestination)

        destination(ProfileScreenDestination) {
             dependency(anotherDependency)
             dependency(someOtherDependency)
        }

        navgraph(NavGraphs.settings) {
            val parentEntry = remember(navBackStackEntry) {
                navController.getBackStackEntry(NavGraphs.settings.route)
            }
            
            dependency(viewModel<SettingsViewModel>(parentEntry))
            dependency(anotherDependencyForSettingsGraph)
        }   
    }
)
```
  </TabItem>

  <TabItem value="diff" label="diff">

```diff
DestinationsNavHost(
     //...
     dependenciesContainerBuilder = {
         dependency(aDependencyForEveryDestination)
-
-        dependency(ProfileScreenDestination) { anotherDependency }
-        dependency(ProfileScreenDestination) { someOtherDependency }
-
-        dependency(NavGraphs.settings) {
+    
+        destination(ProfileScreenDestination) {
+            dependency(anotherDependency)
+            dependency(someOtherDependency)
+        }
+    
+        navgraph(NavGraphs.settings) {
             val parentEntry = remember(navBackStackEntry) {
                 navController.getBackStackEntry(NavGraphs.settings.route)
             }
-            viewModel<SettingsViewModel>(parentEntry)
-        }
-
-        dependency(NavGraphs.settings) { anotherDependencyForSettingsGraph }
+    
+            dependency(viewModel<SettingsViewModel>(parentEntry))
+            dependency(anotherDependencyForSettingsGraph)
+        }
     }
 )
```

  </TabItem>
</Tabs>

</details>

### 14. If using "routedIn", "within" or "withDeepLinks" APIs

<details>
    <summary>Expand</summary>

These APIs were removed on v2. There are new and better ways to achieve the same thing.

<h4>To import destinations from another module while setting different deep links</h4>

```kotlin
@NavGraph<RootGraph>
annotation class MyGraph {

    @ExternalDestination<AnotherModuleDestination>(
        deepLinks = [
            DeepLink(uriPattern = "..."),
            DeepLink(uriPattern = "...")
        ]
    )
    companion object Includes
}
```

<h4>To have a destination be part of multiple graphs</h4>

You can use multiple `@Destination<Graph>` in your Composable. Compose Destinations will generate a Destination for each `Destination` annotations, in this case, preffixing the Destination class name with the name of the graph.

```kotlin
@Destination<GraphOne>
@Destination<GraphTwo>
@Composable
fun MyScreen() { /*...*/ }
```
This would generate a `GraphOneMyScreenDestination` and a `GraphTwoMyScreenDestination`.

:::info Multi module case
Note that a Destination generated on module A cannot be imported to multiple nav graphs of module B. If you find yourself wanting to do this, consider
removing Compose Destinations from module A and just exposing a normal Composable. Then on module B you can create a Composable annotated with multiple `Destination` (like the example above) and just call module A's Composable.
:::
</details>

### 15. If implementing `NavGraphSpec` in a multi module setup to aggregate graphs and destinations from other modules

<details>
    <summary>Expand</summary>

There's no longer a need to do that, in fact, you shouldn't. Because doing it that way, won't let Compose Destinations know at compile
time how the navigation graphs look like, and so, it cannot be as helpful.

So, on v2, if you want to include destinations or navigation graphs from other modules in a graph called "MainNavGraph", you should do:

```kotlin
@NavHostGraph
annotation class MainGraph {

    @ExternalNavGraph<FeatureXNavGraph>
    @ExternalModuleDestinations<SomeModuleDestinations>
    @ExternalDestination<AnotherModuleDestination>
    companion object Includes
}
```

:::note Above example
- Assumes you want to pass MainNavGraph to DestinationsNavHost, otherwise you could also use `@NavGraph<RootGraph>` instead of `@NavHostGraph`
- On all `ExternalNavGraph`, `ExternalDestination` and `ExternalModuleDestinations`, you can call the annotation's constructor to override (or add depending on the field) stuff like deep links, wrappers, default animations etc.
- The most common and better way to split navigation graphs on modules is to have feature modules espose a single NavGraph (internally it can contain multiple others) and import it here with `@ExternalNavGraph` as seen above. Other annotations on above example should be less common practices.
:::


</details>
