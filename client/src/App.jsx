 import { BrowserRouter , Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import IssueList from './pages/IssueList'
import PullList from './pages/PullList'
import RepoList from './pages/RepoList'
import Search from './pages/Search'
import Header from './components/Header'
import Login from './pages/Login';
import RepoDetails from './pages/RepoDetails'
export default function App() {
  return (
    <BrowserRouter>
    
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/repos" element={<RepoList />} />
        <Route path="/repos/:id" element={<RepoDetails />} />
        <Route path="/repos/:id/issues" element={<IssueList />} />
        <Route path="/repos/:id/pulls" element={<PullList />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  )
}
