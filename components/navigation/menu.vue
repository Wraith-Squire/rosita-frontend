<template>
    <div id="nav-menu">
        <el-dropdown>
            <el-button type="primary">
                <el-icon><ElIconMenu></ElIconMenu></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goToProduct()"><el-icon><ElIconBurger></ElIconBurger></el-icon> Product</el-dropdown-item>
                <el-dropdown-item @click="goToTally()"><el-icon><ElIconNotebook></ElIconNotebook></el-icon> Tally</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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