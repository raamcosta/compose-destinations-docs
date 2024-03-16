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
    id 'com.google.devtools.ksp' version '1.9.22-1.0.17' // Depends on your kotlin version
}
```
  
  </TabItem>
  <TabItem value="kotlin" label=".gradle.kts">

```kotlin title=build.gradle.kts(:app)
plugins {
    //...
    id("com.google.devtools.ksp") version "1.9.22-1.0.17" // Depends on your kotlin version
}
```

  </TabItem>
</Tabs>

:::info
The version you chose for the KSP plugin depends on the Kotlin version your project uses.   
You can check https://github.com/google/ksp/releases for the list of KSP versions, then pick the last release that matches your Kotlin version.
Example:
If you're using `1.9.22` Kotlin version, then the last KSP version is `1.9.22-1.0.17`.
:::

### 2. Add the dependencies

Compose Destinations has multiple active versions. 
The higher one uses the latest versions for Compose and Navigation, while the others use only stable versions.
Choose the one that matches your Compose version, considering this table:

<table>
 <tr>
  <td>Compose 1.6 (1.6.x)</td>
    <td>
        <img alt="Maven Central" src="https://img.shields.io/maven-metadata/v?versionPrefix=2.0&color=blue&metadataUrl=https://s01.oss.sonatype.org/service/local/repo_groups/public/content/io/github/raamcosta/compose-destinations/core/maven-metadata.xml&style=for-the-badge)](https://maven-badges.herokuapp.com/maven-central/io.github.raamcosta.compose-destinations/core)"></img>
    </td>
 </tr>
 <tr>
  <td>Compose 1.7 (1.7.x)</td>
    <td>
        <img alt="Maven Central" src="https://img.shields.io/maven-metadata/v?versionPrefix=2.1&color=blue&metadataUrl=https://s01.oss.sonatype.org/service/local/repo_groups/public/content/io/github/raamcosta/compose-destinations/core/maven-metadata.xml&style=for-the-badge)](https://maven-badges.herokuapp.com/maven-central/io.github.raamcosta.compose-destinations/core)"></img>
    </td>
 </tr>
</table>

:::caution
If you choose a version that uses Compose with a higher version than the one you're setting for your app, gradle will upgrade your Compose version via transitive dependency.
:::

<Tabs>
  <TabItem value="groovy" label=".gradle" default>

```groovy title=build.gradle(:app)
implementation 'io.github.raamcosta.compose-destinations:core:<version>'
ksp 'io.github.raamcosta.compose-destinations:ksp:<version>'

// for bottom sheet destination support, also add
implementation 'io.github.raamcosta.compose-destinations:bottom-sheet:<version>'  
```
  
  </TabItem>
  <TabItem value="kotlin" label=".gradle.kts">

```kotlin title=build.gradle.kts(:app)
implementation("io.github.raamcosta.compose-destinations:core:<version>")
ksp("io.github.raamcosta.compose-destinations:ksp:<version>")

// for bottom sheet destination support, also add
implementation("io.github.raamcosta.compose-destinations:bottom-sheet:<version>")
```

  </TabItem>
</Tabs>

:::info
If you want to use Compose Destinations in a Wear OS app, replace above core dependency with:
`implementation 'io.github.raamcosta.compose-destinations:wear-core:<version>'`   
this will use Wear Compose Navigation internally.   
:::