<template>
    <div id="nav-menu">
        <div class="nav-menu-header">
            <div>
                <img src="/logo.jpg" height="100" width="100"/>
            </div>
            <div id="nav-title">Products Tally Management</div>
        </div>
        <el-menu
            default-active="1"
            class="el-menu-rosita"
            :collapse="false"
            active-text-color="brown"
            >
            <el-menu-item index="1" @click="goToProduct()">
                <el-icon><ElIconBurger></ElIconBurger></el-icon>
                <template #title>Product</template>
            </el-menu-item>
            <el-menu-item index="2" @click="goToTally()">
                <el-icon><ElIconNotebook></ElIconNotebook></el-icon>
                <template #title>Tally</template>
            </el-menu-item>
        </el-menu>
    </div>        
</template>
    
<script lang='ts'>
export default {
    methods: {
        goToProduct() {
            this.$router.push('/product/list');
        },
        goToTally() {
            this.$router.push('/tally/list');
        },
    }
}
</script>
<style scoped>
    .el-menu-rosita {
        height: 100vh;
    }

    img {
        mix-blend-mode: darken;
    }
    .nav-menu-header {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    #nav-title {
        margin: 0px;
        font-size: larger;
        font-weight: 400;
    }
</style>