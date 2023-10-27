import React, { useEffect, useState } from "react";
import "../Style/sidebar.scss";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { openSidebar } from "../Redux/StateManagement/sidebar";
import { toggleSidebar } from "../Redux/StateManagement/sidebar";

//Img
import VladimirLogoSmally from "../Img/VladimirSmally.png";
import MisLogo from "../Img/MIS LOGO.png";

// Components
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIcon,
  Collapse,
  Divider,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import Zoom from "@mui/material/Zoom";

// Icons
import {
  Dashboard,
  ListAlt,
  AccountBox,
  LocalOffer,
  RecentActors,
  ManageAccountsSharp,
  Category,
  Inventory2Rounded,
  FormatListBulletedRounded,
  AssignmentIndRounded,
  ClassRounded,
  PlaylistRemoveRounded,
  SummarizeRounded,
  KeyboardDoubleArrowLeftRounded,
  SupervisorAccountRounded,
  FactCheckRounded,
  Apartment,
  LocationOn,
  Schema,
  Construction,
  Badge,
  InventoryRounded,
  Groups2Rounded,
  StoreRounded,
  MonetizationOn,
  CategoryOutlined,
  BackupTableRounded,
  FactCheck,
  SettingsAccessibility,
  ManageAccounts,
  PermDataSetting,
  SettingsApplications,
  HowToReg,
  AssignmentTurnedIn,
  ExpandLessRounded,
  ExpandMoreRounded,
  Segment,
} from "@mui/icons-material";

