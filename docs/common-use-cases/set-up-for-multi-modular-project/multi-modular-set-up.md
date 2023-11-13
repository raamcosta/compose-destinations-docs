---
sidebar_position: 1
---

# Setting-up for a Multi-Modular Project

When dealing with a multi-modular architecture, efficient app navigation is crucial for maintaining a clean and scalable codebase while removing the code complexities.

This is achievable with Compose Destinations as outlined below:


**Adding Compose Destination dependency, KSP and Parcelize plugins to the Base Module**

Firstly you need to apply the KSP plugin on your `gradle.build.kts` ( project--level ). 

You can find the [latest KSP version](https://github.com/google/ksp/releases) on GitHub and depending on your Compose Version you may need to [choose the respective](https://github.com/raamcosta/compose-destinations#2-add-the-dependencies) Compose Destinations library version to load onto your project.

```kotlin

// Apply ksp and parcelize plugins on gradle.build (project level)

plugins{

    id("com.android.application") version "xxx" apply false
    id ("com.android.library") version "xxx" apply false
    id ("com.google.devtools.ksp") version  "xxx" apply false
    id("org.jetbrains.kotlin.plugin.parcelize") version "xxx" apply false
}

```

 Thereafter, you need to add the plugins and dependencies to your base module's `gradle.build.kts` ( app level ) file.
 
You can check the [latest Compose Destinations release](https://github.com/raamcosta/compose-destinations/releases) to add to your project.




```kotlin
// Adding KSP and Parcelize plugins on gradle.kts (app)

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("kotlin-parcelize")
    id("com.google.devtools.ksp")
}
...

dependencies {
    ...
    // Compose Destinations and KSP Libs
    implementation(libs.compose.destinations.core)
    ksp(libs.compose.destinations.core)

    // AndroidX Compose Navigation Lib
    implementation(libs.compose.navigation)

    // AndroidX Compose Animation Lib
    implementation (libs.compose.animation)

}
```
We add official Navigation and Animation libs to take advantage of Navigation component’s infrastructure and features e.g. the `NavController`.

:::note

Prior Accompanist's [Navigation](https://google.github.io/accompanist/navigation-material/) and [Animation](https://google.github.io/accompanist/navigation-animation/) libraries have since been deprecated in favor of `Androidx` libraries.
:::


**Configuring gradle files for the other modules**

The main idea behind Compose Destinations is getting rid of boilerplate code using code generation under the hood.

Depending on your modularization strategy this set-up `gradle` set-up only applies to the feature modules which is where navigation takes place.

```kotlin
// apply ksp plugin - this example uses version catalog

plugins {
    alias(libs.plugins.com.android.library)
    alias(libs.plugins.org.jetbrains.kotlin.android)
    alias(libs.plugins.com.google.devtools.ksp)
}

// multi module configs

android {
    ...

    ksp {
        arg("compose-destinations.mode", "[GENERATION_MODE_FOR_MODULE]")
   arg("compose-destinations.moduleName", "[YOUR_MODULE_NAME")
    }
}

// adding dependencies

dependencies {
    ...
    implementation(libs.compose.destinations.core)
    ksp(libs.compose.destinations.ksp)
```

According to [the docs](https://composedestinations.rafaelcosta.xyz/codegenconfigs/#multi-module-configs), `GENERATION_MODE_FOR_MODULE` can be replaced with:

- `"destinations":` KSP will generate the destinations of the module and expose a list with all of them.

- `"navgraphs":` The module will generate a nav graph and its destinations.

- `"singlemodule":` Meant for apps where navigation-related code is in a single module.

In a multi-modular project go for `destinations` option for KSP to generate the destinations.

For a feature module with a name of `:feature:stats` you can have something like this:

```kotlin
 ksp {
        arg("compose-destinations.mode", "destinations")
        arg("compose-destinations.moduleName", "stats")
        
    }

```
In this example *GENERATION_MODE_FOR_MODULE* placeholder is replaced with *destinations* while *stats* replaces *YOUR_MODULE_NAME* placeholder.

Build the project ( or run `./gradlew kspDebugKotlin` from the terminal ) to generate all the destinations.

However, `destinations` option doesn't generate any `NavGraphs`; this will need to be created manually.

**Example of usage:** Tonnie's [CountriesPad Project](https://github.com/Tonnie-Dev/CountriesPad/blob/master/feature/stats/build.gradle.kts).


**Building the NavGraphs Object**

The `NavGraphs` is an object and it is recommended to have a globally accessible object residing on the base module.

Preferably this should be created inside your app module where you plan to have the Navigation package as illustrated below: 

![Navigation Package](https://raw.githubusercontent.com/Tonnie-Dev/CountriesPad/master/media/navigation_package.png "Navigation package inside the app module")


This is the sample code `NavGraphs` object:

```kotlin

object NavGraphs {

    //overview's module NavGraph - defines NavGraph by
     instantiating NavGraphSpecs
    val overview = object :NavGraphSpec{

        override val route = "overview"

        override val startRoute = OverviewScreenDestination
        override val destinationsByRoute= listOf<DestinationSpec<*>>(
                OverviewScreenDestination,
                DetailsScreenDestination
        )
                .associateBy{it.route}

    }

    //validator's module NavGraph

    val validator = object : NavGraphSpec { ...

    //stat's module NavGraph

    val stats = object :NavGraphSpec { ...

    //Root NavGraph showing Overview as the starting screen

    val root = object : NavGraphSpec {
        override val route = "root"
        override val startRoute = overview
        override val destinationsByRoute = emptyMap<String, DestinationSpec<*>>()
        override val nestedNavGraphs = listOf(overview, validator,stats )
    }

}
```
**Example of usage:** Tonnie's [CountriesPad Project](https://github.com/Tonnie-Dev/CountriesPad/blob/master/app/src/main/java/com/uxstate/countriespad/navigation/NavGraphs.kt) 

This object gathers the `Navgraphs` from other modules into a single "top-level" navigation graph to pass to the `DestinationsNavHost` call.

**Conditional Navigation**

Inside the `NavGraphs` object, you can also write a helper function to establish which screen to present to the user e.g. if the user is not authenticated then you need to present the Authentication Screen before navigating the user to other screens.




```kotlin
...
object NavGraphs {

//Util fxn to figure out the starting screen i.e. Auth or Home

private fun getStartDestination(): NavGraphSpec {

        //App.create() exists as singleton and can be called severally
        val user = App.create(Constants.APP_ID).currentUser

        return if (user != null && user.loggedIn)
            home
        else
            auth
    }

//Root NavGraph using getStartDestination() for startRoute

    val root = object : NavGraphSpec {
        override val route = "root"
        override val startRoute = getStartDestination()
        override val destinationsByRoute = emptyMap<String, DestinationSpec<*>>()
        override val nestedNavGraphs = listOf(auth, home, write)
    }

}
```


**Creating Navigator Interfaces for your Screens**

You need an interface that contains functions to navigate within the app. Therefore, for each Screen ( *Composable marked with `@destination`* ) create a simple inteface defining navigation functions applicable to that specific screen.

```kotlin

interface OverviewScreenNavigator {

    fun navigateToDetailsScreen(country: Country)
    fun navigateBackToOverviewScreen()
    
}
```
**Example of usage:** Tonnie's [CountriesPad Project](https://github.com/Tonnie-Dev/CountriesPad/blob/master/feature/overview/src/main/java/com/uxstate/overview/presentation/overview_screen/OverviewScreen.kt) 

**Common NavGraphNavigator Class**

Inside the Navigation package add `CoreNavigator` class that extends all the `Navigator Interfaces` defined on `@Destination` annotated composables.

The `CoreNavigator` class overrides and implements functions definition on your `@Destination` screens interfaces.

The class takes NavController parameter ( *from androidx.navigation.NavController*) on its constructor.

The `navController` is then used alongside Compose Destinations' `navigate()` function to accomplish navigation. The `navigate()` function ( *not navigateTo( )* function ) takes the KSP-generated destination instead of a String route.

```kotlin
import androidx.navigation.NavController
import com.ramcosta.composedestinations.navigation.navigate

class CoreNavigator(private val navController: NavController) : OverviewScreenNavigator{

    override fun navigateBackToOverviewScreen() {
        navController.navigate(OverviewScreenDestination)
    }

    override fun navigateToDetailsScreen(country: Country) {
        navController.navigate(DetailsScreenDestination(country))
    }

}
```

**Example of usage:** Tonnie's [CountriesPad Project](https://github.com/Tonnie-Dev/CountriesPad/blob/master/app/src/main/java/com/uxstate/countriespad/navigation/CoreNavigator.kt) 

**Creating Transitions**

Transitions are `enter`, `exit` and `pop` animations that are applied when navigating between different destinations within your app. They enhance the user experience by providing smooth visual effects when moving from one screen to another. 

Android provides a framework for specifying these transitions through the AndroidX Navigation component.

In compose the navigation transitions are still experimental but you can refer to the below example on Compose navigation animations.

**Example of usage:** Tonnie's [CountriesPad Project](https://github.com/Tonnie-Dev/CountriesPad/blob/master/app/src/main/java/com/uxstate/countriespad/navigation/NavTransitions.kt) 


**Creating DestinationsNavHost Composable**

Compose Destinations has a "NavHost-like" Composable that you can use as a base for all your screens.

It internally calls the Compose Navigation NavHost but automatically adds all `@Destination` annotated Composables of a given `NavGraph` instance to the NavHost.

You can find more info from the [docs](https://composedestinations.rafaelcosta.xyz/navhosts?_highlight=destinationsnavhost#destinationsnavhost).

It is inside this composable that all the navigation pieces are  hooked-up to create the `DestinationsNavHost`.

```kotlin
@OptIn( ExperimentalAnimationApi::class, ExperimentalMaterialNavigationApi::class)
@ExperimentalAnimationApi
@Composable
internal fun AppNavigation(
    navController: NavHostController,
    modifier: Modifier = Modifier,
) {
    // pass your enter/exit transitions here

    val navHostEngine = rememberAnimatedNavHostEngine(
            rootDefaultAnimations = RootNavGraphDefaultAnimations(
                    enterTransition = { ..
                        
    )

  //  DestinationsNavHost

    DestinationsNavHost(
            engine = navHostEngine,
            navController = navController,
            navGraph = NavGraphs.root,
            modifier = modifier,
            dependenciesContainerBuilder = {
                dependency(currentNavigator())
            }
    )
}



```

**Example of usage:** Tonnie's [CountriesPad Project](https://github.com/Tonnie-Dev/CountriesPad/blob/master/app/src/main/java/com/uxstate/countriespad/navigation/AppNavigation.kt)

**Calling DestinationNavHost in the MainActivity**

Finally call the `DestinationsNavHost` from your `AppTheme` on the `MainActivity`.

```kotlin
class MainActivity : ComponentActivity() { ...

@OptIn(ExperimentalAnimationApi::class)
override fun onCreate(savedInstanceState: Bundle?) { ...

setContent{

AppTheme {
                // call DestinationsNavHost on setContent{}
                AppNavigation(
                        navController = navController,
                        modifier = Modifier
                                .fillMaxSize()
                )
            }
}
```
:::note
This is only applicable in version 1 of Compose Destinations Library which can be replaced by a superior future version.
:::