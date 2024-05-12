import React from 'react';
import '../../Admin.css';
import List from './list/List'
import Chat from './chat/Chat'


function Message() {


	return (
		<div style={{ width: '100%' }}>
			<h1 className='DashboardHeader'>Message</h1>
			<hr className='Divider' style={{ width: '100%' }} />

            <div className='message-container'>
                <List/>
                <Chat/>
            </div>
		</div>
	);
}



export default Message;

