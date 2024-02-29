---
sidebar_position: 8
---

# Styles and Animations

Compose Destinations allows you to define different styles for your Composable screens. <br/> 
These "styles" describe the way the Composable enters and leaves the screen or how it is shown.

Each destination can have one of these styles:

- [Default](#default-style)
- [Dialog](#dialog-style)
- [BottomSheet](#bottomsheet-style)
- [Animated](#animated-style)
- [Runtime](#runtime-style)


See also: [Common setup for Animations and Bottom Sheets](#animations-setup)

The way you can choose this is by passing the `style` argument to the `@Destination` annotation, example:

```kotlin
@Destination(style = DestinationStyle.Dialog::class)
@Composable
fun SomeScreen() { /*...*/ }
```
The class has to be a subclass of the `sealed interface DestinationStyle`.

## Default Style

As you probably have guessed, this is the style that's going to be applied to all Destinations that don't explicitly use another style.
This usually means that no animation and no other special style is used when navigating to it, but, if you're using Compose Destinations `animations-core`, you will be able to change this default to actually have a custom animation. That is done through the arguments of `rememberNavHostEngine` call, which you need to do to pass the returned `AnimatedNavHostEngine` into `DestinationsNavHost`.

## Dialog Style

This style will make your Composable be displayed as a dialog above the previous screen. <br/>
`DestinationStyle.Dialog` is also an interface with a `DialogProperties` field. This enables you to create specific configurations of Dialogs subclassing it with an `object`. Then you can pass that object's class to the style argument, for example:

```kotlin
object NonDismissableDialog : DestinationStyle.Dialog {
    override val properties = DialogProperties(
        dismissOnClickOutside = false,
        dismissOnBackPress = false,
    )
}
```

```kotlin
@Destination(style = NonDismissableDialog::class)
@Composable
fun SomeDialogScreen() { /*...*/ }
```

If you declare the style as `style = DestinationStyle.Dialog::class`, then the default `DialogProperties` will be used.

## BottomSheet Style

This style requires you to use `io.github.raamcosta.compose-destinations:animations-core` instead of the normal `core`. There is a compile-time check that will throw an error if you don't.
The `DestinationStyle.BottomSheet` is a simple object that you can use to set this style.

```kotlin
@Destination(style = DestinationStyleBottomSheet::class)
@Composable
fun ColumnScope.SomeBottomSheetScreen() { /*...*/ }
```

Notice the `ColumnScope` receiver. This is optional if you're using the bottom sheet style and the reason is that the bottom sheet is internally placed inside a Column, so you can potentially do things that are only possible within that type of scope without needing another Column.

Just as if you were working with Accompanist Navigation-Material directly, you will need to wrap your top-most Composable with a `ModalBottomSheetLayout`. 

```kotlin
val navController = rememberNavController()

val bottomSheetNavigator = rememberBottomSheetNavigator()
navController.navigatorProvider += bottomSheetNavigator

ModalBottomSheetLayout(
    bottomSheetNavigator = bottomSheetNavigator,
    // other configuration for you bottom sheet screens, like:
    sheetShape = RoundedCornerShape(16.dp),
) {
    // ...
    DestinationsNavHost(
        navController = navController
        // ...
    )
}
```

## Animated Style

The animated style enables you to define custom animations for your screen transitions. It requires the `io.github.raamcosta.compose-destinations:animations-core` dependency. With this, you can then subclass `DestinationStyle.Animated` interface with an object class and define the enter and exit transitions with normal animation APIs.

```kotlin title=ProfileTransitions.kt
@OptIn(ExperimentalAnimationApi::class)
object ProfileTransitions : DestinationStyle.Animated {

    override fun AnimatedContentScope<NavBackStackEntry>.enterTransition(): EnterTransition? {
    //...
```
<details>
  <summary>(expand to see the rest of ProfileTransitions.kt)</summary>

```kotlin
    //...

        return when (initialState.appDestination()) {
            GreetingScreenDestination ->
                slideInHorizontally(
                    initialOffsetX = { 1000 },
                    animationSpec = tween(700)
                )
            else -> null
        }
    }

    override fun AnimatedContentScope<NavBackStackEntry>.exitTransition(): ExitTransition? {

        return when (targetState.appDestination()) {
            GreetingScreenDestination ->
                slideOutHorizontally(
                    targetOffsetX = { -1000 },
                    animationSpec = tween(700)
                )
            else -> null
        }
    }

    override fun AnimatedContentScope<NavBackStackEntry>.popEnterTransition(): EnterTransition? {

        return when (initialState.appDestination()) {
            GreetingScreenDestination ->
                slideInHorizontally(
                    initialOffsetX = { -1000 },
                    animationSpec = tween(700)
                )
            else -> null
        }
    }

    override fun AnimatedContentScope<NavBackStackEntry>.popExitTransition(): ExitTransition? {

        return when (targetState.appDestination()) {
            GreetingScreenDestination ->
                slideOutHorizontally(
                    targetOffsetX = { 1000 },
                    animationSpec = tween(700)
                )
            else -> null
        }
    }
}
```
</details>

```kotlin
@Destination(style = ProfileTransitions::class)
@Composable
fun AnimatedVisibilityScope.ProfileScreen() { /*...*/ }
```

Notice the `AnimatedVisibilityScope` receiver. This scope is available to all "non dialog" and "non bottom sheet" Composables in the nav graph once you're using the `animations-core` dependency instead of the normal `core`.

### Animations / Bottom Sheet setup

- If you want to use bottom sheet styled screens, you need to replace the normal `core` dependency with the `animations-core` (`io.github.raamcosta.compose-destinations:animations-core`) in your module's build.gradle file.

- `rememberNavHostEngine` has a parameter to define the default animations. This will make it so that all destinations with no specified style, will actually enter and exit as defined in that parameter.
Besides, you can also override this default for specific nested navigation graphs. If you want to do that use the `defaultAnimationsForNestedNavGraph: Map<NavGraph, NestedNavGraphDefaultAnimations>` by mapping with navigation graphs to specific default animation parameters.
`DestinationsNavHost` contains a `contentAlignment` parameter which you can also pass in this call as the `navHostContentAlignment`.

```kotlin
val navHostEngine = rememberNavHostEngine(
    navHostContentAlignment = Alignment.TopCenter,
    rootDefaultAnimations = RootNavGraphDefaultAnimations.ACCOMPANIST_FADING, //default `rootDefaultAnimations` means no animations
    defaultAnimationsForNestedNavGraph = mapOf(
        NavGraphs.settings to NestedNavGraphDefaultAnimations(
            enterTransition = { fadeIn(animationSpec = tween(2000)) },
            exitTransition = { fadeOut(animationSpec = tween(2000)) }
        ),
        NavGraphs.otherNestedGraph to NestedNavGraphDefaultAnimations.ACCOMPANIST_FADING
    ) // all other nav graphs not specified in this map, will get their animations from the `rootDefaultAnimations` above.
)
```

## Runtime Style

This style is just a marker for KSP task to keep the style of a Destination open at compile time. When using it, you need to manualy call the setter of the style on the corresponding generated Destination at runtime before calling `DestinationsNavHost`. If you don't, it will crash with appropriate error message.

This feature is useful when you want to use style classes defined on different modules, which might be the only option when for example the style is `Animated` and you need to reference Destinations from other modules.

Example:

```kotlin
@Destination(style = DestinationStyle.Runtime::class)
@Composable
fun YourScreen(
    //...
) { /*...*/ }
```

And then wherever you call `DestinationsNavHost`

```kotlin
// YourScreenTransitions being an object that implements DestinationStyle.Animated (for example)
YourScreenDestination.style = YourScreenTransitions

DestinationsNavHost(
    //...
)
```
