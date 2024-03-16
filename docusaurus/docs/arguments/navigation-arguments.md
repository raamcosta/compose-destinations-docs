---
sidebar_position: 4
---

# Navigation Arguments

## Types

Compose destinations will consider the following types as navigation argument types:

- `String`
- `Boolean`
- `Int`
- `Long`
- `Float`
- `Parcelable`
- `Serializable` (java.io)
- `Enums`
- [@kotlinx.serialization.Serializable](https://github.com/Kotlin/kotlinx.serialization) annotated types
- [Custom navigation types](#custom-navigation-argument-types) (Types for which the user has defined a serialization to and from string)
- `Array` and `ArrayList` of the above types
> For `Boolean`, `Int`, `Float`, `Long`, you'll need to use `BooleanArray`, `IntArray`, `FloatArray`, `LongArray` instead of `Array<Boolean>`, `Array<Int>`, `Array<Float>`, `Array<Long>`.

:::info
When using `navArgs` of either `@Destination` or `@NavGraph`, the data class passed in holds
all navigation arguments, it is **NOT** itself the navigation argument.
So that class doesn't need to be `Serializable` or `Parcelable`. Instead, its fields need to.
:::

### Custom navigation argument types

Besides types that are navigation arguments out of the box, you can make any type be considered a navigation argument type with a one-time easy setup.

:::info
This feature can also be used to define how `Parcelable` or `Serializable` types will be represented in the route. This is useful if you want to deep link into a Screen that has one of these navigation arguments. Read more [here](../deeplinks#screens-with-mandatory-complex-navigation-arguments-types).
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
Anyway, Compose Destinations gives you the tools to easily do this so you can test it with less upfront work. This is possible to do with Official Compose Navigation, but the setup is way more involved.
:::

## Destination Navigation arguments

For Composables annotated with `@Destination`, there are two ways of defining nav arguments:

1. You can simply pass arguments of navigation argument types
and Compose Destinations will pick them up and register them accordingly.

For example:

```kotlin
@Destination<RootGraph>
@Composable
fun ProfileScreen(
    id: Int // <- this will be a mandatory navigation argument!
)
```

If some of the arguments are not mandatory, i.e they may not be sent when navigating to this screen, you can mark them as nullable or define default values for them.

```kotlin
@Destination<RootGraph>
@Composable
fun ProfileScreen(
    id: Int = -1, // <- optional navigation argument. If it is not sent by previous screen, -1 will be received here
    name: String? = null // <- optional navigation argument. It will be null if not sent by previous screen
)
```

Navigation arguments' default values must be resolvable from the generated `Destination` class, so you cannot use private values as default for navigation arguments.

This approach is simple and works great if you intend to use the navigation arguments inside the screen Composable. However, if you do not, for example, if you use a ViewModel for that screen and it is the one that will actually use the navigation arguments, it would be awkward to have to declare them in the Composable function.

So in these cases, 

2. You can define a class to hold all nav args

:::info
All the information above, regarding defining navigation arguments in the Composable itself, is also valid when defining the arguments this way. The difference is just that now we will get the arguments info from the constructor parameters and before we would get them from the Composable function parameters.
:::

```kotlin
data class ProfileScreenNavArgs(
    val id: Int = -1,
    val groupName: String? = null
)
```

Then in the `@Destination`:

```kotlin
@Destination<RootGraph>(
    navArgs = ProfileScreenNavArgs::class
)
fun ProfileScreen() { /*...*/ }
```

Note that we can also still receive the arguments in the Composable too if we declare a parameter of the `navArgsDelegate` class, but you cannot define any other argument of navigation type (you should not need to anyway). A compile-time check is in place to make sure this is respected.

When using this feature, you'll notice that the generated Destination's `argsFrom` methods will return the delegate navigation arguments class:

```kotlin
override fun argsFrom(navBackStackEntry: NavBackStackEntry): ProfileScreenNavArgs {
    //...
}

override fun argsFrom(savedStateHandle: SavedStateHandle): ProfileScreenNavArgs {
    //...
}
```

You can use the second one to get the arguments in the ViewModel from the `SavedStateHandle`.
Or you can use generated extension function `navArgs`:
```kotlin
val navArgs: ProfileScreenNavArgs = ProfileScreenDestination.argsFrom(savedStateHandle)

// OR

val navArgs: ProfileScreenNavArgs = savedStateHandle.navArgs()
```

:::note
Do not try to access a specific navigation argument by its string key from the `SavedStateHandle` or the `NavBackStackEntry`. Compose Destinations is here to abstract you from this and so internally it may be using
different types than what you expect.  
If you really need to do it for some reason, use the corresponding NavType class `get` methods. You can check in the generated `Destination` how it does it in the `argsFrom` methods.
:::


## NavGraph Navigation arguments

To define arguments on nav graphs, you can use `navArgs` parameter of `@NavGraph`.

Example:

```kotlin
data class ProfileGraphArgs(
    val id: String
)

@NavGraph<RootGraph>(
    navArgs = ProfileGraphArgs::class
)
annotation class ProfileGraph
```

To retrieve the arguments, it's similar to how we do for destinations. They also work for both `SavedStateHandle` or `NavBackStackEntry`.

Either:
```kotlin
val profileArgs: ProfileGraphArgs? = ProfileNavGraph.argsFrom(savedStateHandle)
```

Or:
```kotlin
val profileArgs: ProfileGraphArgs? = savedStateHandle.navGraphArgs<ProfileGraphArgs>()
```

If both the nav graph and its start route have arguments, a new class that contains both those arguments classes will be generated. So the types shown in the example above would likely be different.

:::caution Nav graph arguments are always nullable
Navigation arguments of nav graphs are tricky. They will be present if you navigate to the graph itself
(for above example, doing `navigator.navigate(ProfileNavGraph(id = "some id"))`) and they will not be present
if you navigate to one of its destinations directly.  
This is how official compose navigation works as well, Compose Destinations makes it clear by returning nullable.  
If you know in your case you always navigate to the Graph, you can do `requireNavGraphArgs` instead which will throw
an exception instead of returning nullable type.

Read more about navigating to nav graphs [here](../navigation/basics#navigate-to-navgraphs).
:::