---
sidebar_position: 9
---

# Deep links

Deep links to screen Composables and NavGraphs are supported with Compose Destinations.

You can define deep links to a destination like this:

```kotlin
@Destination<RootGraph>(
  deepLinks = [
    DeepLink(
      uriPattern = "https://myapp.com/user/{id}"
    )
  ]
)
@Composable
fun UserScreen(
  navigator: DestinationsNavigator,
  id: Int
)
```

Or to NavGraphs:

```kotlin
@NavGraph(
    deepLinks = [
      DeepLink(
        uriPattern = "https://myapp.com/user/{id}"
      )
    ],
    navArgs = UserGraph.Args::class
)
annotation class UserGraph {
    data class Args(val id: Int)
}
```

Besides `uriPattern`, `DeepLink` class has other ways of defining it like `action` and `mimetype`. You can read more in [official documentation](https://developer.android.com/jetpack/compose/navigation#deeplinks).

## FULL_ROUTE_PLACEHOLDER

You can also use the placeholder suffix `FULL_ROUTE_PLACEHOLDER` in your `uriPattern`. In the code generation process, it will be replaced with the full route of the destination which contains all the destination arguments. So, for example, this would result in the same `uriPattern` as the above example:

```kotlin
@Destination(
  route = "user",
  deepLinks = [
    DeepLink(
      uriPattern = "https://myapp.com/$FULL_ROUTE_PLACEHOLDER"
    )
  ]
)
@Composable
fun UserScreen(
  navigator: DestinationsNavigator,
  id: Int
)
```

The cool thing about using `FULL_ROUTE_PLACEHOLDER` is that you can always use the corresponding generated `Destination` invoke function as if you were navigating to it. Then, instead of passing the resulting `Direction` to a navigator, you call `.route` on it and use that when building the deep link URI:

```kotlin
val validUserScreenRoute = UserScreenDestination(id = 1).route
val uriForUserScreen = "https://myapp.com/$validUserScreenRoute".toUri()
```

The above URI will always match the `UserScreen` correctly even if you add more arguments and even if some of them are complex types (`Parcelable`, `Array`, etc). Also, if the added arguments are mandatory, you will have to come here and add them as well, otherwise it's a compile-time error! Neat!

## Screens with mandatory complex navigation arguments types

If you have a screen that declares a mandatory navigation argument of `Parcelable`/`Serializable`/[@kotlinx.serialization.Serializable](https://github.com/Kotlin/kotlinx.serialization) type (or Array of those), you need to be explicit about how that type is represented in the deep link route you are expecting.
For this, you need to use `@NavTypeSerializer` annotation in a class that implements either `DestinationsNavTypeSerializer<YOUR_NAV_ARG_TYPE>`.

Example:
```kotlin
@Parcelize
data class Things(
    val thingOne: String,
    val thingTwo: String
) : Parcelable
```

```kotlin
@NavTypeSerializer
class ThingsNavTypeSerializer : DestinationsNavTypeSerializer<Things> {

    override fun toRouteString(value: Things): String {
        return "${value.thing1};${value.thing2}"
    }

    override fun fromRouteString(routeStr: String): Things {
        val things = routeStr.split(";")
        return Things(things[0], things[1])
    }
}
```

After this, you'd be able to use a deep link for this destination:

```kotlin
@Destination(
    deepLinks = [
        DeepLink(uriPattern = "https://myapp.com/things_screen/{things}")
    ]
)
@Composable
fun ThingsScreen(
    things: Things
) {
    //...
}
```

And the link that would lead users to this screen would be `https://myapp.com/things_screen/thingOne;thingTwo`. Given the above `@NavTypeSerializer` annotated class, the navigation argument received would be created by calling the `fromRouteString` method (so in the end, it would be `Things("thingOne", "thingTwo")`).

:::note
 For [custom navigation types](arguments/navigation-arguments#custom-navigation-argument-types), since they are so only because you defined a `@NavTypeSerializer`, the string representation in the deep link will need to match what is expected there in the `fromRouteString` method.
:::

## Arrays / ArrayLists arguments on deep links

Array and ArrayList navigation arguments are represented on deep links as comma separated values surrounded with brackets (example: `[1,2,3]`). If each of those values needs to be "URI encoded" to be safely used on URI, then your commas need to be encoded twice. This is the only way we can safely parse the value from the route without considering other possible commas that could otherwise be present on one of the values.

So:
- **If your app is the one prepraring the URI for the deep link** (example: to pass to a notification) you can use the invoke method on the corresponding generated `Destination` (as if you were navigating to it) and then call `.route` on the result of that. This will give you a valid route you can append to the deep link prefix of your app which will always work and you don't need to worry about how the arguments are represented.
- **If the deep link is prepared from outside the app**, remember that the commas need to be "doubly encoded", i.e, you need to separate values with "%252C", for the following types:

- `Array<String>`, `ArrayList<String>`, `Array` and `ArrayList` of `Parcelable`, `Serializable`, `@Serializable` and  [custom nav types](arguments/navigation-arguments#custom-navigation-argument-types).

Taking the same example as above but changing the argument to array:

```kotlin
@Destination(
    deepLinks = [
        DeepLink(uriPattern = "https://myapp.com/things_screen/{things}")
    ]
)
@Composable
fun ThingsScreen(
    things: Array<Things>
) {
    //...
}
```

Now, a deep link for this screen (also considering the above `@NavTypeSerializer`) would be something like:

`https://myapp.com/things_screen/[thingOne;thingTwo%252CthingThree;thingFour]`

And this would result in the app navigating to the above `ThingsScreen` with a navigation argument equal to the result of `arrayOf(Things("thingOne", "thingTwo"), Things("thingThree", "thingFour"))`.