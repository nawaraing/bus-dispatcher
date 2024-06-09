import NavBar from './NavBar';

const HomePage: React.FC = () => {
  return (
    <>
      <NavBar />
      <div className="content-wrapper">
        <div className="container-fluid flex-grow-1 container-p-y">
          <div className="authentication-wrapper authentication-basic container-p-y">
            <h1 className="justify-content-center">👋키키아이 서비스에 오신 것을 환영합니다!!</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
