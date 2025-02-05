export default async function UserList(props: Readonly<{ users: { id: number; name: string }[] }>) {
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {props.users.map((user) => (
          <li key={user.id}>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
