export default function Profile() {
  const username = localStorage.getItem("username");

  return (
    <div>
      <h1>Profile</h1>
      <p>Welcome{username ? `, ${username}` : ""}.</p>
    </div>
  );
}