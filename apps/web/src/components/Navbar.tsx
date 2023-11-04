
import { Link } from 'react-router-dom';


const NavBar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur">
      <div className='container flex h-14 items-center'>
        <div className='mr-6 flex items-center space-x-2  text-lg'>
          <Link to='/' className='hover:text-primary'>Stat Sniper</Link>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
