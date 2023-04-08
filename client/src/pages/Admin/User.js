import React from "react";
import Siderbar from "../../components/Admin/Sidebar";
import UserList from "../../components/Admin/UserList";

const UserPage = () => {
  return (
    <>
      <Siderbar />
      <div className="p-4 sm:ml-64 h-full">
        <UserList/>
      </div>
    </>
  );
};

export default UserPage;