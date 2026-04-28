import { NavLink, useNavigate } from 'react-router';
import useAuth from '../../auth/hooks/useAuth';

const NAV = [
  {
    to: '/',
    label: 'Home',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    to: '/create',
    label: 'Create',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
];

/**
 * Shared sidebar navigation — used by Home and CreatePost
 */
const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-60 border-r border-[#f0f0f0] bg-white px-6 py-8 z-20">
      {/* Wordmark */}
      <span
        className="text-[#111] text-lg font-semibold tracking-tight mb-12 cursor-pointer"
        onClick={() => navigate('/')}
      >
        MINIMA
      </span>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors duration-150 ${
                isActive
                  ? 'text-[#111] font-semibold bg-[#f5f5f5]'
                  : 'text-[#737373] hover:text-[#111] hover:bg-[#fafafa]'
              }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      {user && (
        <div className="pt-6 border-t border-[#f0f0f0]">
          <div className="flex items-center gap-3 mb-3">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-8 h-8 rounded-full object-cover bg-[#f0f0f0]"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center text-white text-xs font-medium">
                {user.username?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="text-sm text-[#111] font-medium truncate">{user.username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-[#737373] hover:text-[#111] transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
