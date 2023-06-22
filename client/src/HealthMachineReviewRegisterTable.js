//20190633 송제용
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import Rating from 'react-rating-stars-component';
import { styled } from '@mui/system';

const EXPRESS_URL = 'http://localhost:3010';

// 스타일링된 컴포넌트들의 스타일을 정의한 CSS-in-JS 코드
const FormContainer = styled('div')({
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
});

const FormHeading = styled(Typography)({
    textAlign: 'center',
    marginBottom: '20px',
});

const InputField = styled(TextField)({
    width: '100%',
    marginBottom: '20px',
});

const SelectField = styled(FormControl)({
    width: '100%',
    marginBottom: '10px',
    minWidth: '200px',
});

const SubmitButton = styled(Button)({
    width: '100%',
});

const ErrorMessage = styled(Typography)({
    color: 'red',
    marginTop: '10px',
});

const RatingContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
});

const RatingLabel = styled(Typography)({
    marginRight: '10px',
});

function HealthMachineReviewRegisterTable() {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const { machineId } = useParams();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // 서버로부터 사용자 목록을 가져옴
                const res = await axios.get(`${EXPRESS_URL}/HealthMachineShare/users`);
                setUsers(res.data.users);
            } catch (error) {
                console.log(error);
            }
        };

        fetchUsers();
    }, []);

    // 평점 변경 시 상태 업데이트
    const handleRatingChange = (value) => {
        setRating(value);
    };

    // 리뷰 내용 변경 시 상태 업데이트
    const handleReviewChange = (e) => {
        setReview(e.target.value);
    };

    // 사용자 선택 시 상태 업데이트
    const handleUserChange = (e) => {
        setUserId(e.target.value);
    };

    // 비밀번호 입력 시 상태 업데이트
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    // 폼 제출 시 실행되는 함수
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            // 로그인 요청을 보내 사용자 인증
            const loginResponse = await axios.post(
                `${EXPRESS_URL}/HealthMachineShare/users/login`,
                {
                    username: userId,
                    password,
                }
            );
            // 리뷰 등록을 진행
            await axios.post(
                `${EXPRESS_URL}/HealthMachineShare/machines/reviews/register/${machineId}`,
                {
                    userId: loginResponse.data.userId,
                    rating,
                    review,
                }
            );

            // 등록 후 필드 초기화
            setRating(0);
            setReview('');
            setPassword('');
            setErrorMessage('');
        } catch (error) {
			// 오류 응답이 있을 경우 에러 메시지 표시
           if (error.response && error.response.data) {
        		setErrorMessage(error.response.data.message);
      		} else {
        		setErrorMessage('서버 오류');
      		}
        }
    };

    return (
        <div className="review-registration-container">
            <FormContainer>
                <FormHeading variant="h4">평점 및 리뷰 등록</FormHeading>
                <form onSubmit={handleFormSubmit}>
                    <SelectField>
                        <InputLabel>유저 선택</InputLabel>
                        <Select value={userId} onChange={handleUserChange} required>
                            <MenuItem value="">
                                <em>유저 선택</em>
                            </MenuItem>
                            {/* 사용자 목록을 동적으로 렌더링 */}
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.username}>
                                    {user.username}
                                </MenuItem>
                            ))}
                        </Select>
                    </SelectField>
					{errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                    <InputField
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        label="비밀번호"
                    />
                    <InputField
                        value={review}
                        onChange={handleReviewChange}
                        required
                        label="리뷰"
                        multiline
                        rows={4}
                    />
                    <RatingContainer>
                        <RatingLabel>평점:</RatingLabel>
                        {/* 평점을 입력받는 Rating 컴포넌트 */}
                        <Rating
                            count={5}
                            size={24}
                            activeColor="#ffd700"
                            value={rating}
                            onChange={handleRatingChange}
                            required
                        />
                    </RatingContainer>
                    <SubmitButton type="submit" variant="contained">
                        등록
                    </SubmitButton>
                </form>
            </FormContainer>
        </div>
    );
}

export default HealthMachineReviewRegisterTable;
