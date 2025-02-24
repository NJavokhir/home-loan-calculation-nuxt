<template>
    <!-- Card container for displaying legal fee calculation details -->
    <v-card class="legalfee-card">
        <!-- Stamp duty message for first-time homebuyers -->
        <div class="stamp-duty">
            Stamp duty will be only RM10.00 for first time home buyers
            <a
                href="https://www.mof.gov.my/portal/en/news/press-citations/first-time-house-buyers-to-continue-enjoying-stamp-duty-exemption-mof">
                See More
            </a>
        </div>

        <!-- Checkbox for selecting first-time homebuyer status -->
        <div class="buying-house">
            <label>
                <input type="checkbox" v-model="isChecked" />
                <span class="checkmark"></span>
                First time buying a house
            </label>
        </div>

        <!-- Property price input field -->
        <v-label class="custom-label">Property Price <span style="color: red; font-size: 12px;">*</span></v-label>
        <v-text-field v-model="maskedPrice" type="text" class="input-field" hide-details hide-spin-buttons
            placeholder="Property Price" @input="handleInput('price', $event)">
            <template #prepend-inner>
                <span class="prepend-text prepend-style">RM</span>
            </template>
        </v-text-field>

        <!-- Loan Amount input field with unit selection (percentage or RM) as design-->
        <v-label class="custom-label">Loan Amount <span style="color: red; font-size: 12px;">*</span></v-label>
        <v-text-field v-model="maskedLoan" type="text" class="input-field" hide-details hide-spin-buttons
            placeholder="Loan Amount" @input="handleInput('loan', $event)">
            <template #prepend-inner>
                <div class="prepend-class">
                    <span :class="{ active: loanAmountActualType === '%' }" @click="toggleLoanAmountType('%')">
                        %
                    </span>
                    <span :class="{ active: loanAmountActualType === 'RM' }" @click="toggleLoanAmountType('RM')">
                        RM
                    </span>
                </div>
            </template>
        </v-text-field>

        <v-btn @click="calculateLegalFee" class="calculate-btn">Calculate</v-btn>

        <!-- Results section, displayed after calculation -->
        <div class="legal-result" v-if="legalFee">
            <h4 class="font-weight-medium text-left mb-4">Results</h4>
            <div class="legal-result-sp">
                <div class="d-flex justify-space-between align-center mb-4">
                    <p class="text-caption">S&P Legal Fee (RM) </p>
                    <strong>{{ legalFee.toLocaleString() }}</strong>
                </div>
                <div class="d-flex justify-space-between align-center mb-4">
                    <p class="text-caption">S&P Stamp Duty (RM) </p>
                    <strong>{{ stampDutySPA.toLocaleString() }}</strong>
                </div>
                <div class="d-flex justify-space-between align-center">
                    <span class="text-caption caption-total">Total (RM) </span>
                    <strong>{{ totalLegalFee.toLocaleString() }}</strong>
                </div>
            </div>
            <div>
                <div class="d-flex justify-space-between align-center mb-4">
                    <p class="text-caption">Loan Legal Fee (RM)</p>
                    <strong>{{ loanLegalFee.toLocaleString() }}</strong>
                </div>
                <div class="d-flex justify-space-between align-center mb-4">
                    <p class="text-caption">Loan stamp Duty (RM)</p>
                    <strong>{{ loanStampDuty.toLocaleString() }}</strong>
                </div>
                <div class="d-flex justify-space-between align-center">
                    <span class="text-caption caption-total">Total (RM) </span>
                    <strong>{{ totalLoanFee.toLocaleString() }}</strong>
                </div>
            </div>
        </div>

        <!-- Note section for additional information -->
        <div class="note-class">
            <strong>Note:</strong> Exclude disbursement fee, SST and other misc charge, please consult your lawyer, the
            legal
            fee for property price exceeding RM7.5 million is negotiable, but subjected to maximum of 1%
        </div>
    </v-card>
