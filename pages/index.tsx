import { Collapse, IconButton, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import Paper from '@mui/material/Paper';
import type { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Image from 'next/image';
import { Box } from '@mui/system';
import MUIDataTable from 'mui-datatables';

const Home: NextPage = () => {
    const [playerInfo, setPlayerInfo] = useState<PlayerInfo[]>();
    const [isOpen, setOpen] = useState<boolean>(false);
    const [modalData, setModalData] = useState<PlayerInfo>();
    const [modalStatsData, setModalStatsData] = useState<AnniStats>();

    const modalStyle = {
        position: 'absolute' as 'absolute',
        top: '10%',
        left: '10%',
        width: '80%',
        height: '80%',
        color: 'primary.main',
        bgcolor: '#eee',
        borderRadius: 3,
        boxShadow: 20,
        p: 4
    };

    const modalMCID = {
        postion: 'absolute' as 'absolute',
        top: '15%',
        left: '10%',
        width: '90%',
        height: '10%',
    }

    const modalSkin = {
        postion: 'absolute' as 'absolute',
        top: '15%',
        left: '25%',
    };

    const modalNameHistory = {
        position: 'absolute' as 'absolute',
        top: '15%',
        left: '30%',
        width: '60%',
        height: '50%',
    };

    const modalStats = {
        position: 'absolute' as 'absolute',
        top: '75%',
        left: '30%',
        width: '40%',
        height: '30%'
    };

    useEffect(() => {
        axios.get('http://localhost:2999/api/playerdata').then((playerDataRaw) => {
            const playerData = playerDataRaw.data.data as unknown as PlayerInfo[];
            setPlayerInfo(playerData);
        });
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:2999/api/playerstats/${modalData?.mcid}`).then((playerStatsRaw) => {
            const playerStats = playerStatsRaw.data.data as AnniStats;
            setModalStatsData(playerStats);
        });
    }, [modalData]);

    const handleOpen = (data: PlayerInfo) => {
        setOpen(true);
        setModalData(data);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const rowClickEvent = (rowData: string[], rowMeta: { dataIndex: number, rowIndex: number }): void => {
        if (typeof playerInfo !== 'undefined') {
            handleOpen(playerInfo[rowMeta.dataIndex]);
        }
    }

    const columns = [
        {
            name: 'skin',
            label: 'Skin',
            options: {
                filter: false, sort: false,
                customBodyRenderLite: (dataIndex: number) => {
                    return (
                        <>
                            {typeof playerInfo !== 'undefined'
                                ?
                                <Image src={`https://minotar.net/avatar/${playerInfo[dataIndex].uuid}/50`} alt='' width={50} height={50} />
                                : <Image src={`https://minotar.net/helm/MHF_Steve/50.png`} alt='' width={50} height={50} />
                    }
                        </>
                    )
                }
            },
        },
        {
            name: 'mcid',
            label: 'MCID',
            options: { filter: true },
        },
        {
            name: 'lastSeen',
            label: 'Last Seen',
        },
        {
            name: 'lastUpdate',
            label: 'Last Update',
        }
    ];

    const options = {
        onRowClick: rowClickEvent
    };

    return (
        <>
            <Modal
                open={isOpen}
                onClose={handleClose}
            >
                <Box sx={modalStyle}>
                    <Box sx={modalMCID}>
                        <Typography variant='h5' component='h2'>
                            {modalData?.mcid}
                        </Typography>
                    </Box>
                    <Box sx={modalSkin}>
                        <Image src={`https://mc-heads.net/body/${modalData?.uuid}/250/left`} alt='' width={250} height={600} />
                    </Box>
                    <Box sx={modalNameHistory}>
                        <TableContainer component={Paper} sx={{maxHeight: '100%'}}>
                            <Table size='small'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>MCID</TableCell>
                                        <TableCell>Changed At</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {modalData?.history.map((data, index) => (
                                        <TableRow key={data.mcid + index.toString()}>
                                            <TableCell>{data.mcid}</TableCell>
                                            <TableCell>{data.changedAt}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                    <Box sx={modalStats}>
                        <TableContainer component={Paper} sx={{ maxHeight: '100%' }}>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Play Time</TableCell>
                                        <TableCell>{`${modalStatsData?.playTime.playHour}H ${modalStatsData?.playTime.playMin}M`}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Wins:Loses</TableCell>
                                        <TableCell>{modalStatsData?.winLose}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Bow Kills</TableCell>
                                        <TableCell>{modalStatsData?.bowKills}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Melee Kills</TableCell>
                                        <TableCell>{modalStatsData?.meleeKills}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Nexus Damages</TableCell>
                                        <TableCell>{modalStatsData?.nexusDamage}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Ores Mined</TableCell>
                                        <TableCell>{modalStatsData?.oresMined}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </Modal>
            <Box>
                <MUIDataTable
                    title={''}
                    data={playerInfo as Object[]}
                    columns={columns}
                    options={options}
                />
            </Box>
        </>
    );
}

export default Home
