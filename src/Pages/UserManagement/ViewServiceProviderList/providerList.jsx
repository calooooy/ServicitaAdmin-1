import React, { useState, useEffect } from 'react';
import { FaEllipsisV, FaAngleLeft, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { Table, Dropdown, Menu, Space } from 'antd';
import { getFirestore, collection, getDocs, onSnapshot, doc, deleteDoc, getDoc } from 'firebase/firestore';
import Axios from 'axios';

function ProviderList({ searchTerm, sortTerm, category, city, barangay, flagged, onSelectUser, toggleSearchBarVisibility }) {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [showServiceOverlay, setShowServiceOverlay] = useState(false);
  const [deletedUser, setDeletedUser] = useState(false);
  const [unsuspendUser, setUnsuspendUser] = useState(false);

  useEffect(() => {
    setLoading(true);
    const db = getFirestore();
    const providerCollection = collection(db, "providers");

    const fetchProviders = async () => {
      try {
        const querySnapshot = await getDocs(providerCollection);
        const providerData = [];

        await Promise.all(querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const firstName = data.name?.firstName || "";
          const lastName = data.name?.lastName || "";
          const fullName = `${firstName} ${lastName}`;
          const streetAddress1 = data.address?.streetAddress1 || "";
          const streetAddress2 = data.address?.streetAddress2 || "";
          const barangay = data.address?.barangay || "";
          const city = data.address?.cityMunicipality || "";
          const fullAddress = streetAddress2 !== "" ? `${streetAddress1}, ${streetAddress2}, ${barangay}, ${city}` : `${streetAddress1}, ${barangay}, ${city}`;
          const providerInfo = {
            id: doc.id,
            fullName: fullName,
            address: fullAddress,
            city: data.address.cityMunicipality || "",
            barangay: data.address.barangay || "",
            rating: data.rating || 0,
            completedServices: data.completedServices || 0,
            reportsReceived: data.reportsReceived || 0,
            violationRecord: data.violationRecord || 0,
            services: data.services || [],
          };
          const response = await Axios.get(`http://172.16.4.26:5000/admin/getUser/${doc.id}`);
          const userData = response.data.data;
          providerInfo.profileImage = userData.profileImage;
          providerInfo.email = userData.email;
          providerInfo.phone = userData.mobile;
          providerInfo.suspension = userData.suspension;
          const serviceCollection = collection(db, "services");
          const serviceData = [];
          await Promise.all(providerInfo.services.map(async (service) => {
            const serviceDoc = await getDocs(serviceCollection);
            serviceDoc.forEach((doc) => {
              if (doc.id === service) {
                serviceData.push(doc.data());
              }
            });
          }));
          providerInfo.services = serviceData;
          providerData.push(providerInfo);
          console.log(providerInfo)

        }));

        setDataSource(providerData);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching providers: ", error);
      } finally {
        setLoading(false);
        setDeletedUser(false);
        setUnsuspendUser(false);
      }
    };

    fetchProviders();

    // const unsubscribe = onSnapshot(providerCollection, () => {
    //   fetchProviders();
    // });

    // return () => unsubscribe();


  }, [flagged, selectedUser, deletedUser, unsuspendUser]);

  const filteredDataByFlag = dataSource.filter((data) => {
    if (flagged === false) {
      return data;
    } else if (data.suspension && data.suspension.isSuspended === true) {
      return data;
    }
  });

  const filteredDataByCategory = filteredDataByFlag.filter((data) => {
    if (category === '') {
      return data;
    } else if (data.services.some((service) => service.serviceType === category)) {
      return data;
    }
  });

  const filteredDataByCity = filteredDataByCategory.filter((data) => {

    if (city === '') {
      return data;
    } else if (data.city === city) {
      return data;
    }
  });

  const filteredDataByBarangay = filteredDataByCity.filter((data) => {
    if (barangay === '') {
      return data;
    } else if (data.barangay === barangay) {
      return data;
    }
  });

  const filteredDataBySearch = filteredDataByBarangay.filter((data) => {
    if (searchTerm === '') {
      return data;
    } else if (data.fullName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return data;
    }
  });

  const filteredDataBySort = filteredDataBySearch.sort((a, b) => {
    if (sortTerm === 'asc') {
      return a.fullName.localeCompare(b.fullName);
    } else if (sortTerm === 'desc') {
      return b.fullName.localeCompare(a.fullName);
    } else {
      return 0;
    }
  });

  if (!filteredDataBySort) {
    return null;
  }


  // useEffect(() => {
  //   if (selectedUser) {
  //     onSelectUser(selectedUser);
  //     const db = getFirestore();
  //     const providerCollection = collection(db, "providers");
  //     const providerDoc = doc(providerCollection, selectedUser.id);

  //     const unsubscribe = onSnapshot(providerDoc, async (doc) => {
  //       const data = doc.data();
  //       const firstName = data.name?.firstName || "";
  //       const lastName = data.name?.lastName || "";
  //       const fullName = `${firstName} ${lastName}`;
  //       const streetAddress1 = data.address?.streetAddress1 || "";
  //       const streetAddress2 = data.address?.streetAddress2 || "";
  //       const barangay = data.address?.barangay || "";
  //       const city = data.address?.cityMunicipality || "";
  //       const fullAddress = `${streetAddress1}, ${streetAddress2}, ${barangay}, ${city}`;
  //       const updatedUser = {
  //         id: doc.id,
  //         fullName: fullName,
  //         address: fullAddress,
  //         rating: data.rating || 0,
  //         completedServices: data.completedServices || 0,
  //         reportsReceived: data.reportsReceived || 0,
  //         violationRecord: data.violationRecord || 0,
  //         services: data.services || [],

  //       };
  //       const response = await Axios.get(`http://172.16.4.26:5000/admin/getUser/${doc.id}`);
  //       const userData = response.data.data;
  //       updatedUser.profileImage = userData.profileImage;
  //       updatedUser.email = userData.email;
  //       updatedUser.phone = userData.mobile;
  //       const serviceCollection = collection(db, "services");
  //       const serviceData = [];
  //       await Promise.all(updatedUser.services.map(async (service) => {
  //         const serviceDoc = await getDocs(serviceCollection);
  //         serviceDoc.forEach((doc) => {
  //           if (doc.id === service) {
  //             serviceData.push(doc.data());
  //           }
  //         });
  //       }));
  //       updatedUser.services = serviceData;
  //       setSelectedUser(updatedUser);
  //     });

  //     return () => unsubscribe();
  //   }
  // }, [selectedUser, onSelectUser]);


  const renderName = (text, record) => (
    <span
      style={{ textAlign: 'left', fontSize: '20px', cursor: 'pointer' }}
      onClick={() => handleItemClick(record)}
    >
      {text}
    </span>
  );

  const renderImage = (url, record) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        cursor: 'pointer'
      }}
      onClick={() => handleItemClick(record)}
    >
      <div style={{ width: 50, height: 50, borderRadius: '50%', overflow: 'hidden' }}>
        <img src={url} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>
  );

  const handleItemClick = (record) => {
    setSelectedUser(record);
    toggleSearchBarVisibility(false);
  };

  const handleCloseProfile = () => {
    setSelectedUser(null);
    toggleSearchBarVisibility(false);
  };

  const handleSubMenuClick = (record, action) => {

    try {
      const userData = {
        userId: record.id,
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
    }
  }

  const handleDelete = (record) => {
    const userData = {
      userId: record.id
    };
    Axios.post(`http://172.16.4.26:5000/admin/deleteUser`, userData)
      .then((response) => {
        const db = getFirestore();
        const providerCollection = collection(db, "providers");
        const providerDoc = doc(providerCollection, record.id);
        const providerServices = collection(db, "services");
        getDocs(providerServices)
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              if (doc.data().providerId === record.id) {
                deleteDoc(doc.ref) // Use doc.ref here to get the reference
                  .then(() => {
                    console.log("Document successfully deleted");
                  })
                  .catch((error) => {
                    console.error("Error deleting Firestore document: ", error);
                  });
              }
            });
            deleteDoc(providerDoc)
              .then(() => {
                alert("User deleted successfully");
                setDeletedUser(true);
              })
              .catch((error) => {
                console.error("Error deleting Firestore document: ", error);
              });
          })
          .catch((error) => {
            console.error("Error getting documents: ", error);
          });
      })
      .catch((error) => {
        console.error("Error deleting user: ", error);
      });
  };




  const handleUnsuspend = (record) => {
    try {
      const userData = {
        email: record.email
      }
      Axios.patch('http://172.16.4.26:5000/admin/unsuspendUser', userData)
        .then((response) => {
          alert('User unsuspended successfully');
          setUnsuspendUser(true);
        })
        .catch((error) => {
          console.error('Error unsuspending user: ', error);
        });
    } catch (error) {
      console.error('Error unsuspending user: ', error);
    }
  }

  const renderActions = (text, record) => (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key="reward">Reward</Menu.Item>
          {/* {record.suspension && record.suspension.isSuspended === true ? (
            <Menu.Item key="unsuspend" onClick={() => handleUnsuspend(record)}>Unsuspend</Menu.Item>
          ) : ( */}
            <Menu.SubMenu title="Suspend">
              <Menu.Item key="5_hours" onClick={() => handleSubMenuClick(record, 5)}>5 hours</Menu.Item>
              <Menu.Item key="1_day" onClick={() => handleSubMenuClick(record, 24)}>1 day</Menu.Item>
              <Menu.Item key="1_week" onClick={() => handleSubMenuClick(record, 168)}>1 week</Menu.Item>
            </Menu.SubMenu>
          {/* )} */}


          <Menu.Item key="delete" onClick={() => handleDelete(record)}>Delete</Menu.Item>
        </Menu>
      }
      trigger={['click']}
    >
      <span className="ellipsis-icon">
        <FaEllipsisV />
      </span>
    </Dropdown>
  );

  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="star" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="star" />);
      } else {
        stars.push(<FaStar key={i} className="empty-star" />);
      }
    }

    return <div className="star-rating">{stars}</div>;
  };

  function UserDetails({ userDetails }) {
    const { email, phone, address } = userDetails;

    return (
      <div className="user-details-wrapper">
        <div className='tableRow'>
          Email:&nbsp;<span>{email}</span>
        </div>
        <div className='tableRow'>
          Phone:&nbsp;<span>{phone}</span>
        </div>
        <div className='tableRow'>
          Address:&nbsp;<span>{address}</span>
        </div>
      </div>
    );
  }

  function UserDetailCard({ title, value }) {
    return (
      <div className="ProviderDetailCard">
        <div className="ProviderDetailCardTitle">{title}</div>
        <div className="ProviderDetailCardValue">{value}</div>
      </div>
    );
  }

  function handleServiceClick() {
    showServiceOverlay(true);
  }

  function handleServiceClick(service) {
    console.log(service);
    setSelectedService(service);
    setShowServiceOverlay(true);
  }

  return (
    <div>
      
      {selectedUser && (
        <div>
          <div className="profileHeader">
            {/* Back button */}
            <div className="back-button" onClick={handleCloseProfile}>
              <FaAngleLeft />
            </div>
            {/* Profile picture */}
            <div className="profile-picture-container">
              <img className="profile-picture" src={selectedUser.profileImage} alt="Profile" />
            </div>
            {/* Render detailed user profile details here */}
            <div>
              <p className="profile-username">{selectedUser.fullName}</p>
              {/* Star rating frame */}
              {renderStarRating(selectedUser.rating)}
              {/* Add more details as needed */}
            </div>

            {/* Profile actions */}
            <div className="profile-actions">
              {renderActions()}
            </div>

          </div>
          <div className="profileBody">
            <div className='leftSide'>
              <UserDetails userDetails={selectedUser} />
              <div className='ServicesOffered'>Services Offered:
                {selectedUser.services.map((service, index) => (
                  <div key={index} className='ServicesOfferedList' onClick={() => handleServiceClick(service)}>
                    {service.name} ({service.serviceType})
                  </div>
                ))
                }
              </div>
            </div>
            <div class="verticalLine"></div>
            <div className="userDetailCardsContainerProvider">
              <UserDetailCard title={"Completed Services"} value={selectedUser.completedServices} />
              <UserDetailCard title={"Reports Received"} value={selectedUser.reportsReceived} />
              <UserDetailCard title={"Violation Record"} value={selectedUser.violationRecord} />
            </div>
            <div className='Performance'>For graphs:</div>
          </div>
        </div>
      )}

      {!selectedUser && (
        <div className="scrollable-table">
          <Table
            style={{ width: '100%' }}
            components={{
              body: {
                cell: ({ children }) => <td>{children}</td>
              }
            }}
            size='small'
            columns={[
              {
                dataIndex: "profileImage",
                render: (url, record) => renderImage(url, record),
                width: '100px',
              },
              {
                dataIndex: "fullName",
                render: (text, record) => renderName(text, record)
              },
              {
                dataIndex: 'actions',
                render: renderActions,
                width: '50px',
              }
            ]}
            loading={loading}
            dataSource={filteredDataBySort}
            pagination={false}
          />
        </div>


      )}

      {showServiceOverlay && selectedService && (
        <div className="serviceDetailsOverlay">
          <div className="serviceDetails">
            <div className="serviceDetailsHeader">
              <div className="back-button" onClick={() => setShowServiceOverlay(false)}>
                <FaAngleLeft />
              </div>
              <div className="serviceDetailsTitle">{selectedService.name}</div>
            </div>
            <div className="serviceDetailsBody">
              <hr></hr>
              <div className="serviceDetailsDescription">{selectedService.description}</div>
              <hr></hr>
              <div className="serviceDetailsPrice"> ₱{selectedService.price.min} - ₱{selectedService.price.max}</div>
              {/* Design a week schedule regarding the availability displaying all 7 days with start time and end time */}
              <hr></hr>
              <div className="serviceDetailsSchedule">
                {selectedService.availability.map((day, index) => (
                  <div>
                    <div key={index} className="serviceDetailsDay">
                      <div>
                        <div className='dayLabel'>{day.day}</div>
                      </div>
                      <div>
                        <div>{day.startTime}</div>
                        <div> - </div>
                        <div>{day.endTime}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}

export default ProviderList;
