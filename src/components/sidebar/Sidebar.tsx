import * as React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";
import Collapse from "@mui/material/Collapse";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import EscalatorWarningOutlinedIcon from "@mui/icons-material/EscalatorWarningOutlined";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import InsertInvitationOutlinedIcon from "@mui/icons-material/InsertInvitationOutlined";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GavelIcon from "@mui/icons-material/Gavel";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ListAltIcon2 from "@mui/icons-material/ListAlt";
import CategoryIcon from "@mui/icons-material/Category";
import InfoIcon from "@mui/icons-material/Info";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const drawerWidth = 240;
const miniWidth = 72;

interface Props {
  window?: () => Window;
}

export default function Sidebar(props: Props) {
  const { t } = useTranslation();
  const location = useLocation();

  // === remember collapse state across refresh
  const [collapsed, setCollapsed] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem("sidebar:collapsed") === "1";
    } catch {
      return false;
    }
  });
  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((c) => !c);
  }, []);

  // keep CSS var & storage in sync
  React.useLayoutEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-w",
      `${collapsed ? miniWidth : drawerWidth}px`
    );
    try {
      localStorage.setItem("sidebar:collapsed", collapsed ? "1" : "0");
    } catch {}
  }, [collapsed]);

  const [highlightedItem, setHighlightedItem] = React.useState("/");
  const [openTeach, setOpenTeach] = React.useState(false);
  const [openStudents, setOpenStudents] = React.useState(false);
  const [openAcc, setOpenAcc] = React.useState(false);
  const [openMaster, setOpenMaster] = React.useState(false);

  React.useEffect(() => {
    setHighlightedItem(location.pathname);
    if (location.pathname.startsWith("/master")) setOpenMaster(true);
  }, [location]);

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };
  const handleDrawerTransitionEnd = () => setIsClosing(false);
  const handleDrawerToggle: React.EventHandler<React.SyntheticEvent> = () => {
    if (!isClosing) setMobileOpen(!mobileOpen);
  };

  const role = localStorage.getItem("role");

  return (
    <Box sx={{ display: "flex" }}>
      {/* Mobile hamburger */}
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerToggle}
        sx={{
          zIndex: 100,
          position: "absolute",
          top: -8,
          left: 18,
          display: { xs: "block", sm: "none" },
        }}
      >
        <MenuIcon className="text-black" />
      </IconButton>

      {/* NAV container width tracks collapse */}
      <Box
        component="nav"
        sx={{ width: { sm: collapsed ? miniWidth : drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="sidebar"
      >
        {/* Mobile Drawer */}
        <Drawer
          PaperProps={{ sx: { backgroundColor: "#005C78" } }}
          container={window ? window().document.body : undefined}
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {role && drawerContent(role)}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          PaperProps={{ sx: { backgroundColor: "#005C78" } }}
          variant="permanent"
          anchor="left"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              position: "fixed",
              left: 0,
              top: 0,
              height: "100vh",
              width: collapsed ? miniWidth : drawerWidth,
              boxSizing: "border-box",
              overflowX: "hidden",
              transition: (theme) =>
                theme.transitions.create("width", {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              // icon-only look when collapsed
              "& .MuiListItemButton-root": {
                justifyContent: collapsed ? "center" : "flex-start",
                px: collapsed ? 1.25 : 2,
              },
              "& .MuiListItemIcon-root": {
                minWidth: collapsed ? 0 : 40,
                mr: collapsed ? 0 : 1.5,
                justifyContent: "center",
              },
              "& .MuiListItemButton-root .MuiTypography-root": {
                display: collapsed ? "none" : "block",
              },
            },
          }}
          open
        >
          {role && drawerContent(role)}
        </Drawer>
      </Box>
    </Box>
  );

  // ===== Drawer Content =====
  function drawerContent(role: string) {
    const activeClass = (path: string) =>
      `bg-[#1d5769] text-white rounded-lg group ${
        highlightedItem === path ? "bg-gray-600 dark:hover:bg-gray-700" : ""
      }`;

    return (
      <div>
        {/* Header / Brand row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            px: collapsed ? 1.5 : 2,
            py: 2,
            gap: 1,
          }}
        >
          {/* Logo + Brand text (hide when collapsed) */}
          {!collapsed ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <HomeWorkIcon sx={{ color: "white" }} fontSize="small" />
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>
                Nursery
              </Typography>
            </Box>
          ) : (
            // เมื่อหุบ ให้ใช้ไอคอนแทนโลโก้
            <HomeWorkIcon sx={{ color: "white" }} />
          )}

          {/* Toggle button on the same row, right-aligned */}
          <IconButton
            onClick={toggleCollapsed}
            sx={{
              backgroundColor: "rgba(255,255,255,0.18)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.28)" },
              color: "white",
              width: 36,
              height: 36,
            }}
          >
            {collapsed ? <KeyboardDoubleArrowRightIcon /> : <KeyboardDoubleArrowLeftIcon />}
          </IconButton>
        </Box>

        <Divider className="bg-white/30" />

        {/* Home */}
        <Link to={"/dashboard"}>
          <ListItem disablePadding className={`text-white rounded-lg mt-2 mb-2 pl-2 group ${highlightedItem === "/dashboard" ? "bg-gray-600 dark:hover:bg-gray-700" : ""}`}>
            <ListItemButton>
              <ListItemIcon>
                <DashboardIcon className="text-white" fontSize="small" />
              </ListItemIcon>
              <Typography component="div" className="text-white pl-1 py-2 " sx={{ fontSize: "14px" }}>
                {t("sidebar.home")}
              </Typography>
            </ListItemButton>
          </ListItem>
        </Link>

        {/* ===== ADMIN ===== */}
        {role === "admin" && (
          <>
            {/* Teacher */}
            <ListItem
              disablePadding
              onClick={() => setOpenTeach((v) => !v)}
              className="pl-2 text-white rounded-lg mt-2 mb-2 group "
            >
              <ListItemButton>
                <ListItemIcon>
                  <EscalatorWarningOutlinedIcon className="text-white" fontSize="small" />
                </ListItemIcon>
                <Typography className="text-white pl-1 py-2 " sx={{ fontSize: "14px" }}>
                  {t("sidebar.group_teacher")}
                </Typography>
                {!collapsed && (
                  <div style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
                    {openTeach ? <ExpandLess /> : <ExpandMore />}
                  </div>
                )}
              </ListItemButton>
            </ListItem>
            <Collapse in={!collapsed && openTeach} unmountOnExit>
              <Link to={"/teacher/todolist"}>
                <ListItem disablePadding className={activeClass("/teacher/todolist")}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <BusinessCenterIcon className="ml-5 text-white" fontSize="small" />
                    </ListItemIcon>
                    <Typography className="text-white pl-1 pt-1" sx={{ fontSize: "14px" }}>
                      {t("sidebar.teacher_tasks")}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              </Link>

              <Link to={"/teacher/listleave"}>
                <ListItem disablePadding className={activeClass("/teacher/listleave")}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <InsertInvitationOutlinedIcon className="ml-5 text-white" fontSize="small" />
                    </ListItemIcon>
                    <Typography className="text-white pl-1 pt-1" sx={{ fontSize: "14px" }}>
                      {t("sidebar.teacher_leave")}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              </Link>

              <Link to={"/teacher/shift"}>
                <ListItem disablePadding className={activeClass("/teacher/shift")}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <QueryBuilderIcon className="ml-5 text-white" fontSize="small" />
                    </ListItemIcon>
                    <Typography className="text-white pl-1 pt-1" sx={{ fontSize: "14px" }}>
                      {t("sidebar.teacher_shift")}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              </Link>
            </Collapse>

            {/* Students */}
            <ListItem
              disablePadding
              onClick={() => setOpenStudents((v) => !v)}
              className="pl-2 text-white rounded-lg mt-2 mb-2 group "
            >
              <ListItemButton>
                <ListItemIcon>
                  <BadgeOutlinedIcon className="text-white" fontSize="small" />
                </ListItemIcon>
                <Typography className="text-white pl-1 py-2 " sx={{ fontSize: "14px" }}>
                  {t("sidebar.group_students")}
                </Typography>
                {!collapsed && (
                  <div style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
                    {openStudents ? <ExpandLess /> : <ExpandMore />}
                  </div>
                )}
              </ListItemButton>
            </ListItem>
            <Collapse in={!collapsed && openStudents} unmountOnExit>
              <Link to={"/student"}>
                <ListItem disablePadding className={activeClass("/student")}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <SupervisorAccountOutlinedIcon className="ml-5 text-white" fontSize="small" />
                    </ListItemIcon>
                    <Typography className="text-white pl-1 pt-1" sx={{ fontSize: "14px" }}>
                      {t("sidebar.students_children")}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              </Link>

              <Link to={"/class"}>
                <ListItem disablePadding className={activeClass("/class")}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <ClassOutlinedIcon className="ml-5 text-white" fontSize="small" />
                    </ListItemIcon>
                    <Typography className="text-white pl-1 pt-1" sx={{ fontSize: "14px" }}>
                      {t("sidebar.students_class")}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              </Link>
            </Collapse>

            {/* Accounting */}
            <ListItem
              disablePadding
              onClick={() => setOpenAcc((v) => !v)}
              className="pl-2 text-white rounded-lg mt-2 mb-2 group "
            >
              <ListItemButton>
                <ListItemIcon>
                  <AccountBalanceWalletOutlinedIcon className="text-white" fontSize="small" />
                </ListItemIcon>
                <Typography className="text-white pl-1 py-2 " sx={{ fontSize: "14px" }}>
                  {t("sidebar.group_accounting")}
                </Typography>
                {!collapsed && (
                  <div style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
                    {openAcc ? <ExpandLess /> : <ExpandMore />}
                  </div>
                )}
              </ListItemButton>
            </ListItem>
            <Collapse in={!collapsed && openAcc} unmountOnExit>
              <Link to={"/accounting"}>
                <ListItem disablePadding className={activeClass("/accounting")}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <AccountBalanceWalletOutlinedIcon className="ml-5 text-white" fontSize="small" />
                    </ListItemIcon>
                    <Typography className="text-white pl-1 pt-1" sx={{ fontSize: "14px" }}>
                      {t("sidebar.accounting_main")}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              </Link>

              <Link to={"/infoteach"}>
                <ListItem disablePadding className={activeClass("/infoteach")}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <ClassOutlinedIcon className="ml-5 text-white" fontSize="small" />
                    </ListItemIcon>
                    <Typography className="text-white pl-1 pt-1" sx={{ fontSize: "14px" }}>
                      {t("sidebar.accounting_staff_list")}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              </Link>
            </Collapse>

            {/* Report */}
            <Link to={"/report"}>
              <ListItem
                disablePadding
                className={`text-white rounded-lg mt-2 mb-2 pl-2 group ${
                  highlightedItem === "/report" ? "bg-gray-600 dark:hover:bg-gray-700" : ""
                }`}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <ListAltOutlinedIcon className="text-white" fontSize="small" />
                  </ListItemIcon>
                  <Typography className="text-white pl-1 py-2 " sx={{ fontSize: "14px" }}>
                    {t("sidebar.report")}
                  </Typography>
                </ListItemButton>
              </ListItem>
            </Link>

            {/* Master */}
            <ListItem
              disablePadding
              onClick={() => setOpenMaster((v) => !v)}
              className="pl-2 text-white rounded-lg mt-2 mb-2 group"
            >
              <ListItemButton>
                <ListItemIcon>
                  <MenuBookIcon className="text-white" fontSize="small" />
                </ListItemIcon>
                <Typography className="text-white pl-1 py-2 " sx={{ fontSize: "14px" }}>
                  {t("sidebar.group_master")}
                </Typography>
                {!collapsed && (
                  <div style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
                    {openMaster ? <ExpandLess /> : <ExpandMore />}
                  </div>
                )}
              </ListItemButton>
            </ListItem>

            <Collapse in={!collapsed && openMaster} unmountOnExit>
              <Link to={"/master/aboutsupdesk"}>
                <ListItem disablePadding className={activeClass("/master/aboutsupdesk")}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <ListAltIcon2 className="ml-5 text-white" fontSize="small" />
                    </ListItemIcon>
                    <Typography sx={{ fontSize: "14px" }}>{t("sidebar.master_domain_guide")}</Typography>
                  </ListItemButton>
                </ListItem>
              </Link>

              <Link to={"/master/childcarepolicy"}>
                <ListItem disablePadding className={activeClass("/master/childcarepolicy")}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <GavelIcon className="ml-5 text-white" fontSize="small" />
                    </ListItemIcon>
                    <Typography sx={{ fontSize: "14px" }}>{t("sidebar.master_policy")}</Typography>
                  </ListItemButton>
                </ListItem>
              </Link>
{/* 
              <Link to={"/master/agegroups"}>
                <ListItem disablePadding className={activeClass("/master/agegroups")}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <ChildCareIcon className="ml-5 text-white" fontSize="small" />
                    </ListItemIcon>
                    <Typography sx={{ fontSize: "14px" }}>{t("sidebar.master_age_groups")}</Typography>
                  </ListItemButton>
                </ListItem>
              </Link> */}

              <Link to={"/master/developmentarea"}>
                <ListItem disablePadding className={activeClass("/master/developmentarea")}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <PsychologyIcon className="ml-5 text-white" fontSize="small" />
                    </ListItemIcon>
                    <Typography sx={{ fontSize: "14px" }}>{t("sidebar.master_domains")}</Typography>
                  </ListItemButton>
                </ListItem>
              </Link>


              <Link to={"/master/subarea"}>
                <ListItem disablePadding className={activeClass("/master/subarea")}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <CategoryIcon className="ml-5 text-white" fontSize="small" />
                    </ListItemIcon>
                    <Typography sx={{ fontSize: "14px" }}>{t("sidebar.master_domain_targets")}</Typography>
                  </ListItemButton>
                </ListItem>
              </Link>

              <Link to={"/master/infoarea"}>
                <ListItem disablePadding className={activeClass("/master/infoarea")}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <InfoIcon className="ml-5 text-white" fontSize="small" />
                    </ListItemIcon>
                    <Typography sx={{ fontSize: "14px" }}>{t("sidebar.master_domain_extra")}</Typography>
                  </ListItemButton>
                </ListItem>
              </Link>

              <Link to={"/master/carecontent"}>
                <ListItem disablePadding className={activeClass("/master/carecontent")}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <FavoriteIcon className="ml-5 text-white" fontSize="small" />
                    </ListItemIcon>
                    <Typography sx={{ fontSize: "14px" }}>{t("sidebar.master_care_goals")}</Typography>
                  </ListItemButton>
                </ListItem>
              </Link>

              <Divider className="bg-white/30 my-2" />

              <Link to={"/setting/info"}>
                <ListItem disablePadding className={activeClass("/setting/info")}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <AccountCircleOutlinedIcon className="ml-5 text-white" fontSize="small" />
                    </ListItemIcon>
                    <Typography className="text-white pl-1 pt-1" sx={{ fontSize: "14px" }}>
                      {t("sidebar.settings_basic_info")}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              </Link>

              <Link to={"/infostaff"}>
                <ListItem disablePadding className={activeClass("/infostaff")}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <AccountBoxOutlinedIcon className="ml-5 text-white" fontSize="small" />
                    </ListItemIcon>
                    <Typography className="text-white pl-1 pt-1" sx={{ fontSize: "14px" }}>
                      {t("sidebar.settings_executives")}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              </Link>

              <Link to={"/setting/basicdevplan"}>
                <ListItem disablePadding className={activeClass("/setting/basicdevplan")}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <AccountBoxOutlinedIcon className="ml-5 text-white" fontSize="small" />
                    </ListItemIcon>
                    <Typography className="text-white pl-1 pt-1" sx={{ fontSize: "14px" }}>
                      {t("sidebar.settings_basicdevplan")}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              </Link>
            </Collapse>
          </>
        )}

        {/* ===== TEACHER ===== */}
        {role === "teacher" && (
          <>
            <ListItem
              disablePadding
              onClick={() => setOpenTeach((v) => !v)}
              className="pl-2 text-white rounded-lg mt-2 mb-2 group "
            >
              <ListItemButton>
                <ListItemIcon>
                  <EscalatorWarningOutlinedIcon className="text-white" fontSize="small" />
                </ListItemIcon>
                <Typography className="text-white pl-1 py-2 " sx={{ fontSize: "14px" }}>
                  {t("sidebar.group_teacher")}
                </Typography>
                {!collapsed && (
                  <div style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
                    {openTeach ? <ExpandLess /> : <ExpandMore />}
                  </div>
                )}
              </ListItemButton>
            </ListItem>
            <Collapse in={!collapsed && openTeach} unmountOnExit>
              <Link to={"/teacher/todolist"}>
                <ListItem disablePadding className={activeClass("/teacher/todolist")}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <BusinessCenterIcon className="ml-5 text-white" fontSize="small" />
                    </ListItemIcon>
                    <Typography className="text-white pl-1 pt-1" sx={{ fontSize: "14px" }}>
                      {t("sidebar.teacher_tasks")}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              </Link>

              <Link to={"/teacher/listleave"}>
                <ListItem disablePadding className={activeClass("/teacher/listleave")}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <InsertInvitationOutlinedIcon className="ml-5 text-white" fontSize="small" />
                    </ListItemIcon>
                    <Typography className="text-white pl-1 pt-1" sx={{ fontSize: "14px" }}>
                      {t("sidebar.teacher_leave")}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              </Link>
            </Collapse>

            <ListItem
              disablePadding
              onClick={() => setOpenStudents((v) => !v)}
              className="pl-2 text-white rounded-lg mt-2 mb-2 group "
            >
              <ListItemButton>
                <ListItemIcon>
                  <BadgeOutlinedIcon className="text-white" fontSize="small" />
                </ListItemIcon>
                <Typography className="text-white pl-1 py-2 " sx={{ fontSize: "14px" }}>
                  {t("sidebar.group_students")}
                </Typography>
                {!collapsed && (
                  <div style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
                    {openStudents ? <ExpandLess /> : <ExpandMore />}
                  </div>
                )}
              </ListItemButton>
            </ListItem>
            <Collapse in={!collapsed && openStudents} unmountOnExit>
              <Link to={"/student"}>
                <ListItem disablePadding className={activeClass("/student")}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <SupervisorAccountOutlinedIcon className="ml-5 text-white" fontSize="small" />
                    </ListItemIcon>
                    <Typography className="text-white pl-1 pt-1" sx={{ fontSize: "14px" }}>
                      {t("sidebar.students_children")}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              </Link>

              <Link to={"/class"}>
                <ListItem disablePadding className={activeClass("/class")}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <ClassOutlinedIcon className="ml-5 text-white" fontSize="small" />
                    </ListItemIcon>
                    <Typography className="text-white pl-1 pt-1" sx={{ fontSize: "14px" }}>
                      {t("sidebar.students_class")}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              </Link>
            </Collapse>
          </>
        )}

        {/* ===== ACC ===== */}
        {role === "acc" && (
          <>
            <ListItem
              disablePadding
              onClick={() => setOpenAcc((v) => !v)}
              className="pl-2 text-white rounded-lg mt-2 mb-2 group "
            >
              <ListItemButton>
                <ListItemIcon>
                  <AccountBalanceWalletOutlinedIcon className="text-white" fontSize="small" />
                </ListItemIcon>
                <Typography className="text-white pl-1 py-2 " sx={{ fontSize: "14px" }}>
                  {t("sidebar.group_accounting")}
                </Typography>
                {!collapsed && (
                  <div style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
                    {openAcc ? <ExpandLess /> : <ExpandMore />}
                  </div>
                )}
              </ListItemButton>
            </ListItem>
            <Collapse in={!collapsed && openAcc} unmountOnExit>
              <Link to={"/accounting"}>
                <ListItem disablePadding className={activeClass("/accounting")}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <AccountBalanceWalletOutlinedIcon className="ml-5 text-white" fontSize="small" />
                    </ListItemIcon>
                    <Typography className="text-white pl-1 pt-1" sx={{ fontSize: "14px" }}>
                      {t("sidebar.accounting_main")}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              </Link>

              <Link to={"/infoteach"}>
                <ListItem disablePadding className={activeClass("/infoteach")}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <ClassOutlinedIcon className="ml-5 text-white" fontSize="small" />
                    </ListItemIcon>
                    <Typography className="text-white pl-1 pt-1" sx={{ fontSize: "14px" }}>
                      {t("sidebar.accounting_staff_list")}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              </Link>
            </Collapse>
          </>
        )}
      </div>
    );
  }
}
