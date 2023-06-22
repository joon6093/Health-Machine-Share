//20190633 송제용
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { styled } from '@mui/system';

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

const Heading = styled(Typography)({
    textAlign: 'center',
    marginBottom: '20px',
    width: '100%',
    fontSize: '100%',
});
const ButtonContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
});

const RegisterButton = styled(Link)({
    textDecoration: 'none',
    padding: '10px 20px',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
});

const DeleteButton = styled('button')({
    padding: '10px 20px',
    color: '#fff',
    backgroundColor: 'red',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
});

function HealthMachineReviewTable() {
    const [items, setItems] = useState([]); // 리뷰 목록을 저장하는 상태 변수
    const { machineId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 해당 머신의 리뷰 목록을 서버로부터 가져옴
                const res = await axios.get(
                    `${EXPRESS_URL}/HealthMachineShare/machines/reviews/${machineId}`
                );
                setItems(res.data.reviews); // 가져온 리뷰 목록을 상태에 저장
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [machineId]);

    // 리뷰 삭제 함수
    const deleteReview = async (reviewId) => {
        try {
            // 서버로 리뷰 삭제 요청을 보냄
            await axios.delete(`${EXPRESS_URL}/HealthMachineShare/machines/reviews/${reviewId}`);
            // 삭제 후 리뷰 목록을 다시 가져와서 상태를 업데이트
            const res = await axios.get(
                `${EXPRESS_URL}/HealthMachineShare/machines/reviews/${machineId}`
            );
            setItems(res.data.reviews);
        } catch (error) {
            console.log(error);
        }
    };

    // 평점을 별로 표시하는 함수
    const renderRatingStars = (rating) => {
        const fullStar = '★';
        const emptyStar = '☆';
        const maxRating = 5;

        const fullStarsCount = Math.round(rating);
        const emptyStarsCount = maxRating - fullStarsCount;

        const fullStars = fullStar.repeat(fullStarsCount);
        const emptyStars = emptyStar.repeat(emptyStarsCount);

        return fullStars + emptyStars;
    };

    return (
        <Container className="review-table-container">
            <Heading variant="h4">리뷰 목록</Heading>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>번호</TableCell>
                            <TableCell>머신 이름</TableCell>
                            <TableCell>사용자 이름</TableCell>
                            <TableCell>리뷰</TableCell>
                            <TableCell>평점</TableCell>
                            <TableCell>리뷰 삭제</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* 리뷰 목록을 동적으로 렌더링 */}
                        {items.map((review, i) => (
                            <TableRow key={i}>
                                <TableCell>{review.rating_id}</TableCell>
                                <TableCell>{review.machine_name}</TableCell>
                                <TableCell>{review.user_name}</TableCell>
                                <TableCell>{review.review}</TableCell>
                                <TableCell>{renderRatingStars(review.rating)}</TableCell>
                                <TableCell>
                                    {/* 리뷰 삭제 버튼 */}
                                    <DeleteButton onClick={() => deleteReview(review.rating_id)}>
                                        삭제
                                    </DeleteButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* 리뷰 등록 페이지로 이동하는 버튼 */}
            <ButtonContainer>
                <RegisterButton to={`/HealthMachineShare/machines/reviews/register/${machineId}`}>
                    평점 및 리뷰 등록
                </RegisterButton>
            </ButtonContainer>
        </Container>
    );
}

export default HealthMachineReviewTable;
