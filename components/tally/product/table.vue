<template>
    <div id="tally-product-table">
        <div>
            <TallyProductForm :products-dropdown="dropdown.products" v-if="dropdown.isLoaded" @tally-product-add="getAddedTallyProduct"></TallyProductForm>
        </div>
        <el-table :data="tallyProducts" style="width: 100%" type="index" :lazy="true" :summary-method="getSummaries" show-summary>
            <el-table-column prop="product_name" label="Product Name" />
            <el-table-column prop="product_count" label="Made" />
            <el-table-column prop="product_sold" label="Sold" />
            <el-table-column prop="product_sales" label="Sales" />
            <el-table-column label="Actions">
                <template #default="scope">
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: .5em;width: 100%;">
                        <TallyProductForm :is-edit="true" :products-dropdown="dropdown.products" :tally-product-prop.sync="scope.row" @tally-product-edit="getEditedTallyProduct($event, scope.$index )"></TallyProductForm>
                        <el-button size="small" type="danger" @click="deleteTallyProduct(scope.$index)">Delete</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
    
<script lang='ts'>
import { ElPopconfirm } from 'element-plus';
import { ProductService } from '~/services/productService';
import { Product } from '~/types/product';
import {TallyProduct} from '~/types/tally';

export default {
    props: {
        tallyProductsProp: {
            type: Array<TallyProduct>,
            default: [] as Array<TallyProduct>
        }
    },
    emit: ['TallyProductsUpdated'],
    data() {
        return {
            dropdown: {
                products: [] as Array<Product>,
                isLoaded: false
            },
            tallyProducts: [] as Array<TallyProduct>
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
            this.tallyProducts.push(tallyProduct);
            this.$emit('TallyProductsUpdated', this.tallyProducts);
        },
        getEditedTallyProduct(tallyProduct: TallyProduct, index: number) {
            this.tallyProducts[index] = tallyProduct;
            this.$emit('TallyProductsUpdated', this.tallyProducts);
        },
        deleteTallyProduct(index: number) {
            ElMessageBox.confirm("Are you sure you want to delete the tally for this product?").then(() => {
                this.tallyProducts.splice(index, 1);
                this.$emit('TallyProductsUpdated', this.tallyProducts);
            });
        },
        getSummaries() {
            return ['TOTAL', this.totalCount.toString(), this.totalSold.toString(), this.totalSales.toString(), ''];
        }
    },
    created() {
        this.getProductsDropdown();

        this.tallyProducts = [...this.tallyProductsProp];
    },
    computed: {
        totalCount() {
            return this.tallyProducts.reduce((sum, value) => Number(sum) + Number((value.product_count ?? 0)), 0);
        },
        totalSold() {
            return this.tallyProducts.reduce((sum, value) => Number(sum) + Number((value.product_sold ?? 0)), 0);
        },
        totalSales() {
            return this.tallyProducts.reduce((sum, value) => Number(sum) + Number((value.product_sales ?? 0)), 0);
        }
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