const Sidebar = () => {
  const [state, setState] = useState(false);
  const [masterListCollapse, setMasterListCollapse] = useState(false);
  const [userCollapse, setUserCollapse] = useState(false);
  const [settingsCollapse, setSettingsCollapse] = useState(false);
  const [requestCollapse, setRequestCollapse] = useState(false);
  const [reportCollapse, setReportCollapse] = useState(false);
  const collapseArray = [
    masterListCollapse,
    userCollapse,
    settingsCollapse,
    requestCollapse,
    reportCollapse,
  ];

  const dispatch = useDispatch();
  const collapse = useSelector((state) => state.sidebar.open);
  const permissions = useSelector(
    (state) => state.userLogin?.user.role.access_permission
  );

  const drawer = useSelector((state) => state.booleanState.drawer);

  const handleMenuCollapse = () => {
    dispatch(toggleSidebar());
  };

  const closeCollapse = () => {
    setMasterListCollapse(false);
    setUserCollapse(false);
    setSettingsCollapse(false);
    setRequestCollapse(false);
    setReportCollapse(false);
  };

  const MENU_LIST = [
    {
      label: "Dashboard",
      icon: Dashboard,
      path: "/",
      permission: "dashboard",
      setter: closeCollapse,
    },

    {
      label: "Masterlist",
      icon: ListAlt,
      path: "/masterlist",
      permission: "masterlist",
      children: [
        // {
        //   label: "Modules",
        //   icon: DatasetRounded,
        //   path: "/masterlist/modules",
        //   permission: [],
        // },

        {
          label: "Company",
          icon: Apartment,
          path: "/masterlist/company",
          permission: "company",
        },

        {
          label: "Department",
          icon: Schema,
          path: "/masterlist/department",
          permission: "department",
        },

        {
          label: "Location",
          icon: LocationOn,
          path: "/masterlist/location",
          permission: "location",
        },

        {
          label: "Account Title",
          icon: Badge,
          path: "/masterlist/account-title",
          permission: "account-title",
        },

        {
          label: "Sub Unit",
          icon: Segment,
          path: "/masterlist/sub-unit",
          permission: "sub-unit",
        },

        {
          label: "Division",
          icon: Groups2Rounded,
          path: "/masterlist/division",
          permission: "division",
        },

        {
          label: "Type of Request",
          icon: BackupTableRounded,
          path: "/masterlist/type-of-request",
          permission: "type-of-request",
        },

        {
          label: "Capex",
          icon: MonetizationOn,
          path: "/masterlist/capex",
          permission: "capex",
        },

        // {
        //   label: "Service Provider",
        //   icon: Construction,
        //   path: "/masterlist/service-provider",
        //   permission: [],
        // },

        // {
        //   label: "Supplier",
        //   icon: StoreRounded,
        //   path: "/masterlist/supplier",
        //   permission: [],
        // },
        {
          label: "Category",
          icon: Category,
          path: "/masterlist/category",
          permission: "category",
        },

        {
          label: "Status Category",
          icon: FactCheck,
          path: "/masterlist/status-category",
          permission: "status-category",
        },

        // {
        //   label: "Asset Registration",
        //   icon: NoteAddRounded,
        //   path: "masterlist/create-asset-registration",
        //   permission: [],
        // },
      ],
      open: masterListCollapse,
      setter: (e) => {
        // e.preventDefault();
        setMasterListCollapse(!masterListCollapse);
        setUserCollapse(false);
        setSettingsCollapse(false);
        setRequestCollapse(false);
        setReportCollapse(false);
        closeCollapse;
        dispatch(openSidebar());
      },
    },

    {
      label: "User Management",
      icon: SupervisorAccountRounded,
      path: "/user-management",
      permission: "user-management",
      children: [
        {
          label: "User Accounts",
          icon: AccountBox,
          path: "/user-management/user-accounts",
          permission: "user-accounts",
        },
        {
          label: "Role Management",
          icon: ManageAccountsSharp,
          path: "/user-management/role-management",
          permission: "role-management",
        },
      ],
      open: userCollapse,
      setter: (e) => {
        // e.preventDefault();
        setUserCollapse(!userCollapse);
        setMasterListCollapse(false);
        setSettingsCollapse(false);
        setRequestCollapse(false);
        setReportCollapse(false);
        closeCollapse;
        dispatch(openSidebar());
      },
    },

    {
      label: "Fixed Assets",
      icon: InventoryRounded,
      path: "/fixed-assets",
      permission: "fixed-assets",
      setter: closeCollapse,
    },

    {
      label: "Settings",
      icon: PermDataSetting,
      path: "/settings",
      permission: "settings",
      children: [
        {
          label: "Approver Settings",
          icon: HowToReg,
          path: "/settings/approver-settings",
          permission: "approver-settings",
        },
        {
          label: "Form Settings",
          icon: SettingsApplications,
          path: "/settings/form-settings",
          permission: "form-settings",
        },
      ],
      open: settingsCollapse,
      setter: (e) => {
        // e.preventDefault();
        setSettingsCollapse(!settingsCollapse);
        setUserCollapse(false);
        setMasterListCollapse(false);
        setRequestCollapse(false);
        setReportCollapse(false);
        closeCollapse;
        dispatch(openSidebar());
      },
    },

    {
      label: "Request",
      icon: FactCheckRounded,
      path: "/request",
      permission: "request",
      children: [
        {
          label: "Acquisition",
          icon: AssignmentTurnedIn,
          path: "/request/acquisition",
          permission: "acquisition",
        },
        {
          label: "Transfer",
          icon: AccountBox,
          path: "/request/transfer",
          permission: "transfer",
        },
        {
          label: "Pull Out",
          icon: ManageAccountsSharp,
          path: "/request/pull-out",
          permission: "pull-out",
        },
        {
          label: "Evaluation",
          icon: Category,
          path: "/request/evaluation",
          permission: "evaluation",
        },
      ],
      open: requestCollapse,
      setter: () => {
        setRequestCollapse(!requestCollapse);
        setMasterListCollapse(false);
        setUserCollapse(false);
        setSettingsCollapse(false);
        setReportCollapse(false);
        closeCollapse;
        dispatch(openSidebar());
      },
    },

    {
      label: "Asset for Tagging",
      icon: LocalOffer,
      path: "/asset-for-tagging",
      permission: "asset-for-tagging",
      setter: closeCollapse,
    },

    {
      label: "Asset List",
      icon: FormatListBulletedRounded,
      path: "/asset-list",
      permission: "asset-list",
      setter: closeCollapse,
    },

    {
      label: "On Hand in Process",
      icon: ClassRounded,
      path: "/on-hand-in-process",
      permission: "on-hand-in-process",
      setter: closeCollapse,
    },

    {
      label: "Disposal",
      icon: PlaylistRemoveRounded,
      path: "/disposal",
      permission: "disposal",
      setter: closeCollapse,
    },

    {
      label: "Reports",
      icon: SummarizeRounded,
      path: "/reports/report1",
      permission: "reports",
      children: [
        {
          label: "Report 1",
          icon: SummarizeRounded,
          path: "/reports/report1",
          permission: [],
        },
        {
          label: "Report 2",
          icon: SummarizeRounded,
          path: "/reports/report2",
          permission: [],
        },
        {
          label: "Report 3",
          icon: SummarizeRounded,
          path: "/reports/report3",
          permission: [],
        },
      ],
      open: reportCollapse,
      setter: () => {
        setReportCollapse(!reportCollapse);
        setMasterListCollapse(false);
        setUserCollapse(false);
        setRequestCollapse(false);
        closeCollapse;
        dispatch(openSidebar());
      },
    },
  ];

  const { pathname } = useLocation();
  const location = useLocation();

  // useEffect(() => {
  //   if (!collapse) {
  //     closeCollapse();
  //   }

  //   if (pathname === "/") {
  //     closeCollapse();
  //   }

  //   if (collapse && pathname.match(/masterlist/)) {
  //     setMasterListCollapse(true);
  //   } else if (collapse && pathname.match(/user-management/)) {
  //     setUserCollapse(true);
  //   } else if (collapse && pathname.match(/settings/)) {
  //     setSettingsCollapse(true);
  //   } else if (collapse && pathname.match(/request/)) {
  //     setRequestCollapse(true);
  //   } else if (collapse && pathname.match(/reports/)) {
  //     setReportCollapse(true);
  //   }
  // }, [collapse, pathname]);

  useEffect(() => {
    if (collapse) {
      const routes = [
        "masterlist",
        "user-management",
        "settings",
        "request",
        "reports",
      ];
      const match = routes.find((route) => pathname.includes(route));
      if (match) {
        const stateVariable = `${match}Collapse`;
        setState(stateVariable, true);
      }
    } else if (pathname === "/") {
      closeCollapse();
    } else {
      closeCollapse();
    }
  }, [collapse, pathname]);

  return (
    <>
      <Box className={`sidebar ${collapse ? "" : "collapsed"}`}>
        <Box>
          {collapse ? (
            <IconButton
              className="sidebar__closeBtn"
              sx={{ position: "absolute", right: 10, top: 39, zIndex: 2 }}
              onClick={handleMenuCollapse}
              size="small"
            >
              <KeyboardDoubleArrowLeftRounded />
            </IconButton>
          ) : null}
          <Box className="sidebar__logo-container">
            <img
              src={VladimirLogoSmally}
              alt="Vladimir Logo"
              style={{
                width: "40px",
              }}
            />

            {collapse && (
              <Typography
                color="secondary"
                sx={{
                  zIndex: 0,
                  fontFamily: "Josefin Sans",
                  fontSize: "22px",
                  letterSpacing: "2px",
                  pl: 2.3,
                  userSelect: "none",
                }}
              >
                VLADIMIR
              </Typography>
            )}
          </Box>
        </Box>

        <Box className="sidebar__menus">
          <List>
            {MENU_LIST.map((item) => {
              return (
                permissions.split(", ").includes(item.permission) && (
                  <ListItem
                    key={item.path}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      padding: 0,
                      px: "10px",
                    }}
                    disablePadding
                    dense
                  >
                    <Tooltip
                      title={!collapse && item.label}
                      TransitionComponent={Zoom}
                      placement="right"
                      arrow
                    >
                      <ListItemButton
                        className="sidebar__menu-btn"
                        component={NavLink}
                        to={item.path}
                        sx={{
                          width: collapse ? "225px" : "98%",
                          borderRadius: "12px",
                          transition: "0.2s ease-in-out",
                        }}
                        onClick={item?.setter}
                      >
                        <ListItemIcon sx={{ py: 1, minWidth: "35px" }}>
                          <SvgIcon component={item.icon} />
                        </ListItemIcon>
                        {collapse && <ListItemText primary={item.label} />}
                        {collapse && Boolean(item.children?.length) && (
                          <ExpandLessRounded
                            sx={{
                              transform: item.open
                                ? "rotate(0deg)"
                                : "rotate(180deg)",
                              transition: "0.2s ease-in-out",
                            }}
                          />
                        )}
                      </ListItemButton>
                    </Tooltip>

                    {Boolean(item.children?.length) && (
                      <Collapse
                        in={item.open}
                        timeout="auto"
                        unmountOnExit
                        sx={{ width: "100%" }}
                      >
                        <List
                          component="div"
                          className="sidebar__menu-list"
                          sx={{ pt: 0.5 }}
                        >
                          {item.children.map((childItem) => {
                            return (
                              permissions
                                .split(", ")
                                .includes(childItem.permission) && (
                                <ListItemButton
                                  className="sidebar__menu-btn-list"
                                  key={childItem.path}
                                  component={NavLink}
                                  to={childItem.path}
                                  sx={{
                                    width: "208px",
                                    ml: 2,
                                    borderRadius: "12px",
                                    px: 0,
                                  }}
                                  dense
                                >
                                  <ListItemIcon sx={{ pl: 2, py: 0.5 }}>
                                    <SvgIcon component={childItem.icon} />
                                  </ListItemIcon>
                                  <ListItemText primary={childItem.label} />
                                </ListItemButton>
                              )
                            );
                          })}
                        </List>
                        <Divider sx={{ mb: "10px", mx: "15px" }} />
                      </Collapse>
                    )}
                  </ListItem>
                )
              );
            })}
          </List>
        </Box>

        <Box className="sidebar__copyright">
          <img
            src={MisLogo}
            alt="MIS-Logo"
            style={{
              width: "50px",
            }}
          />
          {collapse && (
            <p>
              Powered By MIS All rights reserved <br />
              Copyrights © 2021
            </p>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;
