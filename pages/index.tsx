import { Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Paper from '@mui/material/Paper';
import type { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Image from 'next/image';
import { Box } from '@mui/system';

const Home: NextPage = () => {
    const [initialPlayerInfo, setInitialPlayerInfo] = useState<PlayerInfo[]>();
    const [playerInfo, setPlayerInfo] = useState<PlayerInfo[]>();
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
    return (
        <>
            <input type='text' onChange={event => handleText(event.target.value)} />
            <TableContainer component={Paper}>
                <Table aria-label='collapsible table'>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell />
                            <TableCell>MCID</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {playerInfo?.map((player) => (
                            <Row data={player} key={player.uuid} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
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
