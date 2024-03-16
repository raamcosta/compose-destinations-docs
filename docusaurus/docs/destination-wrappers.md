---
sidebar_position: 10
---

# Destination Wrappers

If you're looking to share logic or UI with multiple screen destinations, you may want to try using what we call Destination wrappers.  
Let's see a couple examples. The examples might not be the best, but hopefully they're good enough to give you ideas of what you could do with wrappers.

## Example 1: Wrapping screens with a PIN entry

Say you want to have some screens be protected by PIN.
You could do this:

```kotlin
object PinEntryWrapper : DestinationWrapper {

    @Composable
    override fun <T> DestinationScope<T>.Wrap(
        screenContent: @Composable () -> Unit
    ) {
        val vm = viewModel<PinEntryWrapperViewModel>()
        val correctPinEntered by vm.correctPinEntered.collectAsState()

        if (!pinEnteredCorrectly) {
            // SHOW YOUR PIN ENTRY UI HERE
        } else {
            screenContent()
        }
    }
}
```

And then apply the wrapper on all Destinations you want to protect this way:

```kotlin
@Destination(
    wrappers = [PinEntryWrapper::class] // 👈 
)
@Composable
fun MyScreen() { /*...*/ }
```

:::info hint
Keep in mind you can create your own Destination annotation, say, for the above example, `PinProtectedDestination`, and use that instead of defining the wrapper manually on each destination. Read about how to do it [here](defining-destinations#centralizing-destination-annotation-configuration).
:::

## Example 2: Wrapping screens with a "no network banner"

On the previous example we decided to show either a PIN entry OR the screen. In this one, we'll always show the screen, but we'll also show a banner on top of it if there is no network.

```kotlin
object NoNetworkBannerWrapper : DestinationWrapper {

    @Composable
    override fun <T> DestinationScope<T>.Wrap(
        screenContent: @Composable () -> Unit
    ) {
        val vm = viewModel<NetworkBannerViewModel>()
        val isNetworkAvailable by vm.isNetworkAvailable.collectAsState()

        Column {
            if (!isNetworkAvailable) {
                NoNetworkBanner() // composable that shows a no network banner
            }
            
            screenContent()
        }
    }
}
```

## About `DestinationWrapper`

Things to note about DestinationWrapper:

* `DestinationWrapper` is an interface you'll need to implement
* The `Wrap` method has a `DestinationScope` receiver. Same thing you get when calling your composables manually. You can use it to access:
  * `destination` that the wrapper is called to wrap
  * `navArgs` type safe args of the destination being wrapped
  * `buildDependencies()` which returns the dependencies provided to the destination via `dependencyContainerBuilder`
  * `navBackStackEntry` correspondent to the destination being wrapped
  * `navController`
  * `destinationsNavigator`
* The `Wrap` method receives a `screenContent` lambda. You should call it when/where you want to call the destination composable.
* Your screens can use multiple wrappers. In that case the order they're set on matters. For example, if you set Wrapper1 and Wrapper2 like `wrappers = [Wrapper1::class, Wrapper2::class]`, then `Wrapper1`'s `screenContent` lambda will actually call `Wrapper2`. `Wrapper2`'s `screenContent` will be the destination composable.