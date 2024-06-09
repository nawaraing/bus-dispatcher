// import ReactDOM from 'react-dom/client';
import { useNavigate } from 'react-router-dom';
import { loginUrl } from './KikiiApi';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const loginId = (document.getElementById('loginId') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    try {
      const response = await fetch( loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginId, password }),
      });

      if (!response.ok) {
        alert('아이디와 비밀번호를 다시 확인해주세요!');
        console.error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem("token", data.object.token);
      localStorage.setItem("name", data.object.name);
      
      console.log('Login successful.');

      navigate('/home'); // 로그인 성공 시 /home 페이지로 이동

    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      {/* Content */}

      <div className="container-xxl">
        <div className="authentication-wrapper authentication-basic container-p-y">
          <div className="authentication-inner">
            {/* Register */}
            <div className="card">
              <div className="card-body">
                {/* Logo */}
                <div className="app-brand justify-content-center">
                  <a href="index.html" className="app-brand-link gap-2">
                    <span className="app-brand-text demo text-body fw-bolder">로그인</span>
                  </a>
                </div>
                {/* /Logo */}
                <p className="mb-4">키키아이 배차일보를 사용해주셔서 감사합니다!</p>

                <form id="formAuthentication" onSubmit={handleSubmit} className="mb-3" >
                  <div className="mb-3">
                    <label htmlFor="loginid" className="form-label">사원번호</label>
                    <input
                      type="text"
                      className="form-control"
                      id="loginId"
                      name="loginId"
                      placeholder="사원번호를 입력해주세요"
                      // onChange={(e) => setLoginId(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="mb-3 form-password-toggle">
                    <div className="d-flex justify-content-between">
                      <label className="form-label" htmlFor="password">비밀번호</label>
                    </div>
                    <div className="input-group input-group-merge">
                      <input
                        type="password"
                        id="password"
                        className="form-control"
                        name="password"
                        placeholder="비밀번호를 입력해주세요"
                        aria-describedby="password"
                        // onChange={(e) => setPassword(e.target.value)}
                      />
                      <span className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <button className="btn btn-primary d-grid w-100" type="submit">로그인하기</button>
                  </div>
                </form>
              </div>
            </div>
            {/* /Register */}
          </div>
        </div>
      </div>

      {/* Core JS */}
      {/* build:js assets/vendor/js/core.js */}
      <script src="./assets/vendor/libs/jquery/jquery.js"></script>
      <script src="./assets/vendor/libs/popper/popper.js"></script>
      <script src="./assets/vendor/js/bootstrap.js"></script>
      <script src="./assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></script>

      <script src="./assets/vendor/js/menu.js"></script>
      {/* endbuild */}

      {/* Vendors JS */}

      {/* Main JS */}
      <script src="./assets/js/main.js"></script>

      {/* Page JS */}

      {/* Place this tag in your head or just before your close body tag. */}
      <script async defer src="https://buttons.github.io/buttons.js"></script>
    </>
  );
};

export default LoginPage;