</template>
<script>
import { formatCurrency } from "@/utils/currencyUtils";

export default {
    data() {
        return {
            propertyPrice: "",
            loanAmountActual: "",
            loanAmountActualType: "RM",
            isChecked: false,
            legalFee: null,
            stampDutySPA: null,
            loanLegalFee: null,
            loanStampDuty: null,
            maskedPrice: "",
            maskedLoan: "",
        };
    },
    computed: {
        // Total Legal Fee
        totalLegalFee() {
            return parseFloat(this.legalFee || 0) + parseFloat(this.stampDutySPA || 0);
        },
        // Total Loan Fee
        totalLoanFee() {
            return parseFloat(this.loanStampDuty || 0) + parseFloat(this.loanLegalFee || 0);
        },
    },
    watch: {
        // Watch loanAmountActual when type is '%'
        loanAmountActual(newLoanAmount) {
            if (this.loanAmountActualType === "%" && newLoanAmount > 100) {
                alert(
                    "The loan amount cannot exceed 100%. Please enter a valid loan amount."
                );
                this.loanAmountActual = "";
                this.maskedLoan = "";
            }
        },
    },
    methods: {
        // Handle input and update both masked and actual value
        handleInput(field, event) {
            let rawValue = event.replace(/[^\d.]/g, "");

            if (rawValue.startsWith("-")) {
                rawValue = rawValue.slice(1);
            }

            if (!rawValue) {
                this.$nextTick(() => {
                    if (field === "price") {
                        this.maskedPrice = rawValue;
                    } else if (field === "loan") {
                        this.maskedLoan = rawValue;
                    }
                });
            } else {
                if (field === "price") {
                    this.propertyPrice = parseInt(rawValue.replace(/[^0-9]/g, ""), 10) || 0;
                    this.maskedPrice = formatCurrency(rawValue);
                } else if (field === "loan") {
                    this.loanAmountActual =
                        parseInt(rawValue.replace(/[^0-9]/g, ""), 10) || 0;
                    this.maskedLoan = formatCurrency(rawValue);
                }
            }
        },
        // Toggle loan amount type
        toggleLoanAmountType(type) {
            this.loanAmountActualType = type;
            this.loanAmountActual = "";
            this.maskedLoan = "";
        },
        // Calculate legal fee
        calculateLegalFee() {
            if (!this.propertyPrice || !this.loanAmountActual) {
                this.legalFee = null;
                this.stampDutySPA = null;
                this.loanLegalFee = null;
                this.loanStampDuty = null;
                alert("Please fill all the fields correctly.");
                return;
            }

            const price = parseFloat(this.propertyPrice) || 0;

            let fee = 0;
            let stampDutySPAAmount = 0;
            let loanAmount = 0;
            let loanStampDutyAmount = 0;
            let loanFee = 0;

            // Legal Fee Calculation
            if (price <= 500000) {
                fee = price * 0.01;
            } else if (price <= 1000000) {
                fee = 5000 + (price - 500000) * 0.008;
            } else if (price <= 3000000) {
                fee = 9000 + (price - 1000000) * 0.007;
            } else if (price <= 5000000) {
                fee = 21000 + (price - 3000000) * 0.006;
            } else if (price <= 7500000) {
                fee = 33000 + (price - 5000000) * 0.006;
            } else {
                fee = Math.min(39000 + (price - 7500000) * 0.01, price * 0.01);
            }

            // Stamp Duty Calculation (SPA)
            if (price <= 100000) {
                stampDutySPAAmount = price * 0.01;
            } else if (price <= 500000) {
                stampDutySPAAmount = 1000 + (price - 100000) * 0.02;
            } else {
                stampDutySPAAmount = 9000 + (price - 500000) * 0.03;
            }

            // Loan Stamp Duty Calculation (0.5% of the loan amount)
            loanAmount =
                this.loanAmountActualType === "%"
                    ? price - price * (1 - parseFloat(this.loanAmountActual) / 100)
                    : parseFloat(this.loanAmountActual);
            loanStampDutyAmount = loanAmount * 0.005;

            // Loan Legal Fee Calculation
            if (loanAmount <= 500000) {
                loanFee = loanAmount * 0.01;
            } else if (loanAmount <= 1000000) {
                loanFee = 5000 + (loanAmount - 500000) * 0.008;
            } else if (loanAmount <= 3000000) {
                loanFee = 9000 + (loanAmount - 1000000) * 0.006;
            } else if (loanAmount <= 7500000) {
                loanFee = 21000 + (loanAmount - 3000000) * 0.005;
            } else {
                loanFee = Math.min(
                    46000 + (loanAmount - 7500000) * 0.01,
                    loanAmount * 0.01
                );
            }

            // Apply discount for first-time buyers
            if (this.isChecked && price <= 500000) {
                stampDutySPAAmount = 10;
                loanStampDutyAmount = 10;
            }

            // Set the values
            this.legalFee = fee;
            this.stampDutySPA = stampDutySPAAmount;
            this.loanStampDuty = loanStampDutyAmount;
            this.loanLegalFee = loanFee;
        },
    },
};
</script>


