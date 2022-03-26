---
sidebar_position: 6
---

# Navigation Host Composables

Compose destinations has a recommended way to set up your `NavHosts` and an alternative one. If you are not sure which to use and don't have much experience with Compose Navigation, go with the recommended [DestinationsNavHost](#destinationsnavhost) way. On the other hand, if you have a lot of experience with vanilla Compose Navigation and just want the type safety of Compose Destinations, you might prefer to use [NavHost / AnimatedNavHost](#vanilla-navhosts).

## DestinationsNavHost 

Compose Destinations has a "NavHost-like" Composable that you can use as a base for all your screens.

It internally calls the Compose Navigation `NavHost` but automatically adds all `@Destination` annotated Composables of a given `NavGraph` instance to the NavHost. When a destination gets navigated to, it calls the corresponding generated `Content` method which prepares the navigation arguments and calls your annotated Composable.

Most times, using it is as simple as:

```kotlin
DestinationsNavHost(navGraph = NavGraphs.root)
```

:::info

`NavGraphs` is a generated object that contains the definition of all your navigation graphs and their destinations. By default, all annotated composable will belong to the "root" navigation graph. But you can customize this however you want. Read more [here](defining-navgraphs)

:::

However, you can override some defaults:

- `navGraph: NavGraphSpec` - In case you have multiple top-level navigation graphs or [you have disabled the generation of `NavGraphs`](defining-navgraphs#manually-defining-navigation-graphs) you can pass a specific one here. If not, it will always be `NavGraphs.root`.

- `modifier: Modifier` - modifier applied to this Composable. It affects the screen Composable.

- `startRoute: Route`: used to override the start route set in the `NavGraph` "startRoute" parameter at runtime. If you have some condition upon which you want to start on some other screen, then pass it explicitly with this parameter. `Route` is an interface only implemented by `Destination` and `NavGraph`, since both are valid to start at (if you pass a `NavGraph` then that `NavGraph`'s start destination will be the first shown).

- `engine: NavHostEngine` - this is the engine that will do all the composable registering in the NavHost. The only reason to override the default here is when you're using `animations-core`, i.e, when you want to animate between screens or have Bottom Sheet destinations. If that is your case, then call `rememberAnimatedNavHostEngine` and pass the result here. Read more [here](styles-and-animations)

- `navController: NavHostController`: If you need to get a hold of the `NavController`, you can use `rememberAnimatedNavController` if you're using `animations-core` and the normal `rememberNavController` if you are not.

- `dependenciesContainerBuilder` offers a `DependenciesContainerBuilder` where you can add dependencies by their class via `com.ramcosta.composedestinations.navigation.dependency()`. The lambda will be called when a Composable screen gets navigated to and `DependenciesContainerBuilder` also implements `com.ramcosta.composedestinations.manualcomposablecalls.DestinationScope` so you can access all information about what `DestinationSpec` is being navigated to. Read more [here](destination-arguments/navhost-level-parameters#use-dependenciescontainerbuilder-to-prepare-dependencies).

- `manualComposableCallsBuilder: ManualComposableCallsBuilder.() -> Unit`: offers a `ManualComposableCallsBuilder` scope where you can
make manual calls to specific Destination Composables which belong to the `navGraph` passed in here. This can be useful if you need to pass non-navigation arguments to those specific Composables which the library cannot provide. Read more [here](destination-arguments/navhost-level-parameters)

## Vanilla NavHosts

If you are experienced with using Compose Navigation, you may prefer using the same NavHost Composables. This is mainly a preference thing, but, in my opinion, having a `NavGraphs` object where you can check your app's destinations and where they belong without all the clutter from the arguments, Composables, etc is beneficial. Besides, being able to quickly and safely check at runtime which navigation graph some route belongs to and getting the `Destination` from the `NavBackStackEntry` can come in handy.

That said, `Destination`s are still very nice to use with the vanilla Composables. There are extension functions on `NavGraphBuilder` that will let you register those destinations in a type-safe way and with much less boilerplate.
Here's an example:

```kotlin
NavHost( // Replace with AnimatedNavHost if you're using `animations-core`
    navController = navController,
    startDestination = GreetingScreenDestination.route,
) {
    // Replace with `animatedComposable` if you're using `animations-core`
    composable(GreetingScreenDestination) { args, navBackStackEntry ->
        GreetingScreen(
            arg1 = args.arg1,
            arg2 = args.arg2,
            //...
        )
    }
    
    composable(SomeScreenWithoutNavigationArgsDestination) { navBackStackEntry -> //no args param if the destination doesn't have them
        SomeScreenWithoutNavigationArgs()
    }

    // Use `dialogComposable` if the destination has a `style = DestinationStyle.Dialog::class` or subclass

    // Use `bottomSheetComposable` if the destination has a `style = DestinationStyle.BottomSheet::class`
}
```

If you do this, you should disable the `NavGraph`s generation. Check [here](defining-navgraphs#manually-defining-navigation-graphs) out to do that.