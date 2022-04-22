---
sidebar_position: 1
---

# Bottom bar navigation

One of the common cases for Android development is to have a bottom bar to navigate between the main entry point destinations of an application.

With Compose Destinations, achieving it is not too different than with normal Jetpack Compose Navigation, you just have some new tools to make it easier.

**Firstly, you need some kind of closed set of Destinations that will be a part of that Bottom Navigation bar.**  
For example:

```kotlin
enum class BottomBarDestination(
    val direction: DirectionDestinationSpec,
    val icon: ImageVector,
    @StringRes val label: Int
) {
    Greeting(GreetingScreenDestination, Icons.Default.Home, R.string.greeting_screen),
    Feed(FeedScreenDestination, Icons.Default.Email, R.string.feed_screen),
}
```

:::note
You can also use a sealed class, sealed interface, whatever you like. The reasons I personally like enum in this case are: 
1. Enums have a `values()` function which comes in handy to populate the bottom bar Composable (as we'll see next).
1. All entries of this closed set probably have the exact same properties/functions so there is really no benefit in using sealed class over it.
:::

**Secondly, create your bottom bar Composable.**  
Taking the example from above, that could look something like:

```kotlin
@Composable
fun BottomBar(
    navController: NavController
) {
    val currentDestination: Destination? = navController.currentBackStackEntryAsState()
        .value?.appDestination()

    BottomNavigation {
        BottomBarDestination.values().forEach { destination ->
            BottomNavigationItem(
                selected = currentDestination == destination.direction,
                onClick = {
                    navController.navigateTo(destination.direction) {
                        launchSingleTop = true
                    }
                },
                icon = { Icon(destination.icon, contentDescription = stringResource(destination.label))},
                label = { Text(stringResource(destination.label)) },
            )
        }
    }
}
```
:::note
The above `appDestination()` is just a handy generated extension function when in "singlemodule" mode (read about configurations [here](../codegenconfigs)).  
It internally uses `NavBackStackEntry.destination(navGraph: NavGraphSpec)` from the core library, so if you have a multi-module app, you can use that method instead to get the destination spec corresponding to a given `NavBackStackEntry` in a given `NavGraphSpec` (you can just use the root one that contains all destinations in its tree).
:::

**Finally, use the Composable on your Scaffold's `bottomBar` slot**

```kotlin
val navController = rememberNavController()

Scaffold(
    bottomBar = { 
        BottomBar(navController)
    }
    //...
) {
    DestinationsNavHost(
        navController = navController //!! this is important
        // ...
    )
}
```

Some considerations:
1. You could make it so your `BottomBar` Composable only receives the current destination and a lambda to be used when an item gets clicked. This makes your bottom bar more testable and separated from navigation code.
2. If each of your bottom bar items corresponds to different navigation graphs, your `BottomBarDestination` enum could contain `NavGraphSpec`s instead of `DirectionDestinationSpec`.
3. The actual code to navigate can use save and restore states to implement this in a "multi nav back stack" way (read more in [official article](https://medium.com/androiddevelopers/multiple-back-stacks-b714d974f134) or see an example of it in my [tivi's fork](https://github.com/raamcosta/tivi)).  
4. Keep in mind that if at any time you need to fallback to using Jetpack Compose Navigation APIs, you can always just get the route by `DestinationSpec.route`. So all approaches you might find out there, can always be implemented with Compose Destinations as well.
