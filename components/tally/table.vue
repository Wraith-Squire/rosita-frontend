<template>
    <div id="tally-table">
        <div class="tally-table-filter">
            <div>
                <label>From Date</label>
                <el-date-picker
                    v-model="filters.fromDate"
                    type="date"
                    placeholder="Pick a day"
                    size="default"
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
                    size="default"
                    format="MM-DD-YYYY"
                    value-format="YYYY-MM-DD"
                    :disabled="componentState.isBusy"
                />
            </div>
            <div>
                <el-button @click="getTallies()" :disabled="componentState.isBusy">Filter</el-button>
            </div>
            <div>
                <el-button @click="clearFilters()" :disabled="componentState.isBusy">Clear</el-button>
            </div>
            <div>
                <el-button @click="exportToExcel()" :disabled="componentState.isBusy">Export</el-button>
            </div>
            <div></div>
            <div></div>
            <div>
                <el-button type="primary" :disabled="componentState.isBusy" @click="goToForm()" style="width: 6em">Add</el-button>
            </div>
        </div>
        <div>
            <el-table :data="tallies" stripe style="width: 100%" v-loading="componentState.isBusy">
                <el-table-column label="Date Tallied" >
                    <template #default="scope">
                        {{ new Date(scope.row.date_tallied).toLocaleDateString() }}
                    </template>
                </el-table-column>
                <el-table-column prop="comment" label="Comment" />
                <el-table-column prop="total_count" label="Made" />
                <el-table-column prop="total_sold" label="Sold" />
                <el-table-column prop="total_sales" label="Sales" />
                <el-table-column label="Actions">
                    <template #default="scope">
                        <div class="table-action-buttons">
                            <el-button size="small" type="success" @click="goToForm(scope.row.tally_id)">View</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="tally-table-paginator">
            <el-pagination layout="prev, pager, next" :page-count="pagination.pageCount" v-model:current-page="filters.currentPage" @current-change="getTallies()"/>
        </div>
    </div>
</template>
    
<script lang='ts'>
import {TallyService} from '~/services/tallyService';
import { Tally } from '~/types/tally';

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
            }
        }
    },
    methods: {
        async getTallies() {
            this.componentState.isBusy = true;

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
            }, 200)
        },
        async exportToExcel() {
            this.componentState.isBusy = true;

            await TallyService.exportToExcel(this.filters).then((response: any) => {
                console.log(response);
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
#tally-table {
    width: 100%;
}
.tally-table-filter {
    display: grid;
    grid-template-columns: repeat(2, 1fr) repeat(6,.5fr);
    align-items: end;
    gap: .5em;
    justify-content: space-between;
    margin-bottom: 2em;
}

.tally-table-filter div {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.tally-table-paginator {
    display: grid;
    justify-content: end;
}

.table-action-buttons {
    display: flex;
    flex-direction: row;
}
</style>