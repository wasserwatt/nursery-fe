import { createBrowserRouter, Navigate } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import WelcomePage from "../pages/WelcomePages";
import Login from "../pages/Login";
import Register from "../pages/Register";
import DashboardAdminPages from "../pages/DashboardAdminPages";
import DashboardTeacherPage from "../pages/teacher/DashboardTeacherPages"
import LayoutPage from "../layout/LayoutPage";
import ListLeavePages from "../pages/teacher/ListLeavePages";
import ListMenuAccPages from "../pages/accounting/ListMenuAccPages";
import ListMenuReportPages from "../pages/report/ListMenuReportPages";
import InfoFormPages from "../pages/setting/InfoFormPages";
import StudentPages from "../pages/student/StudentPages";
import ClassRoomPages from "../pages/class/ClassRoomPages";
import LeaveAddPages from "../pages/teacher/LeaveAddPages";
import AttendanceReportPages from "../pages/report/AttendanceReportPages";
import AttendanceMonthPages from "../pages/report/AttendanceMonthPages";
import OverallPlanPages from "../pages/report/OverallPlanPages";
import StudentHistoryPages from "../pages/student/studenthistory/StudentHistoryPages";
import HealthCheckFormPages from "../pages/student/studenthistory/HealthCheckPages";
import InfoStaffListPages from "../pages/setting/InfoStaffListPages";
import InfoTeachListPages from "../pages/teacher/infoteach/InfoTeachListPages";
import InfoStaffFormPages from "../pages/setting/InfoStaffFormPages";
import ProgressdFourPages from "../pages/student/studentprogressd/ProgressdFourPages";
import ProgressdFivePages from "../pages/student/studentprogressd/ProgressdFivePages";
import ProgressdThreePages from "../pages/student/studentprogressd/ProgressdThreePages";
import ProgressdTwoPages from "../pages/student/studentprogressd/ProgressdrTwoPages";
import ProgressdZeroPages from "../pages/student/studentprogressd/ProgressdZeroPages";
import ProgressdOnePages from "../pages/student/studentprogressd/ProgressdOnePages";
import InformationPages from "../pages/setting/informationPages";
import AnnualplanPages from "../pages/report/AnnualplanPages";
import MonthlyplanPages from "../pages/report/monthlyplan/MonthlyplanPages";
import WeeklyplanPages from "../pages/report/weeklyplan/WeeklyplanPages";
import CareDiaryPages from "../pages/report/CareDiaryPages";
import DaycareRecordPages from "../pages/student/studentdaycarerecord/DaycareRecordPages";
import OverallPlanAddPages from "../pages/report/OverallPlanAddPages";
import AnnualplanAddPages from "../pages/report/AnnualplanAddPages";
import CareDiaryAddPages from "../pages/report/CareDiaryAddPages";
import AddPerfPages from "../pages/accounting/addperf/AddPerfPages";
import MonthlyplanAddPages from "../pages/report/monthlyplan/MonthlyplanAddPages";
import InfoTeachAddPages from "../pages/teacher/infoteach/InfoTeachddPages";
import WeeklyplanAddPages from "../pages/report/weeklyplan/WeeklyplanAddPages";
import ActivityListPages from "../pages/accounting/activity/ActivityListPages";
import ActivityAddPage from "../pages/accounting/activity/ActivityAddPage";
// import SupportFundAddPages from "../pages/accounting/supportfund/SupportFundAddPages";
import ChargePages from "../pages/accounting/charge/ChargePages";
import SupportFundListPages from "../pages/accounting/supportfund/SupportFundListPages";
import EnhancementPages from "../pages/accounting/enhancement/EnhancementPages";
import EnhancementAddPages from "../pages/accounting/enhancement/EnhancementAddPages";
import LunchSubsidyGrantPages from "../pages/accounting/lunch/LunchSubsidyGrantPages";
import LunchAddPages from "../pages/accounting/lunch/LunchAddPages";
import AppropriationPages from "../pages/accounting/appropriation/AppropriationPages";
import AdditionalPages from "../pages/accounting/appropriation/AdditionalPages";
import AdditionalAddPages from "../pages/accounting/appropriation/AdditionalAddPages";
import ProvisionalAddPages from "../pages/accounting/appropriation/ProvisionalAddPages";
import ProvisionalPages from "../pages/accounting/appropriation/ProvisionalPages";
import TreatmentPages from "../pages/accounting/treatment/TreatmentPages";
import CareerTrainingPages from "../pages/accounting/treatment/CareerTrainingPages";
import TreatmentPlanPages from "../pages/accounting/treatment/TreatmentPlanPage";
import RateApplicationPages from "../pages/accounting/treatment/RateApplicationPage";
import RequestBenefitsPages from "../pages/accounting/treatment/RequestBenefitsPages";
import EligiblePersonsPages from "../pages/accounting/treatment/EligiblePersonsPages";
import CareerTrainingAddPages from "../pages/accounting/treatment/CareerTrainingAddPages";
import TreatmentPlanAddPages from "../pages/accounting/treatment/TreatmentPlanAddPages";
import RateApplicationAddPages from "../pages/accounting/treatment/RateApplicationAddPages";
import RequestBenefitsAddPages from "../pages/accounting/treatment/RequestBenefitsAddPages";
import EligiblePersonsAddPages from "../pages/accounting/treatment/EligiblePersonsAddPases";
import SupportFundTabPages from "../pages/accounting/supportfund/SupportFundTabPages";
import EditInfoform from "../components/setting/EditInfoform";
import ViewInfoform from "../components/setting/ViewInfoform";
import EditInfoStaffForm from "../components/setting/EditInfoStaffForm";
import ViewInfoStaffForm from "../components/setting/ViewInfoStaffForm";
import EditOverallPlan from "../components/report/EditOverallPlan";
import ViewOverallPlan from "../components/report/ViewOverallPlan";
import EditAnnualplan from "../components/report/EditAnnualplan";
import ViewAnnualplan from "../components/report/ViewAnnualplan";
import EditCareDiary from "../components/report/EditCareDiary";
import ViewCareDiary from "../components/report/ViewCareDiary";
import EditMonthly from "../components/report/monthlyplan/EditMonthly"
import ViewMonthly from "../components/report/monthlyplan/ViewMonthly"
import EditWeekly from "../components/report/weeklyplan/EditWeekly"
import ViewWeekly from "../components/report/weeklyplan/ViewWeekly"

