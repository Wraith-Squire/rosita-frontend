<template>
    <div id="product-table">
        <div :style="device.isMobileOrTablet ? styles.mobile.filter: styles.default.filter" class="product-table-filter">
            <div style="width: 280px;">
                <label>Search</label>
                <el-input
                    v-model="filters.search"
                    :rows="6"
                    type="text"
                    :size="elementSize"
                    placeholder="Please input"
                    @input="getProducts(true)"
                />
            </div>
            <div>
                <el-button type="primary" :disabled="componentState.isBusy" @click="goToForm()"  style="width: 6em" :size="elementSize">Add</el-button>
            </div>
        </div>
        <div>
            <el-table :data="products" stripe style="width: 100%" v-loading="componentState.isBusy" :size="elementSize">
                <el-table-column prop="product_name" label="Name" />
                <el-table-column prop="product_price" label="Price" />
                <el-table-column prop="product_cost" label="Cost" />
                <el-table-column label="Actions">
                    <template #default="scope">
                        <div class="product-action-buttons">
                            <el-button size="small" type="success"  @click="goToForm(scope.row.product_id)">View</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="product-table-paginator">
            <el-pagination layout="prev, pager, next" :page-count="pagination.pageCount" v-model:current-page="filters.currentPage" @current-change="getProducts()" :size="elementSize"/>
        </div>
    </div>
</template>
    
<script lang='ts'>
import { ProductService } from '~/services/productService';
import { Product } from '~/types/product';
import { CSSProperties } from 'nuxt/dist/app/compat/capi';

export default {
    data() {
        return {
            products: [] as Array<Product>,
            filters: {
                currentPage: 1,
                perPage: 10,
                search: ''
            },
            pagination: {
                pageCount: 1
            },
            componentState: {
                isBusy: false
            },
            error: {},
            debounce: {
                timer: null as any
            },
            device: useDevice(),
            styles: {
                default: {
                    table: {
                        width: "100%"
                    } as CSSProperties,
                    filter: {
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "end",
                        flexWrap: "wrap",
                        gap: ".5em",
                        justifyContent: "flex-start",
                        marginBottom: "2em"
                    } as CSSProperties
                },
                mobile: {
                    table: {
                        width: "100%"
                    } as CSSProperties,
                    filter: {
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        justifyContent: "flex-start",
                        marginBottom: "2em"
                    } as CSSProperties
                }
            },
        }
    },
    computed: {
        elementSize() {
            return this.device.isMobileOrTablet ? "small": "default";
        }
    },
    methods: {
        async getProducts(resetPage = false) {
            this.componentState.isBusy = true;

            if (resetPage) {
                this.filters.currentPage = 1;
            }

            if (this.debounce.timer) clearTimeout(this.debounce.timer);

            this.debounce.timer = setTimeout(async () => {
                await ProductService.list(this.filters).then((response) => {
                    const data = response as unknown as Record<string, any>;

                    this.products = data.result;
                    this.pagination.pageCount = data.lastPage; 

                    this.componentState.isBusy = false;
                }).catch((error) => {
                    this.error = error;

                    this.componentState.isBusy = false;
                });
            }, 50);

            
        },
        goToForm(id = 0) {
            this.$router.push(`/product/${id}`)
        }
    },
    created() {
        this.getProducts();
    }
}
    
</script>
    
<style scoped>
.product-table-filter {
    display: flex;
    flex-direction: row;
    align-items: end;
    gap: .5em;
    justify-content: start;
    margin-bottom: 2em;
}

.product-table-filter div {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.product-table-paginator {
    display: grid;
    justify-content: end;
}

.product-action-buttons {
    display: flex;
    flex-direction: row;
}
</style>