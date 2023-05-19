<template>
    <div id="default-layout-container">
        <section id="default-layout-left">
            <NavigationMenu />
        </section>
        <section id="default-layout-center">
            <NuxtPage />
        </section>
        <section id="default-layout-right">
        </section>
    </div>
</template>
 
<style>
:root {
    --background-left: rgb(77, 69, 93);
}

body {
    margin: 0px;
}

#default-layout-container {
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    height: 100lvh;
    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}

#default-layout-center {
    padding-top: 8em;
}

.error {
    color: var(--el-color-danger);
}
</style>