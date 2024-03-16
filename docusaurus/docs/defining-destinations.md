---
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Defining Destinations

The first step when using Compose Destinations is to mark the Composables you want to navigate to as "Destinations".
This will trigger the annotation processor to generate a `Destination` object with all needed information to include the Composable in the navigation graph.

## Destination annotation

To mark a Composable as a destination, use the `@Destination<RootGraph>` annotation:

```kotlin
@Destination<RootGraph> 
@Composable
fun WelcomeScreen() {
    //...
}
```

As is, this will create an entry in the "root" navigation graph with no navigation arguments (check how you declare those [here](arguments/navigation-arguments)), with route "welcome_screen".

There are a lot of ways to configure this destination.
Lets see an example where all those are used:

```kotlin
@Destination<ProfileGraph>(
    start = true,
    navArgs = ProfileScreenNavArgs::class,
    style = ProfileScreenTransitions::class,
    deepLinks = [DeepLink(uriPattern = "https://destinationssample.com/$FULL_ROUTE_PLACEHOLDER")],
    wrappers = [MyScrenWrapper::class],
    route = "profile",
    visibility = CodeGenVisibility.INTERNAL,
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

* `start` - If true (default is false), marks this destination as the start of its navigation graph. In this case, since this would belong to the `ProfileGraph` navigation graph (as defined in the annotation type arg `<ProfileGraph>`) when navigating to that nested navigation graph, this screen would be shown.
  Each navigation graph needs one and only one start destination. A compile-time check is in place to ensure this.
* `navArgs` - A way to delegate the navigation arguments to some other data class. Read more [here](arguments/navigation-arguments)
* `style` - Class that defines the style the destination is shown in or is animated when entering or leaving the screen. Read more [here](styles-and-animations)
* `deepLinks` - Define deep links to this destination. Read more [here](deeplinks)
* `wrappers` - Array of `DestinationWrapper` classes. These are a good way to reuse compose logic on multiple screens. Read more [here](destination-wrappers)
* `route` - This is a way to override the default route for this destination (which would be "profile_screen" in this case). Avoid using it unless really necessary for some reason. Compose Destinations is abstracting you from the existence of "routes" for the most part.
* `visibility`- Controls the visibility of the generated Destination class. `PUBLIC` by default. Mostly useful when you want to expose only a Nav Graph from a given module, and all its Destinations shouldn't be exposed. When doing that, make the Composable function also internal, to not expose that either.

## Multiple `@Destination` annotations on a single Composable

If you have a Composable function that you want to register on multiple screens, or maybe you need a `Dialog` version of a destination, you can use multiple `@Destination` annotations.
Example:

```kotlin
@Destination<RootGraph>
@Destination<ProfileGraph>(style = DestinationStyle.Dialog::class)
@Composable
fun MyScreen() { /*...*/ }
```

This would create a `RootMyScreenDestination` and a `ProfileMyScreenDestination` with dialog style.

:::info
If multiple Destinations in the same Composable belong to the same graph, then you'll need to use `route` parameter to give at least one of these a different name.
:::

## Generated Destination object

Each annotated Composable will generate a `Destination` object. The nav graph type used in the annotation will contain that Destination object as one of its direct children.
When calling `DestinationsNavHost`, the passed in nav graph will contain all destinations and nested graphs.  

Some points about generated Destinations:

- You can invoke these `Destinations` to create a valid `Direction` object you can then pass to the navigators. Read more about navigation [here](navigation/basics).

- Another reason to interact with `Destinations` is when using the `argsFrom` methods which can be used to get the navigation arguments in the form of a `data class` from either a `NavBackStackEntry` or a `SavedStateHandle`.

- If not using `navArgs` in the annotation, a generated class with name `NavArgs` will be nested in the `Destination`. Either way, the `argsFrom` method will return that data class containing your navigation arguments.

- The other fields/methods from the `Destination` are used to build the navigation graph when calling `DestinationsNavHost`. Usually, there are no reasons to use them in your code. If you feel like you need to use them it might be an indication that there are better ways to do it in the library.

- You can get the `Destination` correspondent to a certain `NavBackStackEntry` with the `destination()`.

## Centralizing Destination annotation configuration

Sometimes, you might find a scenario where multiple or even most of your module's `@Destination usages share some similarities.
When that happens, it might be a little repetitive to have to type all of those things over and over.

