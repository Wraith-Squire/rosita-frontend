<template>
    <el-button @click="open()" type="primary" :size="isEdit ? 'small': elementSize" :color="isEdit ? 'var(--el-color-success)': 'var(--el-color-primary)'">
        {{ isEdit ? 'View': 'Add' }}
    </el-button>
    <teleport to="body">
        <el-dialog v-model="form.isVisible" title="Tally Product" :close-on-click-modal="false" width="90%">
            <div class="tally-product-form">
                <div>
                    <label>Product Name</label>
                    <el-select v-model="tallyProduct.product_id" class="m-2" placeholder="Select" :disabled="componentState.isBusy" filterable>
                        <el-option
                            v-for="item in productsDropdown"
                            :key="item.product_id"
                            :label="item.product_name"
                            :value="(item.product_id as number)"
                            />
                    </el-select>
                    <span v-if="errors?.product_name" class="error">{{errors?.product_name[0]}}</span>
                </div>
                <div>
                    <label>Made count</label>
                    <el-input-number
                        v-model="tallyProduct.product_count"
                        placeholder="Please input"
                        :controls="false"
                        :disabled="componentState.isBusy"
                        style="width: 100%;"
                    />
                    <span v-if="errors?.product_count" class="error">{{errors?.product_count[0]}}</span>
                </div>
                <div>
                    <label>Made unsold</label>
                    <el-input-number
                        v-model="tallyProduct.product_unsold"
                        placeholder="Please input"
                        :controls="false"
                        :disabled="componentState.isBusy"
                        style="width: 100%;"
                    />
                    <span v-if="errors?.product_unsold" class="error">{{errors?.product_unsold[0]}}</span>
                </div>
                <div>
                    <label>Made Sold</label>
                    <el-input-number
                        v-model="madeSold"
                        placeholder="Please input"
                        :controls="false"
                        :disabled="true"
                        style="width: 100%;"
                    />
                </div>
                <div>
                    <label>Price</label>
                    <el-input-number
                        v-model="tallyProduct.product_price"
                        placeholder="Please input"
                        :controls="false"
                        :disabled="!tallyProduct.product_price_override"
                        style="width: 100%;"
                    />
                </div>
                <div>
                    <label>Sales</label>
                    <el-input-number
                        v-model="sales"
                        placeholder="Please input"
                        :controls="false"
                        :disabled="true"
                        style="width: 100%;"
                    />
                </div>
                <div>
                    <div>
                        <label>Override Price</label>
                        <div>
                            <el-switch v-model="tallyProduct.product_price_override" active-text="Yes" inactive-text="No"/>
                        </div>
                    </div>
                </div>
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="form.isVisible = false" :disabled="componentState.isBusy" :size="elementSize">Cancel</el-button>
                <el-button type="primary" @click="validate()" :disabled="componentState.isBusy" :size="elementSize">
                  Confirm
                </el-button>
              </span>
            </template>
          </el-dialog>
    </teleport>
</template>
    
<script lang='ts'>
import { TallyService } from '~/services/tallyService';
import { Product } from '~/types/product';
import { Tally, TallyProduct, TallyProductErrors } from '~/types/tally';

export default {
    props: {
        tallyProductProp: {
            type: Object,
            required: false,
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
            errors: {} as TallyProductErrors,
            device: useDevice(),
        }
    },
    methods: {
        open() {
            if (this.isEdit) {
                this.tallyProduct = {...this.tallyProductProp} as TallyProduct;
            } else {
                this.tallyProduct = {} as TallyProduct
            }

            this.form.isVisible = true;
        },
        async validate() {
            this.componentState.isBusy = true;

            this.tallyProduct.product_sold = this.madeSold;
            this.tallyProduct.product_sales = this.sales;

            await TallyService.validateTallyProduct(this.tallyProduct).then((response) => {
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
    watch: {
        tallyProduct: {
            handler(newValue: TallyProduct, oldValue: TallyProduct) {
                this.componentState.isBusy = true;

                if (newValue?.product_id) {

                    if (this.tallyProduct.product_price_override != true) {
                        this.tallyProduct.product_price = this.productsDropdown.filter((product) => product.product_id == this.tallyProduct.product_id)[0]?.product_price ?? 0;
                    }
                    
                    this.tallyProduct.product_name = this.productsDropdown.filter((product) => product.product_id == this.tallyProduct.product_id)[0]?.product_name ?? '';
                }

                if (newValue?.product_count == null) {
                    this.tallyProduct.product_count = 0;
                }

                if (newValue?.product_unsold == null) {
                    this.tallyProduct.product_unsold = 0;
                }

                this.componentState.isBusy = false;
            },
            deep: true
        }
    },
    computed: {
        madeSold() {
            if (this.tallyProduct.product_id) {
                return Number(Number(this.tallyProduct.product_count ?? 0) - Number(this.tallyProduct.product_unsold ?? 0));
            }

            return 0;
        },
        sales() {
            if (this.tallyProduct.product_id) {
                return Number(Number(this.madeSold) * Number(this.tallyProduct.product_price));
            }

            return 0;
        },
        elementSize() {
            return this.device.isMobileOrTablet ? "small": "default";
        }
    }
}
</script>
    
<style scoped>
    .tally-product-form {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
    }

    .tally-product-form > div {
        display: flex;
        flex-direction: column;
    }

    .dialog-footer {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: flex-end;
    }
</style>