import ViewActivity from "../components/accounting/activity/ViewActivity"
import ShiftFormPages from "../pages/teacher/shiftmanagement/ShiftFormPages";
import BasicDevPlanFormPages from "../pages/setting/BasicDevPlanFormPages";

// master

import OverallplanMainPage from "../pages/master/OverallplanMainPage";
import ChildcarePolicyPage from "../pages/master/ChildcarePolicyPage";
import EducationandChildcarePage from "../pages/master/EducationandChildcarePage";
import SpecificInitiativesPage from "../pages/master/SpecificInitiativesPage";
import AnnualSchedulePage from "../pages/master/AnnualSchedulePage";
import AgeGroupPage from "../pages/master/AgeGroupPage";
import DevelopmentAreaPage from "../pages/master/DevelopmentAreaPage";
import AboutsupDeskPage from "../pages/master/AboutsupDeskPage";
import SubAreaPage from "../pages/master/SubAreaPage";
import InfoAreaPage from "../pages/master/InfoAreaPage";
import CareContentPage from "../pages/master/CareContentPage";

// accident
import IncidentPages from "../pages/accident/IncidentPages";
import IncidentListPages from "../pages/accident/IncidentListPage";
import AccidentReceptionFormPage from "../pages/accident/AccidentReceptionPage";

