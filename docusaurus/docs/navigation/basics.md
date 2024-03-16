---
sidebar_position: 1
---

# Basics

## Navigate to Destinations

To navigate to a destination you need a `NavController` or a `DestinationsNavigator`.
Both are valid arguments for annotated Composables and will be provided by the library at runtime.

:::info
`DestinationsNavigator` is meant only for navigating from one screen to another. If you need some kind of "top-level navigation" (example: Bottom navigation bar, App drawer, etc) you should use the same `NavController` instance you pass to `DestinationsNavHost`.
:::

Then you can:

```kotlin
navigator.navigate(GreetingScreenDestination)

// OR using NavController.navigate extension function

navController.navigate(GreetingScreenDestination)
```

Or if the destination has navigation arguments:

```kotlin
// All arguments will be available in the invoke function, including the default values
navigator.navigate(ProfileScreenDestination(id = 1, groupName = "Kotlin 4ever <3"))
// OR
val navArgs = ProfileScreenDestination.NavArgs(id = 1, groupName = "Kotlin 4ever <3")
navigator.navigate(ProfileScreenDestination(navArgs))
```

```kotlin
navController.navigate(ProfileScreenDestination(id = 1, groupName = "Kotlin 4ever <3"))
// OR
val navArgs = ProfileScreenDestination.NavArgs(id = 1, groupName = "Kotlin 4ever <3")
navController.navigate(ProfileScreenDestination(navArgs))
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
It is good practice to not depend directly on `NavController` on your Composables. You can opt to use `DestinationsNavigator` instead, which is an interface wrapper of `NavController`. Making use of this dependency inversion principle allows you to easily pass an empty implementation (one is available already `EmptyDestinationsNavigator`) for previews or a fake for testing.

## Avoiding duplicate navigation

If you dig around official Compose Samples, you will see this pattern of checking the state of the current `NavBackStackEntry` and only navigating if it is `RESUMED`. `DestinationsNavigator` can avoid duplicate navigation calls by using this same pattern under the hood if you simply pass `onlyIfResumed = true` to the navigate call like this:

```kotlin
navigator.navigate(ProfileScreenDestination(id = 1), onlyIfResumed = true)
```