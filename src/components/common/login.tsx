import React, { useState } from "react";
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import "@assets/css/login.scss";
import { post } from "@utils/coreApiServices";
import { baseUrl } from "../../constant";
interface FormValues {
  email: string;
  password: string;
}
function Login() {
  const [values, setValues] = useState<FormValues>({
    email: "",
    password: "",
  });
  const [dataLoading, setDataLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const handleInputChange = (val: string, key: string) => {
    setValues(() => ({
      ...values,
      [key]: val,
    }));
  };
  const emailRegex = /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.email) {
      enqueueSnackbar({ variant: "error", message: "Please enter email" });
    } else if (!emailRegex.test(values.email)) {
      enqueueSnackbar({
        variant: "error",
        message: "Please enter valid email.",
      });
    } else if (!values.password) {
      enqueueSnackbar({
        variant: "error",
        message: "Please enter password",
      });
    } else {
      setDataLoading(true);
      const res = await post(
        `${baseUrl}api/v1/login/web/`,
        {
          email: values.email,
          password: values.password,
        },
        {},
        true
      );
      if (res?.status === 200) {
        enqueueSnackbar({
          variant: "success",
          message: "Logged In Successfully",
        });
        setDataLoading(false);
        localStorage.setItem("acvissToken", res.data.data.access_token);
        localStorage.setItem("userData", JSON.stringify(res.data.data));
        localStorage.setItem("loggedIn", "true");
        window.location.reload();
      } else {
        setDataLoading(false);
        enqueueSnackbar({
          variant: "error",
          message: res?.data.error,
        });
      }
    }
  };

  return (
    <>
      {dataLoading && (
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
            gap: "20px",
          }}
          open={true}
        >
          <Typography>Loading</Typography> <CircularProgress color="info" />
        </Backdrop>
      )}
      <div className={`login-wrapper ${"align-center"}`}>
        <div className={`login-container d-flex  align-center`}>
          <div className="login-image">
            {/* <img src={LoginCover} alt="login" />{" "} */}
          </div>
          <div className="form-wrapper d-flex flex-column">
            <div className="login-arrow">
              {/* <img src={Arrow} alt="login" />{" "} */}
            </div>
            <p className="login">{"Login"}</p>
            <div className="description d-flex flex-column">
              <p>Welcome</p>
              <p>{"Sign in to your account."}</p>
            </div>
            <form>
              <div className="login-inbut-group d-flex flex-column">
                <label htmlFor="mobile">{"EMAIL:"}</label>

                <input
                  type="tel"
                  name="email"
                  id="email"
                  autoComplete="email"
                  value={values.email}
                  placeholder="Enter Email."
                  onChange={(e) => handleInputChange(e.target.value, "email")}
                />
              </div>
              <div className="login-inbut-group d-flex flex-column mt-10">
                <label>{"PASSWORD:"}</label>
                <input
                  placeholder="Password"
                  type="password"
                  value={values.password}
                  onChange={(e) =>
                    handleInputChange(e.target.value, "password")
                  }
                />
              </div>

              <div className="button-wrapper d-flex align-center flex-column">
                <button type="submit" onClick={(e) => handleLogin(e)}>
                  {"Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
