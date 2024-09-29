document.getElementById("addUserBtn").onclick = function () {
  document.getElementById("userModal").style.display = "block";
};

document.getElementById("cancelBtn").onclick = function () {
  document.getElementById("createUserForm").reset();
  document.getElementById("userModal").style.display = "none";
};

document.querySelector(".close").onclick = function () {
  document.getElementById("userModal").style.display = "none";
};

window.onclick = function (event) {
  if (event.target == document.getElementById("userModal")) {
    document.getElementById("userModal").style.display = "none";
  }
};

async function loadUsers() {
  try {
    const response = await fetch("/alllocaluser");
    if (response.ok) {
      const data = await response.json();
      let tab = "";

      // Check if DataTable is already initialized
      if ($.fn.dataTable.isDataTable("#myTable")) {
        $("#myTable").DataTable().clear().rows.add(data).draw();
      } else {
        $("#myTable").DataTable({
          data: data,
          columns: [
            { data: "username" },
            { data: "role" },
            {
              data: null,
              render: function (data) {
                return `
                <a href="#" id="${data[
                  "_id"
                ].$oid.toString()}" class="getdetailLocaluser"><i class="fa-solid fa-pen-to-square"></i>Edit   </a>
                &nbsp;
                <a href="#" id="${data[
                  "_id"
                ].$oid.toString()}" class="deleteLocaluser"> <i class="fa-solid fa-trash"></i>Delete</a>
                `;
              },
              orderable: false,
            },
          ],
        });
      }
    } else {
      console.log("No user data found or not logged in.");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
  getDetails();
}

async function getDetails() {
  const getOpID = document.querySelectorAll(".getdetailLocaluser");
  const getDetailURL = "/getdetail_localuser/";
  getOpID.forEach((aLink) => {
    aLink.onclick = async function () {
      const objID = aLink.id;

      try {
        const response = await fetch(getDetailURL + objID);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        await getUserInputAndConfirm(objID, data);
       

        // console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  });
  const deleteLinks = document.querySelectorAll(".deleteLocaluser");
  deleteLinks.forEach((link) => {
    link.addEventListener("click", async (event) => {
      event.preventDefault(); // Prevent the default anchor behavior
      const objID = link.id;

      // Call the delete function with the user ID
      await deleteLocalUser(objID);
    });
  });
}

async function deleteLocalUser(userId) {
  // Show confirmation dialog
  const confirmation = await Swal.fire({
    title: "Are you sure?",
    text: "This action will permanently delete the user.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
  });

  if (confirmation.isConfirmed) {
    try {
      // Send DELETE request to the server
      const response = await fetch(`/delete_user/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        // Show success message
        Swal.fire("Deleted!", result.message, "success");
        // Reload users to update the list
        loadUsers();
      } else {
        // Show error message
        Swal.fire("Error", result.message || "An error occurred.", "error");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      Swal.fire("Error", "An error occurred while deleting the user.", "error");
    }
  } else if (confirmation.dismiss === Swal.DismissReason.cancel) {
    Swal.fire("Cancelled", "The user was not deleted.", "error");
  }
}

async function getUserInputAndConfirm(objID, data) {
  const { value: formValues } = await Swal.fire({
    title: "Edit User Administration",
    html: `
          <input id="swal-input-username" class="swal2-input" value="${data.username}" required>
          <input id="swal-input-password" type="password" class="swal2-input" placeholder="Password" required>
          <input id="swal-input-confirm-password" type="password" class="swal2-input" placeholder="Confirm Password" required>
          <select id="swal-input-privilege" class="swal2-input" required>
            <option value="" disabled selected>Select Privilege</option>
            <option value="admin">Admin</option>
            <option value="localuser">Local User</option>
          </select>
        `,
    focusConfirm: false,
    willOpen: () => {
      const swalInputs = Swal.getPopup().querySelectorAll("input, select");
      swalInputs.forEach((input) => {
        input.addEventListener("input", () => {
          input.setCustomValidity("");
        });
      });
    },
    preConfirm: () => {
      const username = document.getElementById("swal-input-username").value;
      const password = document.getElementById("swal-input-password").value;
      const confirmPassword = document.getElementById(
        "swal-input-confirm-password"
      ).value;
      const privilege = document.getElementById("swal-input-privilege").value;

      if (!username || !password || !confirmPassword || !privilege) {
        Swal.showValidationMessage("Please fill out all fields");
        return false;
      }

      if (password !== confirmPassword) {
        Swal.showValidationMessage("Passwords do not match");
        return false;
      }

      return { username, password, privilege };
    },
  });

  if (formValues) {
    const confirmation = await Swal.fire({
      title: "Confirm Submission",
      text: `Are you sure you want to submit the following details?\nUsername: ${formValues.username}\nPrivilege: ${formValues.privilege}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, submit it!",
      cancelButtonText: "No, cancel!",
    });

    if (confirmation.isConfirmed) {
      // Make the PUT request to update user details
      try {
        const response = await fetch(`/update_user/${objID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formValues.username,
            password: formValues.password,
            role: formValues.privilege,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          Swal.fire(
            "Submitted!",
            "Your information has been updated.",
            "success"
          );
          loadUsers(); // Refresh the user list
        } else {
          Swal.fire("Error", result.message || "An error occurred.", "error");
        }
      } catch (error) {
        console.error("Error updating user:", error);
        Swal.fire(
          "Error",
          "An error occurred while updating the user.",
          "error"
        );
      }
    } else if (confirmation.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("Cancelled", "Your submission has been cancelled.", "error");
    }
  }
}

document.getElementById("applyBtn").onclick = function () {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  const user = {
    username: document.getElementById("username").value,
    role: document.getElementById("privilege").value,
    userKey: "1",
    password: password,
    confirmPassword: confirmPassword,
  };
  console.log(user);
  fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        alert("User added!");
        loadUsers();
        document.getElementById("userModal").style.display = "none";
      }
    })
    .catch((error) => console.error("Error:", error));
};
// Initial load
// loadUsers();
loadUsers();
