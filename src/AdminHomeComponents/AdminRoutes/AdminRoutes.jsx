import { Route, Routes } from "react-router-dom";

import Dashboard from "../../Pages/Dashboard/dashboard";
import Message from "../../Pages/Message/message";
import ViewServiceSeekerList from "../../Pages/UserManagement/ViewServiceSeekerList/serviceSeekerList";
import ViewServiceProviderList from "../../Pages/UserManagement/ViewServiceProviderList/serviceProviderList";
import PerformanceMonitoring from "../../Pages/ServiceProviderPerformance/PerfromanceMonitoring/PerformanceMonitoring";
import RatingsAndReviews from "../../Pages/ContentModeration/RatingsandReviews/ratingsAndReviews";
import NewServiceListings from "../../Pages/ContentModeration/NewServiceListings/newServiceListings";
import ReviewComplaints from "../../Pages/ContentModeration/ReviewComplaints/ReviewComplaints";



function AdminRoutes() {
    return (
        
            <Routes>
                <Route path="/" element={<Dashboard />} ></Route>
                <Route path="/dashboard" element={<Dashboard />} ></Route>
                <Route path='/message' element={<Message />} ></Route>
                {/* <Route path="/message" element={<Message />} ></Route> */}
                <Route path="/viewSeekerList" element={<ViewServiceSeekerList />} ></Route>
                <Route path="/viewProviderList" element={<ViewServiceProviderList />} ></Route>
                <Route path="/performanceMonitoring" element={<PerformanceMonitoring />} ></Route>
                <Route path="/newServiceListing" element={<NewServiceListings />} ></Route>
                <Route path="/ratingsAndReviews" element={<RatingsAndReviews />} ></Route>
                <Route path="/reviewComplaints" element={<ReviewComplaints />} ></Route>
            </Routes>
        
    )
}
export default AdminRoutes;