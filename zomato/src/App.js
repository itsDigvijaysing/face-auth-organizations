import logo from './logo.svg';
import './App.css';
import Webcam from "react-webcam";
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};


function App() {
  const webcamRef = useRef(null);
  const [image, setImage] = useState("");
  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);
    },
    [webcamRef]
  );

  // const [email, setEmail] = useState("");
  // const [token, setToken] = useState("");
  const [alert, setAlert] = useState(false);
  const [user, setUser] = useState(false);
  let org = "6263f84682fc0d9851d827f8";
  const [emailVerfiy, setEmailVerify] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    message: "This is test MESSAGE",
    status: "success",
  });

  const email = useRef(null);
  const token = useRef(null)

  const checkUserEmail = async () => {

    // console.log(textInput.current.value)

    const data = await axios.post('http://localhost:5000/login-req', { "email": email.current.value, "organization": org });
    console.log(data.data)
    if (typeof data.data === "number") {
      setAlertMessage({ message: "Email verified.", status: "success" })
      setAlert(true);
      setEmailVerify(true);
    } else {
      setAlertMessage({ message: "Something went wrong", status: "danger" })
      setAlert(true);
    }

  }

  const getUserData = async () => {

    if (email.current.value === "" || token.current.value === "" || image === "") {
      setAlertMessage({ message: "Fill All the data", status: "warning" })
      setAlert(true);
      return;
    }

    var ImageURL = image; // 'photo' is your base64 image
    var block = ImageURL.split(";");
    var contentType = block[0].split(":")[1]; // In this case "image/gif"
    var realData = block[1].split(",")[1];
    var blob = b64toBlob(realData, contentType);
    console.log(blob, ImageURL)
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("email", email.current.value);
    formData.append("organization", org);
    formData.append("token", token.current.value);

    const data = await axios.post("http://localhost:5000/login", formData);
    console.log(data);
    setImage("");
    // setEmail("");

    if (Object.keys(data.data).length > 1) {
      setAlertMessage({ message: "Login Successfull", status: "success" })
      setAlert(true);
      sessionStorage.setItem("user_id", data.data.company_id);
      sessionStorage.setItem('name', data.data.name);
      sessionStorage.setItem('email', data.data.email);
      sessionStorage.setItem('phone', data.data.phone);

      setUser(true);
    } else {
      setAlertMessage({ message: data.data.data, status: "warning" });
      setAlert(true);
    }

  }

  function User() {

    return (
      <>
        <div className="card">
          <div className="card-image">
            <figure className="image is-4by1">
              <img src="/zomato-bike.png" alt="Placeholder image" />
            </figure>
          </div>
          <div className="card-content">
            <div className="media">
              <div className="media-content">
                <p className="title is-4">{sessionStorage.getItem('name')}</p>
              </div>
            </div>

            <div className="content">
              <div>
                <strong>Email</strong> :-  {sessionStorage.getItem('email')}
              </div>
              <div>
                <strong>Phone</strong> :-  {sessionStorage.getItem('phone')}
              </div>
              <time datetime="2016-1-1">Fri, 29 Apr 2022 20:54:38 GMT</time>
            </div>
          </div>
        </div>
      </>
    )

  }

  function Login() {

    return (
      <>
        <div className="card">
          <header className="card-header">
            <h2 className="card-header-title" style={{ textAlign: 'center' }} >
              Login
            </h2>
          </header>
          <div className="card-content">
            <input ref={email} className="input is-danger is-medium my-2" type="email" placeholder="Email"></input>
            <div>
              {
                emailVerfiy &&
                <>
                  {image === "" ? (
                    <Webcam
                      audio={false}
                      height={300}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      width={400}
                      videoConstraints={videoConstraints}
                    />
                  ) : (
                    <img
                      src={image}
                      alt="sadsad"
                      id="limage"
                    />
                  )}

                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {image !== "" ? (
                      <button
                        type="button"
                        className="button is-danger is-outlined custom-button"
                        onClick={(e) => {
                          e.preventDefault();
                          setImage("");
                        }}
                      >
                        Retake
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          capture();
                        }}
                        type="button"
                        className="button is-danger is-outlined custom-button"
                      >
                        Take
                      </button>
                    )}
                  </div>
                </>
              }
            </div>
            {
              emailVerfiy ? <input ref={token} className="input is-danger is-medium my-2" type="number" placeholder="Token"></input> : ""
            }
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {emailVerfiy ? <button onClick={() => getUserData()} className="button is-danger my-2">Submit</button> : <button onClick={() => checkUserEmail()} className="button is-danger my-2">Verify</button>}
            </div>
          </div>
        </div>
      </>
    )

  }


  useEffect(() => {

    if (sessionStorage.getItem('user_id')) {
      setUser(true);
    }

  }, [user]);


  return (
    <>
      <nav className="navbar container is-max-desktop" style={{ height: '100px' }} role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" href="#">
            <img src="/Zomato-logo.png" width="100px" height="108px" />
          </a>

          <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                {
                  user ?
                    <button onClick={() => { sessionStorage.clear(); setUser(false); }} className="button is-danger">
                      <strong>Logout</strong>
                    </button>
                    :
                    <button className="button is-primary is-inverted">
                      <strong>Login With Face Auth</strong>
                    </button>
                }

              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className='container columns my-5' style={{ display: "flex", justifyContent: "center" }}>
        <div className='column is-two-thirds' style={{}}>
          <img src="/zomato-bike.png" alt="monster" style={{ width: '100%', height: '50vh' }} />
        </div>
        <div className='column'>
          {alert && alertMessage.status === "danger" ? <div className="notification is-danger"><button onClick={() => setAlert(false)} className="delete"></button><strong>Error !</strong>{alertMessage.message}</div> : ""}
          {alert && alertMessage.status === "success" ? <div className="notification is-success"><button onClick={() => setAlert(false)} className="delete"></button><strong>Sucess ..</strong>{alertMessage.message}</div> : ""}
          {alert && alertMessage.status === "warning" ? <div className="notification is-warning"><button onClick={() => setAlert(false)} className="delete"></button><strong>Error !</strong>{alertMessage.message}</div> : ""}

          {
            user ? <User /> : <Login />
          }

        </div>
      </div>

      <footer className="footer">
        <div className="content has-text-centered">
          <p>
            <strong>Zomato with face auth</strong> by <a href="https://maheshgaikwad.me">Monster</a>. Made with React + Bulma Css .
          </p>
        </div>
      </footer>
    </>
  );
}


function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || "";
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data); // window.atob(b64Data)
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

export default App;
