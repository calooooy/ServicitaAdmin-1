import { Menu } from "antd";
import { useNavigate } from "react-router-dom";

function SideMenu() {

    const navigate = useNavigate()

    return <div className="SideMenu">
        <Menu
            className="SideMenuVertical"
            mode="inline"
            onClick={(item)=>{
                navigate(item.key);
            }}
                items={[
                  { label: "Dashboard", key: "/home/dashboard" },
                  {
                    label: "User Management", key: "/home/userManagement", children: [
                      { label: "View Service Seeker List", key: "/home/viewSeekerList" },
                      { label: "View Service Provider List", key: "/home/viewProviderList" }
                    ]
                  },
                  {
                    label: "Service Provider Performance", key: "/home/serviceProviderPerformance", children: [
                      { label: "Performance Monitoring", key: "/home/performanceMonitoring" },
                      { label: "Review Complaints", key: "/home/reviewComplaints" }
                    ]
                  },
                  {
                    label: "Content Moderation", key: "contentModeration", children: [
                      { label: "New Service Listing", key: "newServiceListing" },
                      { label: "Ratings and Reviews", key: "ratingsAndReviews" }
                    ]
                  }
                ]}></Menu>

    </div>
}
export default SideMenu;