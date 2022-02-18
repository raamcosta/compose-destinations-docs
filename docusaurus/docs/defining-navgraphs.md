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

The above approach is simple and works for most apps that:
- only have a single `DestinationsNavHost` call
- don't need multiple levels of nested navigation graphs (since each destination can only either belong to the "root" nav graph or belong to a nested nav graph which is a direct child of "root").

If your app has needs that don't align with these restrictions or if you prefer to have more control, you can manually instantiate `NavGraph`s which (as shown above) is just a normal data class.
If you do this, we recommend having a globally accessible object containing the `NavGraph`s since they don't contain any state and you can easily pass them to the `DestinationNavHost` calls, check if certain `Destination` belongs to some graph, get the `Destination` corresponding to a `NavBackStackEntry`, etc. 

That said, you are free to organize them as you prefer. In a big app, it may be better to have multiple of these `NavGraph`s aggregator objects, for example. You can even instantiate this class just as you pass it to `DestinationsNavHost`!

Also, it won't make sense for the library to be generating the `NavGraphs` object anymore. You should disable it adding this into your module's `build.gradle`:

```gradle
ksp {
    arg("compose-destinations.generateNavGraphs", "false")
}
```

If you disable this task, Compose Destinations will print some warnings if you are using "navGraph" or "start" in any `@Destination` annotation (since these will be ignored).

## "Vanilla NavHosts"

Finally, you can opt to not use `DestinationsNavHost`. This approach is described in more details [here](navhosts#vanilla-navhosts).
By doing that, you will be defining the Navigation graphs of the `NavHost` while dealing with arguments, and calling the Composables.

In the end, the fact that we included this approach in both sections speaks to why we believe it's not the best approach: you are dealing with multiple concerns and you lose a way to quickly check (both at runtime and by looking at the code) how the Navigation graphs of your app are defined.