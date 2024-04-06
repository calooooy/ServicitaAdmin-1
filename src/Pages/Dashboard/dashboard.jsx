import React, { useState, useEffect } from 'react';
import '../../Admin.css';
import { Space, Table } from 'antd';
import './../../firebase';
import { getFirestore, addDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';
import Axios from 'axios';

function Dashboard() {

    const db = getFirestore();
    const seekerCollection = collection(db, "seekers");
    const providerCollection = collection(db, "providers");

    const [seekers, setSeekers] = useState([]);
    const [providers, setProviders] = useState([]);
    const [completedServicesCount, setCompletedServicesCount] = useState(0);


    useEffect(() => {
        const fetchSeekers = async () => {
            const querySnapshot = await getDocs(seekerCollection);
            const seekerData = [];
            querySnapshot.forEach((doc) => {
                seekerData.push(doc.data());
            });
            setSeekers(seekerData);
        };

        const fetchProviders = async () => {
            const querySnapshot = await getDocs(providerCollection);
            const providerData = [];
            querySnapshot.forEach((doc) => {
                providerData.push(doc.data());
            });
            setProviders(providerData);
        };

        const iterateOverCompletedServicesCount = async () => {
            const querySnapshot = await getDocs(providerCollection);
            let totalCount = 0;

            querySnapshot.forEach((doc) => {
                const providerData = doc.data();
                const completedServices = providerData.completedServices || 0;

                if (typeof completedServices === 'number') {
                    totalCount += completedServices;
                }
            });

            setCompletedServicesCount(totalCount);
        };

        fetchSeekers();
        fetchProviders();
        iterateOverCompletedServicesCount();

        const unsubscribeSeekers = onSnapshot(seekerCollection, (snapshot) => {
            const data = snapshot.docs.map(doc => doc.data());
            setSeekers(data);
        });

        const unsubscribeProviders = onSnapshot(providerCollection, (snapshot) => {
            const data = snapshot.docs.map(doc => doc.data());
            setProviders(data);
        });


        return () => {
            unsubscribeSeekers();
            unsubscribeProviders();
        };
    }, [seekerCollection, providerCollection]);


    const seekerCount = seekers.length;
    const providerCount = providers.length;
    const completedServiceCount = completedServicesCount;

    return (
        <div style={{ width: '100%' }}>
            <h1 className='DashboardHeader'>Dashboard</h1>
            <hr className='Divider' style={{ width: '1185px' }} />
            <Space direction="horizontal">
                <DashboardCard title={"Service Seekers"} value={seekerCount}></DashboardCard>
                <DashboardCard title={"Service Providers"} value={providerCount}></DashboardCard>
                <DashboardCard title={"Completed Service "} value={completedServiceCount}></DashboardCard>
            </Space>
            <Space>
                <div className='TopPerforming'>
                    <TopPerforming />
                </div>

            </Space>

        </div>
    );
}

function DashboardCard({ title, value }) {
    return (
        <div className="square">
            <div className="cardTitle">{title}</div>
            <div className="value">{value}</div>
        </div>
    );
}


function TopPerforming() {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);

    function computeCombinedScore(rating, completedServices, ratingWeight, servicesWeight) {
        const combinedScore = (rating * ratingWeight) + (completedServices * servicesWeight);
        return combinedScore;
    }

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
                    const providerInfo = {
                        id: doc.id,
                        fullName: fullName,
                        profileImage: data.profileImage || "",
                        rating: data.rating || 0,
                        completedServices: data.completedServices || 0
                    };
                    const response = await Axios.get(`http://192.168.1.10:5000/admin/getUser/${doc.id}`);
                    const userData = response.data.data;
                    console.log(userData);
                    providerInfo.profileImage = userData.profileImage;
                    providerData.push(providerInfo);
                }));

                const rankedProviders = providerData.map(provider => ({
                    ...provider,
                    combinedScore: computeCombinedScore(provider.rating, provider.completedServices, 0.7, 0.3)
                })).sort((a, b) => {
                    if (b.combinedScore !== a.combinedScore) {
                        return b.combinedScore - a.combinedScore;
                    } else {
                        return a.fullName.localeCompare(b.fullName);
                    }
                });

                rankedProviders.forEach((provider, index) => {
                    provider.rank = index + 1;
                });

                setDataSource(rankedProviders.slice(0, 5));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching providers:", error);
                setLoading(false);
            }
        };

        const unsubscribe = onSnapshot(providerCollection, () => {
            fetchProviders();
        });

        return () => unsubscribe();
    }, []);

    const renderImage = (url) => (
        <div style={{ width: 50, height: 50, borderRadius: '50%', overflow: 'hidden' }}>
            <img src={url} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
    );

    return (
        <div>
            <h1 className="topPerformingTableTitle">Top Performing Service Providers</h1>
            <Table
                style={{ width: '90%', marginLeft: '10px' }}
                components={{
                    body: {
                        cell: ({ children }) => <td>{children}</td>
                    }
                }}
                size='small'
                columns={[
                    {
                        dataIndex: "rank",
                        render: (text) => <span style={{
                            color: '#75B9D9',
                            fontSize: '32px',
                            textAlign: 'center', // Center align the text
                            display: 'flex', // Use flexbox to center vertically
                            justifyContent: 'center', // Center horizontally
                            alignItems: 'center' // Center vertically
                        }}>{text}</span>
                    },
                    {
                        dataIndex: "profileImage",
                        render: renderImage,
                        width: '50px'
                    },
                    {
                        dataIndex: "fullName",
                        render: (text, record) => (
                            <span style={{ textAlign: 'left', fontSize: '20px' }}>{text}</span>
                        )
                    }
                ]}
                loading={loading}
                dataSource={dataSource}
                pagination={false}
            />
        </div>
    );
}



export default Dashboard;
