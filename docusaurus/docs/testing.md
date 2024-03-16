---
sidebar_position: 12
---

# Testing

Regarding testing with Compose Destinations, it won't be very different from what you can read on [official documentation for official compose navigation](https://developer.android.com/jetpack/compose/navigation#testing).

There's only two things we offer on top of it:

## `SavedStateHandle` from nav arguments

Sometimes you want to test a ViewModel that receives a `SavedStateHandle` and uses it to get the navigation arguments of the corresponding destination.
To prepare an instance of `SavedStateHandle` that contains certain arguments, you can do:

```kotlin
val savedStateHandle = MyNavArgsClass(arg1 = "stuff").toSavedStateHandle()
val vm = MyViewModel(savedStateHandle)
```

`toSavedStateHandle` can receive `SavedStateHandle` which allows you to end up with an instance that contains multiple arguments from multiple nav arguments class. By default it will instantiate a new one and return it to you.

## DestinationsNavigator from `TestNavHostController`

When reading from official docs, you'll find that they use a specific instance of `NavController` good for testing.
If you need a `DestinationsNavigator` to pass to a screen Composable, you can use it to do the following:

```kotlin
val destinationsNavigator: DestinationsNavigator = TestDestinationsNavigator(testNavController)
```

Something unique to Compose Destinations navigator is that it can take a "onlyIfResumed" boolean to skip calls when the current back stack entry is not resumed (useful to avoid double navigation).
If you need to control the behavior of that, you can pass a lambda in the `TestDestinationsNavigator` call that will be called whenever the `DestinationsNavigator` is checking if the back stack entry is in resumed state.
