// // src/pages/IssueList.jsx

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import Header from '../components/Header';

// export default function IssueList() {
//   const { id } = useParams();
//   const [issues, setIssues] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchIssues = async () => {
//       try {
//         const res = await fetch(`/api/repo/${id}/issues`, {
//           credentials: 'include', // important to send cookie token
//         });
//         const data = await res.json();
//         setIssues(data);
//       } catch (error) {
//         console.error('Error fetching issues:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchIssues();
//   }, [id]);

//   return (
//     <div>
//       <Header />
//       <div className="max-w-4xl mx-auto p-6">
//         <h1 className="text-2xl font-bold mb-6 text-gray-800">Issues for Repository ID: {id}</h1>

//         {loading ? (
//           <p className="text-gray-500">Loading issues...</p>
//         ) : issues.length === 0 ? (
//           <p className="text-red-500">No open issues found for this repository.</p>
//         ) : (
//           <div className="space-y-4">
//             {issues.map((issue) => (
//               <a
//                 key={issue.id}
//                 href={issue.html_url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="block border border-gray-200 p-4 rounded-lg shadow hover:bg-gray-50 transition"
//               >
//                 <h2 className="text-lg font-semibold text-blue-600">{issue.title}</h2>
//                 <p className="text-sm text-gray-600">#{issue.number} opened by {issue.user.login}</p>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Status: {issue.state} • Created at {new Date(issue.created_at).toLocaleString()}
//                 </p>
//               </a>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
