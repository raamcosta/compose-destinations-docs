---
sidebar_position: 8
---

# Styles and Animations

Compose Destinations allows you to define different styles for your Composable screens.   
These "styles" describe the way the Composable enters and leaves the screen or how it is shown.

Each destination can have one of these styles:

- [Default](#default-style)
- [Animated](#animated-style)
- [Dialog](#dialog-style)
- [BottomSheet](#bottomsheet-style)

The way you can choose this is by passing the `style` argument to the `@Destination` annotation, example:

```kotlin
@Destination(style = DestinationStyle.Dialog::class)
@Composable
fun SomeScreen() { /*...*/ }
```

:::info hint
If you have an animation that you need to apply at runtime, for example, if the animation depends on some state that is only known in the DestinationsNavHost level, you can override whatever style is set in the annotation.
Read more in the [_Override the annotation style at runtime_](#override-the-annotation-style-at-runtime) section.
:::

## Default Style

As you probably have guessed, this is the style that's going to be applied to all Destinations that don't explicitly use another style.
Internally, it is similar to `DestinationsStyle.Animated`, except it takes animations from the destination's parent nav graph. 

## Animated Style

The animated style enables you to define custom animations for your screen transitions. You can subclass `DestinationStyle.Animated` class with an object class and define the enter and exit transitions with normal animation APIs.

Since compose 1.7, you'll also be able to override a `sizeTransform` as part of this class.

```kotlin title=ProfileTransitions.kt
object ProfileTransitions : DestinationStyle.Animated() {

    override val enterTransition: AnimatedContentTransitionScope<NavBackStackEntry>.() -> EnterTransition? = {
    //...
```
<details>
  <summary>(expand to see the full ProfileTransitions.kt)</summary>

```kotlin
object ProfileTransitions : DestinationStyle.Animated() {

    override val enterTransition: AnimatedContentTransitionScope<NavBackStackEntry>.() -> EnterTransition? = {
        when (initialState.destination()) {
            GreetingScreenDestination ->
                slideInHorizontally(
                    initialOffsetX = { 1000 },
                    animationSpec = tween(700)
                )
            else -> null
        }
    }

    override val exitTransition: AnimatedContentTransitionScope<NavBackStackEntry>.() -> ExitTransition? = {
        when (targetState.destination()) {
            GreetingScreenDestination ->
                slideOutHorizontally(
                    targetOffsetX = { -1000 },
                    animationSpec = tween(700)
                )
            else -> null
        }
    }
    
    override val popEnterTransition: AnimatedContentTransitionScope<NavBackStackEntry>.() -> EnterTransition? = {
        when (initialState.destination()) {
            GreetingScreenDestination ->
                slideInHorizontally(
                    initialOffsetX = { -1000 },
                    animationSpec = tween(700)
                )
            else -> null
        }
    }
    
    override val popExitTransition: AnimatedContentTransitionScope<NavBackStackEntry>.() -> ExitTransition? = {
        when (targetState.destination()) {
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

Notice the `AnimatedVisibilityScope` receiver. This scope is available to all "non dialog" and "non bottom sheet" Composables in the nav graph.

## Dialog Style

This style will make your Composable be displayed as a dialog above the previous screen. <br/>
`DestinationStyle.Dialog` is also a class you can extend to specify a `DialogProperties` field. This enables you to create specific configurations of Dialogs subclassing it with an `object`. Then you can pass that object's class to the style argument, for example:

```kotlin
object NonDismissableDialog : DestinationStyle.Dialog() {
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

This style requires you to add `io.github.raamcosta.compose-destinations:bottom-sheet` dependency.
The `DestinationStyleBottomSheet` is a simple object that you can use to set this style.

```kotlin
@Destination(style = DestinationStyleBottomSheet::class)
@Composable
fun ColumnScope.SomeBottomSheetScreen() { /*...*/ }
```

Notice the `ColumnScope` receiver. This is optional if you're using the bottom sheet style and the reason is that the bottom sheet is internally placed inside a Column, so you can potentially do things that are only possible within that type of scope without needing another Column.

Just as if you were working with Navigation-Material directly, you will need to wrap your top-most Composable with a `ModalBottomSheetLayout`. 

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

## Override the annotation style at runtime

You might have some situations where animations at compile time, set on a different place is not ideal. For example, if your animation depends on some state that is available at the `DestinationsNavHost` call. 

In that case, you can override whatever is set (or not set, if you didn't specify, which makes sense if you're going to override it anyway), like this:

```kotlin
DestinationsNavHost(
    //...
) {
    // same place you can manually call composables
    MyDestination animateWith SomeAnimatedStyleObject
    
    // OR more likely what you're looking for:
    MyDestination.animateWith(
        enterTransition = { /*...*/ },
        exitTransition = { /*...*/ },
        popEnterTransition = { /*...*/ },
        popExitTransition = { /*...*/ },
        sizeTransform = { /*...*/ },
    )
}
```