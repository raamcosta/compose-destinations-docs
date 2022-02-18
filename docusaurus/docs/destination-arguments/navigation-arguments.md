---
sidebar_position: 1
---

# Navigation arguments

To declare navigation arguments you can just add them to the Composable function:

```kotlin
@Destination
@Composable
fun ProfileScreen(
    id: Int // <- this will be a mandatory navigation argument!
)
```

Only arguments of type `String`, `Boolean`, `Int`, `Float`, `Long`, `Parcelable`, `Serializable` and `Enums` will be considered navigation arguments. <br/>
If some of the arguments are not mandatory, i.e they may not be sent when navigating to this screen, you can mark them as nullable or define default values for them.

:::note

Only `String`, `Parcelable`, `Serializable` and `Enums` navigation arguments can be nullable when using Compose Navigation.

:::

```kotlin
@Destination
@Composable
fun ProfileScreen(
    id: Int = -1, // <- optional navigation argument. If it is not sent by previous screen, -1 will be received here
    name: String? // <- optional navigation argument. It will be null if not sent by previous screen
)
```

Navigation arguments' default values must be resolvable from the generated `Destination` class, so you cannot use private values as default for navigation arguments. 

### Navigation arguments class delegate

The above approach is simple and works great if you intend to use the navigation arguments inside the screen Composable. However, if you do not, for example, if you use a ViewModel for that screen and it is the one that will actually use the navigation arguments, it would be awkward to have to declare them in the Composable function.

So in these cases, you can declare a specific data class with the navigation arguments and set it in the annotation. This class needs to have a public constructor where the navigation arguments are defined.

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
