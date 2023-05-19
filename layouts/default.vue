<template>
    <div id="default-layout-container">
        <section id="default-layout-left">
            <NavigationMenu />
        </section>
        <section id="default-layout-center">
            <!-- <div class="nav-menu-header">
                <div>
                    <img src="/logo.jpg" height="100" width="100"/>
                </div>
                <div id="nav-title">Products Tally Management</div>
            </div> -->
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

.error {
    color: var(--el-color-danger);
}
</style>