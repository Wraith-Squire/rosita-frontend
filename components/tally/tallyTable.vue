<template>
    <div id="tally-table">
        <div class="tally-table-filter">
            <div>
                {{ filters.fromDate }}
                <label>From Date</label>
                <input type="date" v-model="filters.fromDate"/>
            </div>
            <div>
                <label>To Date</label>
                <input type="date" v-model="filters.toDate"/>
            </div>
            <div>
                <button>Filter</button>
            </div>
            <div></div>
            <div></div>
            <div>
                <button>Add Tally</button>
            </div>
        </div>
        <div class="tally-table-row tally-table-header">
            <div v-for="name in columnNames" :key="name">{{ name }}</div>
        </div>
        <div class="tally-table-row" v-for="tally in tallies" :key="tally.tally_id">
            <div>{{ tally.date_tallied }}</div>
            <div>{{ tally.products }}</div>
            <div>{{ tally.total_count }}</div>
            <div>{{ tally.total_sold }}</div>
            <div>{{ tally.total_sales }}</div>
            <div></div>
        </div>
    </div>
</template>
    
<script lang='ts'>
import {TallyService} from '~/services/tallyService';
import { Tally } from '~/types/tally';

export default {
    data() {
        return {
            columnNames: [
                'Date Tallied', 'Product', 'Made', 'Sold', 'Sales', 'Action'
            ],
            tallies: [] as Array<Tally>,
            filters: {
                fromDate: null,
                toDate: null
            }
        }
    },
    methods: {
        async getTallies() {
            await TallyService.list().then((response) => {
                console.log(response.data)
                this.tallies = response.data;
            }).catch((errors) => {
                console.error(errors);
            })
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
    grid-template-columns: repeat(6, 1fr);
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
.tally-table-header {
    font-size: medium;
    font-weight: bold;
}
.tally-table-row {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: .5em;
    align-items: end;
    text-align: center;
    width: 100%;
    margin: .5em;
}

input[type="date"] {
    all: unset;
    border-radius: .1em;
    text-align: center;
    background-color: rgba(158, 158, 204, 0.479);
}
</style>