import "./list.css"
import AdminInfo from "./AdminInfo/AdminInfo"
import ChatList from "./ChatList/ChatList"

const List = () => {
    return (
        <div className='list'>
            <AdminInfo/>
            <ChatList/>
        </div>
    )
}

export default List