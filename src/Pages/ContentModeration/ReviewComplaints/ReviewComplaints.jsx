import React, { useState, useEffect } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { Table, Dropdown, Menu, Space, Card, Spin } from 'antd';
import { getFirestore, collection, getDocs, onSnapshot, doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import Axios from 'axios';

function ReviewComplaints() {
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
					const reportedRole = reportedResponse.data.data.role

					if (reportedRole == 'Provider') {
						reporterDoc = await getDoc(doc(db, 'seekers', report.reporterId));
						reportedDoc = await getDoc(doc(db, 'providers', report.reportedId));
					}
					else {
						reporterDoc = await getDoc(doc(db, 'providers', report.reporterId));
						reportedDoc = await getDoc(doc(db, 'seekers', report.reportedId));
					}

					// reporterDoc = await getDoc(doc(db, 'seekers', report.reporterId));
					// reportedDoc = await getDoc(doc(db, 'providers', report.reportedId));

					// console.log(reporterProfileImage)
					// console.log(reportedRole)

					const reporterData = reporterDoc.data();
					const reportedData = reportedDoc.data();

					console.log(reporterData)
					console.log(reportedData)


					reportInfoData.push({
						id: report._id,
						reporterId: report.reporterId,
						reporterName: `${reporterData.name.firstName} ${reporterData.name.lastName}`,
						reporterProfileImage: reporterProfileImage,
						reportedId: report.reportedId,
						reportedName: `${reportedData.name.firstName} ${reportedData.name.lastName}`,
						reportedRole: reportedRole,
						reason: report.reason,
						createdAt: new Date(report.createdAt) // Assuming createdAt is already a Date in MongoDB
					});
				}







				setDataSource(reportInfoData);
				setLoading(false);
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


	const refresh = dataSource.filter((report => {
		return report;
	}))



	const handleIgnore = async (record) => {
		console.log(record.id)
		setUpdating(true)

		try{
			await Axios.delete(`http://172.16.4.26:5000/report/deleteReport/${record.id}`)
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

	const handleView = (record) => {
		console.log("For view")
	}

	const handleResolve = (record) => {
		console.log("For resolve")
		console.log(record.reason)
		setUpdating(true)

		try{
			
		} catch (error) {

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
				<Menu.Item key="delete" onClick={() => handleIgnore(record)}>Ignore</Menu.Item>
				<Menu.SubMenu title="Resolve">
				  <Menu.Item key="5_hours" onClick={() => handleSubMenuClick(record, 5)}>5 hours</Menu.Item>
				  <Menu.Item key="1_day" onClick={() => handleSubMenuClick(record, 24)}>1 day</Menu.Item>
				  <Menu.Item key="1_week" onClick={() => handleSubMenuClick(record, 168)}>1 week</Menu.Item>
				</Menu.SubMenu>
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


	  const handleSubMenuClick = (record, action) => {

		try {
		  const userData = {
			userId: record.reportedId,
			action: action
		  }
		  Axios.patch('http://172.16.4.26:5000/admin/suspendUser', userData)
			.then((response) => {
			  alert('User suspended successfully');
			}
			)
			.catch((error) => {
			  console.error('Error suspending user: ', error);
			});
		} catch (error) {
		  console.error('Error suspending user: ', error);
		} finally {
			handleIgnore(record);
		}
	  }

	
	const menu = (record) => (
		<Menu>
			<Menu.Item key="ignore" onClick={() => handleIgnore(record)}>Ignore</Menu.Item>
			<Menu.Item key="resolve" onClick={() => handleResolve(record)}>Resolve</Menu.Item>
		</Menu>
	);

	return (
		<div className='reviewComplaints'>
			<div>
				<h1 className='DashboardHeader'>Review Complaints</h1>
				<hr className='Divider' style={{ width: '1185px' }} />
			</div>
			<div className='reviewComplaintsRender'>
				{showSpinner ? (
					<div className='showSpinner'>
						<Spin size="large" />
					</div>
				) : (
				dataSource.length === 0 ? (
				<div>No current complaints to review</div>
			) : (
				<div className='complaints-scroller'>
					{changes ? (
						<div className='updateSpinner'>
							<Spin size="large" />
						</div>
						) : (
							<>
							<div className='complaintsCount'>
							Complaints to Review: {dataSource.length}
							</div>
					{dataSource.map((reportInfoData, index) => (
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
export default ReviewComplaints




{/* <div style={{ paddingTop: '20px', paddingLeft: '20px', paddingRight: '0px' }}>
	<div className='service-scroller' style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'start', overflowY: 'auto', overscrollBehaviorInline: 'contain', width: '1100px', maxHeight: '595px', paddingRight: '20px', paddingBottom: '20px' }}>
		{filterByUpdatedStatus.map((servicesInfo, index) => (
			<div key={servicesInfo.id} style={{ position: 'relative', width: 'calc(50% - 10px)', maxWidth: '550px', height: '300px', backgroundColor: '#FFFFFF', boxShadow: '7px 5px 5px rgba(30, 30, 30, 0.3)' }}>
				<div key={servicesInfo.id} style={{ width: '100%', marginRight: '10px', borderRadius: '0px' }}>
					<div style={{ padding: '20px' }}>
						<div className='serviceHeader' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
							<div className='serviceLeft' style={{ display: 'flex', flexDirection: 'column' }}>
								<div className='serviceprovider' style={{ display: 'flex', alignItems: 'center' }}>
									<img alt="cover" src={servicesInfo.profileImage} style={{ width: '70px', height: '70px', borderRadius: '50%' }}></img>
									<div>
										<p className='provider-Name' style={{ fontSize: '20px', color: 'black', marginLeft: '15px', marginBottom: '0px' }}>{servicesInfo.providerName}</p>
										<p className='provider-Name' style={{ fontSize: '12px', color: 'gray', marginLeft: '15px', marginTop: '0px' }}>{servicesInfo.serviceType}</p>
									</div>
								</div>
							</div>
							<div className='serviceRight'>
								<Dropdown overlay={() => menu(servicesInfo)} trigger={['click']}>
									<FaEllipsisV className='service-listing-ellipsis' style={{ height: '25px', width: '25px', cursor: 'pointer' }} />
								</Dropdown>
							</div>

						</div>

						<div className='description' style={{ marginTop: '15px', fontSize: '12px', maxHeight: '140px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>{servicesInfo.description}</div>

						<div className='bottom-part' style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight: '25px', marginBottom: '25px', bottom: '0', right: '0', position: 'absolute' }}>
							<div className='price' style={{ marginLeft: '0px', marginRight: '3px', color: 'gray', fontSize: '12px' }}>Reported User: </div>
							<div className='price' style={{ marginLeft: '0px', marginRight: '3px', color: 'gray', fontSize: '12px' }}>({servicesInfo.status})</div>
							<div className='price' style={{ marginLeft: '0px', marginRight: '3px', color: 'gray', fontSize: '12px' }}>{servicesInfo.providerName}</div>
							<div className='price' style={{ marginLeft: '0px', marginRight: '3px', color: 'gray', fontSize: '12px' }}>{servicesInfo.providerId}</div>
						</div>



					</div>
				</div>
			</div>

		))}
	</div>
	</div> */}







	// const [dataSource, setDataSource] = useState([]);
	// const [loading, setLoading] = useState(false);

	// useEffect(() => {
	// setLoading(true);
	// const db = getFirestore();
	// const servicesCollection = collection(db, "services");
	// const providerCollection = collection(db, "providers");

	// const fetchServices = async () => {
	// try {
	// const querySnapshot = await getDocs(servicesCollection);
	// const servicesData = [];

	// await Promise.all(querySnapshot.docs.map(async (doc) => {
	// const data = doc.data();
	// const servicesInfo = {
	// id: doc.id,
	// coverImage: data.coverImage,
	// description: data.description,
	// name: data.name,
	// minPrice: data.price.min,
	// maxPrice: data.price.max,
	// providerId: data.providerId,
	// verified: data.verified,
	// status: data.status,
	// serviceType: data.serviceType
	// };
	// const response = await Axios.get(`http://192.168.254.158:5000/admin/getUser/${data.providerId}`);
	// const userData = response.data.data;
	// servicesInfo.profileImage = userData.profileImage;

	// const providerQuerySnapshot = await getDocs(providerCollection);
	// providerQuerySnapshot.forEach(docSnapshot => {
	// const providerData = docSnapshot.data();

	// if (docSnapshot.id === data.providerId) {
	// servicesInfo.providerName = `${providerData.name.firstName} ${providerData.name.lastName}`;
	// return;
	// }
	// });

	// servicesData.push(servicesInfo);

	// }));

	// servicesData.sort((a, b) => {
	// if (a.name < b.name) {
	// return -1;
	// }
	// if (a.name > b.name) {
	// return 1;
	// }
	// return 0;
	// });

	// setDataSource(servicesData);
	// setLoading(false);

	// } catch (error) {
	// console.error("Error fetching services: ", error);
	// } finally {
	// setLoading(false);
	// }
	// };

	// fetchServices();

	// // const unsubscribe = onSnapshot(servicesCollection, () => {
	// // fetchServices();
	// // });

	// // return () => unsubscribe();
	// }, [dataSource]);



	// const filterByStatus = dataSource.filter((data => {
	// if (data.status == 'Pending') {
	// return data;
	// }
	// }))

	// const filterByUpdatedStatus = dataSource.filter((data => {
	// if (data.status == 'Pending') {
	// return data;
	// }
	// }))

	// const handleDelete = (record) => {
	// console.log(record.id)
	// Axios.post(`http://192.168.254.158:5000/admin/deleteUser`, { userId: record.id })
	// .then((response) => {
	// const db = getFirestore();
	// const seekerCollection = collection(db, "seekers");
	// const seekerDoc = doc(seekerCollection, record.id);
	// deleteDoc(seekerDoc)
	// .then(() => {
	// alert('User deleted successfully');
	// setDeletedUser(true);
	// })
	// .catch((error) => {
	// console.error('Error deleting Firestore document: ', error);
	// });
	// })
	// .catch((error) => {
	// console.error('Error deleting user: ', error);
	// });
	// }
