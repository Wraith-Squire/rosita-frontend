<template>
    <div id="tally-product-table">
        <div>
            <div v-if="dropdown.isLoaded">
                <label>Rollover Tally ID</label>
                <el-input-number
                    v-model="rollover.id"
                    placeholder="Please input"
                    :controls="false"
                    :disabled="componentState.isBusy"
                    style="width: 100%;"
                    :size="elementSize"
                />
            </div>
            <el-button type="default" :size="elementSize" v-if="dropdown.isLoaded" style="margin-left: 12px;" @click="rolloverProducts()">Roll Over</el-button>
            <TallyProductForm :products-dropdown="dropdown.products" v-if="dropdown.isLoaded" @tally-product-add="getAddedTallyProduct"></TallyProductForm>
        </div>
        <el-table :data="tallyProducts" style="width: 100%" type="index" :lazy="true" :summary-method="getSummaries" :show-summary="!device.isMobileOrTablet" v-loading="componentState.isBusy" :size="elementSize">
            <el-table-column prop="product_name" label="Product Name" min-width="100px"/>
            <el-table-column label="Summary" v-if="device.isMobileOrTablet">
                <template #default="scope">
                    <div>
                        Made: {{ scope.row.product_count }}
                    </div>
                    <div>
                        Unsold: {{ scope.row.product_unsold }}
                    </div>
                    <div>
                        Sold: {{ scope.row.product_sold }}
                    </div>
                    <div>
                        Sales: {{ scope.row.product_sales }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="product_count" label="Made" v-if="!device.isMobileOrTablet"/>
            <el-table-column prop="product_unsold" label="Unsold" v-if="!device.isMobileOrTablet"/>
            <el-table-column prop="product_sold" label="Sold" v-if="!device.isMobileOrTablet"/>
            <el-table-column prop="product_sales" label="Sales" v-if="!device.isMobileOrTablet"/>
            <el-table-column label="Actions" width="150px">
                <template #default="scope">
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: .5em;width: 100%;">
                        <TallyProductForm :is-edit="true" :products-dropdown="dropdown.products" :tally-product-prop.sync="scope.row" @tally-product-edit="getEditedTallyProduct($event, scope.$index )"></TallyProductForm>
                        <el-button type="danger" @click="deleteTallyProduct(scope.$index)" size="small">Delete</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="summary-total" v-if="device.isMobileOrTablet && tallyProducts.length > 0">
            <label>Summary Total</label>
            <div>
                Made: {{ totalCount }}
            </div>
            <div>
                Unsold: {{ totalUnSold }}
            </div>
            <div>
                Sold: {{ totalSold }}
            </div>
            <div>
                Sales: {{ totalSales }}
            </div>
        </div>
    </div>
</template>
    
<script lang='ts'>
import { ProductService } from '~/services/productService';
import { TallyService } from '~/services/tallyService';
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
            tallyProducts: [] as Array<TallyProduct>,
            componentState: {
                isBusy: false
            },
            rollover: {
                id: undefined
            },
            device: useDevice(),
        }
    },
    methods: {
        async getProductsDropdown() {
            this.componentState.isBusy = true;

            await ProductService.list().then((response) => {
                    const data = response as unknown as Record<string, any>;

                    this.dropdown.products = data.result;
                    this.dropdown.isLoaded = true;
                    this.componentState.isBusy = false;
                }
            );
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
            ElMessageBox.confirm(
                'Are you sure you want to delete the tally for this product?', 
                'Warning',
                {
                    type: 'warning',
                    center: true
                }
            ).then(() => {
                this.tallyProducts.splice(index, 1);
                this.$emit('TallyProductsUpdated', this.tallyProducts);
            });
        },
        rolloverProducts() {
            ElMessageBox.confirm(
                `Are you sure you want to rollover products from Tally with ID number ${this.rollover.id}? This will replace inputted products in this tally.`, 
                'Warning',
                {
                    type: 'warning',
                    center: true
                }
            ).then(async () => {
                if (this.rollover.id == undefined) {
                    ElMessageBox.alert("Please input a valid Tally ID.");

                    return;
                } 

                await TallyService.details(this.rollover.id).then((response) => {
                    const data = response as unknown as Record<string, any>;
                    data.products = JSON.parse(data.products)??[];

                    if (data.products.length > 0) {
                        data.products.map((product: TallyProduct) => {
                            product.product_count = product.product_unsold;
                            product.product_sold = product.product_count;
                            product.product_unsold = 0;
                            product.product_sales = Number(Number(product.product_price ?? 0) * Number(product.product_sold ?? 0));
                        })
                    }

                    this.tallyProducts = data.products;
                }).catch((error) => {
                    console.log(error);
                })
            });
        },
        getSummaries() {
            if (!this.device.isMobileOrTablet) {
                return ['TOTAL', this.totalCount.toString(), this.totalUnSold.toString(), this.totalSold.toString(), this.totalSales.toString(), ''];
            }

            var summary = 
            {
                Made: this.totalCount.toString(),
                Unsold: this.totalUnSold.toString(),
                Sold: this.totalSold.toString(),
                Sales: this.totalSales.toString(),
            };

            return ['TOTAL', summary.toString(), ''];
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
        totalUnSold() {
            return this.tallyProducts.reduce((sum, value) => Number(sum) + Number((value.product_unsold ?? 0)), 0);
        },
        totalSold() {
            return this.tallyProducts.reduce((sum, value) => Number(sum) + Number((value.product_sold ?? 0)), 0);
        },
        totalSales() {
            return this.tallyProducts.reduce((sum, value) => Number(sum) + Number((value.product_sales ?? 0)), 0);
        },
        elementSize() {
            return this.device.isMobileOrTablet ? "small": "default";
        },
        previousDate() {
            var date = new Date();
            date.setDate(date.getDate() - 1);

            return date.toISOString().slice(0, 10);
        }
    }
}
</script>
    
<style scoped>
#tally-product-table {
    display: grid;
}

#tally-product-table > div:first-child {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;
}

#tally-product-table > div:first-child > div{
    display: flex;
    flex-direction: column;
}

.summary-total {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-size: 0.7em;
    color: #606266;
}

.summary-total label {
    font-size: 1.1em;
    font-weight: bold;
}
</style>