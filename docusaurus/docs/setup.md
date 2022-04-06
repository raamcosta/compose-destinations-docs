---
sidebar_position: 2
---

# Setup

Compose destinations is available via maven central.

### 1. Add the KSP plugin

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

:::info
The version you chose for the KSP plugin depends on the Kotlin version your project uses.   
You can check https://github.com/google/ksp/releases for the list of KSP versions, then pick the last release that matches your Kotlin version.
Example:
If you're using `1.5.31` Kotlin version, then the last KSP version is `1.5.31-1.0.1`.
:::

### 2. Add the dependencies

[![Maven metadata URL](https://img.shields.io/maven-metadata/v?color=blue&metadataUrl=https://s01.oss.sonatype.org/service/local/repo_groups/public/content/io/github/raamcosta/compose-destinations/core/maven-metadata.xml)](https://maven-badges.herokuapp.com/maven-central/io.github.raamcosta.compose-destinations/core)

<Tabs>
  <TabItem value="groovy" label=".gradle" default>

```groovy title=build.gradle(:app)
implementation 'io.github.raamcosta.compose-destinations:core:<version>'
ksp 'io.github.raamcosta.compose-destinations:ksp:<version>'    
```
  
  </TabItem>
  <TabItem value="kotlin" label=".gradle.kts">

```kotlin title=build.gradle.kts(:app)
implementation("io.github.raamcosta.compose-destinations:core:<version>")
ksp("io.github.raamcosta.compose-destinations:ksp:<version>")
```

  </TabItem>
</Tabs>

:::info
If you want to use animations between screens and/or bottom sheet screens, replace above core dependency with:  
`implementation 'io.github.raamcosta.compose-destinations:animations-core:<version>'`   
this will use [Accompanist Navigation-Animation](https://github.com/google/accompanist/tree/main/navigation-animation) and [Accompanist Navigation-Material](https://github.com/google/accompanist/tree/main/navigation-material) internally.   
Read more about the next steps to configure these features [here](styles-and-animations)
:::


### 3. And finally, you need to make sure the IDE looks at the generated folder
See KSP related [issue](https://github.com/google/ksp/issues/37).  
Here is an example of how to do that for all your build variants:

<Tabs>
  <TabItem value="groovy" label=".gradle" default>

```groovy title=build.gradle
android {
  //...

  applicationVariants.all { variant ->
    kotlin.sourceSets {
        getByName(variant.name) {
            kotlin.srcDir("build/generated/ksp/${variant.name}/kotlin")
        }
    }
  }
}
```
  
  </TabItem>
  <TabItem value="kotlin" label=".gradle.kts">

```kotlin title=build.gradle.kts
android {
  //...
  
  applicationVariants.all {
    kotlin.sourceSets {
        getByName(name) {
            kotlin.srcDir("build/generated/ksp/$name/kotlin")
        }
    }
  }
}
```

  </TabItem>
</Tabs>

:::caution Important!
Replace `applicationVariants` with `libraryVariants` if the module uses `'com.android.library'` plugin!
:::