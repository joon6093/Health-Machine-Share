//20190633 송제용
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Fab,
} from '@mui/material';
import { styled } from '@mui/system';
import RefreshIcon from '@mui/icons-material/Refresh';

const EXPRESS_URL = 'http://localhost:3010';

// 컴포넌트 스타일링을 위한 CSS-in-JS 코드
const Container = styled('div')({
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
});

const StyledTable = styled(Table)({
    minWidth: 650,
});

const StyledTableCell = styled(TableCell)({
    '& a': {
        display: 'block',
        width: '100%',
        textDecoration: 'none',
        color: '#000',
    },
});

function HealthMachineTable() {
    const [items, setItems] = useState([]);

    // 머신 목록을 서버에서 가져오는 비동기 함수
    const fetchData = async () => {
        try {
            const res = await axios.get(`${EXPRESS_URL}/HealthMachineShare/machines`);
            setItems(res.data.machines);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 데이터를 새로고침하는 함수
    const refresh = () => {
        fetchData();
    };

    return (
        <Container>
            <Paper sx={{ width: '100%', flexGrow: 1, overflow: 'hidden' }}>
                <Fab
                    color="primary"
                    sx={{
                        position: 'fixed',
                        top: (theme) => theme.spacing(2),
                        right: (theme) => theme.spacing(2),
                    }}
                    onClick={refresh}
                >
                    <RefreshIcon />
                </Fab>
                <TableContainer sx={{ maxHeight: '100%', overflow: 'auto' }}>
                    <StyledTable stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>머신 이름</TableCell>
                                <TableCell>머신 설명</TableCell>
                                <TableCell>머신 이미지</TableCell>
                                <TableCell>브랜드 이름</TableCell>
                                <TableCell>브랜드 창립년도</TableCell>
                                <TableCell>브랜드 이미지</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* 머신 목록을 동적으로 렌더링 */}
                            {items.map((machine, index) => (
                                <TableRow key={index}>
                                    <StyledTableCell>
                                        <Link
                                            to={`/HealthMachineShare/machines/reviews/${machine.machine_id}`}
                                        >
                                            {machine.machine_name}
                                        </Link>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Link
                                            to={`/HealthMachineShare/machines/reviews/${machine.machine_id}`}
                                        >
                                            {machine.description}
                                        </Link>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Link
                                            to={`/HealthMachineShare/machines/reviews/${machine.machine_id}`}
                                        >
                                            <img
                                                src={`${process.env.PUBLIC_URL}/machine_images/${machine.machine_image}`}
                                                alt="Machine"
                                            />
                                        </Link>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Link
                                            to={`/HealthMachineShare/machines/reviews/${machine.machine_id}`}
                                        >
                                            {machine.brand_name}
                                        </Link>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Link
                                            to={`/HealthMachineShare/machines/reviews/${machine.machine_id}`}
                                        >
                                            {machine.founding_year}
                                        </Link>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Link
                                            to={`/HealthMachineShare/machines/reviews/${machine.machine_id}`}
                                        >
                                            <img
                                                src={`${process.env.PUBLIC_URL}/brand_images/${machine.brand_image}`}
                                                alt="Brand"
                                            />
                                        </Link>
                                    </StyledTableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </StyledTable>
                </TableContainer>
            </Paper>
        </Container>
    );
}

export default HealthMachineTable;
