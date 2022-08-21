---
sidebar_position: 1
slug: /
---

# Overview

<div style={{textAlign: 'center'}}>
  <img width="250" height="250" src="https://user-images.githubusercontent.com/80427734/147891822-5cd34c80-8dca-4d34-8278-2aa3bf36913f.png" />
</div>

<!-- I'm still on Compose and this is a vertical Spacer 💪 (yeah I'm that good at web dev) -->
<div style={{textAlign: 'center', padding: 30}}> 
</div>

A KSP library that processes annotations and generates code that uses Official Jetpack Compose Navigation under the hood. It hides the complex, non-type-safe and boilerplate code you would have to write otherwise.  
No need to learn a whole new framework to navigate - most APIs are either the same as with the Jetpack Components or inspired by them.

## Main features

  - Typesafe navigation arguments
  - Simple but configurable navigation graphs setup 
  - Navigating back with a result in a simple and type-safe way
  - Getting the navigation arguments from the `SavedStateHandle` (useful in ViewModels) and `NavBackStackEntry` in a type-safe way
  - Navigation animations through integration with [Accompanist Navigation-Animation](https://github.com/google/accompanist/tree/main/navigation-animation)
  - Bottom sheet screens through integration with [Accompanist Navigation-Material](https://github.com/google/accompanist/tree/main/navigation-material)
  - Easy deep linking to screens
  - All you can do with Official Jetpack Compose Navigation but in a simpler safer way!

## Materials

- Alex Styl's quick introduction videos[_Navigate using the Compose Destinations library_](https://www.composables.co/courses/destination-compose)
- Philipp Lackner's Youtube video [_Compose Navigation Just Got SO MUCH EASIER_ 😱](https://www.youtube.com/watch?v=Q3iZyW2etm4)
- Rafael Costa's blog post [_Compose Destinations: simpler and safer navigation in Compose with no compromises_](https://proandroiddev.com/compose-destinations-simpler-and-safer-navigation-in-compose-with-no-compromises-74a59c6b727d)
- Yanneck Reiß's blog post [_Type Safe Navigation With Jetpack Compose Destinations_](https://medium.com/codex/type-save-navigation-with-jetpack-compose-destinations-610514e85370)
- Google Dev Expert Kenji Abe's blog post [_Navigation Composeを便利にしてくれるライブラリ_](https://star-zero.medium.com/navigation-compose%E3%82%92%E4%BE%BF%E5%88%A9%E3%81%AB%E3%81%97%E3%81%A6%E3%81%8F%E3%82%8C%E3%82%8B%E3%83%A9%E3%82%A4%E3%83%96%E3%83%A9%E3%83%AA-c2d0133b3e84)
- aseem wangoo's blog post (and Youtube video inside): [_Using compose destinations_](https://flatteredwithflutter.com/using-compose-destinations%ef%bf%bc/)




## Basic Usage

### 1. Annotate your screen Composables with `@Destination`

```kotlin
@Destination
@Composable
fun ProfileScreen() { /*...*/ }
```

### 2. Add navigation arguments to the function declaration
`Parcelable`, `Serializable`, `Enum` types and classes annotated with [`@kotlinx.serialization.Serializable`](https://github.com/Kotlin/kotlinx.serialization) (as well as `Array`s and `ArrayList`s of these) are allowed with no additional setup!  
Besides, you can make any type a navigation argument type with a [one-time simple setup](destination-arguments/navigation-arguments#custom-navigation-argument-types).

```kotlin
@Destination
@Composable
fun ProfileScreen(
   id: Int, // <-- required navigation argument
   groupName: String?, // <-- optional navigation argument
   isOwnUser: Boolean = false // <-- optional navigation argument
) { /*...*/ }
```

:::info

There is an alternative way to define the destination arguments in case you don't need to use them
inside the Composable (as is likely the case when using ViewModel). Read more [here](destination-arguments/navigation-arguments#navigation-arguments-class-delegate).

:::

### 3. Build the project
Or `./gradlew kspDebugKotlin`, which should be faster, to generate all the Destinations. With the above annotated composable, a `ProfileScreenDestination` file (that we'll use in step 4) would be generated.

### 4. Use the generated Destination invoke method to navigate to it
It will have the correct typed arguments.

```kotlin
@RootNavGraph(start = true) // sets this as the start destination of the default nav graph
@Destination
@Composable
fun HomeScreen(
   navigator: DestinationsNavigator
) {
   /*...*/
   navigator.navigate(ProfileScreenDestination(id = 7, groupName = "Kotlin programmers"))
}
```
:::note

DestinationsNavigator is a wrapper interface to NavController that if declared as a parameter, will be provided for free by the library. NavController can also be provided in the exact same way, but it ties your composables to a specific implementation which will make it harder to test and preview. Read more [here](navigation/basics)

:::

### 5. Finally, add the NavHost call

```kotlin
DestinationsNavHost(navGraph = NavGraphs.root)
```

:::info

`NavGraphs` is a generated file that describes your navigation graphs and their destinations. By default all destinations will belong to "root" (@RootNavGraph), but you can create your own nav graphs annotations to have certain screens in other navigation graphs.

:::

This call adds all annotated Composable functions as destinations of the Navigation Host.

That's it! No need to worry about routes, NavTypes, bundles and strings. All that redundant and error-prone code gets generated for you.
