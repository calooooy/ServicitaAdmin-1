import React, { useState, useEffect } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { Table, Dropdown, Menu, Space, Card, Spin } from 'antd';
import { getFirestore, collection, getDocs, onSnapshot, doc, deleteDoc, getDoc, setDoc, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import Axios from 'axios';

function InProgressComplaints() {
	const [loading, setLoading] = useState(false);
	const [dataSource, setDataSource] = useState([]);
	const [changes, setChanges] = useState(false);
	const [showSpinner, setShowSpinner] = useState(true);
	const [updating, setUpdating] = useState(false);

	useEffect(() => {
		setLoading(true);

		const fetchReports = async () => {
			try {

				const response = await Axios.get('http://172.16.4.26:5000/report/getReports');
				const reportsData = response.data;

				// Initialize array to store report info
				const reportInfoData = [];

				// Fetch additional data from Firebase for each report
				for (const report of reportsData) {
					var reporterDoc, reportedDoc

					const reporterResponse = await Axios.get(`http://172.16.4.26:5000/admin/getUser/${report.reporterId}`); //for reporter profileImage
					const reportedResponse = await Axios.get(`http://172.16.4.26:5000/admin/getUser/${report.reportedId}`); //for reported role



					const db = getFirestore();

					const reporterProfileImage = reporterResponse.data.data.profileImage
					const reportedProfileImage = reportedResponse.data.data.profileImage
					const reportedRole = reportedResponse.data.data.role
					const reporterRole = reporterResponse.data.data.role

					if (reportedRole == 'Provider') {
						reporterDoc = await getDoc(doc(db, 'seekers', report.reporterId));
						reportedDoc = await getDoc(doc(db, 'providers', report.reportedId));
					}
					else {
						reporterDoc = await getDoc(doc(db, 'providers', report.reporterId));
						reportedDoc = await getDoc(doc(db, 'seekers', report.reportedId));
					}

					const reporterData = reporterDoc.data();
					const reportedData = reportedDoc.data();

					reportInfoData.push({
						id: report._id,
						reporterId: report.reporterId,
						reporterName: `${reporterData.name.firstName} ${reporterData.name.lastName}`,
						reporterProfileImage: reporterProfileImage,
						reportedProfileImage: reportedProfileImage,
						reportedId: report.reportedId,
						reportedName: `${reportedData.name.firstName} ${reportedData.name.lastName}`,
						reportedRole: reportedRole,
						reporterRole: reporterRole,
						reason: report.reason,
						createdAt: new Date(report.createdAt), // Assuming createdAt is already a Date in MongoDB
						status: report.status
					});
				}







				setDataSource(reportInfoData);
	
				setChanges(false)

				// Show spinner for 2 seconds
				setTimeout(() => {
					setShowSpinner(false);
				}, 1500);

			} catch (error) {
				console.error("Error fetching reports: ", error);
			} finally {
				setLoading(false);
			}
		};

		fetchReports();
	}, [changes]);


	const filterByStatus = dataSource.filter((report => {
		if (report.status == 'IN PROGRESS') {
			return report;
		}
	}))

	// const handleIgnore = async (record) => {
	// 	console.log(record.id)
	// 	setUpdating(true)

	// 	try{
	// 		await Axios.delete(`http://192.168.1.7:5000/report/deleteReport/${record.id}`)
	// 		setChanges(true)
	// 		setLoading(true)
	// 	} catch (error) {
	// 		console.error("Error:", error)
	// 	} finally {
	// 		setTimeout(() => {
	// 			setUpdating(false); // Set updating/loading state to false after a delay
	// 		}, 1200);
	// 	}

	// }

	const handleMessage = async (record, type) => {
		const adminId = localStorage.getItem('adminId');
			const userId = type === 'reporter' ? record.reporterId : record.reportedId;
			const chatId = `${adminId}_${userId}`;
		
		const messageData = {
			users: [localStorage.getItem('adminId'), type === 'reporter' ? record.reporterId : record.reportedId],
			usersFullName: { admin: localStorage.getItem('adminName'), user: type === 'reporter' ? record.reporterName : record.reportedName },
			usersImage: { admin: 'https://firebasestorage.googleapis.com/v0/b/servicita-signin-fa66f.appspot.com/o/CMSC%20128%201.png?alt=media&token=84ee6b35-73ff-4667-9720-53f2a40490a3', user: type === 'reporter' ? record.reporterProfileImage : record.reportedProfileImage },
			usersId: { admin: localStorage.getItem('adminId'), user: type === 'reporter' ? record.reporterId : record.reportedId },
			lastMessage: '',
			lastSeen: { admin: true, user: false },
			createdAt: new Date(),
			lastMessageTime: new Date(),
			messages: [
				{
					text: type === 'reporter' ? `Hello ${record.reporterName}, it seems you have a complaint. How can I help you?` : `Hello ${record.reportedName}, it seems you have been reported by another user due to ${record.reason}. I would like to hear your side of the story.`,
					createdAt: new Date(),
					_id: `${chatId}_${new Date().getTime()}_${adminId}`,
					user: { _id: adminId }
				}

			]
		}

		try {
			setShowSpinner(true);
			
			const db = getFirestore();
			const chatRef = collection(db, 'adminChats');
			const q = query(chatRef, where('users', 'array-contains', adminId));
			const querySnapshot = await getDocs(q);

			const chatExists = querySnapshot.docs.some(doc => {
			const chatData = doc.data();
			return chatData.users.includes(userId);
			});
			if (chatExists) {
				alert('Chat already exists');
			} else {				
				const chatDocRef = doc(db, 'adminChats', chatId);
				await setDoc(chatDocRef, messageData);
				alert('Chat created successfully, you can now message the user');
			}

		} catch (error) {
			console.error("Error:", error)
		
		} finally {
			setShowSpinner(false);
		}
	}

    const handleResolve = async (record) => {
		setUpdating(true)

		try{
            await Axios.put(`http://192.168.1.7:5000/report/updateReport/${record.id}`, {
                status: 'RESOLVED'
              });

			const db = getFirestore();
			const chatRef = collection(db, 'adminChats');
			const querySnapshot = getDocs(chatRef);
			const chatDocs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
			const chatExistsForReporter = chatDocs.find(chat => chat.users.includes(localStorage.getItem('adminId')) && chat.users.includes(record.reporterId));
			const chatExistsForReported = chatDocs.find(chat => chat.users.includes(localStorage.getItem('adminId')) && chat.users.includes(record.reportedId));

			if (chatExistsForReporter) {
				await deleteDoc(doc(db, 'adminChats', chatExistsForReporter.id));
			}

			if (chatExistsForReported) {
				await deleteDoc(doc(db, 'adminChats', chatExistsForReported.id));
			}

			 const imagesToDelete = [];

			 chatDocs.forEach(chat => {
				 chat.messages.forEach(message => {
					 if (message.image) {
						 imagesToDelete.push(message.image);
					 }
				 });
			 });
	 
			 const storage = getStorage();

			imagesToDelete.forEach(async (imageUrl) => {
				const imageRef = ref(storage, imageUrl);
				await deleteObject(imageRef);
			});

			setChanges(true)
			setLoading(true)
		} catch (error) {
            console.error("Error:", error)
		} finally {
			setTimeout(() => {
				setUpdating(false); // Set updating/loading state to false after a delay
			}, 1200);
		}
	}


	const renderActions = (record) => {
		if (!record) {
		  return null;
		}
	
		return (
		  <Dropdown
			overlay={
                <Menu>
                <Menu.SubMenu key="message" title="Message">
					<Menu.Item key="message_reporter" onClick={() => handleMessage(record, 'reporter')}>Reporter</Menu.Item>
					<Menu.Item key="message_reported" onClick={() => handleMessage(record, 'reported')}>Reported</Menu.Item>
				</Menu.SubMenu>
		
                <Menu.SubMenu key="suspend" title="Suspend">
                    <Menu.SubMenu key="suspend_reporter" title="Reporter">
                        <Menu.Item key="reporter_5_hours" onClick={() => handleSubMenuClick(record, 5, 'reporter')}>5 hours</Menu.Item>
                        <Menu.Item key="reporter_1_day" onClick={() => handleSubMenuClick(record, 24, 'reporter')}>1 day</Menu.Item>
                        <Menu.Item key="reporter_1_week" onClick={() => handleSubMenuClick(record, 168, 'reporter')}>1 week</Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key="suspend_reported" title="Reported">
                        <Menu.Item key="reported_5_hours" onClick={() => handleSubMenuClick(record, 5, 'reported')}>5 hours</Menu.Item>
                        <Menu.Item key="reported_1_day" onClick={() => handleSubMenuClick(record, 24, 'reported')}>1 day</Menu.Item>
                        <Menu.Item key="reported_1_week" onClick={() => handleSubMenuClick(record, 168, 'reported')}>1 week</Menu.Item>
                    </Menu.SubMenu>
                </Menu.SubMenu>
                <Menu.Item key="resolve" onClick={() => handleResolve(record)}>Resolve</Menu.Item>
            </Menu>
			}
			trigger={['click']}
		  >
			<span className="ellipsis-icon">
			  <FaEllipsisV />
			</span>
		  </Dropdown>
		)
	  };


	  const handleSubMenuClick = async (record, action, type) => {
		try {
		  const userData = {
			userId: type === 'reporter' ? record.reporterId : record.reportedId,
			action: action
		  }
		  Axios.patch('http://192.168.1.7:5000/admin/suspendUser', userData)
			.then((response) => {
			  alert('User suspended successfully');
			}
			)
			.catch((error) => {
			  console.error('Error suspending user: ', error);
			});
            await Axios.put(`http://172.16.4.26:5000/report/updateReport/${record.id}`, {
                status: 'IN PROGRESS'
              });
			setChanges(true)
			setLoading(true)
		} catch (error) {
		  console.error('Error suspending user: ', error);
		} 
		// finally {
		// 	handleIgnore(record);
		// }
	  }

	
	// const menu = (record) => (
	// 	<Menu>
	// 		<Menu.Item key="ignore" onClick={() => handleIgnore(record)}>Ignore</Menu.Item>
	// 		<Menu.Item key="resolve" onClick={() => handleResolve(record)}>Resolve</Menu.Item>
	// 	</Menu>
	// );

	return (
		<div className='reviewComplaints'>
			<div>
				<h1 className='DashboardHeader'>In Progress Complaints</h1>
				<hr className='Divider' style={{ width: '1185px' }} />
			</div>
			<div className='reviewComplaintsRender'>
				{showSpinner ? (
					<div className='showSpinner'>
						<Spin size="large" />
					</div>
				) : (
				filterByStatus.length === 0 ? (
				<div>No current In Progress Complaints to review</div>
			) : (
				<div className='complaints-scroller'>
					{changes ? (
						<div className='updateSpinner'>
							<Spin size="large" />
						</div>
						) : (
							<>
							<div className='complaintsCount'>
							In Progress Complaints to Review: {filterByStatus.length}
							</div>
					{filterByStatus.map((reportInfoData, index) => (
						<div key={reportInfoData.id} className='complaintsCard'>
							<div key={reportInfoData.id} className='complaintsCardContent'>
								<div style={{ padding: '20px' }}>
									<div className='complaintsHeader'>
										<div className='complaintsLeft'>
											<div className='serviceprovider' style={{ display: 'flex', alignItems: 'center' }}>
												<img alt="cover" src={reportInfoData.reporterProfileImage} style={{ width: '70px', height: '70px', borderRadius: '50%', border: '3px solid #7bc1e1', marginTop: '10px' }}></img>
												<div>
													<p className='reporter-Name'>{reportInfoData.reporterName}</p>
													<p className='report-date'>{reportInfoData.createdAt.toLocaleString()}</p>
												</div>
											</div>
										</div>
										<div className='serviceRight'>
											{renderActions(reportInfoData)}
											{/* <Dropdown overlay={() => renderActio(reportInfoData)} trigger={['click']}>
												<FaEllipsisV className='complaints-ellipsis'/>
											</Dropdown> */}
										</div>
									</div>
									<div className='complaintReason'>{reportInfoData.reason}</div>
									<div className='bottom-part1'>
										<div className='reported-user-label' >Reported User: </div>
										<div className='reported-user-role'>({reportInfoData.reportedRole})</div>
										<div className='reported-user-name' >{reportInfoData.reportedName}</div>
										{/* <div className='reported-user-id'>{reportInfoData.reportedId}</div> */}
									</div>
								</div>
							</div>
						</div>
					))}



				</>)}

		</div>
			)
				)}
			</div>
		</div> 
	);

}
export default InProgressComplaints


