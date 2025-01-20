<template>
    <!-- Card container for the EPF form -->
    <v-card class="epf-card">

        <div class="custom-radio-group">
            <!-- Radio 1 -->
            <label class="radio-container"
                :class="{ 'radio-container-checked': withdrawalPurpose === 'purchase', 'default-label': withdrawalPurpose !== 'purchase' }">
                <input type="radio" name="withdrawalPurpose" value="purchase" v-model="withdrawalPurpose" hidden />
                <span class="custom-radio"></span>
                <span class="radio-label"
                    :class="{ 'selected-label': withdrawalPurpose === 'purchase', 'default-label': withdrawalPurpose !== 'purchase' }">
                    Withdrawal to purchase/build a house
                </span>
            </label>

            <!-- Radio 2 -->
            <label class="radio-container"
                :class="{ 'radio-container-checked': withdrawalPurpose === 'redeem', 'default-label': withdrawalPurpose !== 'redeem' }">
                <input type="radio" name="withdrawalPurpose" value="redeem" v-model="withdrawalPurpose" hidden />
                <span class="custom-radio" style="width: 42px !important;"></span>
                <span class="radio-label"
                    :class="{ 'selected-label': withdrawalPurpose === 'redeem', 'default-label': withdrawalPurpose !== 'redeem' }">
                    Withdrawal to reduce/redeem a housing loan
                </span>
            </label>
        </div>

        <!-- Calculator section -->
        <h4 class="font-weight-medium text-left mb-4">Calculator</h4>
        <div class="input-group">
            <v-label class="custom-label">Property Price <span style="color: red; font-size: 12px;">*</span></v-label>
            <v-text-field v-model="maskedPrice" type="text" class="input-field" hide-details hide-spin-buttons
                placeholder="Property Price" @input="handleInput('price', $event)">
                <template #prepend-inner>
                    <span class="prepend-text prepend-style">RM</span>
                </template>
            </v-text-field>

            <v-label class="custom-label">Loan Amount <span style="color: red; font-size: 12px;">*</span></v-label>
            <v-text-field v-model="maskedLoan" type="text" class="input-field" hide-details hide-spin-buttons
                placeholder="Loan Amount" @input="handleInput('loan', $event)">
                <template #prepend-inner>
                    <div class="prepend-class">
                        <span :class="{ active: loanAmountType === '%' }" @click="toggleDownPaymentType('%')">
                            %
                        </span>
                        <span :class="{ active: loanAmountType === 'RM' }" @click="toggleDownPaymentType('RM')">
                            RM
                        </span>
                    </div>
                </template>
            </v-text-field>

            <v-label class="custom-label">Balance in Account II <span
                    style="color: red; font-size: 12px;">*</span></v-label>
            <v-text-field v-model="maskedBalance" type="text" class="input-field" hide-details hide-spin-buttons
                placeholder="Balance in Account II" @input="handleInput('balance', $event)">
                <template #prepend-inner>
                    <span class="prepend-text prepend-style">RM</span>
                </template>
            </v-text-field>
        </div>

        <v-btn @click="calculateLoanToValue" class="calculate-btn" :disabled="!isFormValid">Calculate</v-btn>

        <!-- Display result after calculation -->
        <div v-if="fundCanBeWithdrawn">
            <h4 class="font-weight-medium text-left mb-4">Result</h4>
            <div class="d-flex justify-space-between align-center w-full rounded-lg pt-4 px-4 bg-white mb-4"
                v-if="fundCanBeWithdrawn !== null">
                <span class="text-caption">Fund can be withdraw (RM): </span>
                <strong>{{ fundCanBeWithdrawn }}</strong>
            </div>
        </div>
    </v-card>
</template>

<script>
import { formatCurrency } from '@/utils/currencyUtils'; // Assuming formatCurrency is a utility function
export default {
    data() {
        return {
            propertyPrice: '',
            loanAmount: '',
            balanceAccount: '',
            withdrawalPurpose: 'purchase',
            fundCanBeWithdrawn: null,
            loanAmountType: '%',
            maskedPrice: '',
            maskedLoan: '',
            maskedBalance: '',
        };
    },
    computed: {
        isFormValid() {
            return this.propertyPrice > 0 && this.loanAmount > 0 && this.balanceAccount > 0;
        },
    },
    watch: {
        loanAmount(newLoanAmount) {
            if (this.loanAmountType === '%' && newLoanAmount > 100) {
                alert('The loan amount cannot exceed 100%. Please enter a valid loan amount.');
                this.loanAmount = '';
                this.maskedLoan = '';
            }
        },
        loanAmountType(newValue) {
            this.loanAmount = '';
            this.maskedLoan = '';
        }
    },
    methods: {
        handleInput(field, event) {
            let rawValue = event.replace(/[^\d.]/g, '');

            if (rawValue.startsWith('-')) {
                rawValue = rawValue.slice(1);
            }

            if (!rawValue) {
                this.$nextTick(() => {
                    if (field === 'price') {
                        this.maskedPrice = rawValue;
                    } else if (field === 'loan') {
                        this.maskedLoan = rawValue;
                    } else if (field === 'balance') {
                        this.maskedBalance = rawValue;
                    }
                });
            } else {
                if (field === 'price') {
                    this.propertyPrice = parseInt(rawValue.replace(/[^0-9]/g, ''), 10) || 0;
                    this.maskedPrice = formatCurrency(rawValue);
                } else if (field === 'loan') {
                    this.loanAmount = parseInt(rawValue.replace(/[^0-9]/g, ''), 10) || 0;
                    this.maskedLoan = formatCurrency(rawValue);
                } else if (field === 'balance') {
                    this.balanceAccount = parseInt(rawValue.replace(/[^0-9]/g, ''), 10) || 0;
                    this.maskedBalance = formatCurrency(rawValue);
                }
            }
        },
        toggleDownPaymentType(type) {
            this.loanAmountType = type;
            this.loanAmount = '';
            this.maskedLoan = '';
        },
        calculateLoanToValue() {
            const price = parseFloat(this.propertyPrice) || 0;
            const loan = parseFloat(this.loanAmount) || 0;
            const balance = parseFloat(this.balanceAccount) || 0;

            if (price <= 0 || loan <= 0 || balance <= 0) {
                alert('Please fill in all fields correctly.');
                this.fundCanBeWithdrawn = null;
                return;
            }

            let fund = 0;

            if (this.withdrawalPurpose === 'purchase') {
                // Loan amount in RM (can be % or fixed amount)
                const loanInRM = this.loanAmountType === '%' ? (loan / 100) * price : loan;

                // Calculate the maximum eligible withdrawal amount
                const eligibleWithdrawal = (price - loanInRM) + (0.1 * price);

                // The actual amount withdrawable is the lower of Account II balance or the eligible withdrawal amount
                fund = Math.min(eligibleWithdrawal, balance);
            } else if (this.withdrawalPurpose === 'redeem') {
                // For redeem, withdrawal is limited to the lower of Outstanding Loan Balance or Account II Balance
                const loanInRM = this.loanAmountType === '%' ? (loan / 100) * price : loan;

                fund = Math.min(loanInRM, balance);
            }

            // Update the reactive variable for the result
            this.fundCanBeWithdrawn = fund.toLocaleString();
        },
    },
};
</script>

