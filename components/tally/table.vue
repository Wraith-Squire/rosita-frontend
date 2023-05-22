<template>
    <div id="tally-table">
        <div :style="device.isMobileOrTablet ? styles.mobile.filter: styles.default.filter" class="tally-table-filter">
            <div>
                <label>From Date</label>
                <el-date-picker
                    v-model="filters.fromDate"
                    type="date"
                    placeholder="Pick a day"
                    :size="elementSize"
                    format="MM-DD-YYYY"
                    value-format="YYYY-MM-DD"
                    :disabled="componentState.isBusy"
                />
            </div>
            <div>
                <label>To Date</label>
                <el-date-picker
                    v-model="filters.toDate"
                    type="date"
                    placeholder="Pick a day"
                    :size="elementSize"
                    format="MM-DD-YYYY"
                    value-format="YYYY-MM-DD"
                    :disabled="componentState.isBusy"
                />
            </div>
            <div class="table-filter-buttons">
                <div>
                    <el-button @click="getTallies()" :disabled="componentState.isBusy" :size="elementSize">Filter</el-button>
                </div>
                <div>
                    <el-button @click="clearFilters()" :disabled="componentState.isBusy" :size="elementSize">Clear</el-button>
                </div>
                <div>
                    <el-button @click="exportToExcel()" :disabled="componentState.isBusy" :size="elementSize">Export</el-button>
                </div>
                <div>
                    <el-button type="primary" :disabled="componentState.isBusy" @click="goToForm()" style="width: 6em" :size="elementSize">Add</el-button>
                </div>
            </div>
        </div>
        <div>
            <el-table :data="tallies" stripe :style="device.isMobile ? styles.mobile.table: styles.default.table" v-loading="componentState.isBusy" :size="elementSize">
                <el-table-column prop="tally_id" label="ID" :width="device.isMobile ? '30px' : '50px'"/>
                <el-table-column label="Date Tallied" :width="device.isMobile ? '100px': 'auto'">
                    <template #default="scope">
                        {{ new Date(scope.row.date_tallied).toLocaleDateString() }}
                        <div style="font-size: .8em;">Comment:</div> 
                        <div style="font-size: .8em;"><i>{{ scope.row.comment }}</i></div>
                    </template>
                </el-table-column>
                <el-table-column prop="total_count" label="Made" :width="device.isMobile ? '60px': 'auto'"/>
                <el-table-column prop="total_sold" label="Sold" :width="device.isMobile ? '60px': 'auto'"/>
                <el-table-column prop="total_sales" label="Sales" :width="device.isMobile ? '60px': 'auto'"/>
                <el-table-column label="Actions" :width="device.isMobile ? '80px': 'auto'">
                    <template #default="scope">
                        <div class="table-action-buttons">
                            <el-button size="small" type="success" @click="goToForm(scope.row.tally_id)">View</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="tally-table-paginator">
            <el-pagination layout="prev, pager, next" :page-count="pagination.pageCount" v-model:current-page="filters.currentPage" @current-change="getTallies()" :size="elementSize"/>
        </div>
    </div>
</template>
    
<script lang='ts'>
import { TallyService } from '~/services/tallyService';
import { Tally } from '~/types/tally';
import { CSSProperties } from 'nuxt/dist/app/compat/capi';

export default {
    data() {
        return {
            tallies: [] as Array<Tally>,
            filters: {
                currentPage: 1,
                perPage: 10,
                fromDate: '',
                toDate: ''
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
        async getTallies(resetPage = false) {
            this.componentState.isBusy = true;

            if (resetPage) {
                this.filters.currentPage = 1;
            }

            if (this.debounce.timer) clearTimeout(this.debounce.timer);

            this.debounce.timer = setTimeout(async () => {
                await TallyService.list(this.filters).then((response) => {
                    const data = response as unknown as Record<string, any>;

                    this.tallies = data.result;
                    this.pagination.pageCount = data.lastPage;

                    this.componentState.isBusy = false;
                }).catch((error) => {
                    this.error = error;

                    this.componentState.isBusy = false;
                });
            }, 50)
        },
        async exportToExcel() {
            this.componentState.isBusy = true;

            await TallyService.exportToExcel(this.filters).then((response: any) => {
                const url = URL.createObjectURL(response);

                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', 'tally list.xlsx')
                document.body.appendChild(link)
                link.click()

                this.componentState.isBusy = false;
            }).catch((error) => {
                this.error = error;

                this.componentState.isBusy = false;
            });
        },
        clearFilters() {
            this.filters.fromDate = '';
            this.filters.toDate = '';

            this.getTallies();
        },
        goToForm(id = 0) {
            this.$router.push(`/tally/${id}`)
        }
    },
    created() {
        this.getTallies();
    }
}
</script>
    
<style scoped>
.tally-table-filter div:not(.table-filter-buttons) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: .5em;
}

.table-filter-buttons {
    display: flex;
    flex-direction: row;
    gap: 0.5em
}

.tally-table-paginator {
    display: grid;
    justify-content: end;
}

.table-action-buttons {
    display: flex;
    flex-direction: row;
}

.comment {
    font-size: .45em;
}
</style>