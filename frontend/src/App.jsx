import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/new" element={<CreatePost />} />
        <Route path="/posts/:id/edit" element={<EditPost />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Layout>
  );
}