<style scoped>
.epf-card {
    padding: 0px;
    border: none;
    box-shadow: none;
    background-color: #FAFBFB;
}

.input-group {
    display: flex;
    flex-direction: column;
    padding-right: 16px;
    padding-left: 2px;
}

.v-text-field {
    padding-top: 10px !important;
    margin-top: 4px !important;
    padding-bottom: 10px !important;
    padding-left: 10px !important;
}

.input-field {
    width: 100%;
    border: 1px solid #C3C7D9 !important;
    border-radius: 16px;
    color: #1B1B1B;
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 16px;
    background-color: #FAFBFB;
    padding: 20px auto;
}

.custom-label {
    font-size: 12px;
    font-weight: 300;
    color: #6B6F89;
    margin-bottom: 8px;
    display: block;
    line-height: 18px;
}

.prepend-text,
.prepend-class span {
    width: 100%;
    color: #6b6f89;
    font-weight: 400;
    margin-right: 0px;
    font-size: 14px;
    line-height: 16px;
    cursor: pointer;
    justify-content: center;
    text-align: center;
}

.prepend-class span.active {
    color: #00b5b0;
    font-weight: 600;
    padding: 4px;
    background-color: white;
    border-radius: 8px;
}

.prepend-class {
    width: 64px;
    display: flex;
    padding: 2px;
    background-color: #F1F2F8;
    border-radius: 8px;
    align-items: center;
}

.prepend-text::after {
    content: "|";
    margin-left: 8px;
    color: #EDEDF3;
    font-weight: 400;
}

.text-caption {
    font-size: 12px !important;
    line-height: 24px !important;
    font-weight: 400 !important;
    color: #6B6F89 !important;
}

.calculate-btn {
    width: 343px;
    height: 52px !important;
    background-color: #00B5B0 !important;
    color: #F9F8F8 !important;
    text-align: center;
    padding: 14px 16px;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    text-transform: none;
    margin-bottom: 24px;
}

.theme--light.v-btn.v-btn--has-bg {
    background-color: #00B5B0 !important;
}

.v-btn:not(.v-btn--round).v-size--default {
    height: 52px !important;
    min-width: 64px;
    padding: 0 16px;
}

.theme--light.v-btn.v-btn--disabled {
    color: #F9F8F8 !important;
}

.custom-radio-group {
    display: flex;
    flex-wrap: row;
    gap: 16px;
    margin-bottom: 24px;
}

.radio-container {
    width: 167px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 5px 10px;
    border: 1px solid #ededf3;
    border-radius: 8px;
    background-color: white;
    transition: border-color 0.3s ease;
}

.radio-container input[type="radio"]:checked+.custom-radio {
    border-color: #00b5b0;
    background-color: #00b5b0;
}

.custom-radio {
    width: 35px !important;
    height: 20px !important;
    white-space: inherit;
    border: 2px solid #ededf3;
    border-radius: 50%;
    display: inline-block;
    position: relative;
    background-color: white;
    transition: background-color 0.3s ease, border-color 0.3s ease;
}

.custom-radio::after {
    content: "";
    width: 10px;
    height: 10px;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.radio-container input[type="radio"]:checked+.custom-radio::after {
    background-color: white;
    opacity: 1;
}

.radio-label {
    font-size: 12px;
    font-weight: 400;
    color: #6b6f89;
    line-height: 14px;
}

.radio-label.selected-label {
    color: #00b5b0;
    border-color: #00b5b0;
}

.radio-label.default-label {
    color: #6b6f89;
}

.radio-container-checked {
    border: 1px solid #00b5b0 !important;
}

.v-application .rounded-lg {
    border-radius: 8px !important;
    background: white;
}

.v-application p {
    margin-bottom: 0 !important;
}

.prepend-style {
    margin-top: 6px;
}
</style>