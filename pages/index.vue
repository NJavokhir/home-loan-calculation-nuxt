<template>
  <v-app>
    <div class="toolbar-style">
      <img @click="goBack" src="@/assets/icon.svg" alt="">
      Calculator
    </div>
    <v-container>
      <v-tabs v-model="activeTab" hide-slider align-tabs="center" class="mb-6" background-color="#FAFBFB">
        <v-tab :style="activeTab === 0 ? 'background-color: #E5F8F7;' : ''">Mortgage</v-tab>
        <v-tab :style="activeTab === 1 ? 'background-color: #E5F8F7;' : ''">EPF Withdrawal</v-tab>
        <v-tab :style="activeTab === 2 ? 'background-color: #E5F8F7;' : ''">Legal Fee</v-tab>
      </v-tabs>

      <v-tabs-items v-model="activeTab">
        <v-tab-item v-show="activeTab === 0">
          <MortgageTab />
        </v-tab-item>
        <v-tab-item v-show="activeTab === 1">
          <EPFWithdrawalTab />
        </v-tab-item>
        <v-tab-item v-show="activeTab === 2">
          <LegalFeeTab />
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </v-app>
</template>

<script>
import MortgageTab from "@/components/MortgageTab.vue";
import EPFWithdrawalTab from "@/components/EpfWithdrawalTab.vue";
import LegalFeeTab from "@/components/LegalFeeTab.vue";

export default {
  components: {
    MortgageTab,
    EPFWithdrawalTab,
    LegalFeeTab,
  },
  data() {
    return {
      activeTab: 0,
    };
  },
  methods: {
    goBack() {
      this.$router.back();
    },
  },
};
</script>

<style scoped>
.v-tab {
  font-weight: 500;
  border-radius: 20px !important;
  padding: 6px 8px !important;
  margin-right: 8px;
  background-color: #F4F4F7;
  text-transform: none;
  align-self: center;
}

.v-tabs--density-default {
  --v-tabs-height: 30px;
}

.container {
  width: 375px !important;
  padding: 16px !important;
  margin-right: auto;
  margin-left: auto;
  background-color: #FAFBFB !important;
  height: 100vh;
}

.v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: none !important;
}

.v-tab.v-tab {
  color: #00B5B0;
  ;
}

.toolbar-style {
  width: 375px;
  height: 60px;
  position: relative;
  padding: 18px auto !important;
  background-color: white !important;
  align-items: center !important;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  color: #191B1F;
  margin-right: auto;
  margin-left: auto;
  align-content: center;
}

.toolbar-style img {
  position: absolute;
  left: 0;
  margin: auto auto auto 15px;
  cursor: pointer;
}
</style>