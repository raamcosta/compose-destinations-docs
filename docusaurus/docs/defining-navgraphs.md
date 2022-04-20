---
sidebar_position: 7
---

# Defining your Navigation Graphs

In Compose Destinations, we have an interface that defines a navigation graph in its most simple form.
Here is what it looks like:

```kotlin
interface NavGraphSpec: Direction, Route {

    override val route: String

    val startRoute: Route

    val destinationsByRoute: Map<String, DestinationSpec<*>>

    val nestedNavGraphs: List<NavGraphSpec> get() = emptyList()
}
```

:::note

When running in "single-module" mode, KSP will also generate a `NavGraph` data class
that implements the above interface but exposes the generated sealed version of `DestinationSpec`
instead.

:::

**By default**, all your destinations will belong to a `NavGraph` we call "root". This `NavGraph` instance will be generated in an object called `NavGraphs`. So, you can access it via `NavGraphs.root` and you should pass it into `DestinationsNavHost` call.
In some situations, however, you might want to:

1. Group some of your destinations in nested navigation graphs.
2. Have multiple top-level (or "root") navigation graphs, so you can use each one in different `DestinationsNavHost` Composables.

## Generating navigation graphs

### Through @NavGraph annotations

To define a navigation graph, you need to create an annotation class annotated with `@NavGraph`. For example:

```kotlin
@NavGraph
annotation class SettingsNavGraph(
    val start: Boolean = false
)
```

Note the `start` parameter. It is mandatory and it is enforced at compile time. The `NavGraph` annotation has two parameters: 
- `default` : if true, then all `@Destination` Composable functions that don't specify a navigation graph, will belong to it. There is a `@RootNavGraph` in the core library that by default takes this role if no other sets `default = true`.
There can only be one default navigation graph per module. This is enforced at compile time.
- `route` : the route of the navigation graph. By default, the name of the annotation class will be used (without 'NavGraph') suffix and in snake case.

To make destinations part of this navigation graph, you need to annotate them with it!

```kotlin
@SettingsNavGraph(start = true)
@Destination
@Composable
fun SettingsMainScreen()
```

Remember the `start` parameter? You can use it on the destination you wish to use as the start destination of that navigation grahp.

To this navigation graph nested in some other navigation graph, annotate it with the parent's annotation!

```kotlin
@RootNavGraph
@NavGraph
annotation class SettingsNavGraph(
    val start: Boolean = false
)
```

This makes `settings` a nested navigation graph of `root`. It's that simple. If you don't set any parent of a navigation graph, then it will be a "top-level" one, ideal to pass to a `DestinationsNavHost` call.

You can also make nested navigation graphs the start of a parent navigation graph. Just as you do with destinations, you only need to use `start = true`:

```kotlin
@RootNavGraph(start = true)
@NavGraph
annotation class YourNavGraph(
    val start: Boolean = false
)
```

This makes `your` nav graph be nested in `root` and be its starting route.

<div style={{textAlign: 'center'}}>
...
</div>

<!-- I'm still on Compose and this is a vertical Spacer 💪 (yeah I'm that good at web dev) -->
<div style={{textAlign: 'center', padding: 15}}> 
</div>

With this mechanism of making navigation graphs and use their annotations to annotate either nested navigation graphs or the destinations that should belong to it, you can make an entire graph in any way you may want.

The most common use case, is to create nested navigation graphs inside root (like in the above `SettingsNavGraph` example) and pass `NavGraphs.root` to `DestinationsNavHost`. This way, all destinations and navgraphs belong to the root one, and they get registered in the `DestinationsNavHost` call.

### (DEPRECATED) Through @Destination annotation

By default, Compose Destinations reads info from your `@Destination` annotations to build the `NavGraphs` object.
If you want some screens to be part of a nested navigation graph, you can use the `navGraph` argument of `@Destination` annotation:

```kotlin
@Destination(
    navGraph = "settings",
    start = true
)
@Composable
fun SettingsScreen() { /*...*/ }
```

All annotated Composables with the same "navGraph" argument will then belong to this navigation graph. You can access its properties with `NavGraphs.[yourNavGraphName]`. You can navigate to the graph itself with `destinationsNavigator.navigate(NavGraphs.[yourNavGraphName])`. 

Each navigation graph needs one and only one start destination. A compile check is in place to enforce this. You can define that with the "start" argument (as seen in the above example).

## Manually defining navigation graphs

You can also manually define navigation graphs by instantiating `NavGraphSpec`s which, as shown above, is just a normal interface. If your app is multi module, you'll likely have to do it, so that you can gather all destinations / nav graphs from other modules into a single "top-level" navigation graph to pass to `DestinationsNavHost` call.
If you do this, we recommend having a globally accessible object containing the nav graphs since they don't contain any state and you can easily pass them to the `DestinationNavHost` calls, check if certain `Destination` belongs to some graph, get the `Destination` corresponding to a `NavBackStackEntry`, etc. 

That said, you are free to organize them as you prefer. In a big app, it may be better to have multiple of these `NavGraph`s aggregator objects, for example. You can even instantiate this class just as you pass it to `DestinationsNavHost`!

Also, it won't make sense for the library to be generating the `NavGraphs` object anymore. You should disable it adding this into your module's `build.gradle`:

```gradle
ksp {
    arg("compose-destinations.generateNavGraphs", "false")
}
```

If you disable this task, Compose Destinations will print some warnings if you are using `@NavGraph` annotations in any `@Destination` annotation (since these will be ignored).

## "Vanilla NavHosts"

Finally, you can opt to not use `DestinationsNavHost`. This approach is described in more details [here](navhosts#vanilla-navhosts).
By doing that, you will be defining the Navigation graphs of the `NavHost` while dealing with arguments, and calling the Composables.

In the end, the fact that we included this approach in both sections speaks to why we believe it's not the best approach: you are dealing with multiple concerns and you lose a way to quickly check (both at runtime and by looking at the code) how the Navigation graphs of your app are defined.