<template>
    <div id="product-form-container">
        <h3>Product</h3>
        <div class="product-form">
            <div>
                <label>Name</label>
                <el-input
                    v-model="product.product_name"
                    type="text"
                    placeholder="Please input"
                    :disabled="componentState.isBusy"
                    style="width: 100%;"
                    :size="elementSize"
                />
                <span v-if="errors.product_name" class="error">{{errors.product_name[0]}}</span>
            </div>
            <div>
                <label>Price</label>
                <el-input-number
                    v-model="product.product_price"
                    placeholder="Please input"
                    :controls="false"
                    :disabled="componentState.isBusy"
                    style="width: 100%;"
                    :size="elementSize"
                />
                <span v-if="errors.product_price" class="error">{{ errors.product_price[0] }}</span>
            </div>
            <div>
                <label>Cost</label>
                <el-input-number
                    v-model="product.product_cost"
                    placeholder="Please input"
                    :controls="false"
                    :disabled="componentState.isBusy"
                    style="width: 100%;"
                    :size="elementSize"
                />
                <span v-if="errors.product_cost" class="error">{{ errors.product_cost[0] }}</span>
            </div>
        </div>
        <div class="product-buttons">
            <el-button type="success" @click="parameters.id == 0 ? addProduct(): updateProduct()" :disabled="componentState.isBusy" :size="elementSize">Save</el-button>
            <el-button type="default" :disabled="componentState.isBusy" @click="goToList()" :size="elementSize">Cancel</el-button>
            <el-button type="danger" :disabled="componentState.isBusy" @click="deleteProduct()" v-if="parameters.id != 0" :size="elementSize">Delete</el-button>
        </div>
    </div>
</template>
    
<script lang='ts'>
import { ProductService } from '~/services/productService';
import { Product, ProductErrors } from '~/types/product';

export default {
    data() {
        return {
            product: {
                product_price: 0,
                product_cost: 0
            } as Product,
            errors: {} as ProductErrors,
            componentState: {
                isBusy: false
            },
            parameters: {
                id: 0
            },
            device: useDevice(),
        }
    },
    methods: {
        async getProduct() {
            if (this.parameters.id == 0) return;

            this.componentState.isBusy = true;

            await ProductService.details(this.parameters.id).then((response) => {
                const data = response as unknown as Record<string, any>

                this.product = data;

                if (this.parameters.id != 0 && Object.entries(this.product).length == 0) {
                    this.goToList();
                }
            }).catch((err) => {
                this.errors = err.response._data.errors;

                this.goToList();
            });

            this.componentState.isBusy = false;
        },
        addProduct() {
            this.componentState.isBusy = true;

            ElMessageBox.confirm('Save Product?').then(async () => {
                await ProductService.create(this.product).then((response) => {
                    this.errors = {} as ProductErrors;

                    this.goToList();
                }).catch((err) => {
                    this.errors = err.response._data.errors;
                })
            });

            this.componentState.isBusy = false;
        },
        updateProduct() {
            this.componentState.isBusy = true;

            ElMessageBox.confirm("Save Product?").then(async () => {
                await ProductService.update(this.parameters.id, this.product).then((response) => {
                    this.errors = {};
                    this.$router.push('/product/list');
                }).catch((err) => {
                    this.errors = err.response._data.errors;
                });
            }).catch((error) => {
                console.log(error);
            });

            this.componentState.isBusy = false;
        },
        deleteProduct() {
            this.componentState.isBusy = true;

            ElMessageBox.confirm("Are you sure you want to delete this product?").then(async () => {
                await ProductService.delete(this.parameters.id).then((response) => {
                    this.$router.push('/product/list');
                }).catch((error) => {
                    console.log(error);
                });
            })

            this.componentState.isBusy = false;
        },
        goToList() {
            this.$router.push('/product/list')
        }
    },
    created() {
        this.parameters.id = this.$route.params.id as unknown as number;

        this.getProduct();
    },
    computed: {
        elementSize() {
            return this.device.isMobileOrTablet ? "small": "default";
        }
    }
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

@media screen and (max-width: 1200px) {
    #product-form-container {
        padding: 1em;
        width: 90vw;
    }
}
</style>