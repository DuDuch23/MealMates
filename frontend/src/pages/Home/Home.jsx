import React, { useState, useEffect } from 'react';

function Home() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <div>
            {user ? (
                <div className="user-info">
                    <img src={user.picture} alt={user.name} className="user-avatar" />
                    <p>Bienvenue, {user.name} !</p>
                </div>
            ) : (
                <p>Vous n'êtes pas connecté</p>
            )}
        </div>
    );
}

export default Home;
