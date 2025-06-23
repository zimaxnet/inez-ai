import React from 'react';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "./authConfig";

const AccountPage = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch(e => {
      console.error(e);
    });
  }

  const handleLogout = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: "/",
      mainWindowRedirectUri: "/"
    });
  }

  const styles = {
    container: {
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      padding: '40px',
      maxWidth: '600px',
      margin: '0 auto',
    },
    section: {
      marginBottom: '40px',
    },
    sectionTitle: {
      fontSize: '24px',
      borderBottom: '1px solid #444',
      paddingBottom: '10px',
      marginBottom: '20px',
    },
    item: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
    },
    itemLabel: {
      fontSize: '16px',
    },
    itemValue: {
      fontSize: '16px',
      color: '#aaa',
    },
    button: {
      backgroundColor: '#333',
      color: '#fff',
      border: '1px solid #555',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    link: {
      color: '#00aaff',
      textDecoration: 'none',
    },
  };

  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <p>Please sign in to view your account.</p>
        <button onClick={handleLogin} style={styles.button}>Sign In</button>
      </div>
    );
  }

  const user = accounts[0] || {};
  const claims = user.idTokenClaims || {};

  return (
    <div style={styles.container}>
      {/* Account Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Account</h2>
        <div style={styles.item}>
          <div>
            <div style={styles.itemLabel}>{user.name}</div>
          </div>
          <button style={styles.button}>Change avatar</button>
        </div>
        <div style={styles.item}>
          <div style={styles.itemLabel}>Username</div>
          <div>{user.username}</div>
          <button style={styles.button}>Change username</button>
        </div>
        <div style={styles.item}>
          <div style={styles.itemLabel}>Email</div>
          <div>{user.username}</div>
        </div>
        <div style={styles.item}>
          <div style={styles.itemLabel}>User Object ID</div>
          <div>{claims.oid}</div>
        </div>
      </div>

      {/* Subscription Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Subscription</h2>
        <div style={styles.item}>
          <div>
            <div>Unlock the most powerful search experience with Perplexity Pro</div>
            <div style={styles.itemValue}>
              Get the most out of Perplexity with Pro. <a href="#" style={styles.link}>Learn more</a>
            </div>
          </div>
          <button style={styles.button}>Manage plan</button>
        </div>
      </div>

      {/* System Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>System</h2>
        <div style={styles.item}>
          <div style={styles.itemLabel}>Support</div>
          <button style={styles.button}>Contact</button>
        </div>
        <div style={styles.item}>
          <div style={styles.itemLabel}>You are signed in as {user.name}</div>
          <button onClick={handleLogout} style={styles.button}>Sign out</button>
        </div>
        <div style={styles.item}>
          <div style={styles.itemLabel}>Sign out of all sessions</div>
          <div style={styles.itemValue}>Devices or browsers where you are signed in</div>
          <button style={styles.button}>Sign out of all sessions</button>
        </div>
        <div style={styles.item}>
          <div style={styles.itemLabel}>Delete account</div>
          <div style={styles.itemValue}>Permanently delete your account and data</div>
          <button style={styles.button}>Learn more</button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage; 