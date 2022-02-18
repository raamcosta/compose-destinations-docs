---
sidebar_position: 10
---

# Code generation configs

## Generated files package name

If you want the generated files to be placed in a specific package name, you can configure it like this:

```kotlin
ksp {
    arg("compose-destinations.codeGenPackageName", "your.preferred.packagename")
}
```

## Disabling NavGraphs generation

You can disable the `NavGraphs` generated object like this:

```kotlin
ksp {
    arg("compose-destinations.generateNavGraphs", "false")
}
```

This config is only meant for the default (`"singlemodule"`) mode. See more about modes on next section.
It will make `start` and `navGraph` parameters of the `@Destination` annotation ignored in the code generating process since these are hints only used in the generating of the `NavGraphs` object. KSP task will log some warnings about this.
If you do this, you will have more control over the navigation graphs of your app. Read more about when you might want to do this [here](defining-navgraphs#manually-defining-navigation-graphs).


## Multi module configs

```kotlin
ksp {
   arg("compose-destinations.mode", "[GENERATION_MODE_FOR_MODULE]")
   arg("compose-destinations.moduleName", "[YOUR_MODULE_NAME")
}
```

For multi-module apps, you can now use the above two configs in each module's `build.gradle` where you are going to use Compose Destinations `ksp` dependency (in other words where you will annotate composables with `@Destination`). `GENERATION_MODE_FOR_MODULE` can be replaced with:

- `"destinations"`:
KSP will generate the destinations of the module and expose a list with all of them. Doesn't generate any nav graphs. The nav graphs should then be manually built in the "navigation module" where you call the DestinationsNavHost.
This is useful if your module wants to expose single or multiple destinations but they should belong to a navigation graph that also contains destinations from other modules. (Example of usage: Chris Banes tivi project - https://github.com/raamcosta/tivi)

- `"navgraphs"`:
The module will generate a nav graph and its destinations (or graphs if you use `navGraph` on some destination annotations).
This should be used if your module generates one or multiple navigation graphs that will then be consumed in another module, usually the "navigation module" that calls DestinationsNavHost. (Example of usage: Philipp Lackner project - https://github.com/raamcosta/CalorieTracker)

- `"singlemodule"` (default if none is specified):
Meant for apps where navigation-related code is in a single module. It generates a `NavGraphs` object with all nav graphs inside and it nests all of them inside the "root" one. It is also the only mode that generates a `CoreExtensions.kt` file (this is basically a file with utilities that you can always create yourself if you need to. These utilities use the generated `NavGraphs.root` and/or expose the (generated) sealed version of a Destination instead of the DestinationSpec from the core module).