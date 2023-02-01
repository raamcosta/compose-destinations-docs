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
    id 'com.google.devtools.ksp' version '1.6.21-1.0.6' // Depends on your kotlin version
}
```
  
  </TabItem>
  <TabItem value="kotlin" label=".gradle.kts">

```kotlin title=build.gradle.kts(:app)
plugins {
    //...
    id("com.google.devtools.ksp") version "1.6.21-1.0.6" // Depends on your kotlin version
}
```

  </TabItem>
</Tabs>

:::info
The version you chose for the KSP plugin depends on the Kotlin version your project uses.   
You can check https://github.com/google/ksp/releases for the list of KSP versions, then pick the last release that matches your Kotlin version.
Example:
If you're using `1.6.21` Kotlin version, then the last KSP version is `1.6.21-1.0.6`.
:::

### 2. Add the dependencies

Compose Destinations has multiple active versions. 
The higher one uses the latest versions for Compose and Accompanist, while the others use only stable versions.
Choose the one that matches your Compose version, considering this table:

<table>
 <tr>
  <td>Compose 1.1 (1.1.x)</td><td><img alt="Maven Central" src="https://img.shields.io/maven-metadata/v?versionPrefix=1.5&color=blue&metadataUrl=https://s01.oss.sonatype.org/service/local/repo_groups/public/content/io/github/raamcosta/compose-destinations/core/maven-metadata.xml&style=for-the-badge)](https://maven-badges.herokuapp.com/maven-central/io.github.raamcosta.compose-destinations/core)"></img></td>
 </tr>
 <tr>
  <td>Compose 1.2 (1.2.x)</td><td><img alt="Maven Central" src="https://img.shields.io/maven-metadata/v?versionPrefix=1.6&color=blue&metadataUrl=https://s01.oss.sonatype.org/service/local/repo_groups/public/content/io/github/raamcosta/compose-destinations/core/maven-metadata.xml&style=for-the-badge)](https://maven-badges.herokuapp.com/maven-central/io.github.raamcosta.compose-destinations/core)"></img></td>
 </tr>
 <tr>
  <td>Compose 1.3 (1.3.x)</td><td><img alt="Maven Central" src="https://img.shields.io/maven-metadata/v?versionPrefix=1.7&color=blue&metadataUrl=https://s01.oss.sonatype.org/service/local/repo_groups/public/content/io/github/raamcosta/compose-destinations/core/maven-metadata.xml&style=for-the-badge)](https://maven-badges.herokuapp.com/maven-central/io.github.raamcosta.compose-destinations/core)"></img></td>
 </tr>
</table>

:::caution
If you choose a version that uses Compose with a higher version then the one you're setting for your app, gradle will upgrade your Compose version via transitive dependency.
:::

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
:::info
This has been fixed in KSP version `1.8.0-1.0.9` and is therefore only needed if you are using an older version than this.
:::

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
