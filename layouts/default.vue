<template>
    <div id="default-layout-container">
        <section id="default-layout-left">
            Left
        </section>
        <section id="default-layout-center">
            <NuxtPage />
        </section>
        <section id="default-layout-right">
            Right
        </section>
    </div>
</template>
 
<style>
:root {
    --background-left: rgb(77, 69, 93);
    --color-main: rgb(77, 69, 93);
}

body {
    margin: 0px;
}

#default-layout-container {
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    height: 100lvh;
    color: var(--color-main);
    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}
</style>