// import SupportFundTabPages from "../pages/accounting/supportfund/SupportFundTabPages";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/welcome" replace />
  },
  {
    path: "/welcome",
    element: <WelcomePage />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "",
    element: <LayoutPage />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardAdminPages />
      },
      {
        path: "/teacher/todolist",
        element: <DashboardTeacherPage />
      },
      {
        path: "/teacher/listleave",
        element: <ListLeavePages />
      },
      {
        path: "/teacher/shift",
        element: <ShiftFormPages />
      },
      {
        path: "/accounting",
        element: <ListMenuAccPages />
      },
      {
        path: "/accounting/addperf",
        element: <AddPerfPages />
      },
      {
        path: "/accounting/activity",
        element: <ActivityListPages />
      },
      {
        path: "/accounting/activity/add",
        element: <ActivityAddPage />
      },
      {
        path: "/accounting/supportfund",
        element: <SupportFundListPages />
      },
      {
        path: "/accounting/supportfund/add",
        element: <SupportFundTabPages />
      },
      {
        path: "/accounting/charge",
        element: <ChargePages />
      },
      {
        path: "/accounting/enhancement",
        element: <EnhancementPages />
      },
      {
        path: "/accounting/enhancement/add",
        element: <EnhancementAddPages />
      },
      {
        path: "/accounting/treatment",
        element: <TreatmentPages />
      },
      {
        path: "/accounting/careertraining",
        element: <CareerTrainingPages />
      },
      {
        path: "/accounting/careertraining/add",
        element: <CareerTrainingAddPages />
      },
      {
        path: "/accounting/treatmentplan",
        element: <TreatmentPlanPages />
      },
      {
        path: "/accounting/treatmentplan/add",
        element: <TreatmentPlanAddPages />
      },
      {
        path: "/accounting/rateapplication",
        element: <RateApplicationPages />
      },
      {
        path: "/accounting/rateapplication/add",
        element: <RateApplicationAddPages />
      },
      {
        path: "/accounting/requestbenefits",
        element: <RequestBenefitsPages />
      },
      {
        path: "/accounting/requestbenefits/add",
        element: <RequestBenefitsAddPages />
      },
      {
        path: "/accounting/eligiblepersons",
        element: <EligiblePersonsPages />
      },
      {
        path: "/accounting/eligiblepersons/add",
        element: <EligiblePersonsAddPages />
      },
      {
        path: "/accounting/appropriation",
        element: <AppropriationPages />
      },
      {
        path: "/accounting/appropriation/additional",
        element: <AdditionalPages />
      },
      {
        path: "/accounting/appropriation/additional/add",
        element: <AdditionalAddPages />
      },
      {
        path: "/accounting/appropriation/provisional",
        element: <ProvisionalPages />
      },
      {
        path: "/accounting/appropriation/provisional/add",
        element: <ProvisionalAddPages />
      },
      {
        path: "/accounting/lunch",
        element: <LunchSubsidyGrantPages />
      },
      {
        path: "/accounting/lunch/add",
        element: <LunchAddPages />
      },
      {
        path: "/report",
        element: <ListMenuReportPages />
      },
      {
        path: "/report/attendance",
        element: <AttendanceReportPages />
      },
      {
        path: "/report/attendancemonth",
        element: <AttendanceMonthPages />
      },
      {
        path: "/report/overallplan",
        element: <OverallPlanPages />
      },
      {
        path: "/report/overallplan/add",
        element: <OverallPlanAddPages />
      },
      {
        path: "/report/annualplan",
        element: <AnnualplanPages />
      },
      {
        path: "/report/annualplan/add",
        element: <AnnualplanAddPages />
      },
      {
        path: "/report/monthlyplan",
        element: <MonthlyplanPages />
      },
      {
        path: "/report/monthlyplan/add",
        element: <MonthlyplanAddPages />
      },
      {
        path: "/report/weeklyplan",
        element: <WeeklyplanPages />
      },
      {
        path: "/report/weeklyplan/add",
        element: <WeeklyplanAddPages />
      },
      {
        path: "/report/carediary",
        element: <CareDiaryPages />
      },
      {
        path: "/report/carediary/add",
        element: <CareDiaryAddPages />
      },
      {
        path: "/setting/info",
        element: <InformationPages />
      },
      {
        path: "/setting/info/add",
        element: <InfoFormPages />
      },
      {
        path: "/student",
        element: <StudentPages />
      },
      {
        path: "/student/History",
        element: <StudentHistoryPages />
      },
      {
        path: "/student/History/edit/",
        element: <StudentHistoryPages />
      },
      {
        path: "/student/History/view/",
        element: <StudentHistoryPages />
      },
      {
        path: "/student/Health",
        element: <HealthCheckFormPages />
      },
      {
        path: "/student/progressdzero",
        element: <ProgressdZeroPages />
      },
      {
        path: "/student/progressdone",
        element: <ProgressdOnePages />
      },
      {
        path: "/student/progressdtwo",
        element: <ProgressdTwoPages />
      },
      {
        path: "/student/progressdthree",
        element: <ProgressdThreePages />
      },
      {
        path: "/student/progressdfour",
        element: <ProgressdFourPages />
      },
      {
        path: "/student/progressdfive",
        element: <ProgressdFivePages />
      },
      {
        path: "/student/daycare",
        element: <DaycareRecordPages />
      },
      {
        path: "/class",
        element: <ClassRoomPages />
      },
      {
        path: "/teacher/leaveadd",
        element: <LeaveAddPages />
      },
      {
        path: "/infoteach",
        element: <InfoTeachListPages />
      },
      {
        path: "/infoteach/add",
        element: <InfoTeachAddPages />
      },
      {
        path: "/infostaff",
        element: <InfoStaffListPages />
      },
      {
        path: "/infostaff/infostaffadd",
        element: <InfoStaffFormPages />
      },
      {
        path: "/setting/basicdevplan",
        element: <BasicDevPlanFormPages />
      },
      {
        path: "/setting/info/edit/:pid",
        element: <EditInfoform />
      },
      {
        path: "/setting/info/view/:pid",
        element: <ViewInfoform />
      },
      {
        path: "/infostaff/edit/:pid",
        element: <EditInfoStaffForm />
      },
      {
        path: "/infostaff/view/:pid",
        element: <ViewInfoStaffForm />
      },
      {
        path: "/report/overallplan/edit/:id",
        // element: <EditOverallPlan />
         element: <OverallPlanAddPages />
      },
      {
        path: "/report/overallplan/view/:id",
        element: <OverallPlanAddPages />
      },
      {
        path: "/report/annualplan/edit/:pid",
        element: <EditAnnualplan />
      },
      {
        path: "/report/annualplan/view/:pid",
        element: <ViewAnnualplan />
      },
      {
        path: "/report/carediary/edit/:pid",
        element: <EditCareDiary />
      },
      {
        path: "/report/carediary/view/:pid",
        element: <ViewCareDiary />
      },
      {
        path: "/report/monthlyplan/edit/:selectedOption/:pid",
        element: <EditMonthly />
      },
      {
        path: "/report/monthlyplan/view/:selectedOption/:pid",
        element: <ViewMonthly />
      },
      {
        path: "/report/weeklyplan/edit/:selectedOption/:pid",
        element: <EditWeekly />
      },
      {
        path: "/report/weeklyplan/view/:selectedOption/:pid",
        element: <ViewWeekly />
      },

      {
        path: "/accounting/activity/view/:id",
        element: <ViewActivity />
      },
       {
        path: "/master/overallplanmain",
        element: <OverallplanMainPage />
      },

       {
        path: "/master/childcarepolicy",
        element: <ChildcarePolicyPage />
      },

      {
        path: "/master/educationandchildcare",
        element: <EducationandChildcarePage />
      },
       {
        path: "/master/specificinitiatives",
        element: <SpecificInitiativesPage />
      },

       {
        path: "/master/annualschedule",
        element: <AnnualSchedulePage />
      },

        {
        path: "/master/annualschedule",
        element: <AnnualSchedulePage />
      },
       {
        path: "/master/agegroups",
        element: <AgeGroupPage />
      },
       {
        path: "/master/developmentarea",
        element: <DevelopmentAreaPage />
      },
       {
        path: "/master/aboutsupdesk",
        element: <AboutsupDeskPage />
      },

      {
        path: "/master/subarea",
        element: <SubAreaPage />
      },

       {
        path: "/master/infoarea",
        element: <InfoAreaPage />
      },
      {
        path: "/master/carecontent",
        element: <CareContentPage />
      },
      {
        path: "/incident-report",
        element: <IncidentPages />
      },
      {
        path: "/incident-report-list",
        element: <IncidentListPages />
      },
      {
        path: "/accident-reception",
        element: <AccidentReceptionFormPage />
      },



    ]
  },
]);

export default function Route() {
  return <RouterProvider router={Router} />;
}


