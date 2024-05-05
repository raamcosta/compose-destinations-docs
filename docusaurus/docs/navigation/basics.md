---
sidebar_position: 1
---

# Basics

## Navigate to Destinations

To navigate to a destination you need a `DestinationsNavigator`.

:::info
To get a `DestinationsNavigator`:
    - Simply receive a DestinationsNavigator instead of NavController in your annotated screens.

Or do (if you need it at a top level such as around `DestinationsNavHost`, bottom bar, etc):
    - navController.rememberDestinationsNavigator() if in a Composable
    - navController.toDestinationsNavigator() if not in a Composable
:::

Then you can:

```kotlin
navigator.navigate(GreetingScreenDestination)
```

Or if the destination has navigation arguments:

```kotlin
// All arguments will be available in the invoke function, including the default values
navigator.navigate(ProfileScreenDestination(id = 1, groupName = "Kotlin 4ever <3"))
// OR
val navArgs = ProfileScreenDestination.NavArgs(id = 1, groupName = "Kotlin 4ever <3")
navigator.navigate(ProfileScreenDestination(navArgs))
```

## Navigate to NavGraphs

To navigate to a NavGraph, do:

```kotlin
navigator.navigate(ProfileNavGraph(id = "some id"))

// OR from within the same module that is declaring it:
// "NavGraphs" may be prefixed with the module name if that is declared in a ksp config.

navigator.navigate(NavGraphs.profile(id = "some id"))
```

Navigating to a nav graph results in navigating to its start route.
So what if that start route also has mandatory arguments?
Well, in that case, Compose Destinations will also require those arguments.

Example: (start route of ProfileGraph, requires `ProfileMainScreenNavArgs`)

```kotlin
navigator.navigate(
    ProfileNavGraph(
        id = "some id",
        startRouteArgs = ProfileMainScreenNavArgs(/*pass in the fields needed*/)
    )
)
```

- If your nav graph doesn't have its own nav arguments, it may still require arguments to be navigated to, if its
start route does.
This ensures destination arguments will always be present, even if you navigated to its nav graph.

- If the start route of a nav graph is another nav graph which in turn has a start destination
that also needs arguments, then you'll be required to pass all those in.

- In a multi module scenario, all arguments part of this "chain" need to be public so that other
modules can navigate to your module's nav graph.

## DestinationsNavigator vs NavController
Use `NavController` only when you need APIs that are not available on `DestinationsNavigator`. `DestinationsNavigator` is about navigating and managing the back stack with Compose Destinations friendly and type safe APIs. 
Besides, it is good practice to not depend directly on `NavController` on your annotated Composables. You should opt to use `DestinationsNavigator` instead, which is an interface wrapper of `NavController`. Making use of this dependency inversion principle allows you to easily pass an empty implementation (one is available already `EmptyDestinationsNavigator`) for previews or a fake for testing.

:::caution
On recent versions of official compose navigation artifact, `NavController` has new `navigate` methods that can take anything. Because of this, our old `NavController.navigate` extension functions that received a `Direction` (similar to `DestinationsNavigator`) had to be removed. Since then, you must use `DestinationsNavigator` to navigate.
:::
