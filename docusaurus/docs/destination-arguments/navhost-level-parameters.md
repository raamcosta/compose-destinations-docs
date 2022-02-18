---
sidebar_position: 2
---

# Non-navigation parameters

Besides things that the previous screen can pass to the next one, Composable destinations can also make use of certain components usually passed in from the NavHost call level (even when using vanilla Compose Navigation).
Compose Destinations supports some of these out of the box:

- `NavController` (or `NavHostController`) - If part of the Composable function parameters, Compose Destinations will pass in the `NavController` used in the `DestinationsNavHost`.

- `DestinationsNavigator` - This is an interface wrapper around `NavController` useful for inverting the dependency in the `NavController`. This enables your Composable to be testable and previewable since you can just pass an empty implementation (one is available out of the box `EmptyDestinationsNavigator`). Read more in the [navigation section](navigation/basics)

- `NavBackStackEntry` - the back stack entry correspondent to the destination composable. You should avoid depending on this directly.

- `ResultBackNavigator` / `ResultRecipient` - needed for sending results back from a destination to the previous one. Read more [here](navigation/backresult)

Even though most screen Composables will only need their navigation arguments and some of the components mentioned above, if you have a scenario where you need to pass something else, you can manually call screen Composables.

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

Notice you don't need to manually call all destinations. The `NavHost` will be filled with all destinations and nested navigation graphs of `NavGraphs.root`. This feature makes sure you have all control you need in some less common cases.
When some destination gets navigated to, if you are manually calling it here in the `DestinationsNavHost` then the library will call your composable function with the navigation arguments (if the destination has navigation arguments). If you are not, the library will call your annotated Composable instead.

If you're using animations, you might want to use `animatedComposable` or `bottomSheetComposable` if you need the `AnimatedVisibilityScope` or the `ColumnScope` receivers respectively. These scopes are given by the respective Accompanist library. If you don't need them, you can still use `composable` function like in the example above.