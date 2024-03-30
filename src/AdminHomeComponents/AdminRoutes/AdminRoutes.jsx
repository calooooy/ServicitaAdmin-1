import { Route, Routes } from "react-router-dom";

import Dashboard from "../../Pages/Dashboard/dashboard";
import ViewServiceSeekerList from "../../Pages/UserManagement/ViewServiceSeekerList/serviceSeekerList";
import ViewServiceProviderList from "../../Pages/UserManagement/ViewServiceProviderList/serviceProviderList";
import PerformanceMonitoring from "../../Pages/ServiceProviderPerformance/PerfromanceMonitoring/PerformanceMonitoring";
import ReviewComplaints from "../../Pages/ServiceProviderPerformance/ReviewComplaints/ReviewComplaints";
import RatingsAndReviews from "../../Pages/ContentModeration/RatingsandReviews/ratingsAndReviews";
import NewServiceListings from "../../Pages/ContentModeration/NewServiceListings/newServiceListings";



function AdminRoutes() {
    return (
        
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} ></Route>
                <Route path="/viewSeekerList" element={<ViewServiceSeekerList />} ></Route>
                <Route path="/viewProviderList" element={<ViewServiceProviderList />} ></Route>
                <Route path="/performanceMonitoring" element={<PerformanceMonitoring />} ></Route>
                <Route path="/reviewComplaints" element={<ReviewComplaints />} ></Route>
                <Route path="/newServiceListing" element={<NewServiceListings />} ></Route>
                <Route path="/ratingsAndReviews" element={<RatingsAndReviews />} ></Route>
            </Routes>
        
    )
}
export default AdminRoutes;