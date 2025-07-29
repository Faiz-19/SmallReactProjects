import React from "react";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
// uuidv4();

export default function Section() {
  const [form, setForm] = React.useState({
    site: "",
    username: "",
    password: "",
  });
  const [elements, setElements] = React.useState([]);

  const ref = React.useRef();
  const ref1 = React.useRef();

  React.useEffect(() => {
    if (localStorage.getItem("passwords")) {
      setElements(JSON.parse(localStorage.getItem("passwords")));
    }
  }, []);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function handleSave() {
    if (
      form.site.length > 3 &&
      form.username.length > 3 &&
      form.password.length > 3
    ) {
      setElements((p) => {
        return [
          ...p,
          {
            site: form.site,
            username: form.username,
            password: form.password,
            id: uuidv4(),
          },
        ];
      });
      localStorage.setItem(
        "passwords",
        JSON.stringify([
          ...elements,
          {
            site: form.site,
            username: form.username,
            password: form.password,
            id: uuidv4(),
          },
        ])
      );
      toast.success("Password Saved!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setForm({
        site: "",
        username: "",
        password: "",
      });
    } else {
      alert("From not saved");
    }
  }

  function handleCopy(text) {
    navigator.clipboard.writeText(text);
    toast.success("Copied!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }

  function showPassword() {
    if (ref.current.type == "text") {
      ref.current.type = "password";
      ref1.current.src = "public/cross-eye.png";
    } else {
      ref.current.type = "text";
      ref1.current.src = "public/eye.png";
    }
  }

  function handleDelete(id) {
    setElements((p) => p.filter((e) => e.id != id));
    localStorage.setItem(
      "passwords",
      JSON.stringify(elements.filter((e) => e.id != id))
    );
  }

  function handleEdit(id) {
    const toEdit = elements.find((e) => e.id === id);
    setForm({
      site: toEdit.site,
      username: toEdit.username,
      password: toEdit.password,
    });
    setElements((p) => p.filter((e) => e.id != id));
  }

  return (
    <main className="h-[79.3vh]">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="absolute inset-0 -z-10 h-full w-full bg-green-100 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="flex justify-center flex-col items-center my-6">
        <div>
          <span className="text-green-500 font-bold text-xl">&lt;</span>
          <span className="font-bold text-xl">Pass</span>
          <span className="text-green-500 font-bold text-xl">OP/&gt;</span>
        </div>
        <p>Your Own Password Manager</p>
      </div>
      <div className="flex flex-col gap-3 justify-center items-center w-full">
        <div className="w-1/2">
          <input
            type="text"
            onChange={handleChange}
            value={form.site}
            name="site"
            placeholder="Enter Website URL"
            className="bg-white border border-green-300 rounded-full w-full p-0.5 px-5"
          />
        </div>

        <div className="flex gap-3 w-1/2 justify-center flex-col sm:flex-row">
          <input
            type="text"
            onChange={handleChange}
            value={form.username}
            name="username"
            placeholder="Enter Username"
            className="bg-white border border-green-300 rounded-full w-full p-0.5 px-5 sm:w-1/2"
          />
          <div className="w-full flex relative sm:w-1/2">
            <input
              ref={ref}
              type="password"
              onChange={handleChange}
              value={form.password}
              name="password"
              placeholder="Enter Password"
              className="bg-white border border-green-300 rounded-full w-full p-0.5 px-5 sm:w-full"
            />
            <img
              src="public/cross-eye.png"
              ref={ref1}
              alt=""
              className="absolute right-4 top-[5.5px] cursor-pointer"
              onClick={showPassword}
            />
          </div>
        </div>
        <div
          className="bg-green-300 p-1 px-5 rounded-full hover:bg-green-600 border border-green-900 flex items-center justify-center gap-1 cursor-pointer"
          onClick={handleSave}
        >
          <span className="pt-1">
            <lord-icon
              src="https://cdn.lordicon.com/efxgwrkc.json"
              trigger="hover"
              style={{ width: "25px", height: "25px" }}
            ></lord-icon>
          </span>
          <input type="submit" value="Save" className="cursor-pointer" />
        </div>
      </div>
      <div className="flex flex-col w-full justify-center items-center gap-3">
        <h1 className="w-1/2 font-bold">Your Passwords</h1>
        {elements.length <= 0 && (
          <h4 className="w-1/2">No Passwords to display</h4>
        )}
        {elements.length > 0 && (
          <div className="w-full overflow-x-auto flex justify-center">
          <table className="table-auto rounded-md sm:overflow-hidden">
            <thead className="bg-green-800 text-white text-sm h-7  border border-white">
              <tr>
                <th>Site</th>
                <th>Username</th>
                <th>Password</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="bg-green-200">
              {elements.map((e, i) => {
                return (
                  <tr key={i}>
                    <td className="text-center border border-white p-2 whitespace-normal break-words">
                      <a href={e.site} target="_blank">
                        {e.site}
                      </a>
                      <lord-icon
                        src="https://cdn.lordicon.com/cfkiwvcc.json"
                        trigger="hover"
                        style={{
                          width: "25px",
                          height: "25px",
                          paddingTop: "5px",
                          cursor: "pointer",
                          paddingLeft: "2px",
                        }}
                        onClick={() => handleCopy(e.site)}
                      ></lord-icon>
                    </td>

                    <td className="text-center border border-white p-2 whitespace-normal break-words">
                      {e.username}
                      <lord-icon
                        src="https://cdn.lordicon.com/cfkiwvcc.json"
                        trigger="hover"
                        style={{
                          width: "25px",
                          height: "25px",
                          paddingTop: "5px",
                          cursor: "pointer",
                          paddingLeft: "2px",
                        }}
                        onClick={() => handleCopy(e.username)}
                      ></lord-icon>
                    </td>
                    <td className="text-center border border-white p-2 whitespace-normal break-words">
                      {"•".repeat(e.password.length)}
                      <lord-icon
                        src="https://cdn.lordicon.com/cfkiwvcc.json"
                        trigger="hover"
                        style={{
                          width: "25px",
                          height: "25px",
                          paddingTop: "5px",
                          cursor: "pointer",
                          paddingLeft: "2px",
                        }}
                        onClick={() => handleCopy(e.password)}
                      ></lord-icon>
                    </td>
                    <td className="text-center border border-white p-2 flex gap-2">
                      <span
                        className="cursor-pointer"
                        onClick={() => handleEdit(e.id)}
                      >
                        <lord-icon
                          src="https://cdn.lordicon.com/exymduqj.json"
                          trigger="hover"
                          stroke="bold"
                          state="hover-line"
                          colors="primary:#000000,secondary:#08a88a"
                          style={{ width: "30px", height: "30px" }}
                        ></lord-icon>
                      </span>
                      <span
                        className="cursor-pointer"
                        onClick={() => handleDelete(e.id)}
                      >
                        <lord-icon
                          src="https://cdn.lordicon.com/jzinekkv.json"
                          trigger="hover"
                          stroke="bold"
                          colors="primary:#000000,secondary:#08a88a"
                          style={{ width: "30px", height: "30px" }}
                        ></lord-icon>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </main>
  );
}
