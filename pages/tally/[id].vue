<template>
    <div id="tally-form-container">
        <h1>Tally</h1>
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
            </div>
            <div>
                <label>Comment</label>
                <el-input
                    v-model="tally.comment"
                    :rows="6"
                    type="textarea"
                    placeholder="Please input"
                />
            </div>
        </div>
    </div>
</template>
    
<script lang='ts'>
import {TallyService} from '~/services/tallyService';
import { Tally } from '~/types/tally';

export default {
    data() {
        return {
            tally: {} as Tally,
            pageState: {
                isBusy: false
            }
        }
    },
    methods: {
        async getTally() {
            const id: number = this.$route.params.id as unknown as number;

            const { data: data, error: error } = await TallyService.details(id);

            this.tally = data.value as Tally;
        }
    },
    created() {
        this.getTally();
    },
}
</script>
    
<style scoped>
#tally-form-container {
    padding: 2em;
}

.tally-form {
    display: grid;
}

.tally-form > div {
    display: flex;
    flex-direction: column;
    margin: .2em;
}
</style>