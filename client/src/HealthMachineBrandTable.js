//20190633 송제용
import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';

const EXPRESS_URL = 'http://localhost:3010';

// 스타일링된 컴포넌트들의 스타일을 정의한 CSS-in-JS 코드
const FormContainer = styled('div')({
  maxWidth: '400px',
  margin: '0 auto',
  padding: '20px',
});

const Heading = styled(Typography)({
  textAlign: 'center',
  marginBottom: '20px',
});

const InputField = styled(TextField)({
  width: '100%',
  marginBottom: '20px',
});

const ErrorMessage = styled(Typography)({
    color: 'red',
    marginBottom: '10px',
});

const SubmitButton = styled(Button)({
  width: '100%',
});

function HealthMachineBrandTable() {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [foundingYear, setFoundingYear] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 브랜드 이름 변경 시 상태 업데이트
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  // 국가 변경 시 상태 업데이트
  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  // 창립 년도 변경 시 상태 업데이트
  const handleFoundingYearChange = (e) => {
    setFoundingYear(e.target.value);
  };

  // 폼 제출 시 실행되는 함수
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // FormData 객체를 생성하여 필드와 값 추가
      const formData = new FormData();
      formData.append('name', name);
      formData.append('country', country);
      formData.append('founding_year', foundingYear);
      formData.append('image', e.target.image.files[0]);

      // axios를 사용하여 POST 요청을 서버로 보냄
      const response = await axios.post(
        `${EXPRESS_URL}/HealthMachineShare/brands`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      // 등록 후 입력 필드 초기화
      setName('');
      setCountry('');
      setFoundingYear('');

      // 서버에서 전달된 메시지 출력
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
    <div className="brand-table-container">
      <FormContainer>
        <Heading variant="h4">헬스 머신 브랜드 등록</Heading>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <form onSubmit={handleFormSubmit}>
          <InputField
            label="브랜드 이름"
            value={name}
            onChange={handleNameChange}
            required
          />
          <InputField
            label="국가"
            value={country}
            onChange={handleCountryChange}
            required
          />
          <InputField
            label="창립 년도"
            type="number"
            value={foundingYear}
            onChange={handleFoundingYearChange}
            required
          />
          <InputField
            type="file"
            name="image"
            inputProps={{ accept: 'image/*' }}
            required
          />
          <SubmitButton type="submit" variant="contained">
            등록
          </SubmitButton>
        </form>
      </FormContainer>
    </div>
  );
}

export default HealthMachineBrandTable;
