<template>
    <div id="product-form-container">
        <h1>Product</h1>
        <div class="product-form">
            <div>
                <label>Name</label>
                <el-input
                    v-model="product.product_name"
                    type="text"
                    placeholder="Please input"
                />
            </div>
            <div>
                <label>Price</label>
                <el-input
                    v-model="product.product_price"
                    type="number"
                    placeholder="Please input"
                />
            </div>
            <div>
                <label>Cost</label>
                <el-input
                    v-model="product.product_cost"
                    type="number"
                    placeholder="Please input"
                />
            </div>
        </div>
    </div>
</template>
    
<script lang='ts'>
import { ProductService } from '~/services/productService';
import { Product } from '~/types/product';

export default {
    data() {
        return {
            product: {} as Product,
            error: {},
            componentState: {
                isBusy: false
            }
        }
    },
    methods: {
        async getProduct() {
            const id = this.$route.params.id as unknown as number;

            if (id == 0) return;

            this.componentState.isBusy = true;

            await ProductService.details(id).then((response) => {
                this.product = response.data.value ? response.data.value['details']: {};

                return response;
            }).catch((error) => {
                this.error = error;
            });

            this.componentState.isBusy = false;
        }
    },
    created() {
        this.getProduct();
    },
}
</script>
    
<style scoped>
#product-form-container {
    padding: 2em;
}

.product-form {
    display: grid;
}

.product-form > div {
    display: flex;
    flex-direction: column;
    margin: .2em;
} 
</style>