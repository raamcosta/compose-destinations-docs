---
sidebar_position: 1
---

# Basics 

To navigate to a destination you need a `NavController` or a `DestinationsNavigator`. Both are valid arguments for annotated Composables and will be provided by the library at runtime.

`DestinationsNavigator` is meant only for navigating from one screen to another. If you need some kind of "top-level navigation" (example: Bottom navigation bar, App drawer, etc) you should use the same `NavController` instance you pass to `DestinationsNavHost`.

Then you can:

```kotlin
navigator.navigate(GreetingScreenDestination)

// OR using NavController.navigateTo extension function

navController.navigateTo(GreetingScreenDestination)
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
navController.navigateTo(ProfileScreenDestination(id = 1, groupName = "Kotlin 4ever <3"))
// OR
val navArgs = ProfileScreenDestination.NavArgs(id = 1, groupName = "Kotlin 4ever <3")
navController.navigateTo(ProfileScreenDestination(navArgs))
```

:::info

`[YourComposableName]Destination.NavArgs` is the default data class, but if you define a `navArgsDelegate` on the `@Destination`, than that will be used instead!

:::

### DestinationsNavigator vs NavController
It is good practice to not depend directly on `NavController` on your Composables. You can opt to use `DestinationsNavigator` instead, which is an interface wrapper of `NavController`. Making use of this dependency inversion principle allows you to easily pass an empty implementation (one is available already `EmptyDestinationsNavigator`) for previews or a fake for testing.

:::note

`DestinationsNavigator` interface contains the main methods used to navigate that you would use with `NavController`. That said, there are missing APIs, for example, navigating with URI. This seemed rare enough that we did not want to complicate `Destinations Navigator`, but, if you have a use case you consider "common" and there is no way to do it with `DestinationsNavigator`, please open an issue so we can consider adding it. In the meantime, you can always fallback to `NavController`, so you are always covered.

:::

### Avoiding duplicate navigation

If you dig around official Compose Samples, you will see this pattern of checking the state of the current `NavBackStackEntry` and only navigating if it is `RESUMED`. `DestinationsNavigator` can avoid duplicate navigation calls by using this same pattern under the hood if you simply pass `onlyIfResumed = true` to the navigate call like this:

```kotlin
navigator.navigate(ProfileScreenDestination(id = 1), onlyIfResumed = true)
```