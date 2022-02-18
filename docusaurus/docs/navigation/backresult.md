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
    resultRecipient.onResult { confirmed ->
        // Do whatever with the result received!
        // Think of it like a button click, usually you want to call
        // a view model method here or navigate somewhere
    }

    // Navigate normally to the other screen, example:

    Button(
        onClick = {
            navigator.navigate(GoToProfileConfirmationDestination)
        }
    ) { //...
}
```

Notice the type arguments of `ResultRecipient`. The first is the `Destination` that is going to send results to the recipient and the second is the type of result the recipient is expected.  
The `onResult` listener will be called every time the `GoToProfileConfirmation` (in this case) calls `navigateBack` on its `ResultBackNavigator` and receives the result sent through that call.

**Limitations enforced at compile time:**

1. Screens can have at most one `ResultBackNavigator` argument.
2. Screens can have at most one `ResultRecipient` per `Destination` type. This means you can have multiple recipients only if they are related to different Destinations.
3. Result type must be one of String, Boolean, Float, Int, Long, Serializable, or Parcelable. They can be nullable but in the case of Serializables and Parcelables, they cannot contain type arguments.
4. For every `ResultRecipient` of a result type `R`, the corresponding destination must also have a `ResultBackNavigator` of that same `R` type.
