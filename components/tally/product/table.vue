<template>
    <div id="tally-product-table">
        <div>
            <TallyProductForm :products-dropdown="dropdown.products" v-if="dropdown.isLoaded" @tally-product-add="getAddedTallyProduct"></TallyProductForm>
        </div>
        <el-table :data="tallyProducts" stripe style="width: 100%" :lazy="true">
            <el-table-column prop="product_name" label="Product Name" />
            <el-table-column prop="product_count" label="Made" />
            <el-table-column prop="product_sold" label="Sold" />
            <el-table-column prop="product_sales" label="Sales" />
            <el-table-column label="Actions">
                <template #default="scope">
                    <div class="table-action-buttons">
                        <TallyProductForm :is-edit="true"></TallyProductForm>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
    
<script lang='ts'>
import { ProductService } from '~/services/productService';
import { Product } from '~/types/product';
import {TallyProduct} from '~/types/tally';

export default {
    props: {
        tallyProducts: {
            type: Array<TallyProduct>,
            default: [] as Array<TallyProduct>
        }
    },
    data() {
        return {
            dropdown: {
                products: [] as Array<Product>,
                isLoaded: false
            }
        }
    },
    methods: {
        async getProductsDropdown() {
            await ProductService.list().then((response) => {
                    const data = response as unknown as Record<string, any>;

                    this.dropdown.products = data.result;
                    this.dropdown.isLoaded = true;
                }).catch((error) => {
                });
        },
        getAddedTallyProduct(tallyProduct: TallyProduct) {
            console.log(tallyProduct);
            this.tallyProducts.push(tallyProduct);
            console.log(this.tallyProducts);
        }
    },
    created() {
        this.getProductsDropdown();
    }
}
</script>
    
<style scoped>
#tally-product-table {
    display: grid;
}

#tally-product-table div:first-child {
    display: grid;
    justify-content: end;
}
</style>