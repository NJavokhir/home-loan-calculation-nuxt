<template>
  <v-app>
    <!-- <v-app-bar app class="bg-white" style="background-color: white;">
      <v-btn icon @click="goBack">
        <v-icon class="w-6 h-6">mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title class="text-center font-weight-medium ml-n5">Calculator</v-toolbar-title>
    </v-app-bar> -->
    <div class="toolbar-style container">
      <img @click="goBack" src="@/assets/icon.svg" alt="">
      Calculator
    </div>
    <v-container>
      <v-tabs v-model="activeTab" hide-slider align-tabs="center" class="mb-6">
        <v-tab>Mortgage</v-tab>
        <v-tab>EPF Withdrawal</v-tab>
        <v-tab>Legal Fee</v-tab>
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
  padding: 4px 8px !important;
  margin-right: 8px;
  background-color: #F4F4F7;
  text-transform: none;
  align-self: center;
}

.v-tabs--density-default {
  --v-tabs-height: 30px;
}

.v-tab--selected {
  background-color: #E5F8F7 !important;
  color: #00B5B0;
  border: none;
}

.container {
  width: 100%;
  padding: 16px !important;
  margin-right: auto;
  margin-left: auto;
  background-color: #FAFBFB !important;
}

.v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: none !important;
}

.theme--light.v-tabs>.v-tabs-bar {
  background-color: none !important;
}

.v-slide-group__prev,
.v-slide-group__prev--disabled {
  display: none !important;
}

.v-app-bar.v-app-bar--fixed {
  position: relative !important;
}

.v-tab.v-tab {
  color: #00B5B0;
}

.v-slide-group__wrapper {
  background-color: #FAFBFB !important;
}

.v-slide-group__content .v-tabs-bar__content {
  background-color: #FAFBFB !important;
}

.toolbar-style {
  width: 100%;
  position: relative;
  padding: 18px auto !important;
  background-color: white !important;
  align-items: center !important;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  color: #191B1F;
}

.toolbar-style img {
  position: absolute;
  left: 0;
  margin: auto auto auto 34px;
  cursor: pointer;
}
</style>