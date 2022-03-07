---
sidebar_position: 2
---

# Non-navigation parameters

Besides things that the previous screen can pass to the next one, Composable destinations can also make use of certain components usually passed in from the NavHost call level (even when using vanilla Compose Navigation).
Compose Destinations supports some of these out of the box:

- `NavController` (or `NavHostController`) - If part of the Composable function parameters, Compose Destinations will pass in the `NavController` used in the `DestinationsNavHost`.

- `DestinationsNavigator` - This is an interface wrapper around `NavController` useful for inverting the dependency in the `NavController`. This enables your Composable to be testable and previewable since you can just pass an empty implementation (one is available out of the box `EmptyDestinationsNavigator`). Read more in the [navigation section](../navigation/basics)

- `NavBackStackEntry` - the back stack entry correspondent to the destination composable. You should avoid depending on this directly.

- `ResultBackNavigator` / `ResultRecipient` - needed for sending results back from a destination to the previous one. Read more [here](../navigation/backresult)

Even though most screen Composables will only need their navigation arguments and some of the components mentioned above, if you have a scenario where you need to pass something else, you can:

[1. Manually call your screen Composable, which is made super easy by the library:](#manually-call-your-screen-composable)  
This is the preferred way if you want to send something that is tied to Compose runtime (f.ex a `State<Something>`). The other approach uses a `Map<Class<[Component]>, [Component]>` so if `Component` changes your screen won't be recomposed. Also, it is a bit type safer since you are the one calling the Composable function.

[2. Use `dependenciesContainerBuilder` to prepare certain components to certain/all screens](#use-dependenciescontainerbuilder-to-prepare-dependencies)  
This is simpler if you want to make some component available to multiple screens. It should only be used for passing dependencies which are static for the lifetime of your screens (example: `ViewModels`, `ScaffoldState`, etc).

### Manually call your screen Composable


The `DestinationsNavHost` call has a `manualComposableCallsBuilder` which can be used to manually call some `Destination` Composables:

```kotlin
// Just as an example of something you might want to send to some destinations
val scaffoldState = rememberScaffoldState()

DestinationsNavHost(
    navGraph = NavGraphs.root
) {
    composable(SomeScreenDestination) { //this: DestinationScope<SomeScreenDestination.NavArgs>
        SomeScreen(
            arg1 = navArgs.arg1, // navArgs is a lazily evaluated `SomeScreenDestination.NavArgs` instance, field of `DestinationScope`
            navigator = destinationsNavigator, // destinationsNavigator is a `DestinationsNavigator` (also lazily evaluated)
            backStackEntry = navBackStackEntry, // navBackStackEntry is a `DestinationScope` field
            scaffoldState = scaffoldState,
            resultBackNavigator = resultBackNavigator(), // needed if "SomeScreen" needs to send argument back to previous screen
            resultRecipient = resultRecipient(), // needed if "SomeScreen" needs to receive results from a forward screen
        )
    }
}
```

:::note
Notice you don't need to manually call all destinations. The `NavHost` will be filled with all destinations and nested navigation graphs of `NavGraphs.root`.
:::

This feature makes sure you have all control you need in some less common cases.
When some destination gets navigated to, if you are manually calling it here in the `DestinationsNavHost` then the library will call your composable function with the navigation arguments (if the destination has navigation arguments). If you are not, the library will call your annotated Composable instead.

:::info animations
If you're using animations, you might want to use `animatedComposable` or `bottomSheetComposable` if you need the `AnimatedVisibilityScope` or the `ColumnScope` receivers respectively. These scopes are given by the respective Accompanist library. If you don't need them, you can still use `composable` function like in the example above.
:::

### Use `dependenciesContainerBuilder` to prepare dependencies

If you have some dependencies which you want to make available to all or multiple destinations, you can leverage this `DestinationsNavHost` parameter to prepare them.

For example, if you wanted to make `ScaffoldState` available to multiple screens, you could just do:

```kotlin
val scaffoldState = rememberScaffoldState()

DestinationsNavHost(
    dependenciesContainerBuilder = { //this: DependenciesContainerBuilder<*>
        dependency(scaffoldState)
    }
)
```

This lambda will be called everytime a new screen is navigated to to let you prepare components safely scoped to that screen only, since this "container" will not live behond the screen that is navigated to. 

:::info
This lambda is scoped in a `DependenciesContainerBuilder` which is also a `DestinationScope`. So, everything we have available when manually calling a Composable screen, you also have here, including a `destination` with the `DestinationSpec` that is being navigated to. This enables you to make decisions here and have dependencies only available to specific destinations or specific navigation graphs. ([Check this for an example](../common-use-cases/providing-viewmodels#share-viewmodels-between-multiple-destinations))
:::