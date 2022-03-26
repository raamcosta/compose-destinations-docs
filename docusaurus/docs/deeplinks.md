---
sidebar_position: 9
---

# Deep links

Deep links to screen Composables are supported with Compose Destinations.

You can define deep links to a destination like this:

```kotlin
@Destination(
  route = "user",
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

Besides `uriPattern`, `DeepLink` class has other ways of defining it like `action` and `mimetype`. You can read more in [official documentation](https://developer.android.com/jetpack/compose/navigation#deeplinks).

## Screens with mandatory Parcelable/Serializable navigation arguments

If you have a screen that declares a mandatory navigation argument of `Parcelable`/`Serializable` type, you need to be explicit about how that type is represented in the deep link route you are expecting.
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
 For [custom navigation types](destination-arguments/navigation-arguments#custom-navigation-argument-types), since they are so only because you defined a `@NavTypeSerializer`, the string representation in the deep link will need to match what is expected there.
:::