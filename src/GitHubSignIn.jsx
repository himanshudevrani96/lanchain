import React, { useEffect, useState } from 'react';

const GitHubSignIn = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleSignIn = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=<YOUR_CLIENT_ID>&scope=user`;
  };

  const handleSignOut = () => {
    // Perform any necessary sign-out actions
    setIsSignedIn(false);
  };

  useEffect(() => {
    // Check if the URL contains the authorization code
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Send the authorization code to your server for verification
      // Exchange the code for an access token and perform any necessary user authentication

      // If the sign-in is successful, set the isSignedIn state to true
      setIsSignedIn(true);

      // Redirect back to the homepage or any desired route
      window.location.href = '/';
    }
  }, []);

  return (
    <div>
      {!isSignedIn ? (
        <button onClick={handleSignIn}>Sign in with GitHub</button>
      ) : (
        <button onClick={handleSignOut}>Sign out</button>
      )}
    </div>
  );
};

export default GitHubSignIn;
