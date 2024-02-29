---
sidebar_position: 2
---

# Providing ViewModels to your Screens

## Getting a ViewModel specific to one Screen

Android Architecture Components ViewModel is a useful class that can easily be tied to a `NavBackStackEntry`. This means that the state of your screen is live while that screen is in the back stack. If the user goes back to that screen, you don't need to do anything extra: the previous state will still be there.

Even though Compose Destinations will call your annotated Composables with a limited set of components it can provide out the box (read about them [here](../destination-arguments/navhost-level-parameters)), there are a few ways you can get the ViewModel.

:::important
In these next examples, I'll be using `hiltViewModel()` function to get the ViewModel. 
If you're not using Hilt, then check the [last section of this page](#make-your-one-liner-viewmodel-getter) for a way to make your own one-liner function to replace `hiltViewModel()` with.
:::

### Using default parameters feature

This is probably the most simple approach if you have a simple function you can call in a Composable scope to get a ViewModel.

```kotlin
@Destination
@Composable
fun MyScreen(
    viewModel: MyScreenViewModel = hiltViewModel()
) { /*...*/ }
```

### Using a setup Composable

A setup Composable is a place to get all state and "event handlers" and then call the Composable that will compose the actual screen content which can then just receive state and lambdas.

```kotlin
@Destination
@Composable
fun MyScreen() {
    val viewModel: MyScreenViewModel = hiltViewModel()
    
    MyScreenContent(
        isButtonEnabled = viewModel.isButtonEnabled, // example of state
        onButtonClick = viewModel::onButtonClicked // example of events
    )
}


@Composable
fun MyScreenContent(
    isButtonEnabled: Boolean,
    onButtonClick: () -> Unit
) { /*...*/ }
```

If you're used to Jetpack Compose navigation, think of this method as you would think about the setup code you would do inside `NavGraphBuilder`. With Compose Destinations, whatever you'd do there, you can do in this "setup" Composable.

:::note
Notice how your "Content" is a "pure" Composable. It only takes stuff that doesn't depend on the platform, it could even be part of a module shared in Kotlin Multiplatform.  
Of course, you can accomplish the same thing with any of the other approaches.
:::

### Using `dependenciesContainerBuilder`

Even though this method is usually more appropriate to prepare dependencies which will be used by multiple/all screens, you can still use it for this case:

```kotlin
DestinationsNavHost(
    dependenciesContainerBuilder = { //this: DependenciesContainerBuilder<*>
        dependency(MyScreenDestination) { hiltViewModel<MyScreenViewModel>() }
    }
)
```

And then: 

```kotlin
@Destination
@Composable
fun MyScreen(
    viewModel: MyScreenViewModel // <-- this will be provided by the lib through the `dependenciesContainerBuilder`
)
```

### Manually calling your screen Composable

This is the closest way to how you'd do it with Jetpack Compose Navigation. But with Compose Destinations the only thing you're doing is calling the Composable. No navigation arguments or navigation graphs declaration done in the same place:

```kotlin
DestinationsNavHost(
    //...
) {
    composable(MyScreenDestination) { //this: DestinationScope<MyScreenDestination.NavArgs>
        MyScreen(
            viewModel = hiltViewModel()
        )
    }
}
```

Contrary to if you were using Jetpack Compose Navigation, you are not building the navigation graph here (that information comes through the `navGraph` parameter). So you don't need to do this for all your screens, just the ones that need some parameters that the library cannot provide.

## Share ViewModels between multiple destinations

If you want to share a ViewModel with multiple destinations, you need to choose a scope that lives longer than a specific screen. Usually that will be either a nested navigation graph if you want to share a ViewModel with all destinations that belong to that nested nav graph, or an Activity if you want to share a ViewModel with all your destinations.

Either way, in this case, the simplest option (even though the above ones can also work) is to use `dependenciesContainerBuilder` of `DestinationsNavHost` function.
Here is what that looks like:

```kotlin
@Composable
fun AppNavigation(
    activity: ComponentActivity
) {
    DestinationsNavHost(
        //...
        dependenciesContainerBuilder = { //this: DependenciesContainerBuilder<*>

            // 👇 To tie SettingsViewModel to "settings" nested navigation graph, 
            // making it available to all screens that belong to it
            dependency(NavGraphs.settings) {
                val parentEntry = remember(navBackStackEntry) {
                    navController.getBackStackEntry(NavGraphs.settings.route)
                }
                hiltViewModel<SettingsViewModel>(parentEntry)
            }

            // 👇 To tie ActivityViewModel to the activity, making it available to all destinations
            dependency(hiltViewModel<ActivityViewModel>(activity))
        }
    )
}
```

Then a screen that belongs to `SettingsNavGraph` navigation graph could just do:

```kotlin
@SettingsNavGraph
@Destination
@Composable
fun MainSettingsScreen(
    settingsViewModel: SettingsViewModel
)
```

As well as all Destinations can also declare a `activityViewModel: ActivityViewModel`.

:::note
The example uses `hiltViewModel`, but check the next sections if you don't use Hilt.
:::

## Make your one liner ViewModel getter

:::info
This section is not directly related to Compose Destinations. This would be true and valid even if you were not using Compose Destinations library.  
I just felt like this could be helpful as I have seen some confusion around getting a ViewModel tied to the navigation destination.
:::

In previous examples, I used the most simple way of getting a view model instance, and that is with `hiltViewModel()` which belongs to Hilt Dependency Injection framework.

