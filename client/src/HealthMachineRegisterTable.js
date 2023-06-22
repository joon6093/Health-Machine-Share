//20190633 송제용
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';

const EXPRESS_URL = 'http://localhost:3010';

// 스타일링된 컴포넌트들의 스타일을 정의한 CSS-in-JS 코드
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
  marginBottom: '20px',
});

const SubmitButton = styled(Button)({
  width: '100%',
});

const SelectWrapper = styled(FormControl)({
  width: '100%',
  marginBottom: '10px',
});

function HealthMachineRegisterTable() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        // 서버로부터 브랜드 목록을 가져옴
        const res = await axios.get(`${EXPRESS_URL}/HealthMachineShare/brands`);
        setBrands(res.data.brands);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBrands();
  }, []);

  // 머신 이름 변경 시 상태 업데이트
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  // 머신 설명 변경 시 상태 업데이트
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // 브랜드 선택 시 상태 업데이트
  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
  };

  // 폼 제출 시 실행되는 함수
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // FormData 객체를 생성하여 필드와 값 추가
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('image', e.target.image.files[0]);
      formData.append('brand', selectedBrand);

      // axios를 사용하여 POST 요청을 서버로 보냄
      await axios.post(`${EXPRESS_URL}/HealthMachineShare/machines/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // 등록 후 입력 필드 초기화
      setName('');
      setDescription('');
      setSelectedBrand('');

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Heading variant="h4">헬스 머신 정보 등록</Heading>
      <Form onSubmit={handleFormSubmit}>
        <SelectWrapper>
          <InputLabel>머신 브랜드</InputLabel>
          <Select value={selectedBrand} onChange={handleBrandChange} required>
            <MenuItem value="">
              <em>브랜드 선택</em>
            </MenuItem>
            {brands.map((brand) => (
              <MenuItem key={brand.brandId} value={brand.name}>
                {brand.name}
              </MenuItem>
            ))}
          </Select>
        </SelectWrapper>
        <InputField label="머신 이름" value={name} onChange={handleNameChange} required />
        <InputField
          label="머신 설명"
          multiline
          rows={4}
          value={description}
          onChange={handleDescriptionChange}
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
      </Form>
    </Container>
  );
}

export default HealthMachineRegisterTable;
