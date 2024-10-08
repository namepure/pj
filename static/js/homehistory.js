async function getData() {
  try {
    const response = await fetch("/getusers_mongo");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    // console.log(data);
    // console.log(user.username);

    let tab = "";
    data.forEach(function (user) {
      get_OID = user["_id"].$oid;
      get_OIDtoString = get_OID.toString();
      // console.log(get_OIDtoString);

      tab += `<tr>
                        <td>${user.ssidshow}</td>
                        <td>${user.event}</td>
                        <td>${user.location}</td>
                        <td>${user.ouGroup}</td>
                        <td class="text-success">${user.status}</td>
                        <td>
                            <a href="#" id="${get_OIDtoString}" data-toggle="modal" data-target="#userModal" class="link-offset-2 link-offset-3-hover link-success link-underline link-underline-opacity-0 link-underline-opacity-75-hover" ">
                                Detail
                            </a>
                        </td>
                    </tr>`;
    });
    document.getElementById("tbody_data").innerHTML = tab;

    $("#myTable").DataTable({
      data: data,
      columns: [
        { data: "ssidshow" },
        { data: "event" },
        { data: "location" },
        { data: "ouGroup" },
        {
          data: null,
          render: function (data, type, row) {
            if (
              data["status"] == "Active" ||
              data["status"] == "active" ||
              data["status"] == "ACTIVE"
            ) {
              return `<p class="text-success">${data["status"]}</p>`;
            } else {
              return `<p class="text-danger">${data["status"]}</p>`;
            }
          },
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="#" id="${data[
              "_id"
            ].$oid.toString()}" data-toggle="modal" data-target="#userModal" class="link-offset-2 link-offset-3-hover link-success link-underline link-underline-opacity-0 link-underline-opacity-75-hover">Detail</a>`;
          },
          orderable: false,
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  getDetails();
}

async function getDetails() {
  const getOpID = document.querySelectorAll(".link-offset-2");
  const getDetailURL = "/getdetail_mongo/";

  getOpID.forEach((aLink) => {
    aLink.onclick = async function () {
      const objID = aLink.id;
      try {
        const response = await fetch(getDetailURL + objID);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        // console.log(data+data['status']);
        if (
          data["status"] == "Active" ||
          data["status"] == "active" ||
          data["status"] == "ACTIVE"
        ) {
          if (data["ouGroup"] != "none") {
            let Headcontent = "";
            // let bthDelete = `
            //     <button id="btnDelete" type="button" class="btn btn-danger" data-dismiss="modal">Delete</button>
            //     <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            //     `;
            Headcontent += `
                        <p><strong>SSIDNAME: </strong> ${data["ssidshow"]}</p>
                        <p><strong>EVENT: </strong>${data["event"]}</p>
                        <p><strong>LOCATION: </strong>${data["location"]}</p>
                        <p><strong>GOU: </strong>${data["ouGroup"]}</p>
                        <p><strong>TIME :</strong>${data["time"]} to ${data["enddate"]}</p>
                        `;
            let userList = "";
            users = data["users"];
            users.forEach(function (user) {
              // userList += `<li class="list-group-item d-flex justify-content-around">`;
              userList += `
                                <li class="list-group-item d-flex justify-content-between align-items-start">
                                    <div class="ms-2 me-auto">
                                        <div class="fw-bold"><p>name: ${user.name}</p></div>
                                        <p>ID Card: ${user.idcard}</p>
                                        <p>Phone: ${user.phone}</p></li>
    
                                    </div>
                                </li>
                                `;
            });
            // console.log(userList);
            document.getElementById("headcontent").innerHTML = Headcontent;
            document.getElementById("userList").innerHTML = userList;
            // document.getElementById('mdbtn').innerHTML = bthDelete;
            // btn_delete(data);
          } else {
            // let bthDelete = `
            //     <button id="btnDelete" type="button" class="btn btn-danger" data-dismiss="modal">Delete</button>
            //     <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            //     `;
            let Headcontent = "";
            Headcontent += `
                        <p><strong>SSIDNAME: </strong> ${data["ssidshow"]}</p>
                        <p><strong>EVENT: </strong>${data["event"]}</p>
                        <p><strong>LOCATION: </strong>${data["location"]}</p>
                        <p><strong>GOU: </strong>${data["ouGroup"]}</p>
                        <p><strong>TIME :</strong>${data["time"]} to ${data["enddate"]}</p>
                        `;
            userList = `<li class="list-group-item d-flex justify-content-around"><p>-</p></li>`;
            document.getElementById("headcontent").innerHTML = Headcontent;
            document.getElementById("userList").innerHTML = userList;
            // document.getElementById('mdbtn').innerHTML = bthDelete;
            // btn_delete(data);
          }
        } else {
          if (data["ouGroup"] != "none") {
            let Headcontent = "";
            // let bthDelete = `
            //     <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            //     `;
            Headcontent += `
                        <p><strong>SSIDNAME: </strong> ${data["ssidshow"]}</p>
                        <p><strong>EVENT: </strong>${data["event"]}</p>
                        <p><strong>LOCATION: </strong>${data["location"]}</p>
                        <p><strong>GOU: </strong>${data["ouGroup"]}</p>
                        <p><strong>TIME :</strong>${data["time"]} to ${data["enddate"]}</p>
                        `;
            let userList = "";
            users = data["users"];
            users.forEach(function (user) {
              // userList += `<li class="list-group-item d-flex justify-content-around">`;
              userList += `
                                <li class="list-group-item d-flex justify-content-between align-items-start">
                                    <div class="ms-2 me-auto">
                                        <div class="fw-bold"><p>name: ${user.name}</p></div>
                                        <p>ID Card: ${user.idcard}</p>
                                        <p>Phone: ${user.phone}</p></li>
    
                                    </div>
                                </li>
                                `;
            });
            // console.log(userList);
            document.getElementById("headcontent").innerHTML = Headcontent;
            document.getElementById("userList").innerHTML = userList;
            // document.getElementById('mdbtn').innerHTML = bthDelete;
          } else {
            // let bthDelete = `
            //     <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            //     `;
            let Headcontent = "";
            Headcontent += `
                        <p><strong>SSIDNAME: </strong> ${data["ssidshow"]}</p>
                        <p><strong>EVENT: </strong>${data["event"]}</p>
                        <p><strong>LOCATION: </strong>${data["location"]}</p>
                        <p><strong>GOU: </strong>${data["ouGroup"]}</p>
                        <p><strong>TIME :</strong>${data["time"]} to ${data["enddate"]}</p>
                        `;
            userList = `<li class="list-group-item d-flex justify-content-around"><p>-</p></li>`;
            document.getElementById("headcontent").innerHTML = Headcontent;
            document.getElementById("userList").innerHTML = userList;
            // document.getElementById('mdbtn').innerHTML = bthDelete;
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  });
}
getData();