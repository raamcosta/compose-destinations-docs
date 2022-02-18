---
sidebar_position: 2
---

# Setup

Compose destinations is available via maven central.

### 1. Add the KSP plugin:

> The version you chose for the KSP plugin depends on the Kotlin version your project uses.   
You can check https://github.com/google/ksp/releases for the list of KSP versions, then pick the last release that matches your Kotlin version.
Example:
If you're using `1.5.31` Kotlin version, then the last KSP version is `1.5.31-1.0.1`.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="groovy" label=".gradle" default>

```groovy title=build.gradle(:app)
plugins {
    //...
    id 'com.google.devtools.ksp' version '1.5.31-1.0.1' // Depends on your kotlin version
}
```
  
  </TabItem>
  <TabItem value="kotlin" label=".gradle.kts">

```kotlin title=build.gradle.kts(:app)
plugins {
    //...
    id("com.google.devtools.ksp") version "1.5.31-1.0.1" // Depends on your kotlin version
}
```

  </TabItem>
</Tabs>

### 2. Add the dependencies:

<Tabs>
  <TabItem value="groovy" label=".gradle" default>

```groovy title=build.gradle(:app)
implementation 'io.github.raamcosta.compose-destinations:core:1.3.1-beta'
ksp 'io.github.raamcosta.compose-destinations:ksp:1.3.1-beta'    
```
  
  </TabItem>
  <TabItem value="kotlin" label=".gradle.kts">

```kotlin title=build.gradle.kts(:app)
implementation("io.github.raamcosta.compose-destinations:core:1.3.1-beta")
ksp("io.github.raamcosta.compose-destinations:ksp:1.3.1-beta")
```

  </TabItem>
</Tabs>

> If you want to use animations between screens and/or bottom sheet screens, replace above core dependency with:   
`implementation 'io.github.raamcosta.compose-destinations:animations-core:<version>'`   
> this will use [Accompanist Navigation-Animation](https://github.com/google/accompanist/tree/main/navigation-animation) and [Accompanist Navigation-Material](https://github.com/google/accompanist/tree/main/navigation-material) internally.   
> Read more about the next steps to configure these features [here](styles-and-animations)


### 3. And finally, you need to make sure the IDE looks at the generated folder.
See KSP related [issue](https://github.com/google/ksp/issues/37).
An example for the debug/release variant would be:

<Tabs>
  <TabItem value="groovy" label=".gradle" default>

```groovy title=build.gradle
kotlin {
    sourceSets {
        debug {
            kotlin.srcDir("build/generated/ksp/debug/kotlin")
        }
        release {
            kotlin.srcDir("build/generated/ksp/release/kotlin")
        }
    }
}
```
  
  </TabItem>
  <TabItem value="kotlin" label=".gradle.kts">

```kotlin title=build.gradle.kts
kotlin {
    sourceSets {
        debug {
            kotlin.srcDir("build/generated/ksp/debug/kotlin")
        }
        release {
            kotlin.srcDir("build/generated/ksp/release/kotlin")
        }
    }
}
```

  </TabItem>
</Tabs>