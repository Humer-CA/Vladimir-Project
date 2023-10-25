import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

// State Management
import sidebarReducer from "../StateManagement/sidebar";
import toastReducer from "./toastSlice";
import confirmReducer from "./confirmSlice";
import changePasswordReducer from "../StateManagement/changePasswordSlice";
import ipSetupReducer from "../StateManagement/ipSetupSlice";
import userLoginReducer from "../StateManagement/userLogin";
import collapseCapexReducer from "./collapseCapexSlice";
import booleanStateReducer from "./booleanStateSlice";

// import drawerReducer from './drawerSlice'
// import dialogReducer from './dialogSlice'
// import tableDialogReducer from './tableDialogSlice'
// import datePickerReducer from './datePickerSlice'
// import importFileReducer from './importFileSlice'
// import exportFileReducer from './exportFileSlice'
// import scanFileReducer from './scanFileSlice'

// Query
import { changePasswordApi } from "../Query/ChangePasswordApi";
// import { modulesApi } from '../Query/ModulesApi'

// Masterlist
import { sedarUsersApi } from "../Query/SedarUserApi";
import { typeOfRequestApi } from "../Query/Masterlist/TypeOfRequest";
import { capexApi } from "../Query/Masterlist/Capex";
import { subCapexApi } from "../Query/Masterlist/SubCapex";
import { majorCategoryApi } from "../Query/Masterlist/Category/MajorCategory";
import { minorCategoryApi } from "../Query/Masterlist/Category/MinorCategory";
// import { categoryListApi } from '../Query/Masterlist/Category/CategoryList'
// import { serviceProviderApi } from '../Query/Masterlist/ServiceProviderApi'
// import { supplierApi } from '../Query/Masterlist/SupplierApi'

import { fistoCompanyApi } from "../Query/Masterlist/FistoCoa/FistoCompany";
import { fistoDepartmentApi } from "../Query/Masterlist/FistoCoa/FistoDepartment";
import { fistoLocationApi } from "../Query/Masterlist/FistoCoa/FistoLocation";
import { fistoAccountTitleApi } from "../Query/Masterlist/FistoCoa/FistoAccountTitle";
import { companyApi } from "../Query/Masterlist/FistoCoa/Company";
import { departmentApi } from "../Query/Masterlist/FistoCoa/Department";
import { locationApi } from "../Query/Masterlist/FistoCoa/Location";
import { accountTitleApi } from "../Query/Masterlist/FistoCoa/AccountTitle";
import { divisionApi } from "../Query/Masterlist/Division";

// User Management
import { userAccountsApi } from "../Query/UserManagement/UserAccountsApi";
import { roleManagementApi } from "../Query/UserManagement/RoleManagementApi";

// Fixed Assets
import { fixedAssetApi } from "../Query/FixedAsset/FixedAssets";
import { additionalCostApi } from "../Query/FixedAsset/AdditionalCost";
import { printOfflineFaApi } from "../Query/FixedAsset/OfflinePrintingFA";

import { ipAddressSetupApi } from "../Query/IpAddressSetup";
import { ipAddressPretestSetupApi } from "../Query/IpAddressSetup";

import { assetStatusApi } from "../Query/Masterlist/Status/AssetStatus";
import { cycleCountStatusApi } from "../Query/Masterlist/Status/CycleCountStatus";
import { assetMovementStatusApi } from "../Query/Masterlist/Status/AssetMovementStatus";
import { depreciationStatusApi } from "../Query/Masterlist/Status/DepreciationStatus";

