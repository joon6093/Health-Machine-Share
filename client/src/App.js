//20190633 송제용
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { styled } from '@mui/system';
import { Button } from '@mui/material';
import HealthMachineTable from './HealthMachineTable';
import HealthMachineReviewTable from './HealthMachineReviewTable';
import HealthMachineBrandTable from './HealthMachineBrandTable';
import HealthMachineRegisterTable from './HealthMachineRegisterTable';
import HealthMachineReviewRegisterTable from './HealthMachineReviewRegisterTable';
import HealthMachineUserRegisterTable from './HealthMachineUserRegisterTable';

// 스타일링된 컴포넌트들의 스타일을 정의한 CSS-in-JS 코드
const ButtonContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '20px',
});

const StyledLink = styled(Link)({
  textDecoration: 'none',
  margin: '0 10px',
});

const Name = styled('div')({
  textAlign: 'center',
  marginTop: '20px',
  fontWeight: 'bold',
  fontSize: '18px',
});

function App() {
  return (
    <div className="App">
      <Router>
        <ButtonContainer>
          {/* 각 링크를 통해 다른 경로로 이동할 수 있는 버튼들 */}
          <StyledLink to="/HealthMachineShare/users/register">
            <Button variant="contained" className="button">
              회원 등록
            </Button>
          </StyledLink>
          <StyledLink to="/HealthMachineShare/machines">
            <Button variant="contained" className="button">
              머신 목록
            </Button>
          </StyledLink>
          <StyledLink to="/HealthMachineShare/brands">
            <Button variant="contained" className="button">
              브랜드 등록
            </Button>
          </StyledLink>
          <StyledLink to="/HealthMachineShare/machines/register">
            <Button variant="contained" className="button">
              머신 등록
            </Button>
          </StyledLink>
        </ButtonContainer>

        <Routes>
          {/* 각 경로에 맞는 컴포넌트를 렌더링 */}
          <Route path="/HealthMachineShare/users/register" element={<HealthMachineUserRegisterTable />} />
          <Route path="/HealthMachineShare/machines" element={<HealthMachineTable />} />
          <Route path="/HealthMachineShare/machines/reviews/:machineId" element={<HealthMachineReviewTable />} />
          <Route path="/HealthMachineShare/brands" element={<HealthMachineBrandTable />} />
          <Route path="/HealthMachineShare/machines/register" element={<HealthMachineRegisterTable />} />
          <Route
            path="/HealthMachineShare/machines/reviews/register/:machineId"
            element={<HealthMachineReviewRegisterTable />}
          />
        </Routes>
      </Router>

      <Name>20190633 송제용</Name>
    </div>
  );
}

export default App;
