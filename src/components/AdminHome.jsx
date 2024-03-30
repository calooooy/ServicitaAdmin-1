import './../Admin.css';
import PageContent from '../AdminHomeComponents/PageContent/PageContent';
import AdminHeader from '../AdminHomeComponents/AdminHeader/AdminHeader';
import SideMenu from '../AdminHomeComponents/SideMenu/SideMenu';


function AdminHome() {
    return <div className="AdminHome">
       <AdminHeader/>
       <div className='SideMenuAndPageContent'>
        <SideMenu></SideMenu>
        <PageContent></PageContent>
       </div>
    </div>
}

export default AdminHome;