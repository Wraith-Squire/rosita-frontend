<template>
    <Teleport to="body">
        <NavigationMenu style="position: sticky; top: 0px; left: 0px; z-index: 7;"/>
    </Teleport>
    <div id="default-layout-container">
        <div id="default-layout-left">
        </div>
        <div id="default-layout-center">
            <!-- <div class="nav-menu-header">
                <div>
                    <img src="/logo.jpg" height="100" width="100"/>
                </div>
                <div id="nav-title">Products Tally Management</div>
            </div> -->
            <NuxtPage />
        </div>
        <div id="default-layout-right">
        </div>
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

@media screen and (max-width: 1200px) {
    #default-layout-left {
        display: none;
    }

    #default-layout-right {
        display: none;
    }

    label {
        font-size: .8em;
    }
}
</style>