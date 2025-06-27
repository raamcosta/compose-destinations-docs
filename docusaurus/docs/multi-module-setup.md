---
sidebar_position: 11
---

# Multi module setup

If your application is split in multiple "vertical" / "feature" modules, then you'll want to let feature modules use their own navigation logic and exposing navigation graphs so that your "main" module can get all of these graphs and include them in a top level graph to call `DestinationsNavHost` with.

In the next sections, we'll see how to achieve this with Compose Destinations. We'll be talking about these two kinds of modules "feature module" and "DestinationsNavHost module", but you can take these same concepts for any sort of relationship between two modules where one module is being depended on by another.

For example:
 - Your feature module A depends on modules B and C.
 - Modules B and C expose their own nav graphs. (in this case these would be the "feature modules" since they are depended on by Module A)
 - Module A prepares "ModuleAGraph" by including B and C graphs, and possibly adding more destinations / nested graphs of its own.
 - Main module includes the "ModuleAGraph" without ever depending or knowing about B and C.


## Feature module

### Gradle setup

Both of these are not mandatory, but they are recommended:

```kotlin
ksp {
    // used on some of the generated code, including default package name
    arg("compose-destinations.moduleName", "profile")
    // and if you want to generate mermaid graph files for this module's graphs: 
    // (ideally use the same path for all modules, so that navigation in the html works well)
    arg("compose-destinations.htmlMermaidGraph", "$rootDir/navigation-docs")
    arg("compose-destinations.mermaidGraph", "$rootDir/navigation-docs")
}
```

### Exposing nav graphs

Usually a feature module wants to expose one or more navigation graphs. These will be included (nested) in some other graph of the module that depends on it.

Here is how to do it:

```kotlin
@NavGraph<ExternalModuleGraph>
internal annotation class ProfileGraph
```

**Notice** the `ExternalModuleGraph` which is a special annotation to be used specifically on this case when this module doesn't actually know what will be the parent of `ProfileGraph`.

And use it in any Composable destination or nav graph (if you want to have some graph nested on this one).

```kotlin
/*public*/ data class ProfileNavGraphs(val id: String)

@Destination<ProfileGraph>(
    start = true,
    navArgs = ProfileNavGraphs::class,
    visibility = CodeGenVisibility.INTERNAL
)
@Composable
internal fun MainProfileScreen() { /*...*/ }

@NavGraph<ProfileGraph>(visibility = CodeGenVisibility.INTERNAL)
internal annotation class ProfileSettingsGraph
```

**Notice** all the `internal`s used as well as `CodeGenVisibility.INTERNAL`. You'll probably want to reduce what you're exposing to other modules by keeping only the generated `ProfileNavGraph` (in this example) itself public. Nested graphs also don't need to be public.

If your nav graph or start destination (or both!) have navigation arguments, then these also need to be public since they're part of this module's API. Other modules need to use them to navigate to this module's graph.

### Exposing destinations

On some less common setups, you may want to expose destinations.

To do that, do:

```kotlin
@Destination<ExternalModuleGraph>
@Composable
fun MyScren() { /*...*/ }
```

**Notice** the `ExternalModuleGraph` which is a special annotation to be used specifically on this case when this module doesn't actually know what will be the parent of `MyScren` destination.

### Receive NavHost parameters

As pointed out [here](arguments/nav-host-parameters), you'll often have to pass stuff from your `DestinationsNavHost` call.
This may happen even more if your feature modules don't know about each other, since when you want to navigate to another feature, you won't have any direct way of doing so, so the tying party will be the "`DestinationsNavHost` module" since it knows about all others.

To do this, your feature module should expose some "setup" functions, depending if it needs to manually call some of its Composables, or just pass dependencies or both. These two ways are also described [here](arguments/nav-host-parameters).

```kotlin
package my.pckg.feature.profile

interface ExternalNavigator {
    fun navigateToFeatureX(arg1: String)
    
    fun navigateToFeatureY()
}

@Composable
fun DependenciesContainerBuilder<*>.ProfileDependencies(
    externalNavigator: ExternalNavigator
) {
    dependency(externalNavigator)
}

fun ManualComposableCallsBuilder.profileManualCalls(
    // something you want to pass to screens this way
) {
    composable(ProfileAccountSettingsDestination) {
        // if you need to mix these two ways and get dependencies passed in via the above ProfileDependencies
        val dependencies = buildDependencies()
        ProfileAccountSettings(
            externalNavigator = dependencies.require(),
            onOnboardingFinished = onOnboardFinished
        )
    }
}
```

