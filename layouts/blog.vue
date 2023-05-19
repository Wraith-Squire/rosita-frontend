<template>
    <div id="default-layout-container">
        <section id="default-layout-left">
        </section>
        <section id="default-layout-center">
            <div class="nav-menu-header">
                <div>
                    <img src="/logo.jpg" height="200" width="200"/>
                </div>
                <div class="nav-title">Products Tally Management</div>
                <NuxtPage />
            </div>
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
    display: grid;
    grid-template-columns: 1fr;
    justify-content: center;
    align-items: baseline;
}

.error {
    color: var(--el-color-danger);
}

.nav-menu-header {
    padding: 2em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.nav-title {
    font-size: 36px;
}
</style>