I've seen some confusion in the community where some people believe that you need Hilt to get a ViewModel that is tied to a `NavBackStackEntry`. That is not true at all. The only thing Hilt facilitates is injecting dependencies to that ViewModel at the same time. But with some manual setup, you can make your function.

### Manual or no dependency injection

If you're manually setting up dependency injection in your code or you simply are not using dependency injection, you can do this:

```kotlin
@Composable
inline fun <reified VM : ViewModel> viewModel(
    viewModelStoreOwner: ViewModelStoreOwner = checkNotNull(LocalViewModelStoreOwner.current) {
        "No ViewModelStoreOwner was provided via LocalViewModelStoreOwner"
    },
    savedStateRegistryOwner: SavedStateRegistryOwner = LocalSavedStateRegistryOwner.current
): VM {
    return androidx.lifecycle.viewmodel.compose.viewModel(
        viewModelStoreOwner = viewModelStoreOwner,
        factory = ViewModelFactory(
            owner = savedStateRegistryOwner,
            defaultArgs = (savedStateRegistryOwner as? NavBackStackEntry)?.arguments,
             //remove this line if you're not using Dependency injection
            dependencyContainer = [ACCESS YOUR DEPENDENCIES GRAPH HERE SOMEHOW],
        )
    )
}

class ViewModelFactory(
    owner: SavedStateRegistryOwner,
    defaultArgs: Bundle?,
    //remove this line if you're not using Dependency injection
    private val dependencyContainer: DependencyContainer
) : AbstractSavedStateViewModelFactory(
    owner,
    defaultArgs
) {

    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel?> create(
        key: String,
        modelClass: Class<T>,
        handle: SavedStateHandle
    ): T {
        return when (modelClass) {
            ProfileViewModel::class.java -> ProfileViewModel(
                dependencyContainer.getProfileLikeCountUseCase,
                ProfileScreenDestination.argsFrom(handle)
            )

            GreetingViewModel::class.java -> GreetingViewModel()

            else -> throw RuntimeException("Unknown view model $modelClass")
        } as T
    }
}
```

As seen above, if you want a single function for all viewModel types, then you need a single `ViewModelFactory` that can create all your types of ViewModels. Alternatively, you could have one function for each ViewModel (example: `profileViewModel()` to get `ProfileViewModel` by using a `ProfileViewModelFactory`):

```kotlin

class ProfileViewModel(
    private val getProfileLikeCountUseCase: GetProfileLikeCountUseCase,
    private val navArgs: ProfileScreenNavArgs
): ViewModel(){
    ...
}

class ProfileViewModelFactory(
    owner: SavedStateRegistryOwner,
    defaultArgs: Bundle?,
    private val getProfileLikeCountUseCase: GetProfileLikeCountUseCase
): AbstractSavedStateViewModelFactory(owner, defaultArgs) {

    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel?> create(
        key: String,
        modelClass: Class<T>,
        handle: SavedStateHandle
    ): T {
        return ProfileViewModel(
            getProfileLikeCountUseCase,
            ProfileScreenDestination.argsFrom(handle)
        ) as T
    }
}

@Composable
fun profileViewModel(
    savedStateRegistryOwner: SavedStateRegistryOwner = LocalSavedStateRegistryOwner.current
): ProfileViewModel {
    val dependencyContainer = [ACCESS YOUR DEPENDENCIES GRAPH HERE SOMEHOW]
    val factory = ProfileViewModelFactory(
        owner = savedStateRegistryOwner,
        defaultArgs = (savedStateRegistryOwner as? NavBackStackEntry)?.arguments,
        getProfileLikeCountUseCase = dependencyContainer.getProfileLikeCountUseCase
    )
    return viewModel(factory = factory)
}

@Composable
@Destination(
    navArgsDelegate = ProfileScreenNavArgs::class
)
fun ProfileScreen(
    viewModel: ProfileViewModel = profileViewModel()
){
    Text("Profile Screen")
}
```

This does mean that every time you add a new ViewModel to your code base, you'll have to come here and add that entry to the `when` statement above, or create a single `ViewModelFactory` per `ViewModel`. Nothing is perfect, and this is definitely one reason to make you want to use a Dependency Injection framework like Hilt, so that this is handled for you.

:::info "[ACCESS YOUR DEPENDENCIES GRAPH HERE SOMEHOW]"
If you're using manual Dependency injection, you must treat this function as you do with accessing your dependencies graph in an Android entry point (Activity, Fragment, etc), i.e, you need to directly access it somehow.  
There are plenty of ways to do this depending on where you're saving the dependencies container instance: you could use [CompositionLocals](https://developer.android.com/jetpack/compose/compositionlocal) feature to provide the container, you could access your singleton `Application` instance if you're dependencies are available there, or you could do [what Hilt does internally](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:hilt/hilt-navigation/src/main/java/androidx/hilt/navigation/HiltNavBackStackEntry.kt) which is take the `LocalContext.current` and try to get an Activity from that, then you can get the dependency container declared in that Activity.
:::

### Other DI frameworks

If you're using a DI framework other than Hilt (Koin, f.e) then you need to check that framework's documentation in how you can get an instance of a ViewModel.

Remember that if in your framework you have to explicitly pass something like `NavBackStackEntry`, `ViewModelStoreOwner` or `SavedStateRegistryOwner` then check the above example to see how to get that. You can use them to make your own wrapper calling the framework method.
