import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

const handleSignOut = async () => {
    try {
        const res = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
      // Optional: redirect or show a message
        window.location.href = '/';

        }
        if (data.success === false) {
            return;
        } 
    } catch (error) {
        console.log('could not log out', error);
    }


}


export default function Header() {

  return (
    <header className='bg-slate-200 shadow-md' >
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
            <Link to="/">
                <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                    <span className="text-state-500">Github</span>
                    <span className="text-green-700">OAuth</span>
                </h1>
            </Link>
            
            <ul className='flex gap-4'>
                
                
                <span onClick = {handleSignOut} className = 'text-red-700 cursor-pointer'>Sign Out</span>
            </ul>
        </div>

    </header>
  )
}