In these cases, you can centralize this by creating your own annotations that will be picked up by Compose Destinations.

Let's say, you want to make all Destinations of current module internal, since this module is exposing a NavGraph that contains all destinations.
You could define `visibility = CodeGenVisibility.INTERNAL` in all your `@Destination` usages, but, instead, you can create an `InternalDestination` annotation.

```kotlin
@Repeatable // use if you need to repeat annotations on a single composable function
@Destination<Nothing>( // in this case, because "InternalDestination" is opening the graph choice to its users (see: "<T: Annotation>"), this graph here does not matter
  visibility = CodeGenVisibility.INTERNAL
)
annotation class InternalDestination<T: Annotation>(
  val route: String = Destination.COMPOSABLE_NAME,
  val start: Boolean = false,
  val navArgs: KClass<*> = Nothing::class,
  val deepLinks: Array<DeepLink> = [],
  val style: KClass<out DestinationStyle> = DestinationStyle.Default::class,
  val wrappers: Array<KClass<out DestinationWrapper>> = [],
)

@InternalDestination<FeatureXGraph>(start = true)
@Composable
internal fun MyScreen() { /*...*/ }
```

Note how this annotation is copying all parameters from the library's `Destination`, except the `visibility`.
You **DO NOT** need to do that. You just need to copy the ones you want usages of your annotation to be able to use.

For example, let's say this is a feature module and all destinations belong to the same graph `FeatureXGraph`.
Let's also say you only ever use `start` and `navArgs` parameters on this module.
In this case, you can simplify this annotation to:

```kotlin
@Destination<FeatureXGraph>(
  visibility = CodeGenVisibility.INTERNAL
)
annotation class FeatureXDestination(
  val start: Boolean = false,
  val navArgs: KClass<*> = Nothing::class,
)

@FeatureXDestination(start = true)
@Composable
internal fun MyScreen() { /*...*/ }
```

This is all fine, but what if this module actually has two nav graphs, but still all
destinations should be internal?
Well, good news, you can have multiple levels of this:

```kotlin title=FeatureXNavGraphs
// in this case, because "InternalDestination" is opening the graph choice to its users
// (see: "<T: Annotation>"), this graph here does not matter
@Destination<Nothing>(
  visibility = CodeGenVisibility.INTERNAL
)
annotation class InternalDestination<T: Annotation>(
  val start: Boolean = false,
  val navArgs: KClass<*> = Nothing::class,
)

@InternalDestination<LoginGraph>
annotation class LoginDestination(
  val start: Boolean = false,
  val navArgs: KClass<*> = Nothing::class,
)

@InternalDestination<ProfileGraph>
annotation class ProfileDestination(
  val start: Boolean = false,
  val navArgs: KClass<*> = Nothing::class,
)
```

```kotlin title=Destinations
@LoginDestination(start = true)
@Composable
internal fun LoginScreen() { /*...*/ }

@ProfileDestination(
    start = true,
    navArgs = ProfileNavArgs::class
)
@Composable
internal fun ProfileScreen() { /*...*/ }
```

## Register Activities as Destinations

Even if for new apps, we recommend having a single Activity, if you're working
on a project that would still benefit from navigating to another Activity, you might
want to register these Activities as destinations.

Official compose navigation has APIs to achieve this, and Compose Destinations does to.

Example:

<Tabs>
  <TabItem value="kotlin" label="kotlin" default>

```kotlin title=MyActivity.kt
@ActivityDestination<RootGraph>
class MyActivity: Activity {
  // ...
}
```

</TabItem>
  <TabItem value="java" label="java">

```java title=MyActivity.java
@JavaActivityDestination(navGraph = RootGraph.class)
public class MyActivity extends Activity {
  // ...
}
```
  </TabItem>
</Tabs>

There are some ways to configure these Destinations, same things we have on official APIs.
This includes:

Same functionality as with normal `Destination` annotation:
* `route`, `start`, `navArgs`, `deepLinks`, `visibility`

Specific to Activities: (info taken from official lib docs)
* `activityClass` - _Set an explicit ComponentName to navigate to._
* `targetPackage` - _Set an explicit application package name that limits the components this destination will navigate to._
* `action` - _Sets the action sent when navigating to this destination._
* `dataUri` - _Sets a static data URI that is sent when navigating to this destination._
* `dataPattern` - _Sets a dynamic data URI pattern that is sent when navigating to this destination._
