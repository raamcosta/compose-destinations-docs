---
sidebar_position: 2
---

# Navigating back with a result

Since version `1.2.0-beta`, you can send results back in a type-safe and simple way.
Let's see how:

1. Add a `ResultBackNavigator` parameter to the screen that will send results back:

```kotlin
@Destination(style = AppDialog::class)
@Composable
fun GoToProfileConfirmation(
    resultNavigator: ResultBackNavigator<Boolean>
) { //...
```

:::info

- `ResultBackNavigator` has a type argument that is corresponding to the type of result you want to send back.
- The above example is a Dialog. Modal destinations (dialogs, bottom sheet) are good examples of screens that want to send a result to previous screens.

:::

2. When the screen is done, call `navigateBack` function passing in the result:

```kotlin
resultNavigator.navigateBack(result = true)
```

This will finish the current screen (same as calling `navigateUp` on normal navigator) and pass `true` to the previous screen.

3. Get a result back from such a Destination:

```kotlin
@Composable
fun GreetingScreen(
    navigator: DestinationsNavigator,
    resultRecipient: ResultRecipient<GoToProfileConfirmationDestination, Boolean>
) {
    resultRecipient.onNavResult { result ->
        when (result) {
            is NavResult.Canceled -> {
                // `GoToProfileConfirmationDestination` was shown but it was canceled
                // and no value was set (example: dialog/bottom sheet dismissed)
            }
            is NavResult.Value -> {
                println("result reseived from GoToProfileConfirmationDestination = ${result.value}")
                // Do whatever with the result received!
                // Think of it like a button click, usually you want to call
                // a view model method here or navigate somewhere
            }
        }
    }

    // Navigate normally to the other screen, example:

    Button(
        onClick = {
            navigator.navigate(GoToProfileConfirmationDestination)
        }
    ) { //...
}
```

Notice the type arguments of `ResultRecipient`. The first is the `Destination` that is going to send results to the recipient and the second is the type of result the recipient is expecting.  
The `onNavResult` listener will be called every time the `GoToProfileConfirmation` (in this case) calls `navigateBack` on its `ResultBackNavigator` and receives the result sent through that call.
If `GoToProfileConfirmation` screen is shown and then gets popped out of the back stack and no result is set (examples: it calls `navigateBack` with no result set; it is a dialog and it gets dismissed; etc), then the `onNavResult` gets called with `NavResult.Canceled` so that you can react to this.

**Limitations enforced at compile time:**

1. Screens can have at most one `ResultBackNavigator` argument.
2. Screens can have at most one `ResultRecipient` per `Destination` type. This means you can have multiple recipients only if they are related to different Destinations.
3. Result type must be one of String, Boolean, Float, Int, Long, Serializable, or Parcelable. They can be nullable but in the case of Serializables and Parcelables, they cannot contain type arguments.
4. For every `ResultRecipient` of a result type `R`, the corresponding destination must also have a `ResultBackNavigator` of that same `R` type.
