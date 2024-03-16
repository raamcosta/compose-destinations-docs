---
sidebar_position: 2
---

# Navigating back with a result

You can send results back in a type-safe and simple way.
Let's see how:

1. Add a `ResultBackNavigator` parameter to the screen that will send results back:

```kotlin
@Destination(style = AppDialog::class)
@Composable
fun GoToProfileConfirmation(
    resultNavigator: ResultBackNavigator<Boolean>
) { /*...*/ }
```

:::info

- `ResultBackNavigator` has a type argument that is corresponding to the type of result you want to send back.
- The above example is a Dialog. Modal destinations (dialogs, bottom sheet) are good examples of screens that usually want to send a result to previous screens.

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
    resultRecipient.onResult(
        onValue = { resultValue ->
            println("result received from GoToProfileConfirmationDestination = ${resultValue}")
            // Do whatever with the result received!
            // Think of it like a button click, usually you want to call
            // a view model method here or navigate somewhere
        },
        onCancelled = {
            // `GoToProfileConfirmationDestination` was shown but it was canceled
            // and no value was set (example: dialog/bottom sheet dismissed)
            println("did not get result")
        }
    )

    // OR  if you don't care about onCancelled
    resultRecipient.onResult { resultValue ->
        println("got result $resultValue")
    }

    // Navigate normally to the other screen, example:
    Button(
        onClick = {
            navigator.navigate(GoToProfileConfirmationDestination)
        }
    ) { /*...*/ }
}
```

Notice the type arguments of `ResultRecipient`. The first is the `Destination` that is going to send results to the recipient and the second is the type of result the recipient is expecting.  
The `onResult` listener will be called every time the `GoToProfileConfirmation` (in this case) calls `navigateBack` on its `ResultBackNavigator` and receives the result sent through that call.
If `GoToProfileConfirmation` screen is shown and then gets popped out of the back stack and no result is set (examples: it calls `navigateBack` with no result set; it is a dialog and it gets dismissed; etc), then the `onResult`'s `onCancelled` gets called so that you can react to this.

**Safety enforced at compile time:**

1. Screens can have at most one `ResultBackNavigator` argument.
2. Screens can have at most one `ResultRecipient` per `Destination` type. This means you can have multiple recipients only if they are related to different Destinations.
3. Result type must be one of `String`, `Boolean`, `Float`, `Int`, `Long`, or `Parcelable`. They can be nullable but in the case of Serializables and Parcelables, they cannot contain type arguments.
4. For every `ResultRecipient` of a result type `R`, the corresponding destination must also have a `ResultBackNavigator` of that same `R` type.

## Multi module result back case

In multi module apps, you may find a scenario where there is no dependency between result "sender" and result "recipient". In those scenarios, you need to use `OpenResultRecipient<Boolean>` (example) instead of `ResultRecipient<YourConfirmationDestination, Boolean>`.

After this though, there is no way for the library to know how to pass these recipient to your destination, so you need to pass it manually by calling the destinations asking for this kind of `OpenResultRecipient`:

```kotlin
DestinationsNavHost(
//...
) {
    composable(YourRecipientScreenDestination) {
        YourRecipientScreen(
            //...
            resultRecipient = resultRecipient<YourConfirmationDestination, Boolean>()
        )
    }
}
```

As you can see, the place that calls DestinationsNavHost is the one that decides where the result comes from. This way we can use this for multi module apps where there is no dependency between recipient and result destinations.

:::note
There is no check at compile time, and it's a bit of manual setup to use this feature. So always prefer to use the type-safe approach unless you can't - usually only when the destinations at play belong to different modules.
:::
