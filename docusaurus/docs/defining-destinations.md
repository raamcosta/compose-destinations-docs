---
sidebar_position: 3
---

# Defining Destinations

The first step when using Compose Destinations is to mark the Composables you want to navigate to as "Destinations".
This will trigger the annotation processor to generate a `Destination` object with all needed information to include the Composable in the navigation graph.

## Destination annotation

To mark a Composable as a destination, use the `@Destination` annotation:

```kotlin
@Destination
@Composable
fun WelcomeScreen() {
    //...
}
```

As is, this will create an entry in the navigation graph with no navigation arguments (check how you declare those [here](destination-arguments/navigation-arguments)), with route "welcome_screen".

There are a lot of ways to configure this destination.
Lets start with an example where all those are used:

```kotlin
const val PROFILE_SCREEN_ROUTE = "profile/main"
const val PROFILE_NAV_GRAPH = "profile"

@Destination(
    route = PROFILE_SCREEN_ROUTE,
    start = true, // !! DEPRECATED, read below!
    navGraph = PROFILE_NAV_GRAPH, // !! DEPRECATED, read below!
    navArgsDelegate = ProfileScreenNavArgs::class,
    deepLinks = [DeepLink(uriPattern = "https://destinationssample.com/$FULL_ROUTE_PLACEHOLDER")],
    style = ProfileScreenTransitions::class
)
@Composable
fun ProfileScreen() {
    //...
}

data class ProfileScreenNavArgs(
    val arg1: Long,
    val arg2: String
)
```

* `route` - This is a way to override the default route for this destination (which would be "profile_screen" in this case)
* [(DEPRECATED - read here)](defining-navgraphs#generating-navigation-graphs) `start` - If true (default is false), marks this destination as the start of its navigation graph. In this case, since this would belong to the "profile" navigation graph (as defined in the `navGraph`) when navigating to that nested navigation graph, this screen would be shown.
Each navigation graph needs one and only one start destination. A compile-time check is in place to ensure this.
* [(DEPRECATED - read here)](defining-navgraphs#generating-navigation-graphs) `navGraph` - By default it will be "root". All destinations that do not specify other with this argument, will belong to the "root" navigation graph. In the case of the example, the destination would belong to the "profile" navigation graph which will be nested in the "root" one. All other destinations with the same `navGraph` argument would also belong to it. You can read more about nested navigation graphs [here](defining-navgraphs).
* `navArgsDelegate` - a way to delegate the navigation arguments to some other data class. Read more [here](destination-arguments/navigation-arguments#navigation-arguments-class-delegate)
* `deepLinks` - define deep links to this destination. Read more [here](deeplinks)
* `style` - class that defines the style the destination is shown in or is animated when entering or leaving the screen. Read more [here](styles-and-animations)

## Generated Destination object

Each annotated Composable will generate a `Destination` object. These objects will automatically be used when `DestinationsNavHost` is called.
Here is an example:

```kotlin title=ProfileScreenDestination.kt
object ProfileScreenDestination : TypedDestination<ProfileScreenNavArgs> {

    override operator fun invoke(navArgs: ProfileScreenNavArgs): Direction {
        //...
    }
    
    operator fun invoke(
        arg1: Long,
        arg2: String,
    ): Direction {
        //...
    }

    override val route: String = "profile_screen/{arg1}/{arg2}"
    
    override val arguments get() = listOf(
        navArgument("arg1") {
            //...
        },
        navArgument("arg2") {
            //...
        }
    )

    override val deepLinks get() = listOf(
        navDeepLink {
            //...
        }
    )

    override val style = //...

    @Composable
    override fun DestinationScope<ProfileScreenNavArgs>.Content(
        dependenciesContainerBuilder: DependenciesContainerBuilder<ProfileScreenNavArgs>.() -> Unit
    ) {
        //...
    }
                    
    override fun argsFrom(navBackStackEntry: NavBackStackEntry): ProfileScreenNavArgs {
        //...
    }
                
    override fun argsFrom(savedStateHandle: SavedStateHandle): ProfileScreenNavArgs {
        //...
    }
}
```

Some points about generated Destinations:

- You can invoke these `Destinations` to create a valid `Direction` object you can then pass to the navigators. Read more about navigation [here](navigation/basics).
Another reason to interact with `Destinations` is when using the `argsFrom` methods which can be used to get the navigation arguments in the form of a `data class` from either a `NavBackStackEntry` or a `SavedStateHandle`.

- If not using `navArgsDelegate` in the annotation, a generated class with name `NavArgs` will be nested in the `Destination`. Either way, the `argsFrom` method will return that data class containing your navigation arguments.

- The other fields/methods from `Destination` interface are used to build the navigation graph when calling `DestinationsNavHost`. Usually, there are no reasons to use them in your code.

- You can get the `Destination` correspondent to a certain `NavBackStackEntry` with the `appDestination` extensions which can be found in `SingleModuleExtensions.kt`.

- Besides, `Destination` is a sealed interface, which opens possibilities for your logic to make sure is applied to all of them.
A nice example of using it is to make some extension functions/properties, like this:

```kotlin
@get:StringRes
val Destination.title
    get(): Int {
        return when (this) {
            GreetingScreenDestination -> R.string.greeting_screen
            ProfileScreenDestination -> R.string.profile_screen
            SettingsDestination -> R.string.settings_screen
            FeedDestination -> R.string.feed_screen
            ThemeSettingsDestination -> R.string.theme_settings_screen
        }
    }
```
