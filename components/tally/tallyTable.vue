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
                    value-format="MM-DD-YYYY"
                    :disabled="pageState.isBusy"
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
                    value-format="MM-DD-YYYY"
                    :disabled="pageState.isBusy"
                />
            </div>
            <div>
                <el-button @click="getTallies()" :disabled="pageState.isBusy">Filter</el-button>
            </div>
            <div>
                <el-button :disabled="pageState.isBusy">Clear</el-button>
            </div>
            <div>
                <el-button :disabled="pageState.isBusy">Export</el-button>
            </div>
            <div></div>
            <div></div>
            <div>
                <el-button type="primary" :disabled="pageState.isBusy">Add</el-button>
            </div>
        </div>
        <div>
            <el-table :data="tallies" stripe style="width: 100%">
                <el-table-column prop="date_tallied" label="Date Tallied" />
                <el-table-column prop="comment" label="Comment" />
                <el-table-column prop="total_count" label="Made" />
                <el-table-column prop="total_sold" label="Sold" />
                <el-table-column prop="total_sales" label="Sales" />
                <el-table-column label="Actions">
                    <template #default="scope">
                        <div class="table-action-buttons">
                            <el-button size="small">View</el-button>
                            <el-button size="small" type="danger">Delete</el-button>
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
                perPage: 4,
                fromDate: '',
                toDate: ''
            },
            pagination: {
                pageCount: 1
            },
            pageState: {
                isBusy: false
            }
        }
    },
    methods: {
        async getTallies() {
            const {data: data, error: error} = TallyService.list(this.filters);
            
            if (error) console.log(error.value);

            console.log(data.value);
            this.tallies = data.value ? data.value['result'] : [];
            this.pagination.pageCount = data.value ? data.value['lastPage'] : 1;
            console.log(this.tallies);
        }
    },
    created() {
        this.getTallies();
    }
}
</script>
    
<style scoped>
.tally-table-filter {
    display: grid;
    grid-template-columns: repeat(2, 1fr) repeat(6,.5fr);
    gap: .5em;
    align-items: end;
    width: 100%;
    justify-content: center;
    margin-bottom: 2em;
}

.tally-table-filter div {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.tally-table-paginator {
    display: grid;
    justify-content: end;
}

.table-action-buttons {
    display: flex;
    flex-direction: row;
}

input[type="date"] {
    all: unset;
    text-align: center;
    background-color: rgba(158, 158, 204, 0.2);
}
</style>