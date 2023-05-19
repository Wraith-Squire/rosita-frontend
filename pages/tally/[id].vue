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
            <div class="tally-form-products">
                <label>Products</label>
                <TallyProductTable></TallyProductTable>
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
            },
            error: {},
            parameters: {
                id: 0
            }
        }
    },
    methods: {
        async getTally() {
            if (this.parameters.id == 0) return;

            await TallyService.details(this.parameters.id).then((response) => {
                const data = response as unknown as Record<string, any>;

                this.tally = data;

                if (this.parameters.id != 0 && Object.entries(this.tally).length == 0) {
                    this.$router.push('/tally/list');
                }
            }).catch((error) => {
                this.error = error
                this.$router.push('/tally/list');
            });
        }
    },
    created() {
        this.parameters.id = this.$route.params.id as unknown as number;
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

el-date-picker {
    width: 100vw;
}
</style>