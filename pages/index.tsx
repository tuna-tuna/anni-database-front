import { Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import type { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Image from 'next/image';
import { Box } from '@mui/system';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';

const Home: NextPage = () => {
    const defaultModalData: PlayerInfo = {
        mcid: '',
        uuid: '',
        lastSeenRaw: 0,
        lastSeen: '',
        lastUpdateRaw: 0,
        lastUpdate: '',
        isFavorite: false,
        history: []
    };

    const defaultModalStatsData: AnniStats = {
        mcid: '',
        playTime: {
            playHour: '',
            playMin: ''
        },
        winLose: '',
        bowKills: '',
        meleeKills: '',
        nexusDamage: '',
        oresMined: '',
        lastUpdate: 0
    }

    const [playerInfo, setPlayerInfo] = useState<PlayerInfo[]>();
    const [isOpen, setOpen] = useState<boolean>(false);
    const [modalData, setModalData] = useState<PlayerInfo>(defaultModalData);
    const [modalStatsData, setModalStatsData] = useState<AnniStats>(defaultModalStatsData);
    const [isStatsLoading, setStatsLoading] = useState<boolean>(false);
    const [_, forceRender] = useState(false);

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
        top: '10%',
        left: '30%',
        width: '60%',
        height: '50%',
    };

    const modalStats = {
        position: 'absolute' as 'absolute',
        top: '65%',
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
        if (typeof modalData !== 'undefined' && modalData.mcid !== '') {
            setStatsLoading(true);
            axios.get(`http://localhost:2999/api/playerstats/${modalData?.mcid}`).then((playerStatsRaw) => {
                const playerStats = playerStatsRaw.data.data as AnniStats;
                setModalStatsData(playerStats);
                setStatsLoading(false);
            });
        }
    }, [modalData]);

    const handleOpen = (data: PlayerInfo) => {
        setOpen(true);
        setModalData(data);
    }

    const handleClose = () => {
        setOpen(false);
        setModalData(defaultModalData);
        setModalStatsData(defaultModalStatsData);
    }

    const cellClickEvent = (colData: any, cellMeta: { colIndex: number, rowIndex: number, dataIndex: number }) => {
        if (typeof playerInfo !== 'undefined') {
            if (cellMeta.colIndex === 4) {
                return;
            } else {
                handleOpen(playerInfo[cellMeta.dataIndex]);
            }
        }
    };

    const favoriteClickEvent = async (dataIndex: number): Promise<void> => {
        if (typeof playerInfo !== 'undefined') {
            await axios.get(`http://localhost:2999/api/favorite/${playerInfo[dataIndex].uuid}`);
            /*setPlayerInfo([
                ...playerInfo,
                {
                    ...playerInfo[dataIndex],
                    isFavorite: !playerInfo[dataIndex].isFavorite
                }
            ]);*/
            
            let newPlayerInfo: PlayerInfo[] = playerInfo;
            newPlayerInfo[dataIndex].isFavorite = !playerInfo[dataIndex].isFavorite;
            setPlayerInfo(newPlayerInfo);
            
            // shallow ...
            forceRender(!_);
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
        },
        {
            name: 'isFavorite',
            label: 'Favorite',
            options: {
                customBodyRenderLite: (dataIndex: number) => {
                    return (
                        <>
                            {typeof playerInfo !== 'undefined'
                                ? (playerInfo[dataIndex].isFavorite
                                    ? <IconButton sx={{ color: '#ff0' }} onClick={() => favoriteClickEvent(dataIndex)}>
                                          <StarIcon />
                                      </IconButton>
                                    : <IconButton onClick={() => favoriteClickEvent(dataIndex)}>
                                          <StarOutlineIcon />
                                      </IconButton>)
                                : <StarOutlineIcon />}
                        </>
                    );
                }
            }
        }
    ];

    const options: MUIDataTableOptions = {
        selectableRows: 'none',
        onCellClick: cellClickEvent,
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
                    {//<Box sx={modalSkin}>
                        //<Image src={`https://mc-heads.net/body/${modalData?.uuid}/250/left`} alt='' width={250} height={600} />
                    //</Box>
                    }
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
                    <Box sx={modalStats} component={Paper}>
                        {isStatsLoading
                            ? <LinearProgress sx={{ top: '50%'}}/>
                            :
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
                        }
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
