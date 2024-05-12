import "./chatList.css"

const ChatList = () => {
    return (
        <div className='chatList'>
            <div className='search'>
                <div className="searchBar">
                    <img src="../message_assets/search.png" alt="" />
                    <input type="text" placeholder="Search..." />
                </div>
                {/* <img src="../message_assets/plus.png" alt="" className="add"/> */}
            </div>
            <div className="item">
                <img src="../message_assets/avatar.png" alt="" />
                <div className="texts">
                    <span>my champ</span>
                    <p>good morning b hehehe</p>
                </div>
            </div>
            <div className="item">
                <img src="../message_assets/avatar.png" alt="" />
                <div className="texts">
                    <span>Leah Tenebroso</span>
                    <p>Personality: Black Cat</p>
                </div>
            </div>
            <div className="item">
                <img src="../message_assets/avatar.png" alt="" />
                <div className="texts">
                    <span>Kent John Dico</span>
                    <p>Research Topic: Attendance using IP</p>
                </div>
            </div>
            <div className="item">
                <img src="../message_assets/avatar.png" alt="" />
                <div className="texts">
                    <span>Mga Manifesters</span>
                    <p>Looorrrd tabaaaanng</p>
                </div>
            </div>
            <div className="item">
                <img src="../message_assets/avatar.png" alt="" />
                <div className="texts">
                    <span>Nel Obrero</span>
                    <p>umaalog alog</p>
                </div>
            </div>
            <div className="item">
                <img src="../message_assets/avatar.png" alt="" />
                <div className="texts">
                    <span>ANTI-DEL TECH</span>
                    <p>Daniel: paabli ko pultahan bai</p>
                </div>
            </div>
            <div className="item">
                <img src="../message_assets/avatar.png" alt="" />
                <div className="texts">
                    <span>Daniel ALexis Cruz</span>
                    <p>send card number nimo bai</p>
                </div>
            </div>
            <div className="item">
                <img src="../message_assets/avatar.png" alt="" />
                <div className="texts">
                    <span>User name</span>
                    <p>this is message</p>
                </div>
            </div>
        </div>
    )
}

export default ChatList