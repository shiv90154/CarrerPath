import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import VideoCoursesPage from './pages/VideoCoursesPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import SingleCoursePage from './pages/SingleCoursePage';
import TestSeriesPage from './pages/TestSeriesPage';
import TestSeriesDetailPage from './pages/TestSeriesDetailPage';
import SingleTestSeriesPage from './pages/SingleTestSeriesPage';
import EbooksPage from './pages/EbooksPage';
import EbookDetailPage from './pages/EbookDetailPage';
import SingleEbookPage from './pages/SingleEbookPage';
import Login from './components/Login';
import RegisterPage from './pages/RegisterPage';
import ProfileEditPage from './pages/ProfileEditPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ProfilePage from './pages/ProfilePage';
import ContactPage from './pages/ContactPage';
import PaymentTest from './components/PaymentTest';
import EbookDebug from './components/EbookDebug';
import TestSeriesDebug from './components/TestSeriesDebug';
import CurrentAffairsDebug from './components/CurrentAffairsDebug';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import CurrentAffairsPage from './components/CurrentAffairs';
import AdminUserListPage from './pages/AdminUserListPage';
import AdminCourseListPage from './pages/AdminCourseListPage';
import AdminCourseEditPage from './pages/AdminCourseEditPage';
import AdminTestSeriesListPage from './pages/AdminTestSeriesListPage';
import AdminTestSeriesEditPage from './pages/AdminTestSeriesEditPage';
import AdminEbookListPage from './pages/AdminEbookListPage';
import AdminEbookEditPage from './pages/AdminEbookEditPage';
import AdminLiveTestListPage from './pages/AdminLiveTestListPage';
import AdminLiveTestEditPage from './pages/AdminLiveTestEditPage';
import AdminPaymentListPage from './pages/AdminPaymentListPage';
import StudyMaterialPage from './pages/StudyMaterialPage';
import AdminStudyMaterialListPage from './pages/AdminStudyMaterialListPage';
import AdminStudyMaterialEditPage from './pages/AdminStudyMaterialEditPage';
import StudyMaterialDetailPage from './pages/StudyMaterialDetailPage';
import AdminNoticeListPage from './pages/AdminNoticeListPage';
import AdminNoticeCreatePage from './pages/AdminNoticeCreatePage';
// Course Landing Pages
import {
  IASCoursePage,
  HASHPASCoursePage,
  AlliedServicesCoursePage,
  NaibTehsildarCoursePage,
  SSCCoursePage,
  BankingCoursePage,
  CDSCoursePage,
  UGCNETSETCoursePage,
  TETCTETCoursePage,
  TGTPGTJBTCoursePage,
  PatwariPoliceCoursePage,
  JOAITStateCoursePage
} from './pages/landingcoursespages';
import ScrollToTop from "./components/ScrollToTop";
import AutoCallPopup from './components/AutoCallPopup';
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsAndConditions from "./components/TermsAndConditions";
import RefundPolicy from "./components/RefundPolicy";
// Add this import
import NotFoundPage from './components/NotFoundPage';
import ManageCurrentAffairs from './pages/ManageCurrentAffairs';
import EnvDebug from './components/EnvDebug';
function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <AutoCallPopup />
      <EnvDebug />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsAndConditions />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/video-courses" element={<VideoCoursesPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/current-affairs" element={<CurrentAffairsPage />} />
        <Route path="/video-courses/:id" element={<SingleCoursePage />} />
        <Route path="/test-series" element={<TestSeriesPage />} />
        <Route path="/test-series/:id" element={<TestSeriesDetailPage />} />
        <Route path="/test-series/:id/old" element={<SingleTestSeriesPage />} />
        <Route path="/e-books" element={<EbooksPage />} />
        <Route path="/e-books/:id" element={<EbookDetailPage />} />
        <Route path="/e-books/:id/old" element={<SingleEbookPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<ProfileEditPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/payment-test" element={<PaymentTest />} />
        <Route path="/ebook-debug" element={<EbookDebug />} />
        <Route path="/testseries-debug" element={<TestSeriesDebug />} />
        <Route path="/currentaffairs-debug" element={<CurrentAffairsDebug />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUserListPage />} />
        <Route path="/admin/courses" element={<AdminCourseListPage />} />
        <Route path="/admin/courses/new" element={<AdminCourseEditPage />} />
        <Route path="/admin/courses/:id/edit" element={<AdminCourseEditPage />} />
        <Route path="/admin/testseries" element={<AdminTestSeriesListPage />} />
        <Route path="/admin/testseries/new" element={<AdminTestSeriesEditPage />} />
        <Route path="/admin/testseries/:id/edit" element={<AdminTestSeriesEditPage />} />
        <Route path="/admin/ebooks" element={<AdminEbookListPage />} />
        <Route path="/admin/ebooks/new" element={<AdminEbookEditPage />} />
        <Route path="/admin/ebooks/:id/edit" element={<AdminEbookEditPage />} />
        <Route path="/admin/livetests" element={<AdminLiveTestListPage />} />
        <Route path="/admin/livetests/new" element={<AdminLiveTestEditPage />} />
        <Route path="/admin/livetests/:id/edit" element={<AdminLiveTestEditPage />} />
        <Route path="/admin/payments" element={<AdminPaymentListPage />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/study-materials" element={<StudyMaterialPage />} />
        <Route path="/admin/studymaterial" element={<AdminStudyMaterialListPage />} />
        <Route path="/admin/studymaterial/new" element={<AdminStudyMaterialEditPage />} />
        <Route path="/admin/studymaterial/:id/edit" element={<AdminStudyMaterialEditPage />} />
        <Route path="/admin/current-affairs" element={<ManageCurrentAffairs />} />
        <Route path="/admin/notices" element={<AdminNoticeListPage />} />
        <Route path="/admin/notices/new" element={<AdminNoticeCreatePage />} />
        <Route path="/study-materials/:id" element={<StudyMaterialDetailPage />} />

        {/* Course Landing Pages */}
        <Route path="/courses/ias" element={<IASCoursePage />} />
        <Route path="/courses/has-hpas" element={<HASHPASCoursePage />} />
        <Route path="/courses/allied-services" element={<AlliedServicesCoursePage />} />
        <Route path="/courses/naib-tehsildar" element={<NaibTehsildarCoursePage />} />
        <Route path="/courses/ssc" element={<SSCCoursePage />} />
        <Route path="/courses/banking" element={<BankingCoursePage />} />
        <Route path="/courses/cds" element={<CDSCoursePage />} />
        <Route path="/courses/ugc-net-set" element={<UGCNETSETCoursePage />} />
        <Route path="/courses/tet-ctet" element={<TETCTETCoursePage />} />
        <Route path="/courses/tgt-pgt-jbt" element={<TGTPGTJBTCoursePage />} />
        <Route path="/courses/patwari-police" element={<PatwariPoliceCoursePage />} />
        <Route path="/courses/joa-it-state" element={<JOAITStateCoursePage />} />

        {/* Add this 404 route at the END of all routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;