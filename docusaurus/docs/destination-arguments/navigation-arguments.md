---
sidebar_position: 1
---

# Navigation arguments

## Basics

To declare navigation arguments you can just add them to the Composable function:

```kotlin
@Destination
@Composable
fun ProfileScreen(
    id: Int // <- this will be a mandatory navigation argument!
)
```

Only arguments of type `String`, `Boolean`, `Int`, `Float`, `Long`, `Parcelable`, `Serializable`, `Enums`,  annotated with [@kotlinx.serialization.Serializable](https://github.com/Kotlin/kotlinx.serialization) and [custom navigation types](#custom-navigation-argument-types) will be considered navigation arguments.  
If some of the arguments are not mandatory, i.e they may not be sent when navigating to this screen, you can mark them as nullable or define default values for them.

```kotlin
@Destination
@Composable
fun ProfileScreen(
    id: Int = -1, // <- optional navigation argument. If it is not sent by previous screen, -1 will be received here
    name: String? // <- optional navigation argument. It will be null if not sent by previous screen
)
```

Navigation arguments' default values must be resolvable from the generated `Destination` class, so you cannot use private values as default for navigation arguments. 

## Navigation arguments class delegate

The above approach is simple and works great if you intend to use the navigation arguments inside the screen Composable. However, if you do not, for example, if you use a ViewModel for that screen and it is the one that will actually use the navigation arguments, it would be awkward to have to declare them in the Composable function.

So in these cases, you can declare a specific data class with the navigation arguments and set it in the annotation.

> All the information above, regarding defining navigation arguments in the Composable itself, is also valid when defining the arguments this way. The difference is just that now we will get the arguments info from the constructor parameters and before we would get them from the Composable function parameters.

```kotlin
data class ProfileScreenNavArgs(
    val id: Long,
    val groupName: String?
)
```

Then in the `@Destination`:

```kotlin
@Destination(
    navArgsDelegate = ProfileScreenNavArgs::class
)
fun ProfileScreen() { /*...*/ }
```

Note that we can also still receive the arguments in the Composable too if we declare a parameter of the `navArgsDelegate` class, but you cannot define any other argument of navigation type (you should not need to anyway). A compile-time check is in place to make sure this is respected.

When using this feature, you'll notice that the generated Destination's `argsFrom` methods will will return the delegate navigation arguments class:

```kotlin
override fun argsFrom(navBackStackEntry: NavBackStackEntry): ProfileScreenNavArgs {
    //...
}

override fun argsFrom(savedStateHandle: SavedStateHandle): ProfileScreenNavArgs {
    //...
}
```

You can use the second one to get the arguments in the ViewModel from the `SavedStateHandle`.


## Custom navigation argument types

Besides types that are navigation arguments out of the box, you can make any type be considered a navigation argument type with a one-time easy setup. 

:::info
This feature can also be used determine how `Parcelable` or `Serializable` types will be represented in the route. This is useful if you want to deep link into a Screen that has one of these navigation arguments. Read more [here](../deeplinks#screens-with-mandatory-parcelableserializable-navigation-arguments).
:::

You may know that internally, Official Compose Navigation uses string routes to navigate. Well, to make an argument be able to be passed from screen to screen, we need to be able to convert its type to string and back. Hence, there is a `DestinationsNavTypeSerializer` interface that you can implement and annotate with `@NavTypeSerializer` to make code generation consider that type argument a type that can be passed when navigating.

Here is an example:

```kotlin
import androidx.compose.ui.graphics.Color
//...

@NavTypeSerializer
class ColorTypeSerializer : DestinationsNavTypeSerializer<Color> {
    override fun toRouteString(value: Color): String =
        value.toArgb().toString()

    override fun fromRouteString(routeStr: String): Color =
        Color(routeStr.toInt())
}
```

After this, you can pass `androidx.compose.ui.graphics.Color` as you would any other navigation argument.

:::caution
While this feature can be super helpful, remember that you should not be sending big classes in navigation.
The above example is perfect because `Color` is simple structure.  
Anyway, Compose Destinations gives you the tools to easily do this so you can test it with less upfront work. This is possible to do with Official Compose Navigation, but the setup has more boilerplate.
:::

:::note
If the type is not `Parcelable` nor `Serializable`, the library saves it in the Android `Bundle` as a String. So keep that in mind if you ever try to access the navigation argument directly without using `argsFrom` function of your corresponding `Destination`.
:::