import { Badge, Space } from "antd";
import { useLocation } from "react-router-dom";
import { useState } from "react";


function AdminHeader() {

    const [username, setUsername] = useState(localStorage.getItem('adminName'));
    const location = useLocation();

    const getImagePath = (imageName) => {
        return '/' + imageName;
    };

    return (
        <div className="AdminHeader">
            <img src={getImagePath("side-logo.png")} alt="Logo" />
            Servicita
            <div className="icons-container">
            <div className="userNameDisplay">
            Hello, {username}!
            </div>
                <Space>
                    <Badge count={10} dot>
                        <img src={getImagePath("notif.png")} alt="Notification" style={{ width: '100%', height: '100%' }} />
                    </Badge>
                    <Badge count={10} dot>
                        <img src={getImagePath("msg.png")} alt="Message" style={{ width: '100%', height: '100%' }} />
                    </Badge>
                    <Badge>
                        <img src={getImagePath("profile.png")} alt="Profile" style={{ width: '55px', marginLeft: '5px', marginRight: '30px' }} />
                    </Badge>
                </Space>
                
            </div>
           
        </div>
    );
}

export default AdminHeader;
