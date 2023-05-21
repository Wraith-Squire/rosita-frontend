<template>
    <div id="tally-form-container">
        <h3>Tally</h3>
        <div class="tally-form">
            <div>
                <label>Date Tallied</label>
                <el-date-picker
                    v-model="tally.date_tallied"
                    type="date"
                    placeholder="Pick a day"
                    size="default"
                    format="MM-DD-YYYY"
                    value-format="YYYY-MM-DD"
                    :disabled="pageState.isBusy"
                />
                <span v-if="errors.date_tallied" class="error">{{errors.date_tallied[0]}}</span>
            </div>
            <div>
                <label>Comment</label>
                <el-input
                    v-model="tally.comment"
                    :rows="6"
                    type="textarea"
                    placeholder="Please input"
                />
                <span v-if="errors.comment" class="error">{{errors.comment[0]}}</span>
            </div>
            <div class="tally-form-products">
                <label>Products</label>
                <TallyProductTable v-if="componentState.initialized" :tally-products-prop="tally.products" @tally-products-updated="grabTallyProductsUpdate"></TallyProductTable>
                <span v-if="errors.products" class="error">{{errors.products[0]}}</span>
            </div>
        </div>
        <div class="tally-buttons">
            <el-button type="success" @click="parameters.id == 0 ? addTally(): updateTally()" :disabled="componentState.isBusy">Save</el-button>
            <el-button type="default" :disabled="componentState.isBusy" @click="goToList()">Cancel</el-button>
            <el-button type="danger" :disabled="componentState.isBusy" @click="deleteTally()" v-if="parameters.id != 0">Delete</el-button>
        </div>
    </div>
</template>
    
<script lang='ts'>
import {TallyService} from '~/services/tallyService';
import { Tally, TallyErrors, TallyProduct } from '~/types/tally';

export default {
    data() {
        return {
            tally: {} as Tally,
            pageState: {
                isBusy: false
            },
            error: {},
            parameters: {
                id: 0
            },
            componentState: {
                isBusy: false,
                initialized: false,
            },
            errors: {} as TallyErrors
        }
    },
    methods: {
        async getTally() {
            this.componentState.isBusy = true;

            if (this.parameters.id == 0) return;

            await TallyService.details(this.parameters.id).then((response) => {
                const data = response as unknown as Record<string, any>;
                data.products = JSON.parse(data.products)??[];

                this.tally = data;

                if (this.parameters.id != 0 && Object.entries(this.tally).length == 0) {
                    this.$router.push('/tally/list');
                }
            }).catch((error) => {
                this.error = error
                this.$router.push('/tally/list');
            });
        },
        addTally() {
            this.componentState.isBusy = true;

            this.tally.total_count = this.totalCount;
            this.tally.total_sold = this.totalSold;
            this.tally.total_sales = this.totalSales;

            ElMessageBox.confirm('Save Tally?').then(async () => {
                await TallyService.create(this.tally).then((response) => {
                    this.errors = {} as TallyErrors;
                    console.log(this.tally);
                    this.goToList();
                }).catch((err) => {
                    console.log(err.response._data.errors)
                    this.errors = err.response._data.errors;
                })
            });

            this.componentState.isBusy = false;
        },
        updateTally() {
            this.componentState.isBusy = true;

            this.tally.total_count = this.totalCount;
            this.tally.total_sold = this.totalSold;
            this.tally.total_sales = this.totalSales;

            ElMessageBox.confirm("Save Tally?").then(async () => {
                await TallyService.update(this.parameters.id, this.tally).then((response) => {
                    this.errors = {};
                    this.$router.push('/tally/list');
                    console.log({response: response});
                }).catch((err) => {
                    this.errors = err.response._data.errors;
                });
            }).catch((error) => {
                console.log(error);
            });

            this.componentState.isBusy = false;
        },
        deleteTally() {
            this.componentState.isBusy = true;

            ElMessageBox.confirm("Are you sure you want to delete this tally?").then(async () => {
                await TallyService.delete(this.parameters.id).then((response) => {
                    this.$router.push('/tally/list');
                }).catch((error) => {
                    console.log(error);
                });
            })

            this.componentState.isBusy = false;
        },
        goToList() {
            this.$router.push('/tally/list');
        },
        grabTallyProductsUpdate(tallyProducts: Array<TallyProduct>) {
            this.tally.products = tallyProducts;
        }
    },
    created() {
        this.parameters.id = this.$route.params.id as unknown as number;
        this.getTally().then(() => {
            this.componentState.isBusy = false;
            this.componentState.initialized = true;
        });
    },
    computed: {
        totalCount() {
            return Number(this.tally?.products?.reduce((sum, value) => Number(sum) + Number((value.product_count ?? 0)), 0) ?? 0);
        },
        totalSold() {
            return Number(this.tally?.products?.reduce((sum, value) => Number(sum) + Number((value.product_sold ?? 0)), 0) ?? 0);
        },
        totalSales() {
            return Number(this.tally?.products?.reduce((sum, value) => Number(sum) + Number((value.product_sales ?? 0)), 0) ?? 0);
        }
    }
}
</script>
    
<style scoped>
#tally-form-container {
    padding: 2em;
    width: 80vw;
}

.tally-form {
    display: grid;
}

.tally-form > div {
    display: flex;
    flex-direction: column;
    margin: .2em;
}

.tally-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 1em;
}

@media screen and (max-width: 1200px) {
    #tally-form-container {
        padding: 1em;
        width: 90vw;
    }
}
</style>