//20190633 송제용
import React, { useState } from 'react';
import axios from 'axios';
import { 
	Typography, 
	TextField, 
	Button 
} from '@mui/material';
import { styled } from '@mui/system';

const EXPRESS_URL = 'http://localhost:3010';

// 컴포넌트 스타일링을 위한 CSS-in-JS 코드
const Container = styled('div')({
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
});

const Heading = styled(Typography)({
    textAlign: 'center',
    marginBottom: '20px',
});

const Form = styled('form')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
});

const InputField = styled(TextField)({
    width: '100%',
    marginBottom: '10px',
});

const ErrorMessage = styled(Typography)({
    color: 'red',
    marginBottom: '10px',
});

const SubmitButton = styled(Button)({
    width: '100%',
});

function HealthMachineUserRegisterTable() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // 사용자 이름 입력 변경 핸들러
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    // 비밀번호 입력 변경 핸들러
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    // 폼 제출 핸들러
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${EXPRESS_URL}/HealthMachineShare/users/register`, {
                username,
                password,
            });
            // 등록 후 필드 초기화
            setUsername('');
            setPassword('');
            setErrorMessage('');
			console.log(response.data.message);
        } catch (error) {
      console.log(error.response);

      // 오류 응답이 있을 경우 에러 메시지 표시
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('서버 오류');
      }
    }
  };

    return (
        <Container>
            <Heading variant="h4">사용자 등록</Heading>
			{errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            <Form onSubmit={handleFormSubmit}>
                <InputField
                    label="사용자 이름"
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    required
                    variant="outlined"
                    className="input-field"
                />
                <InputField
                    label="비밀번호"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    variant="outlined"
                    className="input-field"
                />
                <SubmitButton type="submit" variant="contained">
                    등록
                </SubmitButton>
            </Form>
        </Container>
    );
}

export default HealthMachineUserRegisterTable;