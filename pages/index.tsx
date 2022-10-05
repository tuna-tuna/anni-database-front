import { Collapse, IconButton, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Paper from '@mui/material/Paper';
import type { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Image from 'next/image';
import { Box } from '@mui/system';
import MUIDataTable, { MUIDataTableProps } from 'mui-datatables';

const Home: NextPage = () => {
    const [initialPlayerInfo, setInitialPlayerInfo] = useState<PlayerInfo[]>();
    const [playerInfo, setPlayerInfo] = useState<PlayerInfo[]>();
    const [isOpen, setOpen] = useState<boolean>(false);
    const [modalData, setModalData] = useState<PlayerInfo>();
    const [searchText, setSearchText] = useState<string>('');
    useEffect(() => {
        axios.get('http://localhost:2999/api/playerdata').then((playerDataRaw) => {
            const playerData = playerDataRaw.data.data as unknown as PlayerInfo[];
            setInitialPlayerInfo(playerData);
            setPlayerInfo(playerData);
        });
    }, []);
    useEffect(() => {
        const re = new RegExp(searchText, 'ig');
        setPlayerInfo(initialPlayerInfo?.filter(player => re.test(player.mcid)));
    }, [initialPlayerInfo, searchText]);
    const handleText = (text: string) => {
        setSearchText(text);
    }

    const handleOpen = (data: PlayerInfo) => {
        setOpen(true);
        setModalData(data);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const rowClickEvent = (rowData: string[], rowMeta: { dataIndex: number, rowIndex: number }): void => {
        if (typeof playerInfo !== 'undefined') {
            handleOpen(playerInfo[rowMeta.rowIndex]);
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
                <Box>
                    <Typography variant='h5' component='h2'>
                        {modalData?.mcid}
                    </Typography>
                </Box>
            </Modal>
            <input type='text' onChange={event => handleText(event.target.value)} />
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

const Row: React.FC<{ data: PlayerInfo }> = (props) => {
    const [isOpen, setOpen] = useState(false);
    return (
        <>
            <TableRow>
                <TableCell align='right'>
                    <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!isOpen)}>
                        {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align='right'>
                    <Image src={`https://minotar.net/avatar/${props.data.uuid}/50`} alt='' width={50} height={50} />
                </TableCell>
                <TableCell>
                    {props.data.mcid}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={isOpen} timeout='auto' unmountOnExit>
                        <Box sx={{ margin: 1 }} >
                            <Typography variant='h6' gutterBottom component='div'>
                                Name History
                            </Typography>
                            <Table size='small' aria-label='history'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>MCID</TableCell>
                                        <TableCell>Changed At</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {props.data.history.map((namedata, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{namedata.mcid}</TableCell>
                                            <TableCell>{namedata.changedAt}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

export default Home
