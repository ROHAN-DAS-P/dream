// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import Header from '../components/Header';

// export default function PullList() {
//   const { id } = useParams(); // repo ID from URL param
//   const [pulls, setPulls] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchPulls = async () => {
//       try {
//         const res = await fetch(`/api/repo/${id}/pull`, {
//           credentials: 'include',
//         });

//         if (res.status === 401) {
//           // Token expired → redirect to login
//           window.location.href = '/';
//           return;
//         }

//         if (!res.ok) {
//           throw new Error('Failed to fetch pull requests');
//         }
//         const data = await res.json();
//         setPulls(data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchPulls();
//   }, [id]);

//   return (
//     <div>
//       <Header />
//       <div className="max-w-4xl mx-auto p-4">
//         <h2 className="text-2xl font-bold mb-6">Pull Requests for Repo ID: {id}</h2>

//         {loading && <p className="text-blue-500">Loading pull requests...</p>}
//         {error && <p className="text-red-500">Error: {error}</p>}

//         {pulls.length === 0 && !loading && !error && (
//           <p className="text-gray-600">No open pull requests found.</p>
//         )}

//         <ul className="space-y-4">
//           {pulls.map((pr) => (
//             <li key={pr.id} className="border border-gray-300 rounded-lg p-4 shadow hover:shadow-md transition">
//               <a href={pr.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold text-lg">
//                 #{pr.number}: {pr.title}
//               </a>
//               <p className="text-sm text-gray-500 mt-1">By {pr.user.login}</p>
//               <p className="text-sm text-gray-500">State: {pr.state}</p>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }
