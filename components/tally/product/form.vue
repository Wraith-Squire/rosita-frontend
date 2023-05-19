<template>
    <el-button @click="form.isVisible = true" type="primary">
        {{ isEdit ? 'Edit': 'Add' }}
    </el-button>
    <el-dialog v-model="form.isVisible" title="Tally Product">
        <div class="tally-product-form">
            <div>
                <label>Product Name</label>
                <el-select v-model="tallyProduct.product_id" class="m-2" placeholder="Select" :disabled="componentState.isBusy">
                    <el-option
                        v-for="item in productsDropdown"
                        :key="item.product_id"
                        :label="item.product_name"
                        :value="(item.product_id as number)"
                        />
                </el-select>
                <span v-if="errors.product_name" class="error">{{errors.product_name[0]}}</span>
            </div>
            <div>
                <label>Made count</label>
                <el-input
                    v-model="tallyProduct.product_count"
                    type="number"
                    placeholder="Please input"
                    :disabled="componentState.isBusy"
                />
                <span v-if="errors.product_count" class="error">{{errors.product_count[0]}}</span>
            </div>
            <div>
                <label>Made unsold</label>
                <el-input
                    v-model="tallyProduct.product_unsold"
                    type="number"
                    placeholder="Please input"
                    :disabled="componentState.isBusy"
                />
                <span v-if="errors.product_unsold" class="error">{{errors.product_unsold[0]}}</span>
            </div>
            <div>
                <label>Made Sold</label>
                <el-input
                    v-model="madeSold"
                    type="number"
                    placeholder="Please input"
                    :disabled="true"
                />
            </div>
            <div>
                <label>Price</label>
                <el-input
                    v-model="tallyProduct.product_price"
                    type="number"
                    placeholder="Please input"
                    :disabled="true"
                />
            </div>
            <div>
                <label>Sales</label>
                <el-input
                    v-model="sales"
                    type="number"
                    placeholder="Please input"
                    :disabled="true"
                />
            </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="form.isVisible = false" :disabled="componentState.isBusy">Cancel</el-button>
            <el-button type="primary" @click="validate()" :disabled="componentState.isBusy">
              Confirm
            </el-button>
          </span>
        </template>
      </el-dialog>
</template>
    
<script lang='ts'>
import { TallyService } from '~/services/tallyService';
import { Product } from '~/types/product';
import { TallyProduct, TallyProductErrors } from '~/types/tally';

export default {
    props: {
        tallyProductProp: {
            type: Object,
            default: {},
            required: false
        },
        productsDropdown: {
            type: Array<Product>,
            default: [] as Array<Product>
        },
        isEdit: {
            type: Boolean,
            default: false
        },
    },
    emits: ['TallyProductEdit', 'TallyProductAdd'],
    data() {
        return {
            tallyProduct: {} as TallyProduct,
            form: {
                isVisible: false,
            },
            componentState: {
                isBusy: false
            },
            errors: {} as TallyProductErrors
        }
    },
    methods: {
        async validate() {
            this.componentState.isBusy = true;

            await TallyService.validateTallyProduct(this.tallyProduct).then((response) => {
                console.log(response);
                this.tallyProduct.product_sold = this.madeSold;
                this.tallyProduct.product_sales = this.sales;

                if (this.isEdit) {
                    this.$emit("TallyProductEdit", this.tallyProduct);
                } else {
                    this.$emit("TallyProductAdd", this.tallyProduct);
                }

                this.form.isVisible = false;
            }).catch((err) => {
                this.errors = err.response._data.errors;
            });

            this.componentState.isBusy = false;
        }
    },
    created() {
        if (this.isEdit)
            this.tallyProduct = {...this.tallyProductProp} as TallyProduct;
    },
    watch: {
        tallyProduct: {
            handler(newValue: TallyProduct, oldValue: TallyProduct) {
                this.componentState.isBusy = true;

                if (newValue.product_id) {
                    this.tallyProduct.product_price = this.productsDropdown.filter((product) => product.product_id == this.tallyProduct.product_id)[0].product_price??0;
                    this.tallyProduct.product_name = this.productsDropdown.filter((product) => product.product_id == this.tallyProduct.product_id)[0].product_name??'';
                }

                if (newValue.product_count == null) {
                    this.tallyProduct.product_count = 0;
                }

                if (newValue.product_unsold == null) {
                    this.tallyProduct.product_unsold = 0;
                }

                this.componentState.isBusy = false;
            },
            deep: true
        }
    },
    computed: {
        madeSold() {
            if (this.tallyProduct.product_id) return (this.tallyProduct.product_count??0) - (this.tallyProduct.product_unsold??0);

            return 0;
        },
        sales() {
            if (this.tallyProduct.product_id) (this.madeSold??0)*(this.tallyProduct.product_price??0);

            return 0;
        }
    }
}
</script>
    
<style scoped>
    .tally-product-form {
        display: grid;
        gap: 1em;
        grid-template-columns: repeat(3, 1fr);
    }

    .tally-product-form div {
        display: flex;
        flex-direction: column;
    }
</style>