<style scoped>
.legalfee-card {
    padding: 0px;
    border: none;
    box-shadow: none;
    background-color: #FAFBFB;
}

a {
    color: #00B5B0;
    font-size: 14px;
    font-weight: 300;
    line-height: 20px;
}

.stamp-duty {
    width: 100%;
    font-size: 14px;
    color: #6B6F89;
    line-height: 20px;
    margin-bottom: 16px;
    font-weight: 300;
}

.buying-house {
    width: 340px;
    border: 1px solid #DBDEEB;
    background-color: #F1F2F8;
    border-radius: 16px;
    margin-bottom: 16px;
    padding: 16px;
}

.buying-house label {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px !important;
    color: #6B6F89;
    user-select: none;
    font-weight: 400;
}

.buying-house input[type="checkbox"] {
    display: none;
}

.buying-house .checkmark {
    width: 20px;
    height: 20px;
    background-color: #F9F8F8;
    border: 1px solid #DBDEEB;
    border-radius: 8px;
    margin-right: 20px;
    transition: all 0.3s ease;
    position: relative;
}

.buying-house input[type="checkbox"]:checked+.checkmark {
    background-color: #00B5B0;
    border-color: #00B5B0;
}

.buying-house input[type="checkbox"]:checked+.checkmark::after {
    content: "";
    position: absolute;
    left: 5px;
    top: 1px;
    width: 8px;
    height: 14px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

.buying-house label:hover .checkmark {
    border-color: #777;
    background-color: #e8e8e8;
}

.selected-label {
    font-size: 12px;
    font-weight: 400;
    color: #00B5B0;
    white-space: normal;
    word-wrap: break-word;
    line-height: 14px;
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
    width: 360px !important;
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

.legal-result {
    width: 349px;
    border: 1px solid #EDEDF3;
    padding: 12px;
    background-color: white;
    border-radius: 8px;
    margin-bottom: 16px;
}

.legal-result p {
    color: #6B6F89;
}

.legal-result-sp {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #C3C7D9;
}

.calculate-btn {
    width: 342px;
    height: 52px;
    background-color: #00B5B0;
    color: #F9F8F8;
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

.note-class {
    width: 350px;
    border-radius: 8px;
    background-color: #FFE7D0;
    border: 1px solid #EDEDF3;
    padding: 12px;
    font-size: 14px;
    font-weight: 400;
    color: #FF8C1B;
    line-height: 22px;
}

.prepend-style {
    margin-top: 6px;
}

.text-caption {
    font-size: 12px !important;
    line-height: 24px !important;
    font-weight: 400 !important;
    color: #6B6F89 !important;
}

.caption-total {
    font-size: 14px !important;
    color: #6B6F89;
    font-weight: 700 !important;
}
</style>