<template>
    <div id="landing-page">
        <div>Initializing application. Please wait.</div>
        <div id="loading"></div>
    </div>

</template>
    
<script lang='ts'>
import { InitService } from '~/services/initService'

export default {
    data() {
        return {
            loadingSpinner: ElLoading.service({target: '#loading'})
        }
    },
    methods: {
        async init() {
            this.loadingSpinner;

            await InitService.init().then(() => {
                this.loadingSpinner.close();
                
                setTimeout(() => {
                    this.$router.push('/product/list');
                }, 100);
            });
        }
    },
    created() {
        this.init();
    },
    setup() {
        definePageMeta({
            layout: 'blog'
        });
    }
}
</script>
    
<style>
#landing-page {
    display: flex;
    flex-direction: column;
    padding: 4em;
}

#loading {
    padding: 2em;
}
</style>