import { approverSettingsApi } from "../Query/Settings/ApproverSettings";
import { unitApproversApi } from "../Query/Settings/UnitApprovers";
import { acquisitionApi } from "../Query/Request/Acquisition";
import { subUnitApi } from "../Query/Masterlist/SubUnit";

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    userLogin: userLoginReducer,
    toast: toastReducer,
    confirm: confirmReducer,
    changePassword: changePasswordReducer,
    ipSetup: ipSetupReducer,
    collapseCapex: collapseCapexReducer,
    booleanState: booleanStateReducer,

    // drawer: drawerReducer,
    // dialog: dialogReducer,
    // tableDialog: tableDialogReducer,
    // datePicker: datePickerReducer,
    // importFile: importFileReducer,
    // exportFile: exportFileReducer,
    // scanFile: scanFileReducer,

    [changePasswordApi.reducerPath]: changePasswordApi.reducer,
    // [modulesApi.reducerPath]: modulesApi.reducer,

    // Masterlist
    [typeOfRequestApi.reducerPath]: typeOfRequestApi.reducer,
    [capexApi.reducerPath]: capexApi.reducer,
    [subCapexApi.reducerPath]: subCapexApi.reducer,
    // [serviceProviderApi.reducerPath]: serviceProviderApi.reducer,

    [majorCategoryApi.reducerPath]: majorCategoryApi.reducer,
    [minorCategoryApi.reducerPath]: minorCategoryApi.reducer,
    // [categoryListApi.reducerPath]: categoryListApi.reducer,
    // [supplierApi.reducerPath]: supplierApi.reducer,

    [fistoCompanyApi.reducerPath]: fistoCompanyApi.reducer,
    [fistoDepartmentApi.reducerPath]: fistoDepartmentApi.reducer,
    [fistoLocationApi.reducerPath]: fistoLocationApi.reducer,
    [fistoAccountTitleApi.reducerPath]: fistoAccountTitleApi.reducer,

    [companyApi.reducerPath]: companyApi.reducer,
    [departmentApi.reducerPath]: departmentApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
    [accountTitleApi.reducerPath]: accountTitleApi.reducer,

    [subUnitApi.reducerPath]: subUnitApi.reducer,
    [divisionApi.reducerPath]: divisionApi.reducer,
    [ipAddressSetupApi.reducerPath]: ipAddressSetupApi.reducer,
    [ipAddressPretestSetupApi.reducerPath]: ipAddressPretestSetupApi.reducer,

    // User Mangement
    [userAccountsApi.reducerPath]: userAccountsApi.reducer,
    [sedarUsersApi.reducerPath]: sedarUsersApi.reducer,
    [roleManagementApi.reducerPath]: roleManagementApi.reducer,

    // Fixed Assets
    [fixedAssetApi.reducerPath]: fixedAssetApi.reducer,
    [additionalCostApi.reducerPath]: additionalCostApi.reducer,
    [printOfflineFaApi.reducerPath]: printOfflineFaApi.reducer,
    [assetStatusApi.reducerPath]: assetStatusApi.reducer,
    [cycleCountStatusApi.reducerPath]: cycleCountStatusApi.reducer,
    [assetMovementStatusApi.reducerPath]: assetMovementStatusApi.reducer,
    [depreciationStatusApi.reducerPath]: depreciationStatusApi.reducer,

    // Settings
    [approverSettingsApi.reducerPath]: approverSettingsApi.reducer,
    [unitApproversApi.reducerPath]: unitApproversApi.reducer,

    // Request
    [acquisitionApi.reducerPath]: acquisitionApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat([
      changePasswordApi.middleware,
      // modulesApi.middleware,

      // Masterlist
      typeOfRequestApi.middleware,
      capexApi.middleware,
      subCapexApi.middleware,

      // serviceProviderApi.middleware,
      majorCategoryApi.middleware,
      minorCategoryApi.middleware,
      // categoryListApi.middleware,
      // supplierApi.middleware,
      fistoCompanyApi.middleware,
      fistoDepartmentApi.middleware,
      fistoLocationApi.middleware,
      fistoAccountTitleApi.middleware,

      companyApi.middleware,
      departmentApi.middleware,
      locationApi.middleware,
      accountTitleApi.middleware,
      subUnitApi.middleware,

      divisionApi.middleware,
      printOfflineFaApi.middleware,
      ipAddressSetupApi.middleware,
      ipAddressPretestSetupApi.middleware,

      // User Management
      userAccountsApi.middleware,
      sedarUsersApi.middleware,
      roleManagementApi.middleware,

      // Fixed Assets
      fixedAssetApi.middleware,
      additionalCostApi.middleware,
      assetStatusApi.middleware,
      cycleCountStatusApi.middleware,
      assetMovementStatusApi.middleware,
      depreciationStatusApi.middleware,

      // Settings
      approverSettingsApi.middleware,
      unitApproversApi.middleware,

      // Request
      acquisitionApi.middleware,
    ]),
});

setupListeners(store.dispatch);
