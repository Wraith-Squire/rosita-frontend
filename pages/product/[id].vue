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
                <span v-if="errors.hasOwnProperty('product_name')" class="error">{{errors.product_name[0]}}</span>
            </div>
            <div>
                <label>Price</label>
                <el-input
                    v-model="product.product_price"
                    type="number"
                    placeholder="Please input"
                />
                <span v-if="errors.hasOwnProperty('product_price')" class="error">{{errors.product_price[0]}}</span>
            </div>
            <div>
                <label>Cost</label>
                <el-input
                    v-model="product.product_cost"
                    type="number"
                    placeholder="Please input"
                />
                <span v-if="errors.hasOwnProperty('product_cost')" class="error">{{errors.product_cost[0]}}</span>
            </div>
        </div>
        <div class="product-buttons">
            <el-button type="success" @click="addProduct()">Save</el-button>
            <el-button type="default">Cancel</el-button>
            <el-button type="danger">Delete</el-button>
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
            errors: {} as Record<string, any>,
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
                const data = response as unknown as Record<string, any>

                this.product = data;
            }).catch((err) => {
                this.errors = err.response._data.errors;
            });

            this.componentState.isBusy = false;
        },
        async addProduct() {
            this.componentState.isBusy = true;

            await ProductService.create(this.product).then((response) => {
                this.errors = {};
                console.log({response: response});
            }).catch((err) => {
                this.errors = err.response._data.errors;
            })
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

.product-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 1em;
}

.error {
    color: var(--el-color-danger);
}
</style>