Notes about above example:

1. Most likely, you don't need both "dependencies" and "manual calls". One of the two as explained in the nav host parameters page, should be enough. But, it's totally fine if you need both.
2. I've used an interface for the navigator that can navigate to external destinations/graphs. You can also pass lambdas, although in that case you'd have to use manual calls and call all the composables that need those lambdas.  
With the `ProfileDependencies` method, we are making this navigator available to all destinations of this module. They just need to request for it, and the library will provide it.
3. You can remove `@Composable` from `ProfileDependencies` if you don't need it to access any composition locals or any compose API.
4. The `DestinationsNavHost` module should call these functions to provide all dependencies, as we'll see later in this page. 

## "DestinationsNavHost module"

### Import nav graphs

To import nav graphs from other modules, nesting them to a graph of the current module, do:

```kotlin
@NavHostGraph
annotation class MainGraph {

    @ExternalNavGraph<FeatureXNavGraph>
    @ExternalNavGraph<ProfileNavGraph>
    @ExternalNavGraph<LoginNavGraph>(start = true)
    companion object Includes
}
```

This would include `FeatureXNavGraph` and `ProfileNavGraph` as nested on this "main" graph. The example uses `NavHostGraph` but you can do this in any nav graph, even if it's itself nested on another one.

`ExternalNavGraph` is an annotation that contains some parameters you can use to configure or add/override some of the details of what you're including with it (like the `start` we see on the example):

* `start` - defines this navigation graph as the start of the navigation graph it is being included on.
* `deepLinks` - adds `DeepLink`s to this nav graph. Both these and the deep links defined on the declaring module (if any) can be used to navigate to this nav graph
* `defaultTransitions` - overrides animations set on the declaring module (if any).

:::note
You can use this `MainGraph` annotation to include other destinations / graphs that are defined in the same module as itself.
:::

### Import destinations

To import destinations from another module, do:

```kotlin
@NavHostGraph
annotation class MainGraph {
    
    @ExternalDestination<AnotherModuleDestination>
    companion object Includes
}
```

This will include `AnotherModuleDestination` in the "main" graph.

`ExternalDestination` is an annotation that contains some parameters you can use to customize or add/override some aspects of what you're including with it:

* `start` - defines this destination as the start of the navigation graph it is being included on.
* `deepLinks` - adds `DeepLink`s to this destination. Both these and the deep links defined on the declaring module (if any) can be used to navigate to this destination.
* `style` - overrides `DestinationStyle` for this destination. The defined style on the declaring module will be ignored.
* `wrappers` - adds `DestinationWrapper`. Both these and the ones defined on the declaring module will be applied.

:::important
Generated Destinations contain navigation stuff like the route. Routes should be unique. So you cannot import another module's Destination to more than one graph.  
So, if you find yourself wanting to do this, you should instead expose the actual Composable, untied from any navigation stuff, then preparing multiple `@Destination` Composables that just call that one.  
:::

### Call `DestinationsNavHost`

Following the example above, where we've setup a `MainGraph`, this will generate a `MainNavGraph` object containing nav graphs and destinations included by both the `External` annotations and all the destinations and graphs of this same module using it.

You should use it to pass to `DestinationsNavHost`:

```kotlin
DestinationsNavHot(
    navGraph = NavGraphs.main // or just MainNavGraph
)
```

#### Send NavHost parameters

If any of your feature modules expect "nav host" parameters, you should also call their "setup" functions at this point. For example:

```kotlin
val navController = rememberNavController()

DestinationsNavHost(
    navGraph = NavGraphs.main,
    navController = navController,
    // for calling DependenciesContainerBuilder functions, following this page's examples
    dependenciesContainerBuilder = {
        navGraph(ProfileNavGraph) {
            val externalNavigator = remember(navBackStackEntry) {
                createExternalNavigator(navController)
            }
            ProfileDependencies(externalNavigator)
        }
    }
) {
    // for calling ManualComposableCallsBuilder functions, following this page's examples
    profileManualCalls(/*whatever you need to pass here*/)
}
```
