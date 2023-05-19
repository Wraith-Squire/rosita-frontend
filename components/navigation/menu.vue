<template>
    <div id="nav-menu">
        <el-radio-group v-model="menu.isCollapse" style="margin-bottom: 20px">
            <el-radio-button :label="false">expand</el-radio-button>
            <el-radio-button :label="true">collapse</el-radio-button>
        </el-radio-group>
        <el-menu
            default-active="1"
            class="el-menu-rosita"
            :collapse="menu.isCollapse"
            >
            <el-menu-item index="/product/" @click="goToProduct()">
                <el-icon><ElIconBurger></ElIconBurger></el-icon>
                <template #title>Product</template>
            </el-menu-item>
            <el-menu-item index="/tally/" @click="goToTally()">
                <el-icon><ElIconNotebook></ElIconNotebook></el-icon>
                <template #title>Tally</template>
            </el-menu-item>
        </el-menu>
    </div>        
</template>
    
<script lang='ts'>
export default {
    data() {
        return {
            menu: {
                isCollapse: true
            }
